"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUpdateLinksOnRename = void 0;
const path = require("path");
const picomatch = require("picomatch");
const vscode = require("vscode");
const async_1 = require("../util/async");
const cancellation_1 = require("../util/cancellation");
const dispose_1 = require("../util/dispose");
const fileReferences_1 = require("./fileReferences");
const settingNames = Object.freeze({
    enabled: 'updateLinksOnFileMove.enabled',
    include: 'updateLinksOnFileMove.include',
    enableForDirectories: 'updateLinksOnFileMove.enableForDirectories',
});
class UpdateLinksOnFileRenameHandler extends dispose_1.Disposable {
    constructor(_client) {
        super();
        this._client = _client;
        this._delayer = new async_1.Delayer(50);
        this._pendingRenames = new Set();
        this._register(vscode.workspace.onDidRenameFiles(async (e) => {
            await Promise.all(e.files.map(async (rename) => {
                if (await this._shouldParticipateInLinkUpdate(rename.newUri)) {
                    this._pendingRenames.add(rename);
                }
            }));
            if (this._pendingRenames.size) {
                this._delayer.trigger(() => {
                    vscode.window.withProgress({
                        location: vscode.ProgressLocation.Window,
                        title: vscode.l10n.t("Checking for Markdown links to update")
                    }, () => this._flushRenames());
                });
            }
        }));
    }
    async _flushRenames() {
        const renames = Array.from(this._pendingRenames);
        this._pendingRenames.clear();
        const result = await this._getEditsForFileRename(renames, cancellation_1.noopToken);
        if (result && result.edit.size) {
            if (await this._confirmActionWithUser(result.resourcesBeingRenamed)) {
                await vscode.workspace.applyEdit(result.edit);
            }
        }
    }
    async _confirmActionWithUser(newResources) {
        if (!newResources.length) {
            return false;
        }
        const config = vscode.workspace.getConfiguration('markdown', newResources[0]);
        const setting = config.get(settingNames.enabled);
        switch (setting) {
            case "prompt" /* UpdateLinksOnFileMoveSetting.Prompt */:
                return this._promptUser(newResources);
            case "always" /* UpdateLinksOnFileMoveSetting.Always */:
                return true;
            case "never" /* UpdateLinksOnFileMoveSetting.Never */:
            default:
                return false;
        }
    }
    async _shouldParticipateInLinkUpdate(newUri) {
        const config = vscode.workspace.getConfiguration('markdown', newUri);
        const setting = config.get(settingNames.enabled);
        if (setting === "never" /* UpdateLinksOnFileMoveSetting.Never */) {
            return false;
        }
        const externalGlob = config.get(settingNames.include);
        if (externalGlob) {
            for (const glob of externalGlob) {
                if (picomatch.isMatch(newUri.fsPath, glob)) {
                    return true;
                }
            }
        }
        const stat = await vscode.workspace.fs.stat(newUri);
        if (stat.type === vscode.FileType.Directory) {
            return config.get(settingNames.enableForDirectories, true);
        }
        return false;
    }
    async _promptUser(newResources) {
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
        const choice = await vscode.window.showInformationMessage(newResources.length === 1
            ? vscode.l10n.t("Update Markdown links for '{0}'?", path.basename(newResources[0].fsPath))
            : this._getConfirmMessage(vscode.l10n.t("Update Markdown links for the following {0} files?", newResources.length), newResources), {
            modal: true,
        }, rejectItem, acceptItem, alwaysItem, neverItem);
        switch (choice) {
            case acceptItem: {
                return true;
            }
            case rejectItem: {
                return false;
            }
            case alwaysItem: {
                const config = vscode.workspace.getConfiguration('markdown', newResources[0]);
                config.update(settingNames.enabled, "always" /* UpdateLinksOnFileMoveSetting.Always */, this._getConfigTargetScope(config, settingNames.enabled));
                return true;
            }
            case neverItem: {
                const config = vscode.workspace.getConfiguration('markdown', newResources[0]);
                config.update(settingNames.enabled, "never" /* UpdateLinksOnFileMoveSetting.Never */, this._getConfigTargetScope(config, settingNames.enabled));
                return false;
            }
            default: {
                return false;
            }
        }
    }
    async _getEditsForFileRename(renames, token) {
        const result = await this._client.getEditForFileRenames(renames.map(rename => ({ oldUri: rename.oldUri.toString(), newUri: rename.newUri.toString() })), token);
        if (!result?.edit.documentChanges?.length) {
            return undefined;
        }
        const workspaceEdit = new vscode.WorkspaceEdit();
        for (const change of result.edit.documentChanges) {
            const uri = vscode.Uri.parse(change.textDocument.uri);
            for (const edit of change.edits) {
                workspaceEdit.replace(uri, (0, fileReferences_1.convertRange)(edit.range), edit.newText);
            }
        }
        return {
            edit: workspaceEdit,
            resourcesBeingRenamed: result.participatingRenames.map(x => vscode.Uri.parse(x.newUri)),
        };
    }
    _getConfirmMessage(start, resourcesToConfirm) {
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
    _getConfigTargetScope(config, settingsName) {
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
function registerUpdateLinksOnRename(client) {
    return new UpdateLinksOnFileRenameHandler(client);
}
exports.registerUpdateLinksOnRename = registerUpdateLinksOnRename;
//# sourceMappingURL=linkUpdater.js.map