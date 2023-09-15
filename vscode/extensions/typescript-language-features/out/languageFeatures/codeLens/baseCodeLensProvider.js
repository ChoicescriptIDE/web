"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymbolRange = exports.TypeScriptBaseCodeLensProvider = exports.ReferencesCodeLens = void 0;
const vscode = require("vscode");
const typeConverters = require("../../typeConverters");
const regexp_1 = require("../../utils/regexp");
class ReferencesCodeLens extends vscode.CodeLens {
    constructor(document, file, range) {
        super(range);
        this.document = document;
        this.file = file;
    }
}
exports.ReferencesCodeLens = ReferencesCodeLens;
class TypeScriptBaseCodeLensProvider {
    constructor(client, cachedResponse) {
        this.client = client;
        this.cachedResponse = cachedResponse;
    }
    async provideCodeLenses(document, token) {
        const filepath = this.client.toOpenTsFilePath(document);
        if (!filepath) {
            return [];
        }
        const response = await this.cachedResponse.execute(document, () => this.client.execute('navtree', { file: filepath }, token));
        if (response.type !== 'response') {
            return [];
        }
        const referenceableSpans = [];
        response.body?.childItems?.forEach(item => this.walkNavTree(document, item, undefined, referenceableSpans));
        return referenceableSpans.map(span => new ReferencesCodeLens(document.uri, filepath, span));
    }
    walkNavTree(document, item, parent, results) {
        const range = this.extractSymbol(document, item, parent);
        if (range) {
            results.push(range);
        }
        item.childItems?.forEach(child => this.walkNavTree(document, child, item, results));
    }
}
exports.TypeScriptBaseCodeLensProvider = TypeScriptBaseCodeLensProvider;
TypeScriptBaseCodeLensProvider.cancelledCommand = {
    // Cancellation is not an error. Just show nothing until we can properly re-compute the code lens
    title: '',
    command: ''
};
TypeScriptBaseCodeLensProvider.errorCommand = {
    title: vscode.l10n.t("Could not determine references"),
    command: ''
};
function getSymbolRange(document, item) {
    if (item.nameSpan) {
        return typeConverters.Range.fromTextSpan(item.nameSpan);
    }
    // In older versions, we have to calculate this manually. See #23924
    const span = item.spans?.[0];
    if (!span) {
        return undefined;
    }
    const range = typeConverters.Range.fromTextSpan(span);
    const text = document.getText(range);
    const identifierMatch = new RegExp(`^(.*?(\\b|\\W))${(0, regexp_1.escapeRegExp)(item.text || '')}(\\b|\\W)`, 'gm');
    const match = identifierMatch.exec(text);
    const prefixLength = match ? match.index + match[1].length : 0;
    const startOffset = document.offsetAt(new vscode.Position(range.start.line, range.start.character)) + prefixLength;
    return new vscode.Range(document.positionAt(startOffset), document.positionAt(startOffset + item.text.length));
}
exports.getSymbolRange = getSymbolRange;
//# sourceMappingURL=baseCodeLensProvider.js.map