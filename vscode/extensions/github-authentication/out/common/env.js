"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHostedGitHubEnterprise = exports.isSupportedTarget = exports.isSupportedClient = void 0;
const github_1 = require("../github");
const VALID_DESKTOP_CALLBACK_SCHEMES = [
    'vscode',
    'vscode-insiders',
    // On Windows, some browsers don't seem to redirect back to OSS properly.
    // As a result, you get stuck in the auth flow. We exclude this from the
    // list until we can figure out a way to fix this behavior in browsers.
    // 'code-oss',
    'vscode-wsl',
    'vscode-exploration'
];
function isSupportedClient(uri) {
    return (VALID_DESKTOP_CALLBACK_SCHEMES.includes(uri.scheme) ||
        // vscode.dev & insiders.vscode.dev
        /(?:^|\.)vscode\.dev$/.test(uri.authority) ||
        // github.dev & codespaces
        /(?:^|\.)github\.dev$/.test(uri.authority));
}
exports.isSupportedClient = isSupportedClient;
function isSupportedTarget(type, gheUri) {
    return (type === github_1.AuthProviderType.github ||
        isHostedGitHubEnterprise(gheUri));
}
exports.isSupportedTarget = isSupportedTarget;
function isHostedGitHubEnterprise(uri) {
    return /\.ghe\.com$/.test(uri.authority);
}
exports.isHostedGitHubEnterprise = isHostedGitHubEnterprise;
//# sourceMappingURL=env.js.map