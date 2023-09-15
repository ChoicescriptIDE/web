"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubAuthenticationProvider = exports.UriEventHandler = exports.AuthProviderType = void 0;
const vscode = require("vscode");
const extension_telemetry_1 = require("@vscode/extension-telemetry");
const keychain_1 = require("./common/keychain");
const githubServer_1 = require("./githubServer");
const utils_1 = require("./common/utils");
const experimentationService_1 = require("./common/experimentationService");
const logger_1 = require("./common/logger");
const crypto_1 = require("./node/crypto");
const errors_1 = require("./common/errors");
var AuthProviderType;
(function (AuthProviderType) {
    AuthProviderType["github"] = "github";
    AuthProviderType["githubEnterprise"] = "github-enterprise";
})(AuthProviderType || (exports.AuthProviderType = AuthProviderType = {}));
class UriEventHandler extends vscode.EventEmitter {
    constructor() {
        super(...arguments);
        this._pendingNonces = new Map();
        this._codeExchangePromises = new Map();
        this.handleEvent = (logger, scopes) => (uri, resolve, reject) => {
            const query = new URLSearchParams(uri.query);
            const code = query.get('code');
            const nonce = query.get('nonce');
            if (!code) {
                reject(new Error('No code'));
                return;
            }
            if (!nonce) {
                reject(new Error('No nonce'));
                return;
            }
            const acceptedNonces = this._pendingNonces.get(scopes) || [];
            if (!acceptedNonces.includes(nonce)) {
                // A common scenario of this happening is if you:
                // 1. Trigger a sign in with one set of scopes
                // 2. Before finishing 1, you trigger a sign in with a different set of scopes
                // In this scenario we should just return and wait for the next UriHandler event
                // to run as we are probably still waiting on the user to hit 'Continue'
                logger.info('Nonce not found in accepted nonces. Skipping this execution...');
                return;
            }
            resolve(code);
        };
    }
    handleUri(uri) {
        this.fire(uri);
    }
    async waitForCode(logger, scopes, nonce, token) {
        const existingNonces = this._pendingNonces.get(scopes) || [];
        this._pendingNonces.set(scopes, [...existingNonces, nonce]);
        let codeExchangePromise = this._codeExchangePromises.get(scopes);
        if (!codeExchangePromise) {
            codeExchangePromise = (0, utils_1.promiseFromEvent)(this.event, this.handleEvent(logger, scopes));
            this._codeExchangePromises.set(scopes, codeExchangePromise);
        }
        try {
            return await Promise.race([
                codeExchangePromise.promise,
                new Promise((_, reject) => setTimeout(() => reject(errors_1.TIMED_OUT_ERROR), 300000)),
                (0, utils_1.promiseFromEvent)(token.onCancellationRequested, (_, __, reject) => { reject(errors_1.USER_CANCELLATION_ERROR); }).promise
            ]);
        }
        finally {
            this._pendingNonces.delete(scopes);
            codeExchangePromise?.cancel.fire();
            this._codeExchangePromises.delete(scopes);
        }
    }
}
exports.UriEventHandler = UriEventHandler;
class GitHubAuthenticationProvider {
    constructor(context, uriHandler, ghesUri) {
        this.context = context;
        this._sessionChangeEmitter = new vscode.EventEmitter();
        this._accountsSeen = new Set();
        const { aiKey } = context.extension.packageJSON;
        this._telemetryReporter = new experimentationService_1.ExperimentationTelemetry(context, new extension_telemetry_1.default(aiKey));
        const type = ghesUri ? AuthProviderType.githubEnterprise : AuthProviderType.github;
        this._logger = new logger_1.Log(type);
        this._keychain = new keychain_1.Keychain(this.context, type === AuthProviderType.github
            ? `${type}.auth`
            : `${ghesUri?.authority}${ghesUri?.path}.ghes.auth`, this._logger);
        this._githubServer = new githubServer_1.GitHubServer(this._logger, this._telemetryReporter, uriHandler, context.extension.extensionKind, ghesUri);
        // Contains the current state of the sessions we have available.
        this._sessionsPromise = this.readSessions().then((sessions) => {
            // fire telemetry after a second to allow the workbench to focus on loading
            setTimeout(() => sessions.forEach(s => this.afterSessionLoad(s)), 1000);
            return sessions;
        });
        this._disposable = vscode.Disposable.from(this._telemetryReporter, vscode.authentication.registerAuthenticationProvider(type, this._githubServer.friendlyName, this, { supportsMultipleAccounts: false }), this.context.secrets.onDidChange(() => this.checkForUpdates()));
    }
    dispose() {
        this._disposable?.dispose();
    }
    get onDidChangeSessions() {
        return this._sessionChangeEmitter.event;
    }
    async getSessions(scopes) {
        // For GitHub scope list, order doesn't matter so we immediately sort the scopes
        const sortedScopes = scopes?.sort() || [];
        this._logger.info(`Getting sessions for ${sortedScopes.length ? sortedScopes.join(',') : 'all scopes'}...`);
        const sessions = await this._sessionsPromise;
        const finalSessions = sortedScopes.length
            ? sessions.filter(session => (0, utils_1.arrayEquals)([...session.scopes].sort(), sortedScopes))
            : sessions;
        this._logger.info(`Got ${finalSessions.length} sessions for ${sortedScopes?.join(',') ?? 'all scopes'}...`);
        return finalSessions;
    }
    async afterSessionLoad(session) {
        // We only want to fire a telemetry if we haven't seen this account yet in this session.
        if (!this._accountsSeen.has(session.account.id)) {
            this._accountsSeen.add(session.account.id);
            this._githubServer.sendAdditionalTelemetryInfo(session);
        }
    }
    async checkForUpdates() {
        const previousSessions = await this._sessionsPromise;
        this._sessionsPromise = this.readSessions();
        const storedSessions = await this._sessionsPromise;
        const added = [];
        const removed = [];
        storedSessions.forEach(session => {
            const matchesExisting = previousSessions.some(s => s.id === session.id);
            // Another window added a session to the keychain, add it to our state as well
            if (!matchesExisting) {
                this._logger.info('Adding session found in keychain');
                added.push(session);
            }
        });
        previousSessions.forEach(session => {
            const matchesExisting = storedSessions.some(s => s.id === session.id);
            // Another window has logged out, remove from our state
            if (!matchesExisting) {
                this._logger.info('Removing session no longer found in keychain');
                removed.push(session);
            }
        });
        if (added.length || removed.length) {
            this._sessionChangeEmitter.fire({ added, removed, changed: [] });
        }
    }
    async readSessions() {
        let sessionData;
        try {
            this._logger.info('Reading sessions from keychain...');
            const storedSessions = await this._keychain.getToken();
            if (!storedSessions) {
                return [];
            }
            this._logger.info('Got stored sessions!');
            try {
                sessionData = JSON.parse(storedSessions);
            }
            catch (e) {
                await this._keychain.deleteToken();
                throw e;
            }
        }
        catch (e) {
            this._logger.error(`Error reading token: ${e}`);
            return [];
        }
        // TODO: eventually remove this Set because we should only have one session per set of scopes.
        const scopesSeen = new Set();
        const sessionPromises = sessionData.map(async (session) => {
            // For GitHub scope list, order doesn't matter so we immediately sort the scopes
            const scopesStr = [...session.scopes].sort().join(' ');
            if (scopesSeen.has(scopesStr)) {
                return undefined;
            }
            let userInfo;
            if (!session.account) {
                try {
                    userInfo = await this._githubServer.getUserInfo(session.accessToken);
                    this._logger.info(`Verified session with the following scopes: ${scopesStr}`);
                }
                catch (e) {
                    // Remove sessions that return unauthorized response
                    if (e.message === 'Unauthorized') {
                        return undefined;
                    }
                }
            }
            this._logger.trace(`Read the following session from the keychain with the following scopes: ${scopesStr}`);
            scopesSeen.add(scopesStr);
            return {
                id: session.id,
                account: {
                    label: session.account
                        ? session.account.label ?? session.account.displayName ?? '<unknown>'
                        : userInfo?.accountName ?? '<unknown>',
                    id: session.account?.id ?? userInfo?.id ?? '<unknown>'
                },
                // we set this to session.scopes to maintain the original order of the scopes requested
                // by the extension that called getSession()
                scopes: session.scopes,
                accessToken: session.accessToken
            };
        });
        const verifiedSessions = (await Promise.allSettled(sessionPromises))
            .filter(p => p.status === 'fulfilled')
            .map(p => p.value)
            .filter((p) => Boolean(p));
        this._logger.info(`Got ${verifiedSessions.length} verified sessions.`);
        if (verifiedSessions.length !== sessionData.length) {
            await this.storeSessions(verifiedSessions);
        }
        return verifiedSessions;
    }
    async storeSessions(sessions) {
        this._logger.info(`Storing ${sessions.length} sessions...`);
        this._sessionsPromise = Promise.resolve(sessions);
        await this._keychain.setToken(JSON.stringify(sessions));
        this._logger.info(`Stored ${sessions.length} sessions!`);
    }
    async createSession(scopes) {
        try {
            // For GitHub scope list, order doesn't matter so we use a sorted scope to determine
            // if we've got a session already.
            const sortedScopes = [...scopes].sort();
            /* __GDPR__
                "login" : {
                    "owner": "TylerLeonhardt",
                    "comment": "Used to determine how much usage the GitHub Auth Provider gets.",
                    "scopes": { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight", "comment": "Used to determine what scope combinations are being requested." }
                }
            */
            this._telemetryReporter?.sendTelemetryEvent('login', {
                scopes: JSON.stringify(scopes),
            });
            const scopeString = sortedScopes.join(' ');
            const token = await this._githubServer.login(scopeString);
            const session = await this.tokenToSession(token, scopes);
            this.afterSessionLoad(session);
            const sessions = await this._sessionsPromise;
            const sessionIndex = sessions.findIndex(s => s.id === session.id || (0, utils_1.arrayEquals)([...s.scopes].sort(), sortedScopes));
            if (sessionIndex > -1) {
                sessions.splice(sessionIndex, 1, session);
            }
            else {
                sessions.push(session);
            }
            await this.storeSessions(sessions);
            this._sessionChangeEmitter.fire({ added: [session], removed: [], changed: [] });
            this._logger.info('Login success!');
            return session;
        }
        catch (e) {
            // If login was cancelled, do not notify user.
            if (e === 'Cancelled' || e.message === 'Cancelled') {
                /* __GDPR__
                    "loginCancelled" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users cancel the login flow." }
                */
                this._telemetryReporter?.sendTelemetryEvent('loginCancelled');
                throw e;
            }
            /* __GDPR__
                "loginFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users run into an error login flow." }
            */
            this._telemetryReporter?.sendTelemetryEvent('loginFailed');
            vscode.window.showErrorMessage(vscode.l10n.t('Sign in failed: {0}', `${e}`));
            this._logger.error(e);
            throw e;
        }
    }
    async tokenToSession(token, scopes) {
        const userInfo = await this._githubServer.getUserInfo(token);
        return {
            id: crypto_1.crypto.getRandomValues(new Uint32Array(2)).reduce((prev, curr) => prev += curr.toString(16), ''),
            accessToken: token,
            account: { label: userInfo.accountName, id: userInfo.id },
            scopes
        };
    }
    async removeSession(id) {
        try {
            /* __GDPR__
                "logout" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users log out of an account." }
            */
            this._telemetryReporter?.sendTelemetryEvent('logout');
            this._logger.info(`Logging out of ${id}`);
            const sessions = await this._sessionsPromise;
            const sessionIndex = sessions.findIndex(session => session.id === id);
            if (sessionIndex > -1) {
                const session = sessions[sessionIndex];
                sessions.splice(sessionIndex, 1);
                await this.storeSessions(sessions);
                await this._githubServer.logout(session);
                this._sessionChangeEmitter.fire({ added: [], removed: [session], changed: [] });
            }
            else {
                this._logger.error('Session not found');
            }
        }
        catch (e) {
            /* __GDPR__
                "logoutFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often logging out of an account fails." }
            */
            this._telemetryReporter?.sendTelemetryEvent('logoutFailed');
            vscode.window.showErrorMessage(vscode.l10n.t('Sign out failed: {0}', `${e}`));
            this._logger.error(e);
            throw e;
        }
    }
}
exports.GitHubAuthenticationProvider = GitHubAuthenticationProvider;
//# sourceMappingURL=github.js.map