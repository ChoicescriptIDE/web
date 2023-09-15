"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fileSchemes_1 = require("../configuration/fileSchemes");
const languageModeIds = require("../configuration/languageIds");
const typeConverters = require("../typeConverters");
const typescriptService_1 = require("../typescriptService");
const typescriptServiceClient_1 = require("../typescriptServiceClient");
const arrays_1 = require("../utils/arrays");
const async_1 = require("../utils/async");
const cancellation_1 = require("../utils/cancellation");
const dispose_1 = require("../utils/dispose");
const resourceMap_1 = require("../utils/resourceMap");
const api_1 = require("./api");
function mode2ScriptKind(mode) {
    switch (mode) {
        case languageModeIds.typescript: return 'TS';
        case languageModeIds.typescriptreact: return 'TSX';
        case languageModeIds.javascript: return 'JS';
        case languageModeIds.javascriptreact: return 'JSX';
    }
    return undefined;
}
class CloseOperation {
    constructor(args, scriptKind) {
        this.args = args;
        this.scriptKind = scriptKind;
        this.type = 0 /* BufferOperationType.Close */;
    }
}
class OpenOperation {
    constructor(args, scriptKind) {
        this.args = args;
        this.scriptKind = scriptKind;
        this.type = 1 /* BufferOperationType.Open */;
    }
}
class ChangeOperation {
    constructor(args) {
        this.args = args;
        this.type = 2 /* BufferOperationType.Change */;
    }
}
/**
 * Manages synchronization of buffers with the TS server.
 *
 * If supported, batches together file changes. This allows the TS server to more efficiently process changes.
 */
