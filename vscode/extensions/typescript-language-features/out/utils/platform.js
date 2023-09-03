"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWebAndHasSharedArrayBuffers = exports.isWeb = void 0;
const vscode = require("vscode");
function isWeb() {
    return 'navigator' in globalThis && vscode.env.uiKind === vscode.UIKind.Web;
}
exports.isWeb = isWeb;
function isWebAndHasSharedArrayBuffers() {
    return isWeb() && globalThis['crossOriginIsolated'];
}
exports.isWebAndHasSharedArrayBuffers = isWebAndHasSharedArrayBuffers;
//# sourceMappingURL=platform.js.map