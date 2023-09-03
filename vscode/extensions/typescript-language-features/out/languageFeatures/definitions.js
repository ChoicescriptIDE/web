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
const definitionProviderBase_1 = require("./definitionProviderBase");
const dependentRegistration_1 = require("./util/dependentRegistration");
class TypeScriptDefinitionProvider extends definitionProviderBase_1.default {
    async provideDefinition(document, position, token) {
        const filepath = this.client.toOpenTsFilePath(document);
        if (!filepath) {
            return undefined;
        }
        const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
        const response = await this.client.execute('definitionAndBoundSpan', args, token);
        if (response.type !== 'response' || !response.body) {
            return undefined;
        }
        const span = response.body.textSpan ? typeConverters.Range.fromTextSpan(response.body.textSpan) : undefined;
        let definitions = response.body.definitions;
        if (vscode.workspace.getConfiguration(document.languageId).get('preferGoToSourceDefinition', false) && this.client.apiVersion.gte(api_1.API.v470)) {
            const sourceDefinitionsResponse = await this.client.execute('findSourceDefinition', args, token);
            if (sourceDefinitionsResponse.type === 'response' && sourceDefinitionsResponse.body?.length) {
                definitions = sourceDefinitionsResponse.body;
            }
        }
        return definitions
            .map((location) => {
            const target = typeConverters.Location.fromTextSpan(this.client.toResource(location.file), location);
            if (location.contextStart && location.contextEnd) {
                return {
                    originSelectionRange: span,
                    targetRange: typeConverters.Range.fromLocations(location.contextStart, location.contextEnd),
                    targetUri: target.uri,
                    targetSelectionRange: target.range,
                };
            }
            return {
                originSelectionRange: span,
                targetRange: target.range,
                targetUri: target.uri
            };
        });
    }
}
exports.default = TypeScriptDefinitionProvider;
function register(selector, client) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.EnhancedSyntax, typescriptService_1.ClientCapability.Semantic),
    ], () => {
        return vscode.languages.registerDefinitionProvider(selector.syntax, new TypeScriptDefinitionProvider(client));
    });
}
exports.register = register;
//# sourceMappingURL=definitions.js.map