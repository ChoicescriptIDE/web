"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const languageIds_1 = require("../configuration/languageIds");
const api_1 = require("../tsServer/api");
const typeConverters = require("../typeConverters");
class SourceDefinitionCommand {
    constructor(client) {
        this.client = client;
        this.id = 'typescript.goToSourceDefinition';
    }
    async execute() {
        if (this.client.apiVersion.lt(SourceDefinitionCommand.minVersion)) {
            vscode.window.showErrorMessage(vscode.l10n.t("Go to Source Definition failed. Requires TypeScript 4.7+."));
            return;
        }
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage(vscode.l10n.t("Go to Source Definition failed. No resource provided."));
            return;
        }
        const resource = activeEditor.document.uri;
        const document = await vscode.workspace.openTextDocument(resource);
        if (!(0, languageIds_1.isSupportedLanguageMode)(document)) {
            vscode.window.showErrorMessage(vscode.l10n.t("Go to Source Definition failed. Unsupported file type."));
            return;
        }
        const openedFiledPath = this.client.toOpenTsFilePath(document);
        if (!openedFiledPath) {
            vscode.window.showErrorMessage(vscode.l10n.t("Go to Source Definition failed. Unknown file type."));
            return;
        }
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: vscode.l10n.t("Finding source definitions")
        }, async (_progress, token) => {
            const position = activeEditor.selection.anchor;
            const args = typeConverters.Position.toFileLocationRequestArgs(openedFiledPath, position);
            const response = await this.client.execute('findSourceDefinition', args, token);
            if (response.type === 'response' && response.body) {
                const locations = response.body.map(reference => typeConverters.Location.fromTextSpan(this.client.toResource(reference.file), reference));
                if (locations.length) {
                    if (locations.length === 1) {
                        vscode.commands.executeCommand('vscode.open', locations[0].uri.with({
                            fragment: `L${locations[0].range.start.line + 1},${locations[0].range.start.character + 1}`
                        }));
                    }
                    else {
                        vscode.commands.executeCommand('editor.action.showReferences', resource, position, locations);
                    }
                    return;
                }
            }
            vscode.window.showErrorMessage(vscode.l10n.t("No source definitions found."));
        });
    }
}
SourceDefinitionCommand.context = 'tsSupportsSourceDefinition';
SourceDefinitionCommand.minVersion = api_1.API.v470;
function register(client, commandManager) {
    function updateContext() {
        vscode.commands.executeCommand('setContext', SourceDefinitionCommand.context, client.apiVersion.gte(SourceDefinitionCommand.minVersion));
    }
    updateContext();
    commandManager.register(new SourceDefinitionCommand(client));
    return client.onTsServerStarted(() => updateContext());
}
exports.register = register;
//# sourceMappingURL=sourceDefinition.js.map