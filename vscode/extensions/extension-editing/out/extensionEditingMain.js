"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const packageDocumentHelper_1 = require("./packageDocumentHelper");
const extensionLinter_1 = require("./extensionLinter");
function activate(context) {
    //package.json suggestions
    context.subscriptions.push(registerPackageDocumentCompletions());
    context.subscriptions.push(new extensionLinter_1.ExtensionLinter());
}
exports.activate = activate;
function registerPackageDocumentCompletions() {
    return vscode.languages.registerCompletionItemProvider({ language: 'json', pattern: '**/package.json' }, {
        provideCompletionItems(document, position, token) {
            return new packageDocumentHelper_1.PackageDocument(document).provideCompletionItems(position, token);
        }
    });
}
//# sourceMappingURL=extensionEditingMain.js.map