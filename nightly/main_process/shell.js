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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleShellTrashItem = exports.handleShellOpenExternal = exports.handleShellOpenPath = exports.handleShellShowItemInFolder = void 0;
const electron_1 = require("electron");
function handleShellShowItemInFolder(event, itemPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return electron_1.shell.showItemInFolder(itemPath);
    });
}
exports.handleShellShowItemInFolder = handleShellShowItemInFolder;
function handleShellOpenPath(event, path) {
    return __awaiter(this, void 0, void 0, function* () {
        return electron_1.shell.openPath(path);
    });
}
exports.handleShellOpenPath = handleShellOpenPath;
function handleShellOpenExternal(event, path) {
    return electron_1.shell.openExternal(path, { activate: true });
}
exports.handleShellOpenExternal = handleShellOpenExternal;
function handleShellTrashItem(event, itemPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return electron_1.shell.trashItem(itemPath);
    });
}
exports.handleShellTrashItem = handleShellTrashItem;
