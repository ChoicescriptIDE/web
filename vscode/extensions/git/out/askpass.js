"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Askpass = void 0;
const vscode_1 = require("vscode");
const util_1 = require("./util");
const path = require("path");
class Askpass {
    constructor(ipc) {
        this.ipc = ipc;
        this.disposable = util_1.EmptyDisposable;
        this.cache = new Map();
        this.credentialsProviders = new Set();
        this.featureDescription = 'git auth provider';
        if (ipc) {
            this.disposable = ipc.registerHandler('askpass', this);
        }
        this.env = {
            // GIT_ASKPASS
            GIT_ASKPASS: path.join(__dirname, this.ipc ? 'askpass.sh' : 'askpass-empty.sh'),
            // VSCODE_GIT_ASKPASS
            VSCODE_GIT_ASKPASS_NODE: process.execPath,
            VSCODE_GIT_ASKPASS_EXTRA_ARGS: (process.versions['electron'] && process.versions['microsoft-build']) ? '--ms-enable-electron-run-as-node' : '',
            VSCODE_GIT_ASKPASS_MAIN: path.join(__dirname, 'askpass-main.js'),
        };
        this.sshEnv = {
            // SSH_ASKPASS
            SSH_ASKPASS: path.join(__dirname, this.ipc ? 'ssh-askpass.sh' : 'ssh-askpass-empty.sh'),
            SSH_ASKPASS_REQUIRE: 'force',
        };
    }
    async handle(payload) {
        const config = vscode_1.workspace.getConfiguration('git', null);
        const enabled = config.get('enabled');
        if (!enabled) {
            return '';
        }
        // https
        if (payload.askpassType === 'https') {
            return await this.handleAskpass(payload.request, payload.host);
        }
        // ssh
        return await this.handleSSHAskpass(payload.request, payload.host, payload.file, payload.fingerprint);
    }
    async handleAskpass(request, host) {
        const uri = vscode_1.Uri.parse(host);
        const authority = uri.authority.replace(/^.*@/, '');
        const password = /password/i.test(request);
        const cached = this.cache.get(authority);
        if (cached && password) {
            this.cache.delete(authority);
            return cached.password;
        }
        if (!password) {
            for (const credentialsProvider of this.credentialsProviders) {
                try {
                    const credentials = await credentialsProvider.getCredentials(uri);
                    if (credentials) {
                        this.cache.set(authority, credentials);
                        setTimeout(() => this.cache.delete(authority), 60000);
                        return credentials.username;
                    }
                }
                catch { }
            }
        }
        const options = {
            password,
            placeHolder: request,
            prompt: `Git: ${host}`,
            ignoreFocusOut: true
        };
        return await vscode_1.window.showInputBox(options) || '';
    }
    async handleSSHAskpass(request, host, file, fingerprint) {
        // passphrase
        if (/passphrase/i.test(request)) {
            const options = {
                password: true,
                placeHolder: vscode_1.l10n.t('Passphrase'),
                prompt: `SSH Key: ${file}`,
                ignoreFocusOut: true
            };
            return await vscode_1.window.showInputBox(options) || '';
        }
        // authenticity
        const options = {
            canPickMany: false,
            ignoreFocusOut: true,
            placeHolder: vscode_1.l10n.t('Are you sure you want to continue connecting?'),
            title: vscode_1.l10n.t('"{0}" has fingerprint "{1}"', host ?? '', fingerprint ?? '')
        };
        const items = [vscode_1.l10n.t('yes'), vscode_1.l10n.t('no')];
        return await vscode_1.window.showQuickPick(items, options) ?? '';
    }
    getEnv() {
        const config = vscode_1.workspace.getConfiguration('git');
        return config.get('useIntegratedAskPass') ? { ...this.env, ...this.sshEnv } : {};
    }
    getTerminalEnv() {
        const config = vscode_1.workspace.getConfiguration('git');
        return config.get('useIntegratedAskPass') && config.get('terminalAuthentication') ? this.env : {};
    }
    registerCredentialsProvider(provider) {
        this.credentialsProviders.add(provider);
        return (0, util_1.toDisposable)(() => this.credentialsProviders.delete(provider));
    }
    dispose() {
        this.disposable.dispose();
    }
}
exports.Askpass = Askpass;
//# sourceMappingURL=askpass.js.map