class BufferSynchronizer {
    constructor(client, pathNormalizer, onCaseInsensitiveFileSystem) {
        this.client = client;
        this._pending = new resourceMap_1.ResourceMap(pathNormalizer, {
            onCaseInsensitiveFileSystem
        });
    }
    open(resource, args) {
        if (this.supportsBatching) {
            this.updatePending(resource, new OpenOperation(args, args.scriptKindName));
        }
        else {
            this.client.executeWithoutWaitingForResponse('open', args);
        }
    }
    /**
     * @return Was the buffer open?
     */
    close(resource, filepath, scriptKind) {
        if (this.supportsBatching) {
            return this.updatePending(resource, new CloseOperation(filepath, scriptKind));
        }
        else {
            const args = { file: filepath };
            this.client.executeWithoutWaitingForResponse('close', args);
            return true;
        }
    }
    change(resource, filepath, events) {
        if (!events.length) {
            return;
        }
        if (this.supportsBatching) {
            this.updatePending(resource, new ChangeOperation({
                fileName: filepath,
                textChanges: events.map((change) => ({
                    newText: change.text,
                    start: typeConverters.Position.toLocation(change.range.start),
                    end: typeConverters.Position.toLocation(change.range.end),
                })).reverse(), // Send the edits end-of-document to start-of-document order
            }));
        }
        else {
            for (const { range, text } of events) {
                const args = {
                    insertString: text,
                    ...typeConverters.Range.toFormattingRequestArgs(filepath, range)
                };
                this.client.executeWithoutWaitingForResponse('change', args);
            }
        }
    }
    reset() {
        this._pending.clear();
    }
    beforeCommand(command) {
        if (command === 'updateOpen') {
            return;
        }
        this.flush();
    }
    flush() {
        if (!this.supportsBatching) {
            // We've already eagerly synchronized
            this._pending.clear();
            return;
        }
        if (this._pending.size > 0) {
            const closedFiles = [];
            const openFiles = [];
            const changedFiles = [];
            for (const change of this._pending.values()) {
                switch (change.type) {
                    case 2 /* BufferOperationType.Change */:
                        changedFiles.push(change.args);
                        break;
                    case 1 /* BufferOperationType.Open */:
                        openFiles.push(change.args);
                        break;
                    case 0 /* BufferOperationType.Close */:
                        closedFiles.push(change.args);
                        break;
                }
            }
            this.client.execute('updateOpen', { changedFiles, closedFiles, openFiles }, cancellation_1.nulToken, { nonRecoverable: true });
            this._pending.clear();
        }
    }
    get supportsBatching() {
        return this.client.apiVersion.gte(api_1.API.v340);
    }
    updatePending(resource, op) {
        switch (op.type) {
            case 0 /* BufferOperationType.Close */: {
                const existing = this._pending.get(resource);
                switch (existing?.type) {
                    case 1 /* BufferOperationType.Open */:
                        if (existing.scriptKind === op.scriptKind) {
                            this._pending.delete(resource);
                            return false; // Open then close. No need to do anything
                        }
                }
                break;
            }
        }
        if (this._pending.has(resource)) {
            // we saw this file before, make sure we flush before working with it again
            this.flush();
        }
        this._pending.set(resource, op);
        return true;
    }
}
class SyncedBuffer {
    constructor(document, filepath, client, synchronizer) {
        this.document = document;
        this.filepath = filepath;
        this.client = client;
        this.synchronizer = synchronizer;
        this.state = 0 /* BufferState.Initial */;
    }
    open() {
        const args = {
            file: this.filepath,
            fileContent: this.document.getText(),
            projectRootPath: this.getProjectRootPath(this.document.uri),
        };
        const scriptKind = mode2ScriptKind(this.document.languageId);
        if (scriptKind) {
            args.scriptKindName = scriptKind;
        }
        const tsPluginsForDocument = this.client.pluginManager.plugins
            .filter(x => x.languages.indexOf(this.document.languageId) >= 0);
        if (tsPluginsForDocument.length) {
            args.plugins = tsPluginsForDocument.map(plugin => plugin.name);
        }
        this.synchronizer.open(this.resource, args);
        this.state = 1 /* BufferState.Open */;
    }
    getProjectRootPath(resource) {
        const workspaceRoot = this.client.getWorkspaceRootForResource(resource);
        if (workspaceRoot) {
            const tsRoot = this.client.toTsFilePath(workspaceRoot);
            return tsRoot?.startsWith(typescriptServiceClient_1.inMemoryResourcePrefix) ? undefined : tsRoot;
        }
        return resource.scheme === fileSchemes_1.officeScript ? '/' : undefined;
    }
    get resource() {
        return this.document.uri;
    }
    get lineCount() {
        return this.document.lineCount;
    }
    get languageId() {
        return this.document.languageId;
    }
    /**
     * @return Was the buffer open?
     */
    close() {
        if (this.state !== 1 /* BufferState.Open */) {
            this.state = 2 /* BufferState.Closed */;
            return false;
        }
        this.state = 2 /* BufferState.Closed */;
        return this.synchronizer.close(this.resource, this.filepath, mode2ScriptKind(this.document.languageId));
    }
    onContentChanged(events) {
        if (this.state !== 1 /* BufferState.Open */) {
            console.error(`Unexpected buffer state: ${this.state}`);
        }
        this.synchronizer.change(this.resource, this.filepath, events);
    }
}
class SyncedBufferMap extends resourceMap_1.ResourceMap {
    getForPath(filePath) {
        return this.get(vscode.Uri.file(filePath));
    }
    get allBuffers() {
        return this.values();
    }
}
class PendingDiagnostics extends resourceMap_1.ResourceMap {
    getOrderedFileSet() {
        const orderedResources = Array.from(this.entries())
            .sort((a, b) => a.value - b.value)
            .map(entry => entry.resource);
        const map = new resourceMap_1.ResourceMap(this._normalizePath, this.config);
        for (const resource of orderedResources) {
            map.set(resource, undefined);
        }
        return map;
    }
}
class GetErrRequest {
    static executeGetErrRequest(client, files, onDone) {
        return new GetErrRequest(client, files, onDone);
    }
    constructor(client, files, onDone) {
        this.client = client;
        this.files = files;
        this._done = false;
        this._token = new vscode.CancellationTokenSource();
        if (!this.isErrorReportingEnabled()) {
            this._done = true;
            (0, async_1.setImmediate)(onDone);
            return;
        }
        const supportsSyntaxGetErr = this.client.apiVersion.gte(api_1.API.v440);
        const allFiles = (0, arrays_1.coalesce)(Array.from(files.entries())
            .filter(entry => supportsSyntaxGetErr || client.hasCapabilityForResource(entry.resource, typescriptService_1.ClientCapability.Semantic))
            .map(entry => client.toTsFilePath(entry.resource)));
        if (!allFiles.length) {
            this._done = true;
            (0, async_1.setImmediate)(onDone);
        }
        else {
            const request = this.areProjectDiagnosticsEnabled()
                // Note that geterrForProject is almost certainly not the api we want here as it ends up computing far
                // too many diagnostics
                ? client.executeAsync('geterrForProject', { delay: 0, file: allFiles[0] }, this._token.token)
                : client.executeAsync('geterr', { delay: 0, files: allFiles }, this._token.token);
            request.finally(() => {
                if (this._done) {
                    return;
                }
                this._done = true;
                onDone();
            });
        }
    }
    isErrorReportingEnabled() {
        if (this.client.apiVersion.gte(api_1.API.v440)) {
            return true;
        }
        else {
            // Older TS versions only support `getErr` on semantic server
            return this.client.capabilities.has(typescriptService_1.ClientCapability.Semantic);
        }
    }
    areProjectDiagnosticsEnabled() {
        return this.client.configuration.enableProjectDiagnostics && this.client.capabilities.has(typescriptService_1.ClientCapability.Semantic);
    }
    cancel() {
        if (!this._done) {
            this._token.cancel();
        }
        this._token.dispose();
    }
}
class TabResourceTracker extends dispose_1.Disposable {
    constructor(normalizePath, config) {
        super();
        this._onDidChange = this._register(new vscode.EventEmitter());
        this.onDidChange = this._onDidChange.event;
        this._tabResources = new resourceMap_1.ResourceMap(normalizePath, config);
        for (const tabGroup of vscode.window.tabGroups.all) {
            for (const tab of tabGroup.tabs) {
                this.add(tab);
            }
        }
        this._register(vscode.window.tabGroups.onDidChangeTabs(e => {
            const closed = e.closed.flatMap(tab => this.delete(tab));
            const opened = e.opened.flatMap(tab => this.add(tab));
            if (closed.length || opened.length) {
                this._onDidChange.fire({ closed, opened });
            }
        }));
    }
    has(resource) {
        if (resource.scheme === fileSchemes_1.vscodeNotebookCell) {
            const notebook = vscode.workspace.notebookDocuments.find(doc => doc.getCells().some(cell => cell.document.uri.toString() === resource.toString()));
            return !!notebook && this.has(notebook.uri);
        }
        const entry = this._tabResources.get(resource);
        return !!entry && entry.tabs.size > 0;
    }
    add(tab) {
        const addedResources = [];
        for (const uri of this.getResourcesForTab(tab)) {
            const entry = this._tabResources.get(uri);
            if (entry) {
                entry.tabs.add(tab);
            }
            else {
                this._tabResources.set(uri, { tabs: new Set([tab]) });
                addedResources.push(uri);
            }
        }
        return addedResources;
    }
    delete(tab) {
        const closedResources = [];
        for (const uri of this.getResourcesForTab(tab)) {
            const entry = this._tabResources.get(uri);
            if (!entry) {
                continue;
            }
            entry.tabs.delete(tab);
            if (entry.tabs.size === 0) {
                this._tabResources.delete(uri);
                closedResources.push(uri);
            }
        }
        return closedResources;
    }
    getResourcesForTab(tab) {
        if (tab.input instanceof vscode.TabInputText) {
            return [tab.input.uri];
        }
        else if (tab.input instanceof vscode.TabInputTextDiff) {
            return [tab.input.original, tab.input.modified];
        }
        else if (tab.input instanceof vscode.TabInputNotebook) {
            return [tab.input.uri];
        }
        else {
            return [];
        }
    }
}
class BufferSyncSupport extends dispose_1.Disposable {
    constructor(client, modeIds, onCaseInsensitiveFileSystem) {
        super();
        this._validateJavaScript = true;
        this._validateTypeScript = true;
        this.listening = false;
        this._onDelete = this._register(new vscode.EventEmitter());
        this.onDelete = this._onDelete.event;
        this._onWillChange = this._register(new vscode.EventEmitter());
        this.onWillChange = this._onWillChange.event;
        this.client = client;
        this.modeIds = new Set(modeIds);
        this.diagnosticDelayer = new async_1.Delayer(300);
        const pathNormalizer = (path) => this.client.toTsFilePath(path);
        this.syncedBuffers = new SyncedBufferMap(pathNormalizer, { onCaseInsensitiveFileSystem });
        this.pendingDiagnostics = new PendingDiagnostics(pathNormalizer, { onCaseInsensitiveFileSystem });
        this.synchronizer = new BufferSynchronizer(client, pathNormalizer, onCaseInsensitiveFileSystem);
        this._tabResources = this._register(new TabResourceTracker(pathNormalizer, { onCaseInsensitiveFileSystem }));
        this._register(this._tabResources.onDidChange(e => {
            if (this.client.configuration.enableProjectDiagnostics) {
                return;
            }
            for (const closed of e.closed) {
                const syncedBuffer = this.syncedBuffers.get(closed);
                if (syncedBuffer) {
                    this.pendingDiagnostics.delete(closed);
                    this.pendingGetErr?.files.delete(closed);
                }
            }
            for (const opened of e.opened) {
                const syncedBuffer = this.syncedBuffers.get(opened);
                if (syncedBuffer) {
                    this.requestDiagnostic(syncedBuffer);
                }
            }
        }));
        this.updateConfiguration();
        vscode.workspace.onDidChangeConfiguration(this.updateConfiguration, this, this._disposables);
    }
    listen() {
        if (this.listening) {
            return;
        }
        this.listening = true;
        vscode.workspace.onDidOpenTextDocument(this.openTextDocument, this, this._disposables);
        vscode.workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this, this._disposables);
        vscode.workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, this._disposables);
        vscode.window.onDidChangeVisibleTextEditors(e => {
            for (const { document } of e) {
                const syncedBuffer = this.syncedBuffers.get(document.uri);
                if (syncedBuffer) {
                    this.requestDiagnostic(syncedBuffer);
                }
            }
        }, this, this._disposables);
        vscode.workspace.textDocuments.forEach(this.openTextDocument, this);
    }
    handles(resource) {
        return this.syncedBuffers.has(resource);
    }
    ensureHasBuffer(resource) {
        if (this.syncedBuffers.has(resource)) {
            return true;
        }
        const existingDocument = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === resource.toString());
        if (existingDocument) {
            return this.openTextDocument(existingDocument);
        }
        return false;
    }
    toVsCodeResource(resource) {
        const filepath = this.client.toTsFilePath(resource);
        for (const buffer of this.syncedBuffers.allBuffers) {
            if (buffer.filepath === filepath) {
                return buffer.resource;
            }
        }
        return resource;
    }
    toResource(filePath) {
        const buffer = this.syncedBuffers.getForPath(filePath);
        if (buffer) {
            return buffer.resource;
        }
        return vscode.Uri.file(filePath);
    }
    reset() {
        this.pendingGetErr?.cancel();
        this.pendingDiagnostics.clear();
        this.synchronizer.reset();
    }
    reinitialize() {
        this.reset();
        for (const buffer of this.syncedBuffers.allBuffers) {
            buffer.open();
        }
    }
    openTextDocument(document) {
        if (!this.modeIds.has(document.languageId)) {
            return false;
        }
        const resource = document.uri;
        const filepath = this.client.toTsFilePath(resource);
        if (!filepath) {
            return false;
        }
        if (this.syncedBuffers.has(resource)) {
            return true;
        }
        const syncedBuffer = new SyncedBuffer(document, filepath, this.client, this.synchronizer);
        this.syncedBuffers.set(resource, syncedBuffer);
        syncedBuffer.open();
        this.requestDiagnostic(syncedBuffer);
        return true;
    }
    closeResource(resource) {
        const syncedBuffer = this.syncedBuffers.get(resource);
        if (!syncedBuffer) {
            return;
        }
        this.pendingDiagnostics.delete(resource);
        this.pendingGetErr?.files.delete(resource);
        this.syncedBuffers.delete(resource);
        const wasBufferOpen = syncedBuffer.close();
        this._onDelete.fire(resource);
        if (wasBufferOpen) {
            this.requestAllDiagnostics();
        }
    }
    interruptGetErr(f) {
        if (!this.pendingGetErr
            || this.client.configuration.enableProjectDiagnostics // `geterr` happens on separate server so no need to cancel it.
        ) {
            return f();
        }
        this.pendingGetErr.cancel();
        this.pendingGetErr = undefined;
        const result = f();
        this.triggerDiagnostics();
        return result;
    }
    beforeCommand(command) {
        this.synchronizer.beforeCommand(command);
    }
    onDidCloseTextDocument(document) {
        this.closeResource(document.uri);
    }
    onDidChangeTextDocument(e) {
        const syncedBuffer = this.syncedBuffers.get(e.document.uri);
        if (!syncedBuffer) {
            return;
        }
        this._onWillChange.fire(syncedBuffer.resource);
        syncedBuffer.onContentChanged(e.contentChanges);
        const didTrigger = this.requestDiagnostic(syncedBuffer);
        if (!didTrigger && this.pendingGetErr) {
            // In this case we always want to re-trigger all diagnostics
            this.pendingGetErr.cancel();
            this.pendingGetErr = undefined;
            this.triggerDiagnostics();
        }
    }
    requestAllDiagnostics() {
        for (const buffer of this.syncedBuffers.allBuffers) {
            if (this.shouldValidate(buffer)) {
                this.pendingDiagnostics.set(buffer.resource, Date.now());
            }
        }
        this.triggerDiagnostics();
    }
    getErr(resources) {
        const handledResources = resources.filter(resource => this.handles(resource));
        if (!handledResources.length) {
            return;
        }
        for (const resource of handledResources) {
            this.pendingDiagnostics.set(resource, Date.now());
        }
        this.triggerDiagnostics();
    }
    triggerDiagnostics(delay = 200) {
        this.diagnosticDelayer.trigger(() => {
            this.sendPendingDiagnostics();
        }, delay);
    }
    requestDiagnostic(buffer) {
        if (!this.shouldValidate(buffer)) {
            return false;
        }
        this.pendingDiagnostics.set(buffer.resource, Date.now());
        const delay = Math.min(Math.max(Math.ceil(buffer.lineCount / 20), 300), 800);
        this.triggerDiagnostics(delay);
        return true;
    }
    hasPendingDiagnostics(resource) {
        return this.pendingDiagnostics.has(resource);
    }
    sendPendingDiagnostics() {
        const orderedFileSet = this.pendingDiagnostics.getOrderedFileSet();
        if (this.pendingGetErr) {
            this.pendingGetErr.cancel();
            for (const { resource } of this.pendingGetErr.files.entries()) {
                if (this.syncedBuffers.get(resource)) {
                    orderedFileSet.set(resource, undefined);
                }
            }
            this.pendingGetErr = undefined;
        }
        // Add all open TS buffers to the geterr request. They might be visible
        for (const buffer of this.syncedBuffers.values()) {
            orderedFileSet.set(buffer.resource, undefined);
        }
        if (orderedFileSet.size) {
            const getErr = this.pendingGetErr = GetErrRequest.executeGetErrRequest(this.client, orderedFileSet, () => {
                if (this.pendingGetErr === getErr) {
                    this.pendingGetErr = undefined;
                }
            });
        }
        this.pendingDiagnostics.clear();
    }
    updateConfiguration() {
        const jsConfig = vscode.workspace.getConfiguration('javascript', null);
        const tsConfig = vscode.workspace.getConfiguration('typescript', null);
        this._validateJavaScript = jsConfig.get('validate.enable', true);
        this._validateTypeScript = tsConfig.get('validate.enable', true);
    }
    shouldValidate(buffer) {
        if (!this.client.configuration.enableProjectDiagnostics && !this._tabResources.has(buffer.resource)) { // Only validate resources that are showing to the user
            return false;
        }
        switch (buffer.languageId) {
            case languageModeIds.javascript:
            case languageModeIds.javascriptreact:
                return this._validateJavaScript;
            case languageModeIds.typescript:
            case languageModeIds.typescriptreact:
            default:
                return this._validateTypeScript;
        }
    }
}
exports.default = BufferSyncSupport;
//# sourceMappingURL=bufferSyncSupport.js.map