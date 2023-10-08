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
exports.handleImageSelect = exports.handleDirSelect = exports.handleFileOpen = void 0;
const electron_1 = require("electron");
function handleFileOpen(window, event, defaultPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const { canceled, filePaths } = yield electron_1.dialog.showOpenDialog(window, {
            filters: [
                { name: 'Scenes', extensions: ['txt', 'log'] }
            ],
            properties: ['openFile', 'multiSelections'], defaultPath: defaultPath
        });
        if (canceled) {
            return undefined;
        }
        else {
            return filePaths;
        }
    });
}
exports.handleFileOpen = handleFileOpen;
function handleDirSelect(window, event, defaultPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const { canceled, filePaths } = yield electron_1.dialog.showOpenDialog(window, { properties: ['openDirectory'], defaultPath: defaultPath });
        if (canceled) {
            return undefined;
        }
        else {
            return filePaths;
        }
    });
}
exports.handleDirSelect = handleDirSelect;
function handleImageSelect(window, event, defaultPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const { canceled, filePaths } = yield electron_1.dialog.showOpenDialog(window, {
            filters: [
                { name: 'Supported Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }
            ],
            properties: ['openFile'], defaultPath: defaultPath
        });
        if (canceled) {
            return undefined;
        }
        else {
            return filePaths;
        }
    });
}
exports.handleImageSelect = handleImageSelect;
