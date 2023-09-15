"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const assert = require("assert");
const documentContext_1 = require("../utils/documentContext");
suite('HTML Document Context', () => {
    test('Context', function () {
        const docURI = 'file:///users/test/folder/test.html';
        const rootFolders = [{ name: '', uri: 'file:///users/test/' }];
        const context = (0, documentContext_1.getDocumentContext)(docURI, rootFolders);
        assert.strictEqual(context.resolveReference('/', docURI), 'file:///users/test/');
        assert.strictEqual(context.resolveReference('/message.html', docURI), 'file:///users/test/message.html');
        assert.strictEqual(context.resolveReference('message.html', docURI), 'file:///users/test/folder/message.html');
        assert.strictEqual(context.resolveReference('message.html', 'file:///users/test/'), 'file:///users/test/message.html');
    });
});
//# sourceMappingURL=documentContext.test.js.map