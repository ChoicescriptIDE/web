"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    openFile: (defaultPath) => electron_1.ipcRenderer.invoke('dialog:openFile', defaultPath),
    selectDir: (defaultPath) => electron_1.ipcRenderer.invoke('dialog:selectDir', defaultPath),
    selectImage: (defaultPath) => electron_1.ipcRenderer.invoke('dialog:selectImage', defaultPath),
    writeFile: (path, data, options) => electron_1.ipcRenderer.invoke('file:write', path, data, options),
    readFile: (path, options) => electron_1.ipcRenderer.invoke('file:read', path, options),
    statFile: (path) => electron_1.ipcRenderer.invoke('file:stat', path),
    moveFile: (oldPath, newPath) => electron_1.ipcRenderer.invoke('file:move', oldPath, newPath),
    mkdirp: (path) => electron_1.ipcRenderer.invoke('file:mkdirp', path),
    getDirName: (path) => electron_1.ipcRenderer.invoke('file:getDirName', path),
    readDir: (path, options) => electron_1.ipcRenderer.invoke('file:readDir', path, options),
    app: {
        getPath: (name) => electron_1.ipcRenderer.invoke('app:getPath', name),
        exit: () => electron_1.ipcRenderer.invoke('app:exit')
    },
    mediaServer: {
        setDir: (path) => electron_1.ipcRenderer.invoke('mediaServer:setDir', path),
        getAddr: () => electron_1.ipcRenderer.invoke('mediaServer:getAddr'),
    },
    getAppPath: () => electron_1.ipcRenderer.invoke('app:getPath', 'app'),
    getPlatform: () => electron_1.ipcRenderer.invoke('getPlatform'),
    getUserDetails: () => electron_1.ipcRenderer.invoke('getUserDetails'),
    getVersions: () => electron_1.ipcRenderer.invoke('getVersions'),
    handleNotification: (callback) => electron_1.ipcRenderer.on('notification', callback),
    hanldeInformationRequest: (callback) => electron_1.ipcRenderer.on('infoReq', callback),
    window: {
        close: () => electron_1.ipcRenderer.invoke('window:close'),
        restore: () => electron_1.ipcRenderer.invoke('window:restore'),
        minimize: () => electron_1.ipcRenderer.invoke('window:minimize'),
        maximize: () => electron_1.ipcRenderer.invoke('window:maximize'),
        setFullScreen: (value) => electron_1.ipcRenderer.invoke('window:setFullScreen', value),
        isMinimized: () => electron_1.ipcRenderer.invoke('window:isMinimized'),
        isMaximized: () => electron_1.ipcRenderer.invoke('window:isMaximized'),
        isFullScreen: () => electron_1.ipcRenderer.invoke('window:isFullScreen')
    },
    updates: {
        check: (versions, updateChannel) => electron_1.ipcRenderer.invoke('updates:check', versions, updateChannel),
        restore: () => electron_1.ipcRenderer.invoke('updates:restore'),
        download: (updateChannel) => electron_1.ipcRenderer.invoke('updates:update', updateChannel)
    },
    process: {
        registerChannel: (channel, callback) => electron_1.ipcRenderer.on(`process-${channel}`, callback),
        unregisterChannel: (channel, callback) => electron_1.ipcRenderer.off(`process-${channel}`, callback),
        fork: (channel, target, args, options) => electron_1.ipcRenderer.invoke('process:fork', channel, target, args, options),
        spawn: (target, args, options) => electron_1.ipcRenderer.invoke('process:spawn', target, args, options),
        execFile: (target, args, options) => electron_1.ipcRenderer.invoke('process:execFile', target, args, options),
        exit: () => electron_1.ipcRenderer.invoke('process:exit')
    },
    shell: {
        show: (path) => electron_1.ipcRenderer.invoke('shell:showItemInFolder', path),
        openItem: (path) => electron_1.ipcRenderer.invoke('shell:openPath', path),
        openExternal: (path) => electron_1.ipcRenderer.invoke('shell:openExternal', path),
        trash: (path) => electron_1.ipcRenderer.invoke('shell:trashItem', path),
    }
});
