"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntellisenseStatus = void 0;
const vscode = require("vscode");
const languageIds_1 = require("../configuration/languageIds");
const tsconfig_1 = require("../tsconfig");
const typescriptService_1 = require("../typescriptService");
const dispose_1 = require("../utils/dispose");
var IntellisenseState;
(function (IntellisenseState) {
    IntellisenseState.None = Object.freeze({ type: 0 /* Type.None */ });
    IntellisenseState.SyntaxOnly = Object.freeze({ type: 3 /* Type.SyntaxOnly */ });
    class Pending {
        constructor(resource, projectType) {
            this.resource = resource;
            this.projectType = projectType;
            this.type = 1 /* Type.Pending */;
            this.cancellation = new vscode.CancellationTokenSource();
        }
    }
    IntellisenseState.Pending = Pending;
    class Resolved {
        constructor(resource, projectType, configFile) {
            this.resource = resource;
            this.projectType = projectType;
            this.configFile = configFile;
            this.type = 2 /* Type.Resolved */;
        }
    }
    IntellisenseState.Resolved = Resolved;
})(IntellisenseState || (IntellisenseState = {}));
class IntellisenseStatus extends dispose_1.Disposable {
    constructor(_client, commandManager, _activeTextEditorManager) {
        super();
        this._client = _client;
        this._activeTextEditorManager = _activeTextEditorManager;
        this.openOpenConfigCommandId = '_typescript.openConfig';
        this.createOrOpenConfigCommandId = '_typescript.createOrOpenConfig';
        this._ready = false;
        this._state = IntellisenseState.None;
        commandManager.register({
            id: this.openOpenConfigCommandId,
            execute: async (root, projectType) => {
                if (this._state.type === 2 /* IntellisenseState.Type.Resolved */) {
                    await (0, tsconfig_1.openProjectConfigOrPromptToCreate)(projectType, this._client, root, this._state.configFile);
                }
                else if (this._state.type === 1 /* IntellisenseState.Type.Pending */) {
                    await (0, tsconfig_1.openProjectConfigForFile)(projectType, this._client, this._state.resource);
                }
            },
        });
        commandManager.register({
            id: this.createOrOpenConfigCommandId,
            execute: async (root, projectType) => {
                await (0, tsconfig_1.openOrCreateConfig)(projectType, root, this._client.configuration);
            },
        });
        _activeTextEditorManager.onDidChangeActiveJsTsEditor(this.updateStatus, this, this._disposables);
        this._client.onReady(() => {
            this._ready = true;
            this.updateStatus();
        });
    }
    dispose() {
        super.dispose();
        this._statusItem?.dispose();
    }
    async updateStatus() {
        const doc = this._activeTextEditorManager.activeJsTsEditor?.document;
        if (!doc || !(0, languageIds_1.isSupportedLanguageMode)(doc)) {
            this.updateState(IntellisenseState.None);
            return;
        }
        if (!this._client.hasCapabilityForResource(doc.uri, typescriptService_1.ClientCapability.Semantic)) {
            this.updateState(IntellisenseState.SyntaxOnly);
            return;
        }
        const file = this._client.toOpenTsFilePath(doc, { suppressAlertOnFailure: true });
        if (!file) {
            this.updateState(IntellisenseState.None);
            return;
        }
        if (!this._ready) {
            return;
        }
        const projectType = (0, languageIds_1.isTypeScriptDocument)(doc) ? 0 /* ProjectType.TypeScript */ : 1 /* ProjectType.JavaScript */;
        const pendingState = new IntellisenseState.Pending(doc.uri, projectType);
        this.updateState(pendingState);
        const response = await this._client.execute('projectInfo', { file, needFileNameList: false }, pendingState.cancellation.token);
        if (response.type === 'response' && response.body) {
            if (this._state === pendingState) {
                this.updateState(new IntellisenseState.Resolved(doc.uri, projectType, response.body.configFileName));
            }
        }
    }
    updateState(newState) {
        if (this._state === newState) {
            return;
        }
        if (this._state.type === 1 /* IntellisenseState.Type.Pending */) {
            this._state.cancellation.cancel();
            this._state.cancellation.dispose();
        }
        this._state = newState;
        switch (this._state.type) {
            case 0 /* IntellisenseState.Type.None */: {
                this._statusItem?.dispose();
                this._statusItem = undefined;
                break;
            }
            case 1 /* IntellisenseState.Type.Pending */: {
                const statusItem = this.ensureStatusItem();
                statusItem.severity = vscode.LanguageStatusSeverity.Information;
                statusItem.text = vscode.l10n.t("Loading IntelliSense status");
                statusItem.detail = undefined;
                statusItem.command = undefined;
                statusItem.busy = true;
                break;
            }
            case 2 /* IntellisenseState.Type.Resolved */: {
                const noConfigFileText = this._state.projectType === 0 /* ProjectType.TypeScript */
                    ? vscode.l10n.t("No tsconfig")
                    : vscode.l10n.t("No jsconfig");
                const rootPath = this._client.getWorkspaceRootForResource(this._state.resource);
                if (!rootPath) {
                    if (this._statusItem) {
                        this._statusItem.text = noConfigFileText;
                        this._statusItem.detail = !vscode.workspace.workspaceFolders
                            ? vscode.l10n.t("No opened folders")
                            : vscode.l10n.t("File is not part opened folders");
                        this._statusItem.busy = false;
                    }
                    return;
                }
                const statusItem = this.ensureStatusItem();
                statusItem.busy = false;
                statusItem.detail = undefined;
                statusItem.severity = vscode.LanguageStatusSeverity.Information;
                if ((0, tsconfig_1.isImplicitProjectConfigFile)(this._state.configFile)) {
                    statusItem.text = noConfigFileText;
                    statusItem.detail = undefined;
                    statusItem.command = {
                        command: this.createOrOpenConfigCommandId,
                        title: this._state.projectType === 0 /* ProjectType.TypeScript */
                            ? vscode.l10n.t("Configure tsconfig")
                            : vscode.l10n.t("Configure jsconfig"),
                        arguments: [rootPath],
                    };
                }
                else {
                    statusItem.text = vscode.workspace.asRelativePath(this._state.configFile);
                    statusItem.detail = undefined;
                    statusItem.command = {
                        command: this.openOpenConfigCommandId,
                        title: vscode.l10n.t("Open config file"),
                        arguments: [rootPath],
                    };
                }
                break;
            }
            case 3 /* IntellisenseState.Type.SyntaxOnly */: {
                const statusItem = this.ensureStatusItem();
                statusItem.severity = vscode.LanguageStatusSeverity.Warning;
                statusItem.text = vscode.l10n.t("Partial Mode");
                statusItem.detail = vscode.l10n.t("Project Wide IntelliSense not available");
                statusItem.busy = false;
                statusItem.command = {
                    title: vscode.l10n.t("Learn More"),
                    command: 'vscode.open',
                    arguments: [
                        vscode.Uri.parse('https://aka.ms/vscode/jsts/partial-mode'),
                    ]
                };
                break;
            }
        }
    }
    ensureStatusItem() {
        if (!this._statusItem) {
            this._statusItem = vscode.languages.createLanguageStatusItem('typescript.projectStatus', languageIds_1.jsTsLanguageModes);
            this._statusItem.name = vscode.l10n.t("JS/TS IntelliSense Status");
        }
        return this._statusItem;
    }
}
exports.IntellisenseStatus = IntellisenseStatus;
//# sourceMappingURL=intellisenseStatus.js.map