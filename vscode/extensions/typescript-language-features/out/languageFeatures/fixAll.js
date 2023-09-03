"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const api_1 = require("../tsServer/api");
const errorCodes = require("../tsServer/protocol/errorCodes");
const fixNames = require("../tsServer/protocol/fixNames");
const typeConverters = require("../typeConverters");
const typescriptService_1 = require("../typescriptService");
const dependentRegistration_1 = require("./util/dependentRegistration");
async function buildIndividualFixes(fixes, edit, client, file, diagnostics, token) {
    for (const diagnostic of diagnostics) {
        for (const { codes, fixName } of fixes) {
            if (token.isCancellationRequested) {
                return;
            }
            if (!codes.has(diagnostic.code)) {
                continue;
            }
            const args = {
                ...typeConverters.Range.toFileRangeRequestArgs(file, diagnostic.range),
                errorCodes: [+(diagnostic.code)]
            };
            const response = await client.execute('getCodeFixes', args, token);
            if (response.type !== 'response') {
                continue;
            }
            const fix = response.body?.find(fix => fix.fixName === fixName);
            if (fix) {
                typeConverters.WorkspaceEdit.withFileCodeEdits(edit, client, fix.changes);
                break;
            }
        }
    }
}
async function buildCombinedFix(fixes, edit, client, file, diagnostics, token) {
    for (const diagnostic of diagnostics) {
        for (const { codes, fixName } of fixes) {
            if (token.isCancellationRequested) {
                return;
            }
            if (!codes.has(diagnostic.code)) {
                continue;
            }
            const args = {
                ...typeConverters.Range.toFileRangeRequestArgs(file, diagnostic.range),
                errorCodes: [+(diagnostic.code)]
            };
            const response = await client.execute('getCodeFixes', args, token);
            if (response.type !== 'response' || !response.body?.length) {
                continue;
            }
            const fix = response.body?.find(fix => fix.fixName === fixName);
            if (!fix) {
                continue;
            }
            if (!fix.fixId) {
                typeConverters.WorkspaceEdit.withFileCodeEdits(edit, client, fix.changes);
                return;
            }
            const combinedArgs = {
                scope: {
                    type: 'file',
                    args: { file }
                },
                fixId: fix.fixId,
            };
            const combinedResponse = await client.execute('getCombinedCodeFix', combinedArgs, token);
            if (combinedResponse.type !== 'response' || !combinedResponse.body) {
                return;
            }
            typeConverters.WorkspaceEdit.withFileCodeEdits(edit, client, combinedResponse.body.changes);
            return;
        }
    }
}
// #region Source Actions
class SourceAction extends vscode.CodeAction {
}
class SourceFixAll extends SourceAction {
    constructor() {
        super(vscode.l10n.t("Fix all fixable JS/TS issues"), SourceFixAll.kind);
    }
    async build(client, file, diagnostics, token) {
        this.edit = new vscode.WorkspaceEdit();
        await buildIndividualFixes([
            { codes: errorCodes.incorrectlyImplementsInterface, fixName: fixNames.classIncorrectlyImplementsInterface },
            { codes: errorCodes.asyncOnlyAllowedInAsyncFunctions, fixName: fixNames.awaitInSyncFunction },
        ], this.edit, client, file, diagnostics, token);
        await buildCombinedFix([
            { codes: errorCodes.unreachableCode, fixName: fixNames.unreachableCode }
        ], this.edit, client, file, diagnostics, token);
    }
}
SourceFixAll.kind = vscode.CodeActionKind.SourceFixAll.append('ts');
class SourceRemoveUnused extends SourceAction {
    constructor() {
        super(vscode.l10n.t("Remove all unused code"), SourceRemoveUnused.kind);
    }
    async build(client, file, diagnostics, token) {
        this.edit = new vscode.WorkspaceEdit();
        await buildCombinedFix([
            { codes: errorCodes.variableDeclaredButNeverUsed, fixName: fixNames.unusedIdentifier },
        ], this.edit, client, file, diagnostics, token);
    }
}
SourceRemoveUnused.kind = vscode.CodeActionKind.Source.append('removeUnused').append('ts');
class SourceAddMissingImports extends SourceAction {
    constructor() {
        super(vscode.l10n.t("Add all missing imports"), SourceAddMissingImports.kind);
    }
    async build(client, file, diagnostics, token) {
        this.edit = new vscode.WorkspaceEdit();
        await buildCombinedFix([
            { codes: errorCodes.cannotFindName, fixName: fixNames.fixImport }
        ], this.edit, client, file, diagnostics, token);
    }
}
SourceAddMissingImports.kind = vscode.CodeActionKind.Source.append('addMissingImports').append('ts');
//#endregion
class TypeScriptAutoFixProvider {
    constructor(client, fileConfigurationManager, diagnosticsManager) {
        this.client = client;
        this.fileConfigurationManager = fileConfigurationManager;
        this.diagnosticsManager = diagnosticsManager;
    }
    get metadata() {
        return {
            providedCodeActionKinds: TypeScriptAutoFixProvider.kindProviders.map(x => x.kind),
        };
    }
    async provideCodeActions(document, _range, context, token) {
        if (!context.only || !vscode.CodeActionKind.Source.intersects(context.only)) {
            return undefined;
        }
        const file = this.client.toOpenTsFilePath(document);
        if (!file) {
            return undefined;
        }
        const actions = this.getFixAllActions(context.only);
        const diagnostics = this.diagnosticsManager.getDiagnostics(document.uri);
        if (!diagnostics.length) {
            // Actions are a no-op in this case but we still want to return them
            return actions;
        }
        await this.fileConfigurationManager.ensureConfigurationForDocument(document, token);
        if (token.isCancellationRequested) {
            return undefined;
        }
        await Promise.all(actions.map(action => action.build(this.client, file, diagnostics, token)));
        return actions;
    }
    getFixAllActions(only) {
        return TypeScriptAutoFixProvider.kindProviders
            .filter(provider => only.intersects(provider.kind))
            .map(provider => new provider());
    }
}
TypeScriptAutoFixProvider.kindProviders = [
    SourceFixAll,
    SourceRemoveUnused,
    SourceAddMissingImports,
];
function register(selector, client, fileConfigurationManager, diagnosticsManager) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        (0, dependentRegistration_1.requireMinVersion)(client, api_1.API.v300),
        (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.Semantic),
    ], () => {
        const provider = new TypeScriptAutoFixProvider(client, fileConfigurationManager, diagnosticsManager);
        return vscode.languages.registerCodeActionsProvider(selector.semantic, provider, provider.metadata);
    });
}
exports.register = register;
//# sourceMappingURL=fixAll.js.map