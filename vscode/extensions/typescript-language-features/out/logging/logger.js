"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const vscode = require("vscode");
const memoize_1 = require("../utils/memoize");
class Logger {
    get output() {
        return vscode.window.createOutputChannel('TypeScript', { log: true });
    }
    get logLevel() {
        return this.output.logLevel;
    }
    info(message, ...args) {
        this.output.info(message, ...args);
    }
    trace(message, ...args) {
        this.output.trace(message, ...args);
    }
    error(message, data) {
        // See https://github.com/microsoft/TypeScript/issues/10496
        if (data && data.message === 'No content available.') {
            return;
        }
        this.output.error(message, ...(data ? [data] : []));
    }
}
exports.Logger = Logger;
__decorate([
    memoize_1.memoize
], Logger.prototype, "output", null);
//# sourceMappingURL=logger.js.map