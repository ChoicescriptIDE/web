"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const dispose_1 = require("../utils/dispose");
class Tracer extends dispose_1.Disposable {
    constructor(logger) {
        super();
        this.logger = logger;
    }
    traceRequest(serverId, request, responseExpected, queueLength) {
        if (this.logger.logLevel === vscode.LogLevel.Trace) {
            this.trace(serverId, `Sending request: ${request.command} (${request.seq}). Response expected: ${responseExpected ? 'yes' : 'no'}. Current queue length: ${queueLength}`, request.arguments);
        }
    }
    traceResponse(serverId, response, meta) {
        if (this.logger.logLevel === vscode.LogLevel.Trace) {
            this.trace(serverId, `Response received: ${response.command} (${response.request_seq}). Request took ${Date.now() - meta.queuingStartTime} ms. Success: ${response.success} ${!response.success ? '. Message: ' + response.message : ''}`, response.body);
        }
    }
    traceRequestCompleted(serverId, command, request_seq, meta) {
        if (this.logger.logLevel === vscode.LogLevel.Trace) {
            this.trace(serverId, `Async response received: ${command} (${request_seq}). Request took ${Date.now() - meta.queuingStartTime} ms.`);
        }
    }
    traceEvent(serverId, event) {
        if (this.logger.logLevel === vscode.LogLevel.Trace) {
            this.trace(serverId, `Event received: ${event.event} (${event.seq}).`, event.body);
        }
    }
    trace(serverId, message, data) {
        this.logger.trace(`<${serverId}> ${message}`, ...(data ? [JSON.stringify(data, null, 4)] : []));
    }
}
exports.default = Tracer;
//# sourceMappingURL=tracer.js.map