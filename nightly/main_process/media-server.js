"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const node_static_1 = require("node-static");
let port;
let server; // eslint-disable-line @typescript-eslint/no-explicit-any
let dir;
server = http_1.default.createServer((req, res) => {
    server.serve(req, res);
}).listen(0, () => port = server.address().port);
function setStaticServeDir(dir) {
    server = new node_static_1.Server(dir, { cache: false, indexFile: 'run_index.html' });
}
exports.default = {
    getPort: () => {
        return port;
    },
    getAddr: () => {
        return 'http://127.0.0.1:' + port + '/';
    },
    getDir: () => {
        return dir;
    },
    setDir: (newDir) => {
        dir = newDir;
        setStaticServeDir(dir);
    }
};
