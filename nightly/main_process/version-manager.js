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
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const process_1 = require("./process");
class VersionManager {
    checkForUpdates(versions, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                response = yield axios_1.default.get('https://api.github.com/repos/ChoiceScriptIDE/main/releases');
            }
            catch (err) {
                throw new Error('Failed to fetch release data.');
            }
            if (response.status === 200) {
                let releases = response.data;
                releases = releases.filter(r => r.tag_name.includes(channel));
                releases.forEach(r => {
                    r.desc = `${r.tag_name} (<a target='_blank' href='${r.html_url}'>details</a>)`;
                });
                releases = releases.sort((a, b) => {
                    const aDate = new Date(a.published_at);
                    const bDate = new Date(b.published_at);
                    if (aDate > bDate) {
                        return 1;
                    }
                    else if (bDate > aDate) {
                        return 0;
                    }
                    else {
                        return -1;
                    }
                });
                return releases[0];
            }
            else {
                throw new Error('Failed to fetch release data.');
            }
        });
    }
    downloadUpdate(updateChannel) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const release = yield this.checkForUpdates({}, updateChannel);
            const url = (_a = release.assets.find(a => a.name === 'app.asar')) === null || _a === void 0 ? void 0 : _a.browser_download_url;
            if (url) {
                const response = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data);
                fs_1.default.writeFileSync(`${electron_1.app.getAppPath().slice(0, -('app.asar'.length))}update.file`, buffer, { 'encoding': 'binary' });
                (0, process_1.handleSpawnDetatchedNodeProcess)(undefined, 'update.js');
            }
            else {
                throw new Error('Failed to download update.');
            }
        });
    }
}
exports.default = VersionManager;
