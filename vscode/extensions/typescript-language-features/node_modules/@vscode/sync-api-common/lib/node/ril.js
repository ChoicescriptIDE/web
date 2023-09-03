"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const worker_threads_1 = require("worker_threads");
const ral_1 = __importDefault(require("../common/ral"));
const connection_1 = require("./connection");
class TestServiceConnection extends connection_1.ServiceConnection {
    constructor(script, testCase) {
        const worker = new worker_threads_1.Worker(script, testCase !== undefined ? { argv: [testCase] } : undefined);
        super(worker);
        this.worker = worker;
    }
    terminate() {
        return this.worker.terminate();
    }
}
const _ril = Object.freeze({
    type: ral_1.default.Type.Node,
    TextEncoder: Object.freeze({
        create(encoding = 'utf-8') {
            return {
                encode(input) {
                    return Buffer.from(input ?? '', encoding);
                }
            };
        }
    }),
    TextDecoder: Object.freeze({
        create(encoding = 'utf-8') {
            return new util_1.TextDecoder(encoding);
        }
    }),
    console: console,
    timer: Object.freeze({
        setTimeout(callback, ms, ...args) {
            const handle = setTimeout(callback, ms, ...args);
            return { dispose: () => clearTimeout(handle) };
        },
        setImmediate(callback, ...args) {
            const handle = setImmediate(callback, ...args);
            return { dispose: () => clearImmediate(handle) };
        },
        setInterval(callback, ms, ...args) {
            const handle = setInterval(callback, ms, ...args);
            return { dispose: () => clearInterval(handle) };
        }
    }),
    $testing: Object.freeze({
        ClientConnection: Object.freeze({
            create() {
                if (!worker_threads_1.parentPort) {
                    throw new Error(`No parent port defined. Shouldn't happen in test setup`);
                }
                return new connection_1.ClientConnection(worker_threads_1.parentPort);
            }
        }),
        ServiceConnection: Object.freeze({
            create(script, testCase) {
                return new TestServiceConnection(script, testCase);
            }
        }),
        get testCase() {
            return process.argv[2];
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