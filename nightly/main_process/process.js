"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleExecFile = exports.handleSpawnDetatchedNodeProcess = exports.handleForkProcess = exports.handleProcessExit = void 0;
const child_process_1 = __importDefault(require("child_process"));
const electron_1 = require("electron");
const util_1 = require("util");
function handleProcessExit(_) {
    return __awaiter(this, void 0, void 0, function* () {
        process.exit();
    });
}
exports.handleProcessExit = handleProcessExit;
function handleForkProcess(event, channel, target, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (target) {
            case 'compile.js': {
                child_process_1.default.fork(target, args, options);
                break;
            }
            default: {
                throw new Error(`Unsupported fork operation requested! '${target}' is not a valid target.`);
            }
        }
    });
}
exports.handleForkProcess = handleForkProcess;
function handleSpawnDetatchedNodeProcess(event, target, args = [], _) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisedSpawn = (0, util_1.promisify)(child_process_1.default.spawn);
        return promisedSpawn(`${process.execPath}`, [target, process.pid.toString(), process.ppid.toString()], {
            detached: true,
            stdio: 'ignore',
            cwd: electron_1.app.getAppPath().slice(0, -('app.asar'.length)),
            env: {
                ELECTRON_RUN_AS_NODE: '1'
            }
        });
    });
}
exports.handleSpawnDetatchedNodeProcess = handleSpawnDetatchedNodeProcess;
function handleExecFile(event, target, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisedExecFile = (0, util_1.promisify)(child_process_1.default.execFile);
        return yield promisedExecFile(target, args, options);
    });
}
exports.handleExecFile = handleExecFile;
