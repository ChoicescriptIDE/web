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
class FileReferencesCommand {
    constructor(client) {
        this.client = client;
        this.id = 'typescript.findAllFileReferences';
    }
    async execute(resource) {
        if (this.client.apiVersion.lt(FileReferencesCommand.minVersion)) {
            vscode.window.showErrorMessage(vscode.l10n.t("Find file references failed. Requires TypeScript 4.2+."));
            return;
        }
        resource ?? (resource = vscode.window.activeTextEditor?.document.uri);
        if (!resource) {
            vscode.window.showErrorMessage(vscode.l10n.t("Find file references failed. No resource provided."));
            return;
        }
        const document = await vscode.workspace.openTextDocument(resource);
        if (!(0, languageIds_1.isSupportedLanguageMode)(document)) {
            vscode.window.showErrorMessage(vscode.l10n.t("Find file references failed. Unsupported file type."));
            return;
        }
        const openedFiledPath = this.client.toOpenTsFilePath(document);
        if (!openedFiledPath) {
            vscode.window.showErrorMessage(vscode.l10n.t("Find file references failed. Unknown file type."));
            return;
        }
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: vscode.l10n.t("Finding file references")
        }, async (_progress, token) => {
            const response = await this.client.execute('fileReferences', {
                file: openedFiledPath
            }, token);
            if (response.type !== 'response' || !response.body) {
                return;
            }
            const locations = response.body.refs.map(reference => typeConverters.Location.fromTextSpan(this.client.toResource(reference.file), reference));
            const config = vscode.workspace.getConfiguration('references');
            const existingSetting = config.inspect('preferredLocation');
            await config.update('preferredLocation', 'view');
            try {
                await vscode.commands.executeCommand('editor.action.showReferences', resource, new vscode.Position(0, 0), locations);
            }
            finally {
                await config.update('preferredLocation', existingSetting?.workspaceFolderValue ?? existingSetting?.workspaceValue);
            }
        });
    }
}
FileReferencesCommand.context = 'tsSupportsFileReferences';
FileReferencesCommand.minVersion = api_1.API.v420;
function register(client, commandManager) {
    function updateContext() {
        vscode.commands.executeCommand('setContext', FileReferencesCommand.context, client.apiVersion.gte(FileReferencesCommand.minVersion));
    }
    updateContext();
    commandManager.register(new FileReferencesCommand(client));
    return client.onTsServerStarted(() => updateContext());
}
exports.register = register;
//# sourceMappingURL=fileReferences.js.map