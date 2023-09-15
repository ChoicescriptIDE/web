"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
require("mocha");
const assert = require("assert");
const vscode_uri_1 = require("vscode-uri");
const path_1 = require("path");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const documentContext_1 = require("../utils/documentContext");
const nodeFs_1 = require("../node/nodeFs");
suite('Links', () => {
    const cssLanguageService = (0, vscode_css_languageservice_1.getCSSLanguageService)({ fileSystemProvider: (0, nodeFs_1.getNodeFSRequestService)() });
    const assertLink = function (links, expected, document) {
        const matches = links.filter(link => {
            return document.offsetAt(link.range.start) === expected.offset;
        });
        assert.strictEqual(matches.length, 1, `${expected.offset} should only existing once: Actual: ${links.map(l => document.offsetAt(l.range.start)).join(', ')}`);
        const match = matches[0];
        assert.strictEqual(document.getText(match.range), expected.value);
        assert.strictEqual(match.target, expected.target);
    };
    async function assertLinks(value, expected, testUri, workspaceFolders, lang = 'css') {
        const offset = value.indexOf('|');
        value = value.substr(0, offset) + value.substr(offset + 1);
        const document = vscode_languageserver_types_1.TextDocument.create(testUri, lang, 0, value);
        if (!workspaceFolders) {
            workspaceFolders = [{ name: 'x', uri: testUri.substr(0, testUri.lastIndexOf('/')) }];
        }
        const context = (0, documentContext_1.getDocumentContext)(testUri, workspaceFolders);
        const stylesheet = cssLanguageService.parseStylesheet(document);
        const links = await cssLanguageService.findDocumentLinks2(document, stylesheet, context);
        assert.strictEqual(links.length, expected.length);
        for (const item of expected) {
            assertLink(links, item, document);
        }
    }
    function getTestResource(path) {
        return vscode_uri_1.URI.file((0, path_1.resolve)(__dirname, '../../test/linksTestFixtures', path)).toString(true);
    }
    test('url links', async function () {
        const testUri = getTestResource('about.css');
        const folders = [{ name: 'x', uri: getTestResource('') }];
        await assertLinks('html { background-image: url("hello.html|")', [{ offset: 29, value: '"hello.html"', target: getTestResource('hello.html') }], testUri, folders);
    });
    test('url links - untitled', async function () {
        const testUri = 'untitled:untitled-1';
        const folders = [{ name: 'x', uri: getTestResource('') }];
        await assertLinks('@import url("base.css|");")', [{ offset: 12, value: '"base.css"', target: 'untitled:base.css' }], testUri, folders);
    });
    test('node module resolving', async function () {
        const testUri = getTestResource('about.css');
        const folders = [{ name: 'x', uri: getTestResource('') }];
        await assertLinks('html { background-image: url("~foo/hello.html|")', [{ offset: 29, value: '"~foo/hello.html"', target: getTestResource('node_modules/foo/hello.html') }], testUri, folders);
    });
    test('node module subfolder resolving', async function () {
        const testUri = getTestResource('subdir/about.css');
        const folders = [{ name: 'x', uri: getTestResource('') }];
        await assertLinks('html { background-image: url("~foo/hello.html|")', [{ offset: 29, value: '"~foo/hello.html"', target: getTestResource('node_modules/foo/hello.html') }], testUri, folders);
    });
});
//# sourceMappingURL=links.test.js.map