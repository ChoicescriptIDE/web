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
exports.handleReadDir = exports.handleGetDirName = exports.handleMoveFile = exports.handleStatFile = exports.handleReadFile = exports.handleMkdirp = exports.handleWriteFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const mkdirp_1 = __importDefault(require("mkdirp"));
function handleWriteFile(event, filePath, data, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisedWriteFile = (0, util_1.promisify)(fs_1.default.writeFile);
        return yield promisedWriteFile(filePath, data, options);
    });
}
exports.handleWriteFile = handleWriteFile;
function handleMkdirp(event, filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, mkdirp_1.default)(filePath, options);
    });
}
exports.handleMkdirp = handleMkdirp;
function handleReadFile(event, filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisedReadFile = (0, util_1.promisify)(fs_1.default.readFile);
        return yield promisedReadFile(filePath, Object.assign(options || {}, { encoding: 'utf8' }));
    });
}
exports.handleReadFile = handleReadFile;
function handleStatFile(event, filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisedStat = (0, util_1.promisify)(fs_1.default.stat);
        return yield promisedStat(filePath, options);
    });
}
exports.handleStatFile = handleStatFile;
function handleMoveFile(event, oldPath, newPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisedRename = (0, util_1.promisify)(fs_1.default.rename);
        return yield promisedRename(oldPath, newPath);
    });
}
exports.handleMoveFile = handleMoveFile;
function handleGetDirName(event, dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return path_1.default.dirname(dirPath);
    });
}
exports.handleGetDirName = handleGetDirName;
function handleReadDir(event, dirPath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisedReadDir = (0, util_1.promisify)(fs_1.default.readdir);
        return yield promisedReadDir(dirPath, options);
    });
}
exports.handleReadDir = handleReadDir;
