"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageConnection = exports.ClientConnection = exports.ServiceConnection = void 0;
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const ril_1 = __importDefault(require("./ril"));
ril_1.default.install();
__exportStar(require("../common/api"), exports);
var connection_1 = require("./connection");
Object.defineProperty(exports, "ServiceConnection", { enumerable: true, get: function () { return connection_1.ServiceConnection; } });
Object.defineProperty(exports, "ClientConnection", { enumerable: true, get: function () { return connection_1.ClientConnection; } });
var messageConnection_1 = require("./messageConnection");
Object.defineProperty(exports, "MessageConnection", { enumerable: true, get: function () { return messageConnection_1.MessageConnection; } });
//# sourceMappingURL=main.js.map