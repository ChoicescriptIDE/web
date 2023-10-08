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
const electron_1 = require("electron");
const dialog_1 = require("./dialog");
const window_1 = require("./window");
const file_1 = require("./file");
const shell_1 = require("./shell");
const process_1 = require("./process");
const os_1 = require("os");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const version_manager_1 = __importDefault(require("./version-manager"));
const media_server_1 = __importDefault(require("./media-server"));
const versionManager = new version_manager_1.default();
let mainWindow;
electron_1.app.whenReady().then(() => {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, '../preload.js'),
            webviewTag: true,
            sandbox: true
        }
    });
    mainWindow.loadFile('index.html');
    if (process.env.CSIDE_DEV) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.setMenu(null); // No CMD + W closure etc.
    const menu = new electron_1.Menu();
    menu.append(new electron_1.MenuItem({
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => { console.log('Cmd + Q is pressed'); }
    }));
    menu.append(new electron_1.MenuItem({
        label: 'WQuit',
        accelerator: 'CmdOrCtrl+W',
        click: () => { console.log('Cmd + W is pressed'); }
    }));
    electron_1.Menu.setApplicationMenu(null);
    mainWindow.setMenu(menu); // No CMD + W closure etc.
    mainWindow.webContents.on('will-navigate', (event) => {
        event.preventDefault();
    });
    mainWindow.webContents.setWindowOpenHandler((details) => {
        if (details.url.match(/^https?:/)) {
            (0, shell_1.handleShellOpenExternal)({}, details.url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });
    mainWindow.on('close', (evt) => {
        evt.preventDefault();
    });
    registerHandler('dialog:openFile', dialog_1.handleFileOpen.bind(null, mainWindow));
    registerHandler('dialog:selectDir', dialog_1.handleDirSelect.bind(null, mainWindow));
    registerHandler('dialog:selectImage', dialog_1.handleImageSelect.bind(null, mainWindow));
    registerHandler('window:close', window_1.handleWindowClose.bind(null, mainWindow));
    registerHandler('window:restore', window_1.handleWindowRestore.bind(null, mainWindow));
    registerHandler('window:setFullScreen', window_1.handleWindowSetFullScreen.bind(null, mainWindow));
    registerHandler('window:minimize', window_1.handleWindowMinimize.bind(null, mainWindow));
    registerHandler('window:maximize', window_1.handleWindowMaximize.bind(null, mainWindow));
    registerHandler('window:isMinimized', window_1.handleWindowIsMinimized.bind(null, mainWindow));
    registerHandler('window:isMaximized', window_1.handleWindowIsMaximized.bind(null, mainWindow));
    registerHandler('window:isFullScreen', window_1.handleWindowIsFullScreen.bind(null, mainWindow));
    registerHandler('file:read', file_1.handleReadFile);
    registerHandler('file:write', file_1.handleWriteFile);
    registerHandler('file:stat', file_1.handleStatFile);
    registerHandler('file:move', file_1.handleMoveFile);
    registerHandler('file:mkdirp', file_1.handleMkdirp);
    registerHandler('file:getDirName', file_1.handleGetDirName);
    registerHandler('file:readDir', file_1.handleReadDir);
    registerHandler('app:getPath', handleGetAppPath);
    registerHandler('app:exit', handleAppExit);
    registerHandler('process:fork', process_1.handleForkProcess);
    registerHandler('process:spawn', process_1.handleSpawnDetatchedNodeProcess);
    registerHandler('process:execFile', process_1.handleExecFile);
    registerHandler('process:exit', process_1.handleProcessExit);
    registerHandler('updates:check', handleCheckForUpdates);
    registerHandler('updates:update', handleUpdate);
    registerHandler('mediaServer:setDir', handleMediaServerSetDir);
    registerHandler('mediaServer:getAddr', handleMediaServerGetAddr);
    registerHandler('getUserDetails', handleGetUserDetails);
    registerHandler('getPlatform', handleGetPlatform);
    registerHandler('getVersions', handleGetVersions);
    registerHandler('shell:showItemInFolder', shell_1.handleShellShowItemInFolder);
    registerHandler('shell:openExternal', shell_1.handleShellOpenExternal);
    registerHandler('shell:openPath', shell_1.handleShellOpenPath);
    registerHandler('shell:trashItem', shell_1.handleShellTrashItem);
});
electron_1.app.on('window-all-closed', () => {
    electron_1.app.quit();
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const encodeError = (err) => {
    return {
        message: err.message,
        code: err.code,
    };
};
// Error objects can't be serialized properly, see:
// https://github.com/electron/electron/issues/24427
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registerHandler = (channel, handler) => {
    electron_1.ipcMain.handle(channel, (...args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return { result: yield Promise.resolve(handler(...args)) };
        }
        catch (err) {
            return { error: encodeError(err) };
        }
    }));
};
const handleAppExit = () => {
    mainWindow.close();
    process.exit();
};
function handleCheckForUpdates(_, versions, updateChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield versionManager.checkForUpdates(versions, updateChannel);
    });
}
function handleUpdate(_, updateChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        /*const handlers = {
            error: (title: string, desc: string) => {
                mainWindow.webContents.send('process-update-error', { title, desc });
            },
            progress: (progressPercent: string) => {
                mainWindow.webContents.send('process-update-progress', progressPercent);
            }
        }*/
        return yield versionManager.downloadUpdate(updateChannel); //, handlers);
    });
}
function handleMediaServerSetDir(_, dir) {
    return __awaiter(this, void 0, void 0, function* () {
        return media_server_1.default.setDir(dir);
    });
}
function handleMediaServerGetAddr(_) {
    return __awaiter(this, void 0, void 0, function* () {
        return media_server_1.default.getAddr();
    });
}
function handleGetAppPath(event, name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (name === 'app') {
            return electron_1.app.getAppPath();
        }
        else if (name === 'cwd') {
            return process.cwd();
        }
        else {
            return electron_1.app.getPath(name);
        }
    });
}
function handleGetUserDetails(_) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            name: process.env.USER || process.env.USERNAME || process.env.LNAME || (0, os_1.userInfo)().username,
            path: electron_1.app.getPath('home')
        };
    });
}
function handleGetVersions(_) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            cside: electron_1.app.getVersion(),
            electron: process.versions.electron
        };
    });
}
function handleGetPlatform(_) {
    return __awaiter(this, void 0, void 0, function* () {
        return process.platform === 'darwin' ? 'mac_os' : process.platform;
    });
}
process.on('uncaughtException', (err) => {
    mainWindow.webContents.send('notification', '<h3>Uncaught Exception <span aria-hidden=\'true\'>=(</span></h3><p>' + err.message + '\
    </p><p>Something went (unexpectedly!) wrong.<br/>Please close \
    and restart the application (then report this!).');
    try {
        fs_1.default.appendFileSync(electron_1.app.getPath('userData') + '/cside-errors.txt', new Date(Date.now()) + ': ' + err.message + '\n' + err.stack + '\n');
        console.log(err);
    }
    catch (err) { /* Failed to write to error log */ }
});
process.on('SIGTERM', (signal, code) => {
    mainWindow.webContents.send('infoReq', 'dirty');
    process.exit(128 + code);
});
