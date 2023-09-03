"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const typeConverters = require("../typeConverters");
const arrays_1 = require("../utils/arrays");
class TypeScriptFoldingProvider {
    constructor(client) {
        this.client = client;
    }
    async provideFoldingRanges(document, _context, token) {
        const file = this.client.toOpenTsFilePath(document);
        if (!file) {
            return;
        }
        const args = { file };
        const response = await this.client.execute('getOutliningSpans', args, token);
        if (response.type !== 'response' || !response.body) {
            return;
        }
        return (0, arrays_1.coalesce)(response.body.map(span => this.convertOutliningSpan(span, document)));
    }
    convertOutliningSpan(span, document) {
        const range = typeConverters.Range.fromTextSpan(span.textSpan);
        const kind = TypeScriptFoldingProvider.getFoldingRangeKind(span);
        // Workaround for #49904
        if (span.kind === 'comment') {
            const line = document.lineAt(range.start.line).text;
            if (/\/\/\s*#endregion/gi.test(line)) {
                return undefined;
            }
        }
        const start = range.start.line;
        const end = this.adjustFoldingEnd(range, document);
        return new vscode.FoldingRange(start, end, kind);
    }
    adjustFoldingEnd(range, document) {
        // workaround for #47240
        if (range.end.character > 0) {
            const foldEndCharacter = document.getText(new vscode.Range(range.end.translate(0, -1), range.end));
            if (TypeScriptFoldingProvider.foldEndPairCharacters.includes(foldEndCharacter)) {
                return Math.max(range.end.line - 1, range.start.line);
            }
        }
        return range.end.line;
    }
    static getFoldingRangeKind(span) {
        switch (span.kind) {
            case 'comment': return vscode.FoldingRangeKind.Comment;
            case 'region': return vscode.FoldingRangeKind.Region;
            case 'imports': return vscode.FoldingRangeKind.Imports;
            case 'code':
            default: return undefined;
        }
    }
}
TypeScriptFoldingProvider.foldEndPairCharacters = ['}', ']', ')', '`', '>'];
function register(selector, client) {
    return vscode.languages.registerFoldingRangeProvider(selector.syntax, new TypeScriptFoldingProvider(client));
}
exports.register = register;
//# sourceMappingURL=folding.js.map