"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerServerProcessFactory = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/// <reference lib='webworker' />
const browser_1 = require("@vscode/sync-api-common/browser");
const sync_api_service_1 = require("@vscode/sync-api-service");
const vscode = require("vscode");
const fileWatchingManager_1 = require("./fileWatchingManager");
class WorkerServerProcessFactory {
    constructor(_extensionUri, _logger) {
        this._extensionUri = _extensionUri;
        this._logger = _logger;
    }
    fork(version, args, kind, _configuration, _versionManager, tsServerLog) {
        const tsServerPath = version.tsServerPath;
        return new WorkerServerProcess(kind, tsServerPath, this._extensionUri, [
            ...args,
            // Explicitly give TS Server its path so it can
            // load local resources
            '--executingFilePath', tsServerPath,
        ], tsServerLog, this._logger);
    }
}
exports.WorkerServerProcessFactory = WorkerServerProcessFactory;
class WorkerServerProcess {
    constructor(kind, tsServerPath, extensionUri, args, tsServerLog, logger) {
        this.kind = kind;
        this.tsServerLog = tsServerLog;
        this.id = WorkerServerProcess.idPool++;
        this._onDataHandlers = new Set();
        this._onErrorHandlers = new Set();
        this._onExitHandlers = new Set();
        this._worker = new Worker(tsServerPath, { name: `TS ${kind} server #${this.id}` });
        this._watches = new fileWatchingManager_1.FileWatcherManager(logger);
        const tsserverChannel = new MessageChannel();
        const watcherChannel = new MessageChannel();
        const syncChannel = new MessageChannel();
        this._tsserver = tsserverChannel.port2;
        this._watcher = watcherChannel.port2;
        this._syncFs = syncChannel.port2;
        this._tsserver.onmessage = (event) => {
            if (event.data.type === 'log') {
                console.error(`unexpected log message on tsserver channel: ${JSON.stringify(event)}`);
                return;
            }
            for (const handler of this._onDataHandlers) {
                handler(event.data);
            }
        };
        this._watcher.onmessage = (event) => {
            switch (event.data.type) {
                case 'dispose': {
                    this._watches.delete(event.data.id);
                    break;
                }
                case 'watchDirectory':
                case 'watchFile': {
                    this._watches.create(event.data.id, vscode.Uri.from(event.data.uri), /*watchParentDirs*/ true, !!event.data.recursive, {
                        change: uri => this._watcher.postMessage({ type: 'watch', event: 'change', uri }),
                        create: uri => this._watcher.postMessage({ type: 'watch', event: 'create', uri }),
                        delete: uri => this._watcher.postMessage({ type: 'watch', event: 'delete', uri }),
                    });
                    break;
                }
                default:
                    console.error(`unexpected message on watcher channel: ${JSON.stringify(event)}`);
            }
        };
        this._worker.onmessage = (msg) => {
            // for logging only
            if (msg.data.type === 'log') {
                this.appendLog(msg.data.body);
                return;
            }
            console.error(`unexpected message on main channel: ${JSON.stringify(msg)}`);
        };
        this._worker.onerror = (err) => {
            console.error('error! ' + JSON.stringify(err));
            for (const handler of this._onErrorHandlers) {
                // TODO: The ErrorEvent type might be wrong; previously this was typed as Error and didn't have the property access.
                handler(err.error);
            }
        };
        this._worker.postMessage({ args, extensionUri }, [syncChannel.port1, tsserverChannel.port1, watcherChannel.port1]);
        const connection = new browser_1.ServiceConnection(syncChannel.port2);
        new sync_api_service_1.ApiService('vscode-wasm-typescript', connection);
        connection.signalReady();
    }
    write(serverRequest) {
        this._tsserver.postMessage(serverRequest);
    }
    onData(handler) {
        this._onDataHandlers.add(handler);
    }
    onError(handler) {
        this._onErrorHandlers.add(handler);
    }
    onExit(handler) {
        this._onExitHandlers.add(handler);
        // Todo: not implemented
    }
    kill() {
        this._worker.terminate();
        this._tsserver.close();
        this._watcher.close();
        this._syncFs.close();
        this._watches.dispose();
    }
    appendLog(msg) {
        if (this.tsServerLog?.type === 'output') {
            this.tsServerLog.output.appendLine(`(${this.id} - ${this.kind}) ${msg}`);
        }
    }
}
WorkerServerProcess.idPool = 0;
//# sourceMappingURL=serverProcess.browser.js.map