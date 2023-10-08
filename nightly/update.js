'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const child_process_1 = __importDefault(require("child_process"));
const https_1 = require("https");
function printProgress(progress) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Downloading update: ${progress}%`);
}
function relaunchApp() {
    console.log('Relaunching application...');
    const cp = child_process_1.default.spawn(`${process.execPath}`, ['./app.asar'], {
        detached: true,
        stdio: 'ignore',
        env: {} // Drop ELECTRON_RUN_AS_NODE
    });
    cp.on('error', (err) => {
        console.log(err);
        process.exit();
    });
    cp.on('exit', (code, signal) => {
        console.log(`Application closed with: ${code !== null && code !== void 0 ? code : signal}.`);
        process.exit();
    });
    cp.on('spawn', () => {
        console.log('Application restarted successfully.');
        process.exit();
    });
}
function applyUpdate() {
    return fs_1.default.rename('update.file', 'app.asar', (err) => {
        throw err;
    });
}
function downloadUpdate(url = 'https://choicescriptide.github.io/downloads/updates/targets/preview141.zip') {
    return new Promise((resolve, reject) => {
        let timeOutAllowance = 3;
        let timeout;
        function handleData(fileSize, data) {
            clearInterval(timeout);
            timeout = setInterval(() => {
                if (--timeOutAllowance < 1) {
                    request.destroy();
                }
                reject(new Error('The application isn\'t receiving any data. Please check your internet connection.'));
            }, 10000);
            fileStream.write(data);
            const percentComplete = ((100 / (fileSize / fileStream.bytesWritten)).toFixed(2));
            printProgress(percentComplete);
        }
        function end() {
            clearInterval(timeout);
            fileStream.end();
            printProgress('100');
            process.stdout.write('\n');
            resolve();
        }
        const fileStream = fs_1.default.createWriteStream('./myupdate');
        const request = (0, https_1.get)(url, (response) => {
            var _a;
            if (!response || typeof response.statusCode !== 'number' || response.statusCode != 200) {
                console.log('Update download failed due to a server error: ' + ((_a = response.statusCode) === null || _a === void 0 ? void 0 : _a.toString()));
            }
            const fileSize = parseInt(response.headers['content-length'] || '0');
            fileStream.on('finish', () => fileStream.close());
            response
                .on('data', handleData.bind(null, fileSize))
                .on('end', end);
        });
    });
}
fs_1.default.appendFileSync('log', process.argv.toString());
const [, , ppid, pppid] = process.argv;
const timeout = 5000;
let timeoutAttempts = 3;
const interval = setInterval(() => {
    try {
        process.kill(parseInt(ppid), 'SIGTERM');
        process.kill(parseInt(pppid), 'SIGTERM');
        clearInterval(interval);
        applyUpdate();
        relaunchApp();
    }
    catch (err) {
        fs_1.default.appendFileSync('log', `Waiting for application to close... ${timeout * timeoutAttempts} milliseconds left.`);
        if (timeoutAttempts-- <= 0) {
            fs_1.default.appendFileSync('log', 'Giving up.');
            process.exit(); // give up
        }
    }
}, timeout);
