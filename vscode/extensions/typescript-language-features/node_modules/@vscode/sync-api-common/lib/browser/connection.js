"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceConnection = exports.ClientConnection = void 0;
const ral_1 = __importDefault(require("../common/ral"));
const connection_1 = require("../common/connection");
class ClientConnection extends connection_1.BaseClientConnection {
    constructor(port) {
        super();
        this.port = port;
        this.port.onmessage = ((event) => {
            this.handleMessage(event.data);
        });
    }
    postMessage(sharedArrayBuffer) {
        this.port.postMessage(sharedArrayBuffer);
    }
}
exports.ClientConnection = ClientConnection;
class ServiceConnection extends connection_1.BaseServiceConnection {
    constructor(port) {
        super();
        this.port = port;
        this.port.onmessage = (async (event) => {
            try {
                await this.handleMessage(event.data);
            }
            catch (error) {
                (0, ral_1.default)().console.error(error);
            }
        });
    }
    postMessage(message) {
        this.port.postMessage(message);
    }
}
exports.ServiceConnection = ServiceConnection;
//# sourceMappingURL=connection.js.map