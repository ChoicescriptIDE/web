"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.templateToSnippet = void 0;
const vscode = require("vscode");
const typeConverters = require("../typeConverters");
const defaultJsDoc = new vscode.SnippetString(`/**\n * $0\n */`);
class JsDocCompletionItem extends vscode.CompletionItem {
    constructor(document, position) {
        super('/** */', vscode.CompletionItemKind.Text);
        this.document = document;
        this.position = position;
        this.detail = vscode.l10n.t("JSDoc comment");
        this.sortText = '\0';
        const line = document.lineAt(position.line).text;
        const prefix = line.slice(0, position.character).match(/\/\**\s*$/);
        const suffix = line.slice(position.character).match(/^\s*\**\//);
        const start = position.translate(0, prefix ? -prefix[0].length : 0);
        const range = new vscode.Range(start, position.translate(0, suffix ? suffix[0].length : 0));
        this.range = { inserting: range, replacing: range };
    }
}
class JsDocCompletionProvider {
    constructor(client, language, fileConfigurationManager) {
        this.client = client;
        this.language = language;
        this.fileConfigurationManager = fileConfigurationManager;
    }
    async provideCompletionItems(document, position, token) {
        if (!vscode.workspace.getConfiguration(this.language.id, document).get('suggest.completeJSDocs')) {
            return undefined;
        }
        const file = this.client.toOpenTsFilePath(document);
        if (!file) {
            return undefined;
        }
        if (!this.isPotentiallyValidDocCompletionPosition(document, position)) {
            return undefined;
        }
        const response = await this.client.interruptGetErr(async () => {
            await this.fileConfigurationManager.ensureConfigurationForDocument(document, token);
            const args = typeConverters.Position.toFileLocationRequestArgs(file, position);
            return this.client.execute('docCommentTemplate', args, token);
        });
        if (response.type !== 'response' || !response.body) {
            return undefined;
        }
        const item = new JsDocCompletionItem(document, position);
        // Workaround for #43619
        // docCommentTemplate previously returned undefined for empty jsdoc templates.
        // TS 2.7 now returns a single line doc comment, which breaks indentation.
        if (response.body.newText === '/** */') {
            item.insertText = defaultJsDoc;
        }
        else {
            item.insertText = templateToSnippet(response.body.newText);
        }
        return [item];
    }
    isPotentiallyValidDocCompletionPosition(document, position) {
        // Only show the JSdoc completion when the everything before the cursor is whitespace
        // or could be the opening of a comment
        const line = document.lineAt(position.line).text;
        const prefix = line.slice(0, position.character);
        if (!/^\s*$|\/\*\*\s*$|^\s*\/\*\*+\s*$/.test(prefix)) {
            return false;
        }
        // And everything after is possibly a closing comment or more whitespace
        const suffix = line.slice(position.character);
        return /^\s*(\*+\/)?\s*$/.test(suffix);
    }
}
function templateToSnippet(template) {
    // TODO: use append placeholder
    let snippetIndex = 1;
    template = template.replace(/\$/g, '\\$'); // CodeQL [SM02383] This is only used for text which is put into the editor. It is not for rendered html
    template = template.replace(/^[ \t]*(?=(\/|[ ]\*))/gm, '');
    template = template.replace(/^(\/\*\*\s*\*[ ]*)$/m, (x) => x + `\$0`);
    template = template.replace(/\* @param([ ]\{\S+\})?\s+(\S+)[ \t]*$/gm, (_param, type, post) => {
        let out = '* @param ';
        if (type === ' {any}' || type === ' {*}') {
            out += `{\$\{${snippetIndex++}:*\}} `;
        }
        else if (type) {
            out += type + ' ';
        }
        out += post + ` \${${snippetIndex++}}`;
        return out;
    });
    template = template.replace(/\* @returns[ \t]*$/gm, `* @returns \${${snippetIndex++}}`);
    return new vscode.SnippetString(template);
}
exports.templateToSnippet = templateToSnippet;
function register(selector, language, client, fileConfigurationManager) {
    return vscode.languages.registerCompletionItemProvider(selector.syntax, new JsDocCompletionProvider(client, language, fileConfigurationManager), '*');
}
exports.register = register;
//# sourceMappingURL=jsDocCompletions.js.map