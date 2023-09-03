"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const api_1 = require("../tsServer/api");
const typeConverters_1 = require("../typeConverters");
const typescriptService_1 = require("../typescriptService");
const dispose_1 = require("../utils/dispose");
const fileConfigurationManager_1 = require("./fileConfigurationManager");
const dependentRegistration_1 = require("./util/dependentRegistration");
const inlayHintSettingNames = Object.freeze([
    fileConfigurationManager_1.InlayHintSettingNames.parameterNamesSuppressWhenArgumentMatchesName,
    fileConfigurationManager_1.InlayHintSettingNames.parameterNamesEnabled,
    fileConfigurationManager_1.InlayHintSettingNames.variableTypesEnabled,
    fileConfigurationManager_1.InlayHintSettingNames.variableTypesSuppressWhenTypeMatchesName,
    fileConfigurationManager_1.InlayHintSettingNames.propertyDeclarationTypesEnabled,
    fileConfigurationManager_1.InlayHintSettingNames.functionLikeReturnTypesEnabled,
    fileConfigurationManager_1.InlayHintSettingNames.enumMemberValuesEnabled,
]);
class TypeScriptInlayHintsProvider extends dispose_1.Disposable {
    constructor(language, client, fileConfigurationManager) {
        super();
        this.language = language;
        this.client = client;
        this.fileConfigurationManager = fileConfigurationManager;
        this._onDidChangeInlayHints = new vscode.EventEmitter();
        this.onDidChangeInlayHints = this._onDidChangeInlayHints.event;
        this._register(vscode.workspace.onDidChangeConfiguration(e => {
            if (inlayHintSettingNames.some(settingName => e.affectsConfiguration(language.id + '.' + settingName))) {
                this._onDidChangeInlayHints.fire();
            }
        }));
        // When a JS/TS file changes, change inlay hints for all visible editors
        // since changes in one file can effect the hints the others.
        this._register(vscode.workspace.onDidChangeTextDocument(e => {
            if (language.languageIds.includes(e.document.languageId)) {
                this._onDidChangeInlayHints.fire();
            }
        }));
    }
    async provideInlayHints(model, range, token) {
        const filepath = this.client.toOpenTsFilePath(model);
        if (!filepath) {
            return [];
        }
        if (!areInlayHintsEnabledForFile(this.language, model)) {
            return [];
        }
        const start = model.offsetAt(range.start);
        const length = model.offsetAt(range.end) - start;
        await this.fileConfigurationManager.ensureConfigurationForDocument(model, token);
        const response = await this.client.execute('provideInlayHints', { file: filepath, start, length }, token);
        if (response.type !== 'response' || !response.success || !response.body) {
            return [];
        }
        return response.body.map(hint => {
            const result = new vscode.InlayHint(typeConverters_1.Position.fromLocation(hint.position), this.convertInlayHintText(model.uri, hint), hint.kind && fromProtocolInlayHintKind(hint.kind));
            result.paddingLeft = hint.whitespaceBefore;
            result.paddingRight = hint.whitespaceAfter;
            return result;
        });
    }
    convertInlayHintText(resource, tsHint) {
        if (tsHint.displayParts) {
            return tsHint.displayParts.map((part) => {
                const out = new vscode.InlayHintLabelPart(part.text);
                if (part.span) {
                    out.location = typeConverters_1.Location.fromTextSpan(resource, part.span);
                }
                return out;
            });
        }
        return tsHint.text;
    }
}
TypeScriptInlayHintsProvider.minVersion = api_1.API.v440;
function fromProtocolInlayHintKind(kind) {
    switch (kind) {
        case 'Parameter': return vscode.InlayHintKind.Parameter;
        case 'Type': return vscode.InlayHintKind.Type;
        case 'Enum': return undefined;
        default: return undefined;
    }
}
function areInlayHintsEnabledForFile(language, document) {
    const config = vscode.workspace.getConfiguration(language.id, document);
    const preferences = (0, fileConfigurationManager_1.getInlayHintsPreferences)(config);
    return preferences.includeInlayParameterNameHints === 'literals' ||
        preferences.includeInlayParameterNameHints === 'all' ||
        preferences.includeInlayEnumMemberValueHints ||
        preferences.includeInlayFunctionLikeReturnTypeHints ||
        preferences.includeInlayFunctionParameterTypeHints ||
        preferences.includeInlayPropertyDeclarationTypeHints ||
        preferences.includeInlayVariableTypeHints;
}
function register(selector, language, client, fileConfigurationManager) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        (0, dependentRegistration_1.requireMinVersion)(client, TypeScriptInlayHintsProvider.minVersion),
        (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.Semantic),
    ], () => {
        const provider = new TypeScriptInlayHintsProvider(language, client, fileConfigurationManager);
        return vscode.languages.registerInlayHintsProvider(selector.semantic, provider);
    });
}
exports.register = register;
//# sourceMappingURL=inlayHints.js.map