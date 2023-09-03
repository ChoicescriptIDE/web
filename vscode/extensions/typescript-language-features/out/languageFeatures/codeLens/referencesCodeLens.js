"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.TypeScriptReferencesCodeLensProvider = void 0;
const vscode = require("vscode");
const PConst = require("../../tsServer/protocol/protocol.const");
const server_1 = require("../../tsServer/server");
const typeConverters = require("../../typeConverters");
const typescriptService_1 = require("../../typescriptService");
const dependentRegistration_1 = require("../util/dependentRegistration");
const baseCodeLensProvider_1 = require("./baseCodeLensProvider");
class TypeScriptReferencesCodeLensProvider extends baseCodeLensProvider_1.TypeScriptBaseCodeLensProvider {
    constructor(client, _cachedResponse, language) {
        super(client, _cachedResponse);
        this._cachedResponse = _cachedResponse;
        this.language = language;
    }
    async resolveCodeLens(codeLens, token) {
        const args = typeConverters.Position.toFileLocationRequestArgs(codeLens.file, codeLens.range.start);
        const response = await this.client.execute('references', args, token, {
            lowPriority: true,
            executionTarget: server_1.ExecutionTarget.Semantic,
            cancelOnResourceChange: codeLens.document,
        });
        if (response.type !== 'response' || !response.body) {
            codeLens.command = response.type === 'cancelled'
                ? baseCodeLensProvider_1.TypeScriptBaseCodeLensProvider.cancelledCommand
                : baseCodeLensProvider_1.TypeScriptBaseCodeLensProvider.errorCommand;
            return codeLens;
        }
        const locations = response.body.refs
            .filter(reference => !reference.isDefinition)
            .map(reference => typeConverters.Location.fromTextSpan(this.client.toResource(reference.file), reference));
        codeLens.command = {
            title: this.getCodeLensLabel(locations),
            command: locations.length ? 'editor.action.showReferences' : '',
            arguments: [codeLens.document, codeLens.range.start, locations]
        };
        return codeLens;
    }
    getCodeLensLabel(locations) {
        return locations.length === 1
            ? vscode.l10n.t("1 reference")
            : vscode.l10n.t("{0} references", locations.length);
    }
    extractSymbol(document, item, parent) {
        if (parent && parent.kind === PConst.Kind.enum) {
            return (0, baseCodeLensProvider_1.getSymbolRange)(document, item);
        }
        switch (item.kind) {
            case PConst.Kind.function: {
                const showOnAllFunctions = vscode.workspace.getConfiguration(this.language.id).get('referencesCodeLens.showOnAllFunctions');
                if (showOnAllFunctions) {
                    return (0, baseCodeLensProvider_1.getSymbolRange)(document, item);
                }
            }
            // fallthrough
            case PConst.Kind.const:
            case PConst.Kind.let:
            case PConst.Kind.variable:
                // Only show references for exported variables
                if (/\bexport\b/.test(item.kindModifiers)) {
                    return (0, baseCodeLensProvider_1.getSymbolRange)(document, item);
                }
                break;
            case PConst.Kind.class:
                if (item.text === '<class>') {
                    break;
                }
                return (0, baseCodeLensProvider_1.getSymbolRange)(document, item);
            case PConst.Kind.interface:
            case PConst.Kind.type:
            case PConst.Kind.enum:
                return (0, baseCodeLensProvider_1.getSymbolRange)(document, item);
            case PConst.Kind.method:
            case PConst.Kind.memberGetAccessor:
            case PConst.Kind.memberSetAccessor:
            case PConst.Kind.constructorImplementation:
            case PConst.Kind.memberVariable:
                // Don't show if child and parent have same start
                // For https://github.com/microsoft/vscode/issues/90396
                if (parent &&
                    typeConverters.Position.fromLocation(parent.spans[0].start).isEqual(typeConverters.Position.fromLocation(item.spans[0].start))) {
                    return undefined;
                }
                // Only show if parent is a class type object (not a literal)
                switch (parent?.kind) {
                    case PConst.Kind.class:
                    case PConst.Kind.interface:
                    case PConst.Kind.type:
                        return (0, baseCodeLensProvider_1.getSymbolRange)(document, item);
                }
                break;
        }
        return undefined;
    }
}
exports.TypeScriptReferencesCodeLensProvider = TypeScriptReferencesCodeLensProvider;
function register(selector, language, client, cachedResponse) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        (0, dependentRegistration_1.requireGlobalConfiguration)(language.id, 'referencesCodeLens.enabled'),
        (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.Semantic),
    ], () => {
        return vscode.languages.registerCodeLensProvider(selector.semantic, new TypeScriptReferencesCodeLensProvider(client, cachedResponse, language));
    });
}
exports.register = register;
//# sourceMappingURL=referencesCodeLens.js.map