"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fileSchemes_1 = require("../configuration/fileSchemes");
const languageDescription_1 = require("../configuration/languageDescription");
const languageIds_1 = require("../configuration/languageIds");
const dispose_1 = require("../utils/dispose");
/**E
 * When clause context set when the current file is managed by vscode's built-in typescript extension.
 */
class ManagedFileContextManager extends dispose_1.Disposable {
    constructor(activeJsTsEditorTracker) {
        super();
        this.isInManagedFileContext = false;
        activeJsTsEditorTracker.onDidChangeActiveJsTsEditor(this.onDidChangeActiveTextEditor, this, this._disposables);
        this.onDidChangeActiveTextEditor(activeJsTsEditorTracker.activeJsTsEditor);
    }
    onDidChangeActiveTextEditor(editor) {
        if (editor) {
            this.updateContext(this.isManagedFile(editor));
        }
        else {
            this.updateContext(false);
        }
    }
    updateContext(newValue) {
        if (newValue === this.isInManagedFileContext) {
            return;
        }
        vscode.commands.executeCommand('setContext', ManagedFileContextManager.contextName, newValue);
        this.isInManagedFileContext = newValue;
    }
    isManagedFile(editor) {
        return this.isManagedScriptFile(editor) || this.isManagedConfigFile(editor);
    }
    isManagedScriptFile(editor) {
        return (0, languageIds_1.isSupportedLanguageMode)(editor.document) && !fileSchemes_1.disabledSchemes.has(editor.document.uri.scheme);
    }
    isManagedConfigFile(editor) {
        return (0, languageDescription_1.isJsConfigOrTsConfigFileName)(editor.document.fileName);
    }
}
ManagedFileContextManager.contextName = 'typescript.isManagedFile';
exports.default = ManagedFileContextManager;
//# sourceMappingURL=managedFileContext.js.map