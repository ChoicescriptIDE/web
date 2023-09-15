"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const child_process_1 = require("child_process");
const path = require("path");
const vscode = require("vscode");
const deferredPromise_1 = require("./deferredPromise");
const split_1 = require("./split");
/**
 * Timeout after the last port forwarding is disposed before we'll tear down
 * the CLI. This is primarily used since privacy changes to port will appear
 * as a dispose+re-create call, and we don't want to have to restart the CLI.
 */
const CLEANUP_TIMEOUT = 10000;
const cliPath = process.env.VSCODE_FORWARDING_IS_DEV
    ? path.join(__dirname, '../../../cli/target/debug/code')
    : path.join(vscode.env.appRoot, process.platform === 'win32' ? '../../bin' : 'bin', vscode.env.appQuality === 'stable' ? 'code-tunnel' : 'code-tunnel-insiders') + (process.platform === 'win32' ? '.exe' : '');
class Tunnel {
    constructor(remoteAddress, privacy) {
        this.remoteAddress = remoteAddress;
        this.privacy = privacy;
        this.disposeEmitter = new vscode.EventEmitter();
        this.onDidDispose = this.disposeEmitter.event;
    }
    setPortFormat(formatString) {
        this.localAddress = formatString.replace('{port}', String(this.remoteAddress.port));
    }
    dispose() {
        this.disposeEmitter.fire();
    }
}
async function activate(context) {
    if (vscode.env.remoteAuthority) {
        return; // forwarding is local-only at the moment
    }
    const logger = new Logger(vscode.l10n.t('Port Forwarding'));
    const provider = new TunnelProvider(logger);
    context.subscriptions.push(vscode.commands.registerCommand('tunnel-forwarding.showLog', () => logger.show()), vscode.commands.registerCommand('tunnel-forwarding.restart', () => provider.restart()), provider.onDidStateChange(s => {
        vscode.commands.executeCommand('setContext', 'tunnelForwardingIsRunning', s.state !== 2 /* State.Inactive */);
    }), await vscode.workspace.registerTunnelProvider(provider, {
        tunnelFeatures: {
            elevation: false,
            privacyOptions: [
                { themeIcon: 'globe', id: "public" /* TunnelPrivacyId.Public */, label: vscode.l10n.t('Public') },
                { themeIcon: 'lock', id: "private" /* TunnelPrivacyId.Private */, label: vscode.l10n.t('Private') },
            ],
        },
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
class Logger {
    constructor(label) {
        this.label = label;
    }
    show() {
        return this.outputChannel?.show();
    }
    clear() {
        this.outputChannel?.clear();
    }
    log(logLevel, message, ...args) {
        if (!this.outputChannel) {
            this.outputChannel = vscode.window.createOutputChannel(this.label, { log: true });
            vscode.commands.executeCommand('setContext', 'tunnelForwardingHasLog', true);
        }
        this.outputChannel[logLevel](message, ...args);
    }
}
class TunnelProvider {
    get state() {
        return this._state;
    }
    set state(state) {
        this._state = state;
        this.stateChange.fire(state);
    }
    constructor(logger) {
        this.logger = logger;
        this.tunnels = new Set();
        this.stateChange = new vscode.EventEmitter();
        this._state = { state: 2 /* State.Inactive */ };
        this.onDidStateChange = this.stateChange.event;
    }
    /** @inheritdoc */
    async provideTunnel(tunnelOptions) {
        const tunnel = new Tunnel(tunnelOptions.remoteAddress, tunnelOptions.privacy || "private" /* TunnelPrivacyId.Private */);
        this.tunnels.add(tunnel);
        tunnel.onDidDispose(() => {
            this.tunnels.delete(tunnel);
            this.updateActivePortsIfRunning();
        });
        switch (this.state.state) {
            case 3 /* State.Error */:
            case 2 /* State.Inactive */:
                await this.setupPortForwardingProcess();
            // fall through since state is now starting
            case 0 /* State.Starting */:
                this.updateActivePortsIfRunning();
                return new Promise((resolve, reject) => {
                    const l = this.stateChange.event(state => {
                        if (state.state === 1 /* State.Active */) {
                            tunnel.setPortFormat(state.portFormat);
                            l.dispose();
                            resolve(tunnel);
                        }
                        else if (state.state === 3 /* State.Error */) {
                            l.dispose();
                            reject(new Error(state.error));
                        }
                    });
                });
            case 1 /* State.Active */:
                tunnel.setPortFormat(this.state.portFormat);
                this.updateActivePortsIfRunning();
                return tunnel;
        }
    }
    /** Re/starts the port forwarding system. */
    async restart() {
        this.killRunningProcess();
        await this.setupPortForwardingProcess(); // will show progress
        this.updateActivePortsIfRunning();
    }
    isInStateWithProcess(process) {
        return ((this.state.state === 0 /* State.Starting */ || this.state.state === 1 /* State.Active */) &&
            this.state.process === process);
    }
    killRunningProcess() {
        if (this.state.state === 0 /* State.Starting */ || this.state.state === 1 /* State.Active */) {
            this.logger.log('info', '[forwarding] no more ports, stopping forwarding CLI');
            this.state.process.kill();
            this.state = { state: 2 /* State.Inactive */ };
        }
    }
    updateActivePortsIfRunning() {
        if (this.state.state !== 0 /* State.Starting */ && this.state.state !== 1 /* State.Active */) {
            return;
        }
        const ports = [...this.tunnels].map(t => ({ number: t.remoteAddress.port, privacy: t.privacy }));
        this.state.process.stdin.write(`${JSON.stringify(ports)}\n`);
        if (ports.length === 0 && !this.state.cleanupTimeout) {
            this.state.cleanupTimeout = setTimeout(() => this.killRunningProcess(), CLEANUP_TIMEOUT);
        }
        else if (ports.length > 0 && this.state.cleanupTimeout) {
            clearTimeout(this.state.cleanupTimeout);
            this.state.cleanupTimeout = undefined;
        }
    }
    async setupPortForwardingProcess() {
        const session = await vscode.authentication.getSession('github', ['user:email', 'read:org'], {
            createIfNone: true,
        });
        const args = [
            '--verbose',
            'tunnel',
            'forward-internal',
            '--provider',
            'github',
            '--access-token',
            session.accessToken,
        ];
        this.logger.log('info', '[forwarding] starting CLI');
        const process = (0, child_process_1.spawn)(cliPath, args, { stdio: 'pipe' });
        this.state = { state: 0 /* State.Starting */, process };
        const progressP = new deferredPromise_1.DeferredPromise();
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: vscode.l10n.t({
                comment: ['do not change link format [Show Log](command), only change the text "Show Log"'],
                message: 'Starting port forwarding system ([Show Log]({0}))',
                args: ['command:tunnel-forwarding.showLog']
            }),
        }, () => progressP.p);
        let lastPortFormat;
        process.on('exit', status => {
            const msg = `[forwarding] exited with code ${status}`;
            this.logger.log('info', msg);
            progressP.complete(); // make sure to clear progress on unexpected exit
            if (this.isInStateWithProcess(process)) {
                this.state = { state: 3 /* State.Error */, error: msg };
            }
        });
        process.on('error', err => {
            this.logger.log('error', `[forwarding] ${err}`);
            progressP.complete(); // make sure to clear progress on unexpected exit
            if (this.isInStateWithProcess(process)) {
                this.state = { state: 3 /* State.Error */, error: String(err) };
            }
        });
        process.stdout
            .pipe((0, split_1.splitNewLines)())
            .on('data', line => this.logger.log('info', `[forwarding] ${line}`))
            .resume();
        process.stderr
            .pipe((0, split_1.splitNewLines)())
            .on('data', line => {
            try {
                const l = JSON.parse(line);
                if (l.port_format && l.port_format !== lastPortFormat) {
                    this.state = {
                        state: 1 /* State.Active */,
                        portFormat: l.port_format, process,
                        cleanupTimeout: 'cleanupTimeout' in this.state ? this.state.cleanupTimeout : undefined,
                    };
                    progressP.complete();
                }
            }
            catch (e) {
                this.logger.log('error', `[forwarding] ${line}`);
            }
        })
            .resume();
        await new Promise((resolve, reject) => {
            process.on('spawn', resolve);
            process.on('error', reject);
        });
    }
}
//# sourceMappingURL=extension.js.map