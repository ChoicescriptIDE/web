"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const vscode = require("vscode");
const tsconfig_1 = require("../tsconfig");
class ExcludeHintItem {
    constructor(telemetryReporter) {
        this.telemetryReporter = telemetryReporter;
        this._item = vscode.window.createStatusBarItem('status.typescript.exclude', vscode.StatusBarAlignment.Right, 98 /* to the right of typescript version status (99) */);
        this._item.name = vscode.l10n.t("TypeScript: Configure Excludes");
        this._item.command = 'js.projectStatus.command';
    }
    getCurrentHint() {
        return this._currentHint;
    }
    hide() {
        this._item.hide();
    }
    show(largeRoots) {
        this._currentHint = {
            message: largeRoots
                ? vscode.l10n.t("To enable project-wide JavaScript/TypeScript language features, exclude folders with many files, like: {0}", largeRoots)
                : vscode.l10n.t("To enable project-wide JavaScript/TypeScript language features, exclude large folders with source files that you do not work on.")
        };
        this._item.tooltip = this._currentHint.message;
        this._item.text = vscode.l10n.t("Configure Excludes");
        this._item.tooltip = vscode.l10n.t("To enable project-wide JavaScript/TypeScript language features, exclude large folders with source files that you do not work on.");
        this._item.color = '#A5DF3B';
        this._item.show();
        /* __GDPR__
            "js.hintProjectExcludes" : {
                "owner": "mjbvz",
                "${include}": [
                    "${TypeScriptCommonProperties}"
                ]
            }
        */
        this.telemetryReporter.logTelemetry('js.hintProjectExcludes');
    }
}
function createLargeProjectMonitorFromTypeScript(item, client) {
    return client.onProjectLanguageServiceStateChanged(body => {
        if (body.languageServiceEnabled) {
            item.hide();
        }
        else {
            item.show();
            const configFileName = body.projectName;
            if (configFileName) {
                item.configFileName = configFileName;
                vscode.window.showWarningMessage(item.getCurrentHint().message, {
                    title: vscode.l10n.t("Configure Excludes"),
                    index: 0
                }).then(selected => {
                    if (selected && selected.index === 0) {
                        onConfigureExcludesSelected(client, configFileName);
                    }
                });
            }
        }
    });
}
function onConfigureExcludesSelected(client, configFileName) {
    if (!(0, tsconfig_1.isImplicitProjectConfigFile)(configFileName)) {
        vscode.workspace.openTextDocument(configFileName)
            .then(vscode.window.showTextDocument);
    }
    else {
        const root = client.getWorkspaceRootForResource(vscode.Uri.file(configFileName));
        if (root) {
            (0, tsconfig_1.openOrCreateConfig)(/tsconfig\.?.*\.json/.test(configFileName) ? 0 /* ProjectType.TypeScript */ : 1 /* ProjectType.JavaScript */, root, client.configuration);
        }
    }
}
function create(client) {
    const toDispose = [];
    const item = new ExcludeHintItem(client.telemetryReporter);
    toDispose.push(vscode.commands.registerCommand('js.projectStatus.command', () => {
        if (item.configFileName) {
            onConfigureExcludesSelected(client, item.configFileName);
        }
        const { message } = item.getCurrentHint();
        return vscode.window.showInformationMessage(message);
    }));
    toDispose.push(createLargeProjectMonitorFromTypeScript(item, client));
    return vscode.Disposable.from(...toDispose);
}
exports.create = create;
//# sourceMappingURL=largeProjectStatus.js.map