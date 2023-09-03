"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.looksLikeAbsoluteWindowsPath = exports.exists = void 0;
const vscode = require("vscode");
async function exists(resource) {
    try {
        const stat = await vscode.workspace.fs.stat(resource);
        // stat.type is an enum flag
        return !!(stat.type & vscode.FileType.File);
    }
    catch {
        return false;
    }
}
exports.exists = exists;
function looksLikeAbsoluteWindowsPath(path) {
    return /^[a-zA-Z]:[\/\\]/.test(path);
}
exports.looksLikeAbsoluteWindowsPath = looksLikeAbsoluteWindowsPath;
//# sourceMappingURL=fs.js.map