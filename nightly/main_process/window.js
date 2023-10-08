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
exports.handleWindowIsFullScreen = exports.handleWindowIsMaximized = exports.handleWindowIsMinimized = exports.handleWindowMaximize = exports.handleWindowMinimize = exports.handleWindowSetFullScreen = exports.handleWindowRestore = exports.handleWindowClose = void 0;
function handleWindowClose(window, _) {
    return __awaiter(this, void 0, void 0, function* () {
        window.close();
    });
}
exports.handleWindowClose = handleWindowClose;
function handleWindowRestore(window, _) {
    return __awaiter(this, void 0, void 0, function* () {
        window.restore();
    });
}
exports.handleWindowRestore = handleWindowRestore;
function handleWindowSetFullScreen(window, _, value) {
    return __awaiter(this, void 0, void 0, function* () {
        window.setFullScreen(value);
    });
}
exports.handleWindowSetFullScreen = handleWindowSetFullScreen;
function handleWindowMinimize(window, _) {
    return __awaiter(this, void 0, void 0, function* () {
        window.minimize();
    });
}
exports.handleWindowMinimize = handleWindowMinimize;
function handleWindowMaximize(window, _) {
    return __awaiter(this, void 0, void 0, function* () {
        window.maximize();
    });
}
exports.handleWindowMaximize = handleWindowMaximize;
function handleWindowIsMinimized(window, _) {
    return __awaiter(this, void 0, void 0, function* () {
        return window.isMaximized();
    });
}
exports.handleWindowIsMinimized = handleWindowIsMinimized;
function handleWindowIsMaximized(window, _) {
    return __awaiter(this, void 0, void 0, function* () {
        return window.isMinimized();
    });
}
exports.handleWindowIsMaximized = handleWindowIsMaximized;
function handleWindowIsFullScreen(window, _) {
    return __awaiter(this, void 0, void 0, function* () {
        return window.isFullScreen();
    });
}
exports.handleWindowIsFullScreen = handleWindowIsFullScreen;
