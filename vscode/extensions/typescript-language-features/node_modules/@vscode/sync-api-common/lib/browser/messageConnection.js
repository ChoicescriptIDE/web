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
const messageConnection_1 = require("../common/messageConnection");
class MessageConnection extends messageConnection_1.BaseMessageConnection {
    constructor(port) {
        super();
        this.port = port;
    }
    postMessage(message, transfer) {
        transfer !== undefined ? this.port.postMessage(message, transfer) : this.port.postMessage(message);
    }
    listen() {
        this.port.onmessage = (event) => {
            this.handleMessage(event.data).catch((0, ral_1.default)().console.error);
        };
    }
}
exports.MessageConnection = MessageConnection;
//# sourceMappingURL=messageConnection.js.map