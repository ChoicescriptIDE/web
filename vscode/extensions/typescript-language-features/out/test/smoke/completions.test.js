"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const vscode = require("vscode");
const suggestTestHelpers_1 = require("../../test/suggestTestHelpers");
const testUtils_1 = require("../../test/testUtils");
const dispose_1 = require("../../utils/dispose");
const testDocumentUri = vscode.Uri.parse('untitled:test.ts');
const insertModes = Object.freeze(['insert', 'replace']);
suite.skip('TypeScript Completions', () => {
    const configDefaults = Object.freeze({
        [testUtils_1.Config.autoClosingBrackets]: 'always',
        [testUtils_1.Config.typescriptCompleteFunctionCalls]: false,
        [testUtils_1.Config.insertMode]: 'insert',
        [testUtils_1.Config.snippetSuggestions]: 'none',
        [testUtils_1.Config.suggestSelection]: 'first',
        [testUtils_1.Config.javascriptQuoteStyle]: 'double',
        [testUtils_1.Config.typescriptQuoteStyle]: 'double',
    });
    const _disposables = [];
    let oldConfig = {};
    setup(async () => {
        // the tests assume that typescript features are registered
        await vscode.extensions.getExtension('vscode.typescript-language-features').activate();
        // Save off config and apply defaults
        oldConfig = await (0, testUtils_1.updateConfig)(testDocumentUri, configDefaults);
    });
    teardown(async () => {
        (0, dispose_1.disposeAll)(_disposables);
        // Restore config
        await (0, testUtils_1.updateConfig)(testDocumentUri, oldConfig);
        return vscode.commands.executeCommand('workbench.action.closeAllEditors');
    });
    test('Basic var completion', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `const abcdef = 123;`, `ab$0;`);
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`const abcdef = 123;`, `abcdef;`), `config: ${config}`);
        });
    });
    test('Should treat period as commit character for var completions', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `const abcdef = 123;`, `ab$0;`);
            await (0, suggestTestHelpers_1.typeCommitCharacter)(testDocumentUri, '.', _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`const abcdef = 123;`, `abcdef.;`), `config: ${config}`);
        });
    });
    test('Should treat paren as commit character for function completions', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `function abcdef() {};`, `ab$0;`);
            await (0, suggestTestHelpers_1.typeCommitCharacter)(testDocumentUri, '(', _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`function abcdef() {};`, `abcdef();`), `config: ${config}`);
        });
    });
    test('Should insert brackets when completing dot properties with spaces in name', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, 'const x = { "hello world": 1 };', 'x.$0');
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)('const x = { "hello world": 1 };', 'x["hello world"]'), `config: ${config}`);
        });
    });
    test('Should allow commit characters for backet completions', async () => {
        for (const { char, insert } of [
            { char: '.', insert: '.' },
            { char: '(', insert: '()' },
        ]) {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, 'const x = { "hello world2": 1 };', 'x.$0');
            await (0, suggestTestHelpers_1.typeCommitCharacter)(testDocumentUri, char, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)('const x = { "hello world2": 1 };', `x["hello world2"]${insert}`));
            (0, dispose_1.disposeAll)(_disposables);
            await vscode.commands.executeCommand('workbench.action.closeAllEditors');
        }
    });
    test('Should not prioritize bracket accessor completions. #63100', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            // 'a' should be first entry in completion list
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, 'const x = { "z-z": 1, a: 1 };', 'x.$0');
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)('const x = { "z-z": 1, a: 1 };', 'x.a'), `config: ${config}`);
        });
    });
    test('Accepting a string completion should replace the entire string. #53962', async () => {
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, 'interface TFunction {', `  (_: 'abc.abc2', __ ?: {}): string;`, `  (_: 'abc.abc', __?: {}): string;`, `}`, 'const f: TFunction = (() => { }) as any;', `f('abc.abc$0')`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)('interface TFunction {', `  (_: 'abc.abc2', __ ?: {}): string;`, `  (_: 'abc.abc', __?: {}): string;`, `}`, 'const f: TFunction = (() => { }) as any;', `f('abc.abc')`));
    });
    test('completeFunctionCalls should complete function parameters when at end of word', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.typescriptCompleteFunctionCalls]: true });
        // Complete with-in word
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `function abcdef(x, y, z) { }`, `abcdef$0`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`function abcdef(x, y, z) { }`, `abcdef(x, y, z)`));
    });
    test.skip('completeFunctionCalls should complete function parameters when within word', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.typescriptCompleteFunctionCalls]: true });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `function abcdef(x, y, z) { }`, `abcd$0ef`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`function abcdef(x, y, z) { }`, `abcdef(x, y, z)`));
    });
    test('completeFunctionCalls should not complete function parameters at end of word if we are already in something that looks like a function call, #18131', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.typescriptCompleteFunctionCalls]: true });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `function abcdef(x, y, z) { }`, `abcdef$0(1, 2, 3)`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`function abcdef(x, y, z) { }`, `abcdef(1, 2, 3)`));
    });
    test.skip('completeFunctionCalls should not complete function parameters within word if we are already in something that looks like a function call, #18131', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.typescriptCompleteFunctionCalls]: true });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `function abcdef(x, y, z) { }`, `abcd$0ef(1, 2, 3)`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`function abcdef(x, y, z) { }`, `abcdef(1, 2, 3)`));
    });
    test('should not de-prioritize `this.member` suggestion, #74164', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class A {`, `  private detail = '';`, `  foo() {`, `    det$0`, `  }`, `}`);
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class A {`, `  private detail = '';`, `  foo() {`, `    this.detail`, `  }`, `}`), `Config: ${config}`);
        });
    });
    test('Member completions for string property name should insert `this.` and use brackets', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class A {`, `  ['xyz 123'] = 1`, `  foo() {`, `    xyz$0`, `  }`, `}`);
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class A {`, `  ['xyz 123'] = 1`, `  foo() {`, `    this["xyz 123"]`, `  }`, `}`), `Config: ${config}`);
        });
    });
    test('Member completions for string property name already using `this.` should add brackets', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class A {`, `  ['xyz 123'] = 1`, `  foo() {`, `    this.xyz$0`, `  }`, `}`);
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class A {`, `  ['xyz 123'] = 1`, `  foo() {`, `    this["xyz 123"]`, `  }`, `}`), `Config: ${config}`);
        });
    });
    test('Accepting a completion in word using `insert` mode should insert', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.insertMode]: 'insert' });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `const abc = 123;`, `ab$0c`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`const abc = 123;`, `abcc`));
    });
    test('Accepting a completion in word using `replace` mode should replace', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.insertMode]: 'replace' });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `const abc = 123;`, `ab$0c`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`const abc = 123;`, `abc`));
    });
    test('Accepting a member completion in word using `insert` mode add `this.` and insert', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.insertMode]: 'insert' });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class Foo {`, `  abc = 1;`, `  foo() {`, `    ab$0c`, `  }`, `}`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class Foo {`, `  abc = 1;`, `  foo() {`, `    this.abcc`, `  }`, `}`));
    });
    test('Accepting a member completion in word using `replace` mode should add `this.` and replace', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.insertMode]: 'replace' });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class Foo {`, `  abc = 1;`, `  foo() {`, `    ab$0c`, `  }`, `}`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class Foo {`, `  abc = 1;`, `  foo() {`, `    this.abc`, `  }`, `}`));
    });
    test('Accepting string completion inside string using `insert` mode should insert', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.insertMode]: 'insert' });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `const abc = { 'xy z': 123 }`, `abc["x$0y w"]`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`const abc = { 'xy z': 123 }`, `abc["xy zy w"]`));
    });
    // Waiting on https://github.com/microsoft/TypeScript/issues/35602
    test.skip('Accepting string completion inside string using insert mode should insert', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.insertMode]: 'replace' });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `const abc = { 'xy z': 123 }`, `abc["x$0y w"]`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`const abc = { 'xy z': 123 }`, `abc["xy w"]`));
    });
    test('Private field completions on `this.#` should work', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class A {`, `  #xyz = 1;`, `  foo() {`, `    this.#$0`, `  }`, `}`);
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class A {`, `  #xyz = 1;`, `  foo() {`, `    this.#xyz`, `  }`, `}`), `Config: ${config}`);
        });
    });
    test('Private field completions on `#` should insert `this.`', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class A {`, `  #xyz = 1;`, `  foo() {`, `    #$0`, `  }`, `}`);
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class A {`, `  #xyz = 1;`, `  foo() {`, `    this.#xyz`, `  }`, `}`), `Config: ${config}`);
        });
    });
    test('Private field completions should not require strict prefix match (#89556)', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class A {`, `  #xyz = 1;`, `  foo() {`, `    this.xyz$0`, `  }`, `}`);
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class A {`, `  #xyz = 1;`, `  foo() {`, `    this.#xyz`, `  }`, `}`), `Config: ${config}`);
        });
    });
    test('Private field completions without `this.` should not require strict prefix match (#89556)', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class A {`, `  #xyz = 1;`, `  foo() {`, `    xyz$0`, `  }`, `}`);
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class A {`, `  #xyz = 1;`, `  foo() {`, `    this.#xyz`, `  }`, `}`), `Config: ${config}`);
        });
    });
    test('Accepting a completion for async property in `insert` mode should insert and add await', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.insertMode]: 'insert' });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class A {`, `  xyz = Promise.resolve({ 'abc': 1 });`, `  async foo() {`, `    this.xyz.ab$0c`, `  }`, `}`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class A {`, `  xyz = Promise.resolve({ 'abc': 1 });`, `  async foo() {`, `    (await this.xyz).abcc`, `  }`, `}`));
    });
    test('Accepting a completion for async property in `replace` mode should replace and add await', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.insertMode]: 'replace' });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class A {`, `  xyz = Promise.resolve({ 'abc': 1 });`, `  async foo() {`, `    this.xyz.ab$0c`, `  }`, `}`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class A {`, `  xyz = Promise.resolve({ 'abc': 1 });`, `  async foo() {`, `    (await this.xyz).abc`, `  }`, `}`));
    });
    test.skip('Accepting a completion for async string property should add await plus brackets', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, insertModes, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class A {`, `  xyz = Promise.resolve({ 'ab c': 1 });`, `  async foo() {`, `    this.xyz.ab$0`, `  }`, `}`);
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class A {`, `  xyz = Promise.resolve({ 'abc': 1 });`, `  async foo() {`, `    (await this.xyz)["ab c"]`, `  }`, `}`), `Config: ${config}`);
        });
    });
    test('Replace should work after this. (#91105)', async () => {
        await (0, testUtils_1.updateConfig)(testDocumentUri, { [testUtils_1.Config.insertMode]: 'replace' });
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `class A {`, `  abc = 1`, `  foo() {`, `    this.$0abc`, `  }`, `}`);
        await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
        (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`class A {`, `  abc = 1`, `  foo() {`, `    this.abc`, `  }`, `}`));
    });
});
//# sourceMappingURL=completions.test.js.map