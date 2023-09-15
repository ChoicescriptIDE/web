"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevelMonitor = void 0;
const vscode = require("vscode");
const configuration_1 = require("../configuration/configuration");
const dispose_1 = require("../utils/dispose");
class LogLevelMonitor extends dispose_1.Disposable {
    constructor(context) {
        super();
        this.context = context;
        this._register(vscode.workspace.onDidChangeConfiguration(this.onConfigurationChange, this, this._disposables));
        if (this.shouldNotifyExtendedLogging()) {
            this.notifyExtendedLogging();
        }
    }
    onConfigurationChange(event) {
        const logLevelChanged = event.affectsConfiguration(LogLevelMonitor.logLevelConfigKey);
        if (!logLevelChanged) {
            return;
        }
        this.context.globalState.update(LogLevelMonitor.logLevelChangedStorageKey, new Date());
    }
    get logLevel() {
        return configuration_1.TsServerLogLevel.fromString(vscode.workspace.getConfiguration().get(LogLevelMonitor.logLevelConfigKey, 'off'));
    }
    /**
     * Last date change if it exists and can be parsed as a date,
     * otherwise undefined.
     */
    get lastLogLevelChange() {
        const lastChange = this.context.globalState.get(LogLevelMonitor.logLevelChangedStorageKey);
        if (lastChange) {
            const date = new Date(lastChange);
            if (date instanceof Date && !isNaN(date.valueOf())) {
                return date;
            }
        }
        return undefined;
    }
    get doNotPrompt() {
        return this.context.globalState.get(LogLevelMonitor.doNotPromptLogLevelStorageKey) || false;
    }
    shouldNotifyExtendedLogging() {
        const lastChangeMilliseconds = this.lastLogLevelChange ? new Date(this.lastLogLevelChange).valueOf() : 0;
        const lastChangePlusOneWeek = new Date(lastChangeMilliseconds + /* 7 days in milliseconds */ 86400000 * 7);
        if (!this.doNotPrompt && this.logLevel !== configuration_1.TsServerLogLevel.Off && lastChangePlusOneWeek.valueOf() < Date.now()) {
            return true;
        }
        return false;
    }
    notifyExtendedLogging() {
        vscode.window.showInformationMessage(vscode.l10n.t("TS Server logging is currently enabled which may impact performance."), {
            title: vscode.l10n.t("Disable logging"),
            choice: 0 /* Choice.DisableLogging */
        }, {
            title: vscode.l10n.t("Don't show again"),
            choice: 1 /* Choice.DoNotShowAgain */
        })
            .then(selection => {
            if (!selection) {
                return;
            }
            if (selection.choice === 0 /* Choice.DisableLogging */) {
                return vscode.workspace.getConfiguration().update(LogLevelMonitor.logLevelConfigKey, 'off', true);
            }
            else if (selection.choice === 1 /* Choice.DoNotShowAgain */) {
                return this.context.globalState.update(LogLevelMonitor.doNotPromptLogLevelStorageKey, true);
            }
            return;
        });
    }
}
exports.LogLevelMonitor = LogLevelMonitor;
LogLevelMonitor.logLevelConfigKey = 'typescript.tsserver.log';
LogLevelMonitor.logLevelChangedStorageKey = 'typescript.tsserver.logLevelChanged';
LogLevelMonitor.doNotPromptLogLevelStorageKey = 'typescript.tsserver.doNotPromptLogLevel';
//# sourceMappingURL=logLevelMonitor.js.map