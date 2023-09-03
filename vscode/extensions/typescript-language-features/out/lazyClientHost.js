"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazilyActivateClient = exports.createLazyClientHost = void 0;
const vscode = require("vscode");
const typeScriptServiceClientHost_1 = require("./typeScriptServiceClientHost");
const managedFileContext_1 = require("./ui/managedFileContext");
const fileSchemes = require("./configuration/fileSchemes");
const languageDescription_1 = require("./configuration/languageDescription");
const lazy_1 = require("./utils/lazy");
function createLazyClientHost(context, onCaseInsensitiveFileSystem, services, onCompletionAccepted) {
    return (0, lazy_1.lazy)(() => {
        const clientHost = new typeScriptServiceClientHost_1.default(languageDescription_1.standardLanguageDescriptions, context, onCaseInsensitiveFileSystem, services, onCompletionAccepted);
        context.subscriptions.push(clientHost);
        return clientHost;
    });
}
exports.createLazyClientHost = createLazyClientHost;
function lazilyActivateClient(lazyClientHost, pluginManager, activeJsTsEditorTracker, onActivate = () => Promise.resolve()) {
    const disposables = [];
    const supportedLanguage = [
        ...languageDescription_1.standardLanguageDescriptions.map(x => x.languageIds),
        ...pluginManager.plugins.map(x => x.languages)
    ].flat();
    let hasActivated = false;
    const maybeActivate = (textDocument) => {
        if (!hasActivated && isSupportedDocument(supportedLanguage, textDocument)) {
            hasActivated = true;
            onActivate().then(() => {
                // Force activation
                void lazyClientHost.value;
                disposables.push(new managedFileContext_1.default(activeJsTsEditorTracker));
            });
            return true;
        }
        return false;
    };
    const didActivate = vscode.workspace.textDocuments.some(maybeActivate);
    if (!didActivate) {
        const openListener = vscode.workspace.onDidOpenTextDocument(doc => {
            if (maybeActivate(doc)) {
                openListener.dispose();
            }
        }, undefined, disposables);
    }
    return vscode.Disposable.from(...disposables);
}
exports.lazilyActivateClient = lazilyActivateClient;
function isSupportedDocument(supportedLanguage, document) {
    return supportedLanguage.indexOf(document.languageId) >= 0
        && !fileSchemes.disabledSchemes.has(document.uri.scheme);
}
//# sourceMappingURL=lazyClientHost.js.map