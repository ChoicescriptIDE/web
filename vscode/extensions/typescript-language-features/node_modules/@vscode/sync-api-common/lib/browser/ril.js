"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ral_1 = __importDefault(require("../common/ral"));
const connection_1 = require("./connection");
// In Browser environments we can only encode / decode utf-8
const encoder = new TextEncoder();
const decoder = new TextDecoder();
class TestServiceConnection extends connection_1.ServiceConnection {
    constructor(script, testCase) {
        const url = testCase !== undefined ? `${script}?toRun=${testCase}` : script;
        const worker = new Worker(url);
        super(worker);
        this.worker = worker;
    }
    terminate() {
        this.worker.terminate();
        return Promise.resolve(0);
    }
}
const _ril = Object.freeze({
    type: ral_1.default.Type.Browser,
    TextEncoder: Object.freeze({
        create(encoding = 'utf-8') {
            return encoder;
        }
    }),
    TextDecoder: Object.freeze({
        create(encoding = 'utf-8') {
            return decoder;
        }
    }),
    console: console,
    timer: Object.freeze({
        setTimeout(callback, ms, ...args) {
            const handle = setTimeout(callback, ms, ...args);
            return { dispose: () => clearTimeout(handle) };
        },
        setImmediate(callback, ...args) {
            const handle = setTimeout(callback, 0, ...args);
            return { dispose: () => clearTimeout(handle) };
        },
        setInterval(callback, ms, ...args) {
            const handle = setInterval(callback, ms, ...args);
            return { dispose: () => clearInterval(handle) };
        },
    }),
    $testing: Object.freeze({
        ClientConnection: Object.freeze({
            create() {
                return new connection_1.ClientConnection(self);
            }
        }),
        ServiceConnection: Object.freeze({
            create(script, testCase) {
                return new TestServiceConnection(script, testCase);
            }
        }),
        get testCase() {
            const location = self.location;
            const search = location.search;
            return search.substring('?toRun='.length);
        }
    })
});
function RIL() {
    return _ril;
}
(function (RIL) {
    function install() {
        ral_1.default.install(_ril);
    }
    RIL.install = install;
})(RIL || (RIL = {}));
exports.default = RIL;
//# sourceMappingURL=ril.js.map