"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const api_1 = require("../tsServer/api");
const typeConverters = require("../typeConverters");
const typescriptService_1 = require("../typescriptService");
const dependentRegistration_1 = require("./util/dependentRegistration");
class LinkedEditingSupport {
    constructor(client) {
        this.client = client;
    }
    async provideLinkedEditingRanges(document, position, token) {
        const filepath = this.client.toOpenTsFilePath(document);
        if (!filepath) {
            return undefined;
        }
        const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
        const response = await this.client.execute('linkedEditingRange', args, token);
        if (response.type !== 'response' || !response.body) {
            return undefined;
        }
        const wordPattern = response.body.wordPattern ? new RegExp(response.body.wordPattern) : undefined;
        return new vscode.LinkedEditingRanges(response.body.ranges.map(range => typeConverters.Range.fromTextSpan(range)), wordPattern);
    }
}
LinkedEditingSupport.minVersion = api_1.API.v510;
function register(selector, client) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        (0, dependentRegistration_1.requireMinVersion)(client, LinkedEditingSupport.minVersion),
        (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.Syntax),
    ], () => {
        return vscode.languages.registerLinkedEditingRangeProvider(selector.syntax, new LinkedEditingSupport(client));
    });
}
exports.register = register;
//# sourceMappingURL=linkedEditing.js.map