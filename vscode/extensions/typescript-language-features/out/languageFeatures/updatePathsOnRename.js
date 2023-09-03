"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const path = require("path");
const vscode = require("vscode");
const fileSchemes = require("../configuration/fileSchemes");
const languageDescription_1 = require("../configuration/languageDescription");
const api_1 = require("../tsServer/api");
const typeConverters = require("../typeConverters");
const typescriptService_1 = require("../typescriptService");
const async_1 = require("../utils/async");
const cancellation_1 = require("../utils/cancellation");
const dispose_1 = require("../utils/dispose");
const dependentRegistration_1 = require("./util/dependentRegistration");
const updateImportsOnFileMoveName = 'updateImportsOnFileMove.enabled';
async function isDirectory(resource) {
    try {
        return (await vscode.workspace.fs.stat(resource)).type === vscode.FileType.Directory;
    }
    catch {
        return false;
    }
}
class UpdateImportsOnFileRenameHandler extends dispose_1.Disposable {
    constructor(client, fileConfigurationManager, _handles) {
        super();
        this.client = client;
        this.fileConfigurationManager = fileConfigurationManager;
        this._handles = _handles;
        this._delayer = new async_1.Delayer(50);
        this._pendingRenames = new Set();
        this._register(vscode.workspace.onDidRenameFiles(async (e) => {
            const [{ newUri, oldUri }] = e.files;
            const newFilePath = this.client.toTsFilePath(newUri);
            if (!newFilePath) {
                return;
            }
            const oldFilePath = this.client.toTsFilePath(oldUri);
            if (!oldFilePath) {
                return;
            }
            const config = this.getConfiguration(newUri);
            const setting = config.get(updateImportsOnFileMoveName);
            if (setting === "never" /* UpdateImportsOnFileMoveSetting.Never */) {
                return;
            }
            // Try to get a js/ts file that is being moved
            // For directory moves, this returns a js/ts file under the directory.
            const jsTsFileThatIsBeingMoved = await this.getJsTsFileBeingMoved(newUri);
            if (!jsTsFileThatIsBeingMoved || !this.client.toTsFilePath(jsTsFileThatIsBeingMoved)) {
                return;
            }
            this._pendingRenames.add({ oldUri, newUri, newFilePath, oldFilePath, jsTsFileThatIsBeingMoved });
            this._delayer.trigger(() => {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Window,
                    title: vscode.l10n.t("Checking for update of JS/TS imports")
                }, () => this.flushRenames());
            });
        }));
    }
    async flushRenames() {
        const renames = Array.from(this._pendingRenames);
        this._pendingRenames.clear();
        for (const group of this.groupRenames(renames)) {
            const edits = new vscode.WorkspaceEdit();
            const resourcesBeingRenamed = [];
            for (const { oldUri, newUri, newFilePath, oldFilePath, jsTsFileThatIsBeingMoved } of group) {
                const document = await vscode.workspace.openTextDocument(jsTsFileThatIsBeingMoved);
                // Make sure TS knows about file
                this.client.bufferSyncSupport.closeResource(oldUri);
                this.client.bufferSyncSupport.openTextDocument(document);
                if (await this.withEditsForFileRename(edits, document, oldFilePath, newFilePath)) {
                    resourcesBeingRenamed.push(newUri);
                }
            }
            if (edits.size) {
                if (await this.confirmActionWithUser(resourcesBeingRenamed)) {
                    await vscode.workspace.applyEdit(edits, { isRefactoring: true });
                }
            }
        }
    }
    async confirmActionWithUser(newResources) {
        if (!newResources.length) {
            return false;
        }
        const config = this.getConfiguration(newResources[0]);
        const setting = config.get(updateImportsOnFileMoveName);
        switch (setting) {
            case "always" /* UpdateImportsOnFileMoveSetting.Always */:
                return true;
            case "never" /* UpdateImportsOnFileMoveSetting.Never */:
                return false;
            case "prompt" /* UpdateImportsOnFileMoveSetting.Prompt */:
            default:
                return this.promptUser(newResources);
        }
    }
    getConfiguration(resource) {
        return vscode.workspace.getConfiguration((0, languageDescription_1.doesResourceLookLikeATypeScriptFile)(resource) ? 'typescript' : 'javascript', resource);
    }
    async promptUser(newResources) {
        if (!newResources.length) {
            return false;
        }
        const rejectItem = {
            title: vscode.l10n.t("No"),
            isCloseAffordance: true,
        };
        const acceptItem = {
            title: vscode.l10n.t("Yes"),
        };
        const alwaysItem = {
            title: vscode.l10n.t("Always"),
        };
        const neverItem = {
            title: vscode.l10n.t("Never"),
        };
        const response = await vscode.window.showInformationMessage(newResources.length === 1
            ? vscode.l10n.t("Update imports for '{0}'?", path.basename(newResources[0].fsPath))
            : this.getConfirmMessage(vscode.l10n.t("Update imports for the following {0} files?", newResources.length), newResources), {
            modal: true,
        }, rejectItem, acceptItem, alwaysItem, neverItem);
        switch (response) {
            case acceptItem: {
                return true;
            }
            case rejectItem: {
                return false;
            }
            case alwaysItem: {
                const config = this.getConfiguration(newResources[0]);
                config.update(updateImportsOnFileMoveName, "always" /* UpdateImportsOnFileMoveSetting.Always */, this.getConfigTargetScope(config, updateImportsOnFileMoveName));
                return true;
            }
            case neverItem: {
                const config = this.getConfiguration(newResources[0]);
                config.update(updateImportsOnFileMoveName, "never" /* UpdateImportsOnFileMoveSetting.Never */, this.getConfigTargetScope(config, updateImportsOnFileMoveName));
                return false;
            }
            default: {
                return false;
            }
        }
    }
    async getJsTsFileBeingMoved(resource) {
        if (resource.scheme !== fileSchemes.file) {
            return undefined;
        }
        if (await isDirectory(resource)) {
            const files = await vscode.workspace.findFiles(new vscode.RelativePattern(resource, '**/*.{ts,tsx,js,jsx}'), '**/node_modules/**', 1);
            return files[0];
        }
        return (await this._handles(resource)) ? resource : undefined;
    }
    async withEditsForFileRename(edits, document, oldFilePath, newFilePath) {
        const response = await this.client.interruptGetErr(() => {
            this.fileConfigurationManager.setGlobalConfigurationFromDocument(document, cancellation_1.nulToken);
            const args = {
                oldFilePath,
                newFilePath,
            };
            return this.client.execute('getEditsForFileRename', args, cancellation_1.nulToken);
        });
        if (response.type !== 'response' || !response.body.length) {
            return false;
        }
        typeConverters.WorkspaceEdit.withFileCodeEdits(edits, this.client, response.body);
        return true;
    }
    groupRenames(renames) {
        const groups = new Map();
        for (const rename of renames) {
            // Group renames by type (js/ts) and by workspace.
            const key = `${this.client.getWorkspaceRootForResource(rename.jsTsFileThatIsBeingMoved)?.fsPath}@@@${(0, languageDescription_1.doesResourceLookLikeATypeScriptFile)(rename.jsTsFileThatIsBeingMoved)}`;
            if (!groups.has(key)) {
                groups.set(key, new Set());
            }
            groups.get(key).add(rename);
        }
        return groups.values();
    }
    getConfirmMessage(start, resourcesToConfirm) {
        const MAX_CONFIRM_FILES = 10;
        const paths = [start];
        paths.push('');
        paths.push(...resourcesToConfirm.slice(0, MAX_CONFIRM_FILES).map(r => path.basename(r.fsPath)));
        if (resourcesToConfirm.length > MAX_CONFIRM_FILES) {
            if (resourcesToConfirm.length - MAX_CONFIRM_FILES === 1) {
                paths.push(vscode.l10n.t("...1 additional file not shown"));
            }
            else {
                paths.push(vscode.l10n.t("...{0} additional files not shown", resourcesToConfirm.length - MAX_CONFIRM_FILES));
            }
        }
        paths.push('');
        return paths.join('\n');
    }
    getConfigTargetScope(config, settingsName) {
        const inspected = config.inspect(settingsName);
        if (inspected?.workspaceFolderValue) {
            return vscode.ConfigurationTarget.WorkspaceFolder;
        }
        if (inspected?.workspaceValue) {
            return vscode.ConfigurationTarget.Workspace;
        }
        return vscode.ConfigurationTarget.Global;
    }
}
UpdateImportsOnFileRenameHandler.minVersion = api_1.API.v300;
function register(client, fileConfigurationManager, handles) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        (0, dependentRegistration_1.requireMinVersion)(client, UpdateImportsOnFileRenameHandler.minVersion),
        (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.Semantic),
    ], () => {
        return new UpdateImportsOnFileRenameHandler(client, fileConfigurationManager, handles);
    });
}
exports.register = register;
//# sourceMappingURL=updatePathsOnRename.js.map