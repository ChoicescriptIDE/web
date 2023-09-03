"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionStatus = void 0;
const vscode = require("vscode");
const selectTypeScriptVersion_1 = require("../commands/selectTypeScriptVersion");
const languageIds_1 = require("../configuration/languageIds");
const dispose_1 = require("../utils/dispose");
class VersionStatus extends dispose_1.Disposable {
    constructor(_client) {
        super();
        this._client = _client;
        this._statusItem = this._register(vscode.languages.createLanguageStatusItem('typescript.version', languageIds_1.jsTsLanguageModes));
        this._statusItem.name = vscode.l10n.t("TypeScript Version");
        this._statusItem.detail = vscode.l10n.t("TypeScript Version");
        this._register(this._client.onTsServerStarted(({ version }) => this.onDidChangeTypeScriptVersion(version)));
    }
    onDidChangeTypeScriptVersion(version) {
        this._statusItem.text = version.displayName;
        this._statusItem.command = {
            command: selectTypeScriptVersion_1.SelectTypeScriptVersionCommand.id,
            title: vscode.l10n.t("Select Version"),
            tooltip: version.path
        };
    }
}
exports.VersionStatus = VersionStatus;
//# sourceMappingURL=versionStatus.js.map