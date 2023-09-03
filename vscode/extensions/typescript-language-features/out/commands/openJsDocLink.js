"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenJsDocLinkCommand = void 0;
const vscode = require("vscode");
/**
 * Proxy command for opening links in jsdoc comments.
 *
 * This is needed to avoid incorrectly rewriting uris.
 */
class OpenJsDocLinkCommand {
    constructor() {
        this.id = OpenJsDocLinkCommand.id;
    }
    async execute(args) {
        await vscode.commands.executeCommand('vscode.open', vscode.Uri.from(args.file), {
            selection: new vscode.Range(args.position, args.position),
        });
    }
}
exports.OpenJsDocLinkCommand = OpenJsDocLinkCommand;
OpenJsDocLinkCommand.id = '_typescript.openJsDocLink';
//# sourceMappingURL=openJsDocLink.js.map