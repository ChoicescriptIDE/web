"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageConnection = void 0;
const ral_1 = __importDefault(require("../common/ral"));
const worker_threads_1 = require("worker_threads");
const messageConnection_1 = require("../common/messageConnection");
class MessageConnection extends messageConnection_1.BaseMessageConnection {
    constructor(port) {
        super();
        this.port = port;
    }
    postMessage(message, transferList) {
        this.port.postMessage(message, transferList);
    }
    listen() {
        this.port.on('message', (value) => {
            this.handleMessage(value).catch((0, ral_1.default)().console.error);
        });
    }
}
exports.MessageConnection = MessageConnection;
new MessageConnection(worker_threads_1.parentPort);
//# sourceMappingURL=messageConnection.js.map