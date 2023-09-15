"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const assert = require("assert");
const words = require("../utils/strings");
const fs = require("fs");
const path = require("path");
suite('HTML Language Configuration', () => {
    const config = JSON.parse((fs.readFileSync(path.join(__dirname, '../../../../html/language-configuration.json')).toString()));
    function createRegex(str) {
        if (typeof str === 'string') {
            return new RegExp(str, 'g');
        }
        return new RegExp(str.pattern, str.flags);
    }
    const wordRegex = createRegex(config.wordPattern);
    function assertWord(value, expected) {
        const offset = value.indexOf('|');
        value = value.substr(0, offset) + value.substring(offset + 1);
        const actualRange = words.getWordAtText(value, offset, wordRegex);
        assert(actualRange.start <= offset);
        assert(actualRange.start + actualRange.length >= offset);
        assert.strictEqual(value.substr(actualRange.start, actualRange.length), expected);
    }
    test('Words Basic', function () {
        assertWord('|var x1 = new F<A>(a, b);', 'var');
        assertWord('v|ar x1 = new F<A>(a, b);', 'var');
        assertWord('var| x1 = new F<A>(a, b);', 'var');
        assertWord('var |x1 = new F<A>(a, b);', 'x1');
        assertWord('var x1| = new F<A>(a, b);', 'x1');
        assertWord('var x1 = new |F<A>(a, b);', 'F');
        assertWord('var x1 = new F<|A>(a, b);', 'A');
        assertWord('var x1 = new F<A>(|a, b);', 'a');
        assertWord('var x1 = new F<A>(a, b|);', 'b');
        assertWord('var x1 = new F<A>(a, b)|;', '');
        assertWord('var x1 = new F<A>(a, b)|;|', '');
        assertWord('var x1 = |  new F<A>(a, b)|;|', '');
    });
    test('Words Multiline', function () {
        assertWord('console.log("hello");\n|var x1 = new F<A>(a, b);', 'var');
        assertWord('console.log("hello");\n|\nvar x1 = new F<A>(a, b);', '');
        assertWord('console.log("hello");\n\r |var x1 = new F<A>(a, b);', 'var');
    });
    const onEnterBeforeRules = config.onEnterRules.map((r) => createRegex(r.beforeText));
    function assertBeforeRule(text, expectedMatch) {
        for (const reg of onEnterBeforeRules) {
            const start = new Date().getTime();
            assert.strictEqual(reg.test(text), expectedMatch);
            const totalTime = new Date().getTime() - start;
            assert.ok(totalTime < 200, `Evaluation of ${reg.source} on ${text} took ${totalTime}ms]`);
        }
    }
    test('OnEnter Before', function () {
        assertBeforeRule('<button attr1=val1 attr2=val2', false);
        assertBeforeRule('<button attr1=val1 attr2=val2>', true);
        assertBeforeRule('<button attr1=\'val1\' attr2="val2">', true);
        assertBeforeRule('<button attr1=val1 attr2=val2></button>', false);
    });
});
//# sourceMappingURL=words.test.js.map