"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageDocument = void 0;
const vscode = require("vscode");
const jsonc_parser_1 = require("jsonc-parser");
class PackageDocument {
    constructor(document) {
        this.document = document;
    }
    provideCompletionItems(position, _token) {
        const location = (0, jsonc_parser_1.getLocation)(this.document.getText(), this.document.offsetAt(position));
        if (location.path.length >= 2 && location.path[1] === 'configurationDefaults') {
            return this.provideLanguageOverridesCompletionItems(location, position);
        }
        return undefined;
    }
    provideLanguageOverridesCompletionItems(location, position) {
        let range = this.getReplaceRange(location, position);
        const text = this.document.getText(range);
        if (location.path.length === 2) {
            let snippet = '"[${1:language}]": {\n\t"$0"\n}';
            // Suggestion model word matching includes quotes,
            // hence exclude the starting quote from the snippet and the range
            // ending quote gets replaced
            if (text && text.startsWith('"')) {
                range = new vscode.Range(new vscode.Position(range.start.line, range.start.character + 1), range.end);
                snippet = snippet.substring(1);
            }
            return Promise.resolve([this.newSnippetCompletionItem({
                    label: vscode.l10n.t("Language specific editor settings"),
                    documentation: vscode.l10n.t("Override editor settings for language"),
                    snippet,
                    range
                })]);
        }
        if (location.path.length === 3 && location.previousNode && typeof location.previousNode.value === 'string' && location.previousNode.value.startsWith('[')) {
            // Suggestion model word matching includes starting quote and open sqaure bracket
            // Hence exclude them from the proposal range
            range = new vscode.Range(new vscode.Position(range.start.line, range.start.character + 2), range.end);
            return vscode.languages.getLanguages().then(languages => {
                return languages.map(l => {
                    // Suggestion model word matching includes closed sqaure bracket and ending quote
                    // Hence include them in the proposal to replace
                    return this.newSimpleCompletionItem(l, range, '', l + ']"');
                });
            });
        }
        return Promise.resolve([]);
    }
    getReplaceRange(location, position) {
        const node = location.previousNode;
        if (node) {
            const nodeStart = this.document.positionAt(node.offset), nodeEnd = this.document.positionAt(node.offset + node.length);
            if (nodeStart.isBeforeOrEqual(position) && nodeEnd.isAfterOrEqual(position)) {
                return new vscode.Range(nodeStart, nodeEnd);
            }
        }
        return new vscode.Range(position, position);
    }
    newSimpleCompletionItem(text, range, description, insertText) {
        const item = new vscode.CompletionItem(text);
        item.kind = vscode.CompletionItemKind.Value;
        item.detail = description;
        item.insertText = insertText ? insertText : text;
        item.range = range;
        return item;
    }
    newSnippetCompletionItem(o) {
        const item = new vscode.CompletionItem(o.label);
        item.kind = vscode.CompletionItemKind.Value;
        item.documentation = o.documentation;
        item.insertText = new vscode.SnippetString(o.snippet);
        item.range = o.range;
        return item;
    }
}
exports.PackageDocument = PackageDocument;
//# sourceMappingURL=packageDocumentHelper.js.map