"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const api_1 = require("../tsServer/api");
const modifiers_1 = require("../tsServer/protocol/modifiers");
const PConst = require("../tsServer/protocol/protocol.const");
const typeConverters = require("../typeConverters");
const typescriptService_1 = require("../typescriptService");
const cancellation_1 = require("../utils/cancellation");
const codeAction_1 = require("./util/codeAction");
const dependentRegistration_1 = require("./util/dependentRegistration");
const snippetForFunctionCall_1 = require("./util/snippetForFunctionCall");
const Previewer = require("./util/textRendering");
class MyCompletionItem extends vscode.CompletionItem {
    constructor(position, document, tsEntry, completionContext, metadata, client) {
        const label = tsEntry.name || (tsEntry.insertText ?? '');
        super(label, MyCompletionItem.convertKind(tsEntry.kind));
        this.position = position;
        this.document = document;
        this.tsEntry = tsEntry;
        this.completionContext = completionContext;
        this.metadata = metadata;
        if (tsEntry.source && tsEntry.hasAction && client.apiVersion.lt(api_1.API.v490)) {
            // De-prioritze auto-imports
            // https://github.com/microsoft/vscode/issues/40311
            this.sortText = '\uffff' + tsEntry.sortText;
        }
        else {
            this.sortText = tsEntry.sortText;
        }
        if (tsEntry.source && tsEntry.hasAction) {
            // Render "fancy" when source is a workspace path
            const qualifierCandidate = vscode.workspace.asRelativePath(tsEntry.source);
            if (qualifierCandidate !== tsEntry.source) {
                this.label = { label, description: qualifierCandidate };
            }
        }
        const { sourceDisplay, isSnippet } = tsEntry;
        if (sourceDisplay) {
            this.label = { label, description: Previewer.asPlainTextWithLinks(sourceDisplay, client) };
        }
        if (tsEntry.labelDetails) {
            this.label = { label, ...tsEntry.labelDetails };
        }
        this.preselect = tsEntry.isRecommended;
        this.position = position;
        this.useCodeSnippet = completionContext.completeFunctionCalls && (this.kind === vscode.CompletionItemKind.Function || this.kind === vscode.CompletionItemKind.Method);
        this.range = this.getRangeFromReplacementSpan(tsEntry, completionContext);
        this.commitCharacters = MyCompletionItem.getCommitCharacters(completionContext, tsEntry);
        this.insertText = isSnippet && tsEntry.insertText ? new vscode.SnippetString(tsEntry.insertText) : tsEntry.insertText;
        this.filterText = tsEntry.filterText || this.getFilterText(completionContext.line, tsEntry.insertText);
        if (completionContext.isMemberCompletion && completionContext.dotAccessorContext && !(this.insertText instanceof vscode.SnippetString)) {
            this.filterText = completionContext.dotAccessorContext.text + (this.insertText || this.textLabel);
            if (!this.range) {
                const replacementRange = this.completionContext.wordRange;
                if (replacementRange) {
                    this.range = {
                        inserting: completionContext.dotAccessorContext.range,
                        replacing: completionContext.dotAccessorContext.range.union(replacementRange),
                    };
                }
                else {
                    this.range = completionContext.dotAccessorContext.range;
                }
                this.insertText = this.filterText;
            }
        }
        if (tsEntry.kindModifiers) {
            const kindModifiers = (0, modifiers_1.parseKindModifier)(tsEntry.kindModifiers);
            if (kindModifiers.has(PConst.KindModifiers.optional)) {
                this.insertText ?? (this.insertText = this.textLabel);
                this.filterText ?? (this.filterText = this.textLabel);
                if (typeof this.label === 'string') {
                    this.label += '?';
                }
                else {
                    this.label.label += '?';
                }
            }
            if (kindModifiers.has(PConst.KindModifiers.deprecated)) {
                this.tags = [vscode.CompletionItemTag.Deprecated];
            }
            if (kindModifiers.has(PConst.KindModifiers.color)) {
                this.kind = vscode.CompletionItemKind.Color;
            }
            this.detail = getScriptKindDetails(tsEntry);
        }
        this.resolveRange();
    }
    get textLabel() {
        return typeof this.label === 'string' ? this.label : this.label.label;
    }
    async resolveCompletionItem(client, token) {
        token.onCancellationRequested(() => {
            if (this._resolvedPromise && --this._resolvedPromise.waiting <= 0) {
                // Give a little extra time for another caller to come in
                setTimeout(() => {
                    if (this._resolvedPromise && this._resolvedPromise.waiting <= 0) {
                        this._resolvedPromise.requestToken.cancel();
                    }
                }, 300);
            }
        });
        if (this._resolvedPromise) {
            ++this._resolvedPromise.waiting;
            return this._resolvedPromise.promise;
        }
        const requestToken = new vscode.CancellationTokenSource();
        const promise = (async () => {
            const filepath = client.toOpenTsFilePath(this.document);
            if (!filepath) {
                return undefined;
            }
            const args = {
                ...typeConverters.Position.toFileLocationRequestArgs(filepath, this.position),
                entryNames: [
                    this.tsEntry.source || this.tsEntry.data ? {
                        name: this.tsEntry.name,
                        source: this.tsEntry.source,
                        data: this.tsEntry.data,
                    } : this.tsEntry.name
                ]
            };
            const response = await client.interruptGetErr(() => client.execute('completionEntryDetails', args, requestToken.token));
            if (response.type !== 'response' || !response.body || !response.body.length) {
                return undefined;
            }
            const detail = response.body[0];
            const newItemDetails = this.getDetails(client, detail);
            if (newItemDetails) {
                this.detail = newItemDetails;
            }
            this.documentation = this.getDocumentation(client, detail, this.document.uri);
            const codeAction = this.getCodeActions(detail, filepath);
            const commands = [{
                    command: CompletionAcceptedCommand.ID,
                    title: '',
                    arguments: [this]
                }];
            if (codeAction.command) {
                commands.push(codeAction.command);
            }
            const additionalTextEdits = codeAction.additionalTextEdits;
            if (this.useCodeSnippet) {
                const shouldCompleteFunction = await this.isValidFunctionCompletionContext(client, filepath, this.position, this.document, token);
                if (shouldCompleteFunction) {
                    const { snippet, parameterCount } = (0, snippetForFunctionCall_1.snippetForFunctionCall)({ ...this, label: this.textLabel }, detail.displayParts);
                    this.insertText = snippet;
                    if (parameterCount > 0) {
                        //Fix for https://github.com/microsoft/vscode/issues/104059
                        //Don't show parameter hints if "editor.parameterHints.enabled": false
                        if (vscode.workspace.getConfiguration('editor.parameterHints').get('enabled')) {
                            commands.push({ title: 'triggerParameterHints', command: 'editor.action.triggerParameterHints' });
                        }
                    }
                }
            }
            return { commands, edits: additionalTextEdits };
        })();
        this._resolvedPromise = {
            promise,
            requestToken,
            waiting: 1,
        };
        return this._resolvedPromise.promise;
    }
    getDetails(client, detail) {
        const parts = [];
        if (detail.kind === PConst.Kind.script) {
            // details were already added
            return undefined;
        }
        for (const action of detail.codeActions ?? []) {
            parts.push(action.description);
        }
        parts.push(Previewer.asPlainTextWithLinks(detail.displayParts, client));
        return parts.join('\n\n');
    }
    getDocumentation(client, detail, baseUri) {
        const documentation = new vscode.MarkdownString();
        Previewer.appendDocumentationAsMarkdown(documentation, detail.documentation, detail.tags, client);
        documentation.baseUri = baseUri;
        return documentation.value.length ? documentation : undefined;
    }
    async isValidFunctionCompletionContext(client, filepath, position, document, token) {
        // Workaround for https://github.com/microsoft/TypeScript/issues/12677
        // Don't complete function calls inside of destructive assignments or imports
        try {
            const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
            const response = await client.execute('quickinfo', args, token);
            if (response.type === 'response' && response.body) {
                switch (response.body.kind) {
                    case 'var':
                    case 'let':
                    case 'const':
                    case 'alias':
                        return false;
                }
            }
        }
        catch {
            // Noop
        }
        const line = document.lineAt(position.line);
        // Don't complete function call if there is already something that looks like a function call
        // https://github.com/microsoft/vscode/issues/18131
        const after = line.text.slice(position.character);
        if (after.match(/^[a-z_$0-9]*\s*\(/gi)) {
            return false;
        }
        // Don't complete function call if it looks like a jsx tag.
        const before = line.text.slice(0, position.character);
        if (before.match(/<\s*[\w]*$/gi)) {
            return false;
        }
        return true;
    }
    getCodeActions(detail, filepath) {
        if (!detail.codeActions?.length) {
            return {};
        }
        // Try to extract out the additionalTextEdits for the current file.
        // Also check if we still have to apply other workspace edits and commands
        // using a vscode command
        const additionalTextEdits = [];
        let hasRemainingCommandsOrEdits = false;
        for (const tsAction of detail.codeActions) {
            if (tsAction.commands) {
                hasRemainingCommandsOrEdits = true;
            }
            // Apply all edits in the current file using `additionalTextEdits`
            if (tsAction.changes) {
                for (const change of tsAction.changes) {
                    if (change.fileName === filepath) {
                        additionalTextEdits.push(...change.textChanges.map(typeConverters.TextEdit.fromCodeEdit));
                    }
                    else {
                        hasRemainingCommandsOrEdits = true;
                    }
                }
            }
        }
        let command = undefined;
        if (hasRemainingCommandsOrEdits) {
            // Create command that applies all edits not in the current file.
            command = {
                title: '',
                command: ApplyCompletionCodeActionCommand.ID,
                arguments: [filepath, detail.codeActions.map((x) => ({
                        commands: x.commands,
                        description: x.description,
                        changes: x.changes.filter(x => x.fileName !== filepath)
                    }))]
            };
        }
        return {
            command,
            additionalTextEdits: additionalTextEdits.length ? additionalTextEdits : undefined
        };
    }
    getRangeFromReplacementSpan(tsEntry, completionContext) {
        if (!tsEntry.replacementSpan) {
            return;
        }
        let replaceRange = typeConverters.Range.fromTextSpan(tsEntry.replacementSpan);
        // Make sure we only replace a single line at most
        if (!replaceRange.isSingleLine) {
            replaceRange = new vscode.Range(replaceRange.start.line, replaceRange.start.character, replaceRange.start.line, completionContext.line.length);
        }
        // If TS returns an explicit replacement range, we should use it for both types of completion
        return {
            inserting: replaceRange,
            replacing: replaceRange,
        };
    }
    getFilterText(line, insertText) {
        // Handle private field completions
        if (this.tsEntry.name.startsWith('#')) {
            const wordRange = this.completionContext.wordRange;
            const wordStart = wordRange ? line.charAt(wordRange.start.character) : undefined;
            if (insertText) {
                if (insertText.startsWith('this.#')) {
                    return wordStart === '#' ? insertText : insertText.replace(/^this\.#/, '');
                }
                else {
                    return insertText;
                }
            }
            else {
                return wordStart === '#' ? undefined : this.tsEntry.name.replace(/^#/, '');
            }
        }
        // For `this.` completions, generally don't set the filter text since we don't want them to be overly prioritized. #74164
        if (insertText?.startsWith('this.')) {
            return undefined;
        }
        // Handle the case:
        // ```
        // const xyz = { 'ab c': 1 };
        // xyz.ab|
        // ```
        // In which case we want to insert a bracket accessor but should use `.abc` as the filter text instead of
        // the bracketed insert text.
        else if (insertText?.startsWith('[')) {
            return insertText.replace(/^\[['"](.+)[['"]\]$/, '.$1');
        }
        // In all other cases, fallback to using the insertText
        return insertText;
    }
    resolveRange() {
        if (this.range) {
            return;
        }
        const replaceRange = this.completionContext.wordRange;
        if (replaceRange) {
            this.range = {
                inserting: new vscode.Range(replaceRange.start, this.position),
                replacing: replaceRange
            };
        }
    }
    static convertKind(kind) {
        switch (kind) {
            case PConst.Kind.primitiveType:
            case PConst.Kind.keyword:
                return vscode.CompletionItemKind.Keyword;
            case PConst.Kind.const:
            case PConst.Kind.let:
            case PConst.Kind.variable:
            case PConst.Kind.localVariable:
            case PConst.Kind.alias:
            case PConst.Kind.parameter:
                return vscode.CompletionItemKind.Variable;
            case PConst.Kind.memberVariable:
            case PConst.Kind.memberGetAccessor:
            case PConst.Kind.memberSetAccessor:
                return vscode.CompletionItemKind.Field;
            case PConst.Kind.function:
            case PConst.Kind.localFunction:
                return vscode.CompletionItemKind.Function;
            case PConst.Kind.method:
            case PConst.Kind.constructSignature:
            case PConst.Kind.callSignature:
            case PConst.Kind.indexSignature:
                return vscode.CompletionItemKind.Method;
            case PConst.Kind.enum:
                return vscode.CompletionItemKind.Enum;
            case PConst.Kind.enumMember:
                return vscode.CompletionItemKind.EnumMember;
            case PConst.Kind.module:
            case PConst.Kind.externalModuleName:
                return vscode.CompletionItemKind.Module;
            case PConst.Kind.class:
            case PConst.Kind.type:
                return vscode.CompletionItemKind.Class;
            case PConst.Kind.interface:
                return vscode.CompletionItemKind.Interface;
            case PConst.Kind.warning:
                return vscode.CompletionItemKind.Text;
            case PConst.Kind.script:
                return vscode.CompletionItemKind.File;
            case PConst.Kind.directory:
                return vscode.CompletionItemKind.Folder;
            case PConst.Kind.string:
                return vscode.CompletionItemKind.Constant;
            default:
                return vscode.CompletionItemKind.Property;
        }
    }
    static getCommitCharacters(context, entry) {
        if (entry.kind === PConst.Kind.warning || entry.kind === PConst.Kind.string) { // Ambient JS word based suggestion, strings
            return undefined;
        }
        if (context.isNewIdentifierLocation) {
            return undefined;
        }
        const commitCharacters = ['.', ',', ';'];
        if (context.enableCallCompletions) {
            commitCharacters.push('(');
        }
        return commitCharacters;
    }
}
function getScriptKindDetails(tsEntry) {
    if (!tsEntry.kindModifiers || tsEntry.kind !== PConst.Kind.script) {
        return;
    }
    const kindModifiers = (0, modifiers_1.parseKindModifier)(tsEntry.kindModifiers);
    for (const extModifier of PConst.KindModifiers.fileExtensionKindModifiers) {
        if (kindModifiers.has(extModifier)) {
            if (tsEntry.name.toLowerCase().endsWith(extModifier)) {
                return tsEntry.name;
            }
            else {
                return tsEntry.name + extModifier;
            }
        }
    }
    return undefined;
}
class CompletionAcceptedCommand {
    constructor(onCompletionAccepted, telemetryReporter) {
        this.onCompletionAccepted = onCompletionAccepted;
        this.telemetryReporter = telemetryReporter;
        this.id = CompletionAcceptedCommand.ID;
    }
    execute(item) {
        this.onCompletionAccepted(item);
        if (item instanceof MyCompletionItem) {
            /* __GDPR__
                "completions.accept" : {
                    "owner": "mjbvz",
                    "isPackageJsonImport" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                    "isImportStatementCompletion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                    "${include}": [
                        "${TypeScriptCommonProperties}"
                    ]
                }
            */
            this.telemetryReporter.logTelemetry('completions.accept', {
                isPackageJsonImport: item.tsEntry.isPackageJsonImport ? 'true' : undefined,
                isImportStatementCompletion: item.tsEntry.isImportStatementCompletion ? 'true' : undefined,
            });
        }
    }
}
CompletionAcceptedCommand.ID = '_typescript.onCompletionAccepted';
/**
 * Command fired when an completion item needs to be applied
 */
class ApplyCompletionCommand {
    constructor(client) {
        this.client = client;
        this.id = ApplyCompletionCommand.ID;
    }
    async execute(item) {
        const resolved = await item.resolveCompletionItem(this.client, cancellation_1.nulToken);
        if (!resolved) {
            return;
        }
        const { edits, commands } = resolved;
        if (edits) {
            const workspaceEdit = new vscode.WorkspaceEdit();
            for (const edit of edits) {
                workspaceEdit.replace(item.document.uri, edit.range, edit.newText);
            }
            await vscode.workspace.applyEdit(workspaceEdit);
        }
        for (const command of commands) {
            await vscode.commands.executeCommand(command.command, ...(command.arguments ?? []));
        }
    }
}
ApplyCompletionCommand.ID = '_typescript.applyCompletionCommand';
class ApplyCompletionCodeActionCommand {
    constructor(client) {
        this.client = client;
        this.id = ApplyCompletionCodeActionCommand.ID;
    }
    async execute(_file, codeActions) {
        if (codeActions.length === 0) {
            return true;
        }
        if (codeActions.length === 1) {
            return (0, codeAction_1.applyCodeAction)(this.client, codeActions[0], cancellation_1.nulToken);
        }
        const selection = await vscode.window.showQuickPick(codeActions.map(action => ({
            label: action.description,
            description: '',
            action,
        })), {
            placeHolder: vscode.l10n.t("Select code action to apply")
        });
        if (selection) {
            return (0, codeAction_1.applyCodeAction)(this.client, selection.action, cancellation_1.nulToken);
        }
        return false;
    }
}
ApplyCompletionCodeActionCommand.ID = '_typescript.applyCompletionCodeAction';
var CompletionConfiguration;
(function (CompletionConfiguration) {
    CompletionConfiguration.completeFunctionCalls = 'suggest.completeFunctionCalls';
    CompletionConfiguration.nameSuggestions = 'suggest.names';
    CompletionConfiguration.pathSuggestions = 'suggest.paths';
    CompletionConfiguration.autoImportSuggestions = 'suggest.autoImports';
    CompletionConfiguration.importStatementSuggestions = 'suggest.importStatements';
    function getConfigurationForResource(modeId, resource) {
        const config = vscode.workspace.getConfiguration(modeId, resource);
        return {
            completeFunctionCalls: config.get(CompletionConfiguration.completeFunctionCalls, false),
            pathSuggestions: config.get(CompletionConfiguration.pathSuggestions, true),
            autoImportSuggestions: config.get(CompletionConfiguration.autoImportSuggestions, true),
            nameSuggestions: config.get(CompletionConfiguration.nameSuggestions, true),
            importStatementSuggestions: config.get(CompletionConfiguration.importStatementSuggestions, true),
        };
    }
    CompletionConfiguration.getConfigurationForResource = getConfigurationForResource;
})(CompletionConfiguration || (CompletionConfiguration = {}));
class TypeScriptCompletionItemProvider {
    constructor(client, language, typingsStatus, fileConfigurationManager, commandManager, telemetryReporter, onCompletionAccepted) {
        this.client = client;
        this.language = language;
        this.typingsStatus = typingsStatus;
        this.fileConfigurationManager = fileConfigurationManager;
        this.telemetryReporter = telemetryReporter;
        commandManager.register(new ApplyCompletionCodeActionCommand(this.client));
        commandManager.register(new CompletionAcceptedCommand(onCompletionAccepted, this.telemetryReporter));
        commandManager.register(new ApplyCompletionCommand(this.client));
    }
    async provideCompletionItems(document, position, token, context) {
        if (!vscode.workspace.getConfiguration(this.language.id, document).get('suggest.enabled')) {
            return undefined;
        }
        if (this.typingsStatus.isAcquiringTypings) {
            return Promise.reject({
                label: vscode.l10n.t({
                    message: "Acquiring typings...",
                    comment: ['Typings refers to the *.d.ts typings files that power our IntelliSense. It should not be localized'],
                }),
                detail: vscode.l10n.t({
                    message: "Acquiring typings definitions for IntelliSense.",
                    comment: ['Typings refers to the *.d.ts typings files that power our IntelliSense. It should not be localized'],
                })
            });
        }
        const file = this.client.toOpenTsFilePath(document);
        if (!file) {
            return undefined;
        }
        const line = document.lineAt(position.line);
        const completionConfiguration = CompletionConfiguration.getConfigurationForResource(this.language.id, document.uri);
        if (!this.shouldTrigger(context, line, position, completionConfiguration)) {
            return undefined;
        }
        let wordRange = document.getWordRangeAtPosition(position);
        if (wordRange && !wordRange.isEmpty) {
            const secondCharPosition = wordRange.start.translate(0, 1);
            const firstChar = document.getText(new vscode.Range(wordRange.start, secondCharPosition));
            if (firstChar === '@') {
                wordRange = wordRange.with(secondCharPosition);
            }
        }
        await this.client.interruptGetErr(() => this.fileConfigurationManager.ensureConfigurationForDocument(document, token));
        const args = {
            ...typeConverters.Position.toFileLocationRequestArgs(file, position),
            includeExternalModuleExports: completionConfiguration.autoImportSuggestions,
            includeInsertTextCompletions: true,
            triggerCharacter: this.getTsTriggerCharacter(context),
            triggerKind: typeConverters.CompletionTriggerKind.toProtocolCompletionTriggerKind(context.triggerKind),
        };
        let isNewIdentifierLocation = true;
        let isIncomplete = false;
        let isMemberCompletion = false;
        let dotAccessorContext;
        let entries;
        let metadata;
        let response;
        let duration;
        if (this.client.apiVersion.gte(api_1.API.v300)) {
            const startTime = Date.now();
            try {
                response = await this.client.interruptGetErr(() => this.client.execute('completionInfo', args, token));
            }
            finally {
                duration = Date.now() - startTime;
            }
            if (response.type !== 'response' || !response.body) {
                this.logCompletionsTelemetry(duration, response);
                return undefined;
            }
            isNewIdentifierLocation = response.body.isNewIdentifierLocation;
            isMemberCompletion = response.body.isMemberCompletion;
            if (isMemberCompletion) {
                const dotMatch = line.text.slice(0, position.character).match(/\??\.\s*$/) || undefined;
                if (dotMatch) {
                    const range = new vscode.Range(position.translate({ characterDelta: -dotMatch[0].length }), position);
                    const text = document.getText(range);
                    dotAccessorContext = { range, text };
                }
            }
            isIncomplete = !!response.body.isIncomplete || response.metadata && response.metadata.isIncomplete;
            entries = response.body.entries;
            metadata = response.metadata;
        }
        else {
            const response = await this.client.interruptGetErr(() => this.client.execute('completions', args, token));
            if (response.type !== 'response' || !response.body) {
                return undefined;
            }
            entries = response.body;
            metadata = response.metadata;
        }
        const completionContext = {
            isNewIdentifierLocation,
            isMemberCompletion,
            dotAccessorContext,
            enableCallCompletions: !completionConfiguration.completeFunctionCalls,
            wordRange,
            line: line.text,
            completeFunctionCalls: completionConfiguration.completeFunctionCalls,
        };
        let includesPackageJsonImport = false;
        let includesImportStatementCompletion = false;
        const items = [];
        for (const entry of entries) {
            if (!shouldExcludeCompletionEntry(entry, completionConfiguration)) {
                const item = new MyCompletionItem(position, document, entry, completionContext, metadata, this.client);
                item.command = {
                    command: ApplyCompletionCommand.ID,
                    title: '',
                    arguments: [item]
                };
                items.push(item);
                includesPackageJsonImport = includesPackageJsonImport || !!entry.isPackageJsonImport;
                includesImportStatementCompletion = includesImportStatementCompletion || !!entry.isImportStatementCompletion;
            }
        }
        if (duration !== undefined) {
            this.logCompletionsTelemetry(duration, response, includesPackageJsonImport, includesImportStatementCompletion);
        }
        return new vscode.CompletionList(items, isIncomplete);
    }
    logCompletionsTelemetry(duration, response, includesPackageJsonImport, includesImportStatementCompletion) {
        /* __GDPR__
            "completions.execute" : {
                "owner": "mjbvz",
                "duration" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "type" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "count" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "flags": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "updateGraphDurationMs" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "createAutoImportProviderProgramDurationMs" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "includesPackageJsonImport" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "includesImportStatementCompletion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "${include}": [
                    "${TypeScriptCommonProperties}"
                ]
            }
        */
        this.telemetryReporter.logTelemetry('completions.execute', {
            duration: String(duration),
            type: response?.type ?? 'unknown',
            flags: response?.type === 'response' && typeof response.body?.flags === 'number' ? String(response.body.flags) : undefined,
            count: String(response?.type === 'response' && response.body ? response.body.entries.length : 0),
            updateGraphDurationMs: response?.type === 'response' && typeof response.performanceData?.updateGraphDurationMs === 'number'
                ? String(response.performanceData.updateGraphDurationMs)
                : undefined,
            createAutoImportProviderProgramDurationMs: response?.type === 'response' && typeof response.performanceData?.createAutoImportProviderProgramDurationMs === 'number'
                ? String(response.performanceData.createAutoImportProviderProgramDurationMs)
                : undefined,
            includesPackageJsonImport: includesPackageJsonImport ? 'true' : undefined,
            includesImportStatementCompletion: includesImportStatementCompletion ? 'true' : undefined,
        });
    }
    getTsTriggerCharacter(context) {
        switch (context.triggerCharacter) {
            case '@': { // Workaround for https://github.com/microsoft/TypeScript/issues/27321
                return this.client.apiVersion.gte(api_1.API.v310) && this.client.apiVersion.lt(api_1.API.v320) ? undefined : '@';
            }
            case '#': { // Workaround for https://github.com/microsoft/TypeScript/issues/36367
                return this.client.apiVersion.lt(api_1.API.v381) ? undefined : '#';
            }
            case ' ': {
                return this.client.apiVersion.gte(api_1.API.v430) ? ' ' : undefined;
            }
            case '.':
            case '"':
            case '\'':
            case '`':
            case '/':
            case '<': {
                return context.triggerCharacter;
            }
            default: {
                return undefined;
            }
        }
    }
    async resolveCompletionItem(item, token) {
        await item.resolveCompletionItem(this.client, token);
        return item;
    }
    shouldTrigger(context, line, position, configuration) {
        if (context.triggerCharacter === ' ') {
            if (!configuration.importStatementSuggestions || this.client.apiVersion.lt(api_1.API.v430)) {
                return false;
            }
            const pre = line.text.slice(0, position.character);
            return pre === 'import';
        }
        return true;
    }
}
TypeScriptCompletionItemProvider.triggerCharacters = ['.', '"', '\'', '`', '/', '@', '<', '#', ' '];
function shouldExcludeCompletionEntry(element, completionConfiguration) {
    return ((!completionConfiguration.nameSuggestions && element.kind === PConst.Kind.warning)
        || (!completionConfiguration.pathSuggestions &&
            (element.kind === PConst.Kind.directory || element.kind === PConst.Kind.script || element.kind === PConst.Kind.externalModuleName))
        || (!completionConfiguration.autoImportSuggestions && element.hasAction));
}
function register(selector, language, client, typingsStatus, fileConfigurationManager, commandManager, telemetryReporter, onCompletionAccepted) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.EnhancedSyntax, typescriptService_1.ClientCapability.Semantic),
    ], () => {
        return vscode.languages.registerCompletionItemProvider(selector.syntax, new TypeScriptCompletionItemProvider(client, language, typingsStatus, fileConfigurationManager, commandManager, telemetryReporter, onCompletionAccepted), ...TypeScriptCompletionItemProvider.triggerCharacters);
    });
}
exports.register = register;
//# sourceMappingURL=completions.js.map