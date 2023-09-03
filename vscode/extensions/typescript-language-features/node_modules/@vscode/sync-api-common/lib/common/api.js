"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
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
exports.BaseMessageConnection = exports.Cancellation = exports.RAL = void 0;
__exportStar(require("./connection"), exports);
__exportStar(require("./protocol"), exports);
const ral_1 = __importDefault(require("./ral"));
exports.RAL = ral_1.default;
var messageCancellation_1 = require("./messageCancellation");
Object.defineProperty(exports, "Cancellation", { enumerable: true, get: function () { return messageCancellation_1.Cancellation; } });
var messageConnection_1 = require("./messageConnection");
Object.defineProperty(exports, "BaseMessageConnection", { enumerable: true, get: function () { return messageConnection_1.BaseMessageConnection; } });
//# sourceMappingURL=api.js.map