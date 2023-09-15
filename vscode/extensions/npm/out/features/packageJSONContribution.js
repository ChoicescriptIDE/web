"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageJSONContribution = void 0;
const vscode_1 = require("vscode");
const cp = require("child_process");
const path_1 = require("path");
const date_1 = require("./date");
const LIMIT = 40;
const USER_AGENT = 'Visual Studio Code';
class PackageJSONContribution {
    getDocumentSelector() {
        return [{ language: 'json', scheme: '*', pattern: '**/package.json' }];
    }
    constructor(xhr, npmCommandPath) {
        this.xhr = xhr;
        this.npmCommandPath = npmCommandPath;
        this.mostDependedOn = ['lodash', 'async', 'underscore', 'request', 'commander', 'express', 'debug', 'chalk', 'colors', 'q', 'coffee-script',
            'mkdirp', 'optimist', 'through2', 'yeoman-generator', 'moment', 'bluebird', 'glob', 'gulp-util', 'minimist', 'cheerio', 'pug', 'redis', 'node-uuid',
            'socket', 'io', 'uglify-js', 'winston', 'through', 'fs-extra', 'handlebars', 'body-parser', 'rimraf', 'mime', 'semver', 'mongodb', 'jquery',
            'grunt', 'connect', 'yosay', 'underscore', 'string', 'xml2js', 'ejs', 'mongoose', 'marked', 'extend', 'mocha', 'superagent', 'js-yaml', 'xtend',
            'shelljs', 'gulp', 'yargs', 'browserify', 'minimatch', 'react', 'less', 'prompt', 'inquirer', 'ws', 'event-stream', 'inherits', 'mysql', 'esprima',
            'jsdom', 'stylus', 'when', 'readable-stream', 'aws-sdk', 'concat-stream', 'chai', 'Thenable', 'wrench'];
        this.knownScopes = ['@types', '@angular', '@babel', '@nuxtjs', '@vue', '@bazel'];
    }
    collectDefaultSuggestions(_resource, result) {
        const defaultValue = {
            'name': '${1:name}',
            'description': '${2:description}',
            'authors': '${3:author}',
            'version': '${4:1.0.0}',
            'main': '${5:pathToMain}',
            'dependencies': {}
        };
        const proposal = new vscode_1.CompletionItem(vscode_1.l10n.t("Default package.json"));
        proposal.kind = vscode_1.CompletionItemKind.Module;
        proposal.insertText = new vscode_1.SnippetString(JSON.stringify(defaultValue, null, '\t'));
        result.add(proposal);
        return Promise.resolve(null);
    }
    isEnabled() {
        return this.npmCommandPath || this.onlineEnabled();
    }
    onlineEnabled() {
        return !!vscode_1.workspace.getConfiguration('npm').get('fetchOnlinePackageInfo');
    }
    collectPropertySuggestions(_resource, location, currentWord, addValue, isLast, collector) {
        if (!this.isEnabled()) {
            return null;
        }
        if ((location.matches(['dependencies']) || location.matches(['devDependencies']) || location.matches(['optionalDependencies']) || location.matches(['peerDependencies']))) {
            let queryUrl;
            if (currentWord.length > 0) {
                if (currentWord[0] === '@') {
                    if (currentWord.indexOf('/') !== -1) {
                        return this.collectScopedPackages(currentWord, addValue, isLast, collector);
                    }
                    for (const scope of this.knownScopes) {
                        const proposal = new vscode_1.CompletionItem(scope);
                        proposal.kind = vscode_1.CompletionItemKind.Property;
                        proposal.insertText = new vscode_1.SnippetString().appendText(`"${scope}/`).appendTabstop().appendText('"');
                        proposal.filterText = JSON.stringify(scope);
                        proposal.documentation = '';
                        proposal.command = {
                            title: '',
                            command: 'editor.action.triggerSuggest'
                        };
                        collector.add(proposal);
                    }
                    collector.setAsIncomplete();
                }
                queryUrl = `https://registry.npmjs.org/-/v1/search?size=${LIMIT}&text=${encodeURIComponent(currentWord)}`;
                return this.xhr({
                    url: queryUrl,
                    headers: { agent: USER_AGENT }
                }).then((success) => {
                    if (success.status === 200) {
                        try {
                            const obj = JSON.parse(success.responseText);
                            if (obj && obj.objects && Array.isArray(obj.objects)) {
                                const results = obj.objects;
                                for (const result of results) {
                                    this.processPackage(result.package, addValue, isLast, collector);
                                }
                            }
                        }
                        catch (e) {
                            // ignore
                        }
                        collector.setAsIncomplete();
                    }
                    else {
                        collector.error(vscode_1.l10n.t("Request to the NPM repository failed: {0}", success.responseText));
                        return 0;
                    }
                    return undefined;
                }, (error) => {
                    collector.error(vscode_1.l10n.t("Request to the NPM repository failed: {0}", error.responseText));
                    return 0;
                });
            }
            else {
                this.mostDependedOn.forEach((name) => {
                    const insertText = new vscode_1.SnippetString().appendText(JSON.stringify(name));
                    if (addValue) {
                        insertText.appendText(': "').appendTabstop().appendText('"');
                        if (!isLast) {
                            insertText.appendText(',');
                        }
                    }
                    const proposal = new vscode_1.CompletionItem(name);
                    proposal.kind = vscode_1.CompletionItemKind.Property;
                    proposal.insertText = insertText;
                    proposal.filterText = JSON.stringify(name);
                    proposal.documentation = '';
                    collector.add(proposal);
                });
                this.collectScopedPackages(currentWord, addValue, isLast, collector);
                collector.setAsIncomplete();
                return Promise.resolve(null);
            }
        }
        return null;
    }
    collectScopedPackages(currentWord, addValue, isLast, collector) {
        const segments = currentWord.split('/');
        if (segments.length === 2 && segments[0].length > 1) {
            const scope = segments[0].substr(1);
            let name = segments[1];
            if (name.length < 4) {
                name = '';
            }
            const queryUrl = `https://registry.npmjs.com/-/v1/search?text=scope:${scope}%20${name}&size=250`;
            return this.xhr({
                url: queryUrl,
                headers: { agent: USER_AGENT }
            }).then((success) => {
                if (success.status === 200) {
                    try {
                        const obj = JSON.parse(success.responseText);
                        if (obj && Array.isArray(obj.objects)) {
                            const objects = obj.objects;
                            for (const object of objects) {
                                this.processPackage(object.package, addValue, isLast, collector);
                            }
                        }
                    }
                    catch (e) {
                        // ignore
                    }
                    collector.setAsIncomplete();
                }
                else {
                    collector.error(vscode_1.l10n.t("Request to the NPM repository failed: {0}", success.responseText));
                }
                return null;
            });
        }
        return Promise.resolve(null);
    }
    async collectValueSuggestions(resource, location, result) {
        if (!this.isEnabled()) {
            return null;
        }
        if ((location.matches(['dependencies', '*']) || location.matches(['devDependencies', '*']) || location.matches(['optionalDependencies', '*']) || location.matches(['peerDependencies', '*']))) {
            const currentKey = location.path[location.path.length - 1];
            if (typeof currentKey === 'string') {
                const info = await this.fetchPackageInfo(currentKey, resource);
                if (info && info.version) {
                    let name = JSON.stringify(info.version);
                    let proposal = new vscode_1.CompletionItem(name);
                    proposal.kind = vscode_1.CompletionItemKind.Property;
                    proposal.insertText = name;
                    proposal.documentation = vscode_1.l10n.t("The currently latest version of the package");
                    result.add(proposal);
                    name = JSON.stringify('^' + info.version);
                    proposal = new vscode_1.CompletionItem(name);
                    proposal.kind = vscode_1.CompletionItemKind.Property;
                    proposal.insertText = name;
                    proposal.documentation = vscode_1.l10n.t("Matches the most recent major version (1.x.x)");
                    result.add(proposal);
                    name = JSON.stringify('~' + info.version);
                    proposal = new vscode_1.CompletionItem(name);
                    proposal.kind = vscode_1.CompletionItemKind.Property;
                    proposal.insertText = name;
                    proposal.documentation = vscode_1.l10n.t("Matches the most recent minor version (1.2.x)");
                    result.add(proposal);
                }
            }
        }
        return null;
    }
    getDocumentation(description, version, time, homepage) {
        const str = new vscode_1.MarkdownString();
        if (description) {
            str.appendText(description);
        }
        if (version) {
            str.appendText('\n\n');
            str.appendText(time ? vscode_1.l10n.t("Latest version: {0} published {1}", version, (0, date_1.fromNow)(Date.parse(time), true, true)) : vscode_1.l10n.t("Latest version: {0}", version));
        }
        if (homepage) {
            str.appendText('\n\n');
            str.appendText(homepage);
        }
        return str;
    }
    resolveSuggestion(resource, item) {
        if (item.kind === vscode_1.CompletionItemKind.Property && !item.documentation) {
            let name = item.label;
            if (typeof name !== 'string') {
                name = name.label;
            }
            return this.fetchPackageInfo(name, resource).then(info => {
                if (info) {
                    item.documentation = this.getDocumentation(info.description, info.version, info.time, info.homepage);
                    return item;
                }
                return null;
            });
        }
        return null;
    }
    isValidNPMName(name) {
        // following rules from https://github.com/npm/validate-npm-package-name
        if (!name || name.length > 214 || name.match(/^[_.]/)) {
            return false;
        }
        const match = name.match(/^(?:@([^/]+?)[/])?([^/]+?)$/);
        if (match) {
            const scope = match[1];
            if (scope && encodeURIComponent(scope) !== scope) {
                return false;
            }
            const name = match[2];
            return encodeURIComponent(name) === name;
        }
        return false;
    }
    async fetchPackageInfo(pack, resource) {
        if (!this.isValidNPMName(pack)) {
            return undefined; // avoid unnecessary lookups
        }
        let info;
        if (this.npmCommandPath) {
            info = await this.npmView(this.npmCommandPath, pack, resource);
        }
        if (!info && this.onlineEnabled()) {
            info = await this.npmjsView(pack);
        }
        return info;
    }
    npmView(npmCommandPath, pack, resource) {
        return new Promise((resolve, _reject) => {
            const args = ['view', '--json', pack, 'description', 'dist-tags.latest', 'homepage', 'version', 'time'];
            const cwd = resource && resource.scheme === 'file' ? (0, path_1.dirname)(resource.fsPath) : undefined;
            cp.execFile(npmCommandPath, args, { cwd }, (error, stdout) => {
                if (!error) {
                    try {
                        const content = JSON.parse(stdout);
                        const version = content['dist-tags.latest'] || content['version'];
                        resolve({
                            description: content['description'],
                            version,
                            time: content.time?.[version],
                            homepage: content['homepage']
                        });
                        return;
                    }
                    catch (e) {
                        // ignore
                    }
                }
                resolve(undefined);
            });
        });
    }
    async npmjsView(pack) {
        const queryUrl = 'https://registry.npmjs.org/' + encodeURIComponent(pack);
        try {
            const success = await this.xhr({
                url: queryUrl,
                headers: { agent: USER_AGENT }
            });
            const obj = JSON.parse(success.responseText);
            const version = obj['dist-tags']?.latest || Object.keys(obj.versions).pop() || '';
            return {
                description: obj.description || '',
                version,
                time: obj.time?.[version],
                homepage: obj.homepage || ''
            };
        }
        catch (e) {
            //ignore
        }
        return undefined;
    }
    getInfoContribution(resource, location) {
        if (!this.isEnabled()) {
            return null;
        }
        if ((location.matches(['dependencies', '*']) || location.matches(['devDependencies', '*']) || location.matches(['optionalDependencies', '*']) || location.matches(['peerDependencies', '*']))) {
            const pack = location.path[location.path.length - 1];
            if (typeof pack === 'string') {
                return this.fetchPackageInfo(pack, resource).then(info => {
                    if (info) {
                        return [this.getDocumentation(info.description, info.version, info.time, info.homepage)];
                    }
                    return null;
                });
            }
        }
        return null;
    }
    processPackage(pack, addValue, isLast, collector) {
        if (pack && pack.name) {
            const name = pack.name;
            const insertText = new vscode_1.SnippetString().appendText(JSON.stringify(name));
            if (addValue) {
                insertText.appendText(': "');
                if (pack.version) {
                    insertText.appendVariable('version', pack.version);
                }
                else {
                    insertText.appendTabstop();
                }
                insertText.appendText('"');
                if (!isLast) {
                    insertText.appendText(',');
                }
            }
            const proposal = new vscode_1.CompletionItem(name);
            proposal.kind = vscode_1.CompletionItemKind.Property;
            proposal.insertText = insertText;
            proposal.filterText = JSON.stringify(name);
            proposal.documentation = this.getDocumentation(pack.description, pack.version, undefined, pack?.links?.homepage);
            collector.add(proposal);
        }
    }
}
exports.PackageJSONContribution = PackageJSONContribution;
//# sourceMappingURL=packageJSONContribution.js.map