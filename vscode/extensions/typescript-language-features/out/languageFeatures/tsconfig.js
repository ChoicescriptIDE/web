"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const jsonc = require("jsonc-parser");
const path_1 = require("path");
const vscode = require("vscode");
const vscode_uri_1 = require("vscode-uri");
const arrays_1 = require("../utils/arrays");
const fs_1 = require("../utils/fs");
function mapChildren(node, f) {
    return node && node.type === 'array' && node.children
        ? node.children.map(f)
        : [];
}
const openExtendsLinkCommandId = '_typescript.openExtendsLink';
class TsconfigLinkProvider {
    provideDocumentLinks(document, _token) {
        const root = jsonc.parseTree(document.getText());
        if (!root) {
            return [];
        }
        return (0, arrays_1.coalesce)([
            this.getExtendsLink(document, root),
            ...this.getFilesLinks(document, root),
            ...this.getReferencesLinks(document, root)
        ]);
    }
    getExtendsLink(document, root) {
        const node = jsonc.findNodeAtLocation(root, ['extends']);
        return node && this.tryCreateTsConfigLink(document, node);
    }
    getReferencesLinks(document, root) {
        return mapChildren(jsonc.findNodeAtLocation(root, ['references']), child => {
            const pathNode = jsonc.findNodeAtLocation(child, ['path']);
            return pathNode && this.tryCreateTsConfigLink(document, pathNode);
        });
    }
    tryCreateTsConfigLink(document, node) {
        if (!this.isPathValue(node)) {
            return undefined;
        }
        const args = {
            resourceUri: { ...document.uri.toJSON(), $mid: undefined },
            extendsValue: node.value
        };
        const link = new vscode.DocumentLink(this.getRange(document, node), vscode.Uri.parse(`command:${openExtendsLinkCommandId}?${JSON.stringify(args)}`));
        link.tooltip = vscode.l10n.t("Follow link");
        return link;
    }
    getFilesLinks(document, root) {
        return mapChildren(jsonc.findNodeAtLocation(root, ['files']), child => this.pathNodeToLink(document, child));
    }
    pathNodeToLink(document, node) {
        return this.isPathValue(node)
            ? new vscode.DocumentLink(this.getRange(document, node), this.getFileTarget(document, node))
            : undefined;
    }
    isPathValue(node) {
        return node
            && node.type === 'string'
            && node.value
            && !node.value.includes('*'); // don't treat globs as links.
    }
    getFileTarget(document, node) {
        return vscode.Uri.joinPath(vscode_uri_1.Utils.dirname(document.uri), node.value);
    }
    getRange(document, node) {
        const offset = node.offset;
        const start = document.positionAt(offset + 1);
        const end = document.positionAt(offset + (node.length - 1));
        return new vscode.Range(start, end);
    }
}
async function resolveNodeModulesPath(baseDirUri, pathCandidates) {
    let currentUri = baseDirUri;
    const baseCandidate = pathCandidates[0];
    const sepIndex = baseCandidate.startsWith('@') ? 2 : 1;
    const moduleBasePath = baseCandidate.split(path_1.posix.sep).slice(0, sepIndex).join(path_1.posix.sep);
    while (true) {
        const moduleAbsoluteUrl = vscode.Uri.joinPath(currentUri, 'node_modules', moduleBasePath);
        let moduleStat;
        try {
            moduleStat = await vscode.workspace.fs.stat(moduleAbsoluteUrl);
        }
        catch (err) {
            // noop
        }
        if (moduleStat && (moduleStat.type & vscode.FileType.Directory)) {
            for (const uriCandidate of pathCandidates
                .map((relativePath) => relativePath.split(path_1.posix.sep).slice(sepIndex).join(path_1.posix.sep))
                // skip empty paths within module
                .filter(Boolean)
                .map((relativeModulePath) => vscode.Uri.joinPath(moduleAbsoluteUrl, relativeModulePath))) {
                if (await (0, fs_1.exists)(uriCandidate)) {
                    return uriCandidate;
                }
            }
            // Continue to looking for potentially another version
        }
        const oldUri = currentUri;
        currentUri = vscode.Uri.joinPath(currentUri, '..');
        // Can't go next. Reached the system root
        if (oldUri.path === currentUri.path) {
            return;
        }
    }
}
// Reference: https://github.com/microsoft/TypeScript/blob/febfd442cdba343771f478cf433b0892f213ad2f/src/compiler/commandLineParser.ts#L3005
/**
* @returns Returns undefined in case of lack of result while trying to resolve from node_modules
*/
async function getTsconfigPath(baseDirUri, pathValue) {
    async function resolve(absolutePath) {
        if (absolutePath.path.endsWith('.json') || await (0, fs_1.exists)(absolutePath)) {
            return absolutePath;
        }
        return absolutePath.with({
            path: `${absolutePath.path}.json`
        });
    }
    const isRelativePath = ['./', '../'].some(str => pathValue.startsWith(str));
    if (isRelativePath) {
        return resolve(vscode.Uri.joinPath(baseDirUri, pathValue));
    }
    if (pathValue.startsWith('/') || (0, fs_1.looksLikeAbsoluteWindowsPath)(pathValue)) {
        return resolve(vscode.Uri.file(pathValue));
    }
    // Otherwise resolve like a module
    return resolveNodeModulesPath(baseDirUri, [
        pathValue,
        ...pathValue.endsWith('.json') ? [] : [
            `${pathValue}.json`,
            `${pathValue}/tsconfig.json`,
        ]
    ]);
}
function register() {
    const patterns = [
        '**/[jt]sconfig.json',
        '**/[jt]sconfig.*.json',
    ];
    const languages = ['json', 'jsonc'];
    const selector = languages.map(language => patterns.map((pattern) => ({ language, pattern })))
        .flat();
    return vscode.Disposable.from(vscode.commands.registerCommand(openExtendsLinkCommandId, async ({ resourceUri, extendsValue, }) => {
        const tsconfigPath = await getTsconfigPath(vscode_uri_1.Utils.dirname(vscode.Uri.from(resourceUri)), extendsValue);
        if (tsconfigPath === undefined) {
            vscode.window.showErrorMessage(vscode.l10n.t("Failed to resolve {0} as module", extendsValue));
            return;
        }
        // Will suggest to create a .json variant if it doesn't exist yet (but only for relative paths)
        await vscode.commands.executeCommand('vscode.open', tsconfigPath);
    }), vscode.languages.registerDocumentLinkProvider(selector, new TsconfigLinkProvider()));
}
exports.register = register;
//# sourceMappingURL=tsconfig.js.map