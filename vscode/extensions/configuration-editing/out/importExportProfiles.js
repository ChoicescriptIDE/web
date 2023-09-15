"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path_1 = require("path");
const net_1 = require("./node/net");
class GitHubGistProfileContentHandler {
    constructor() {
        this.name = vscode.l10n.t('GitHub');
        this.description = vscode.l10n.t('gist');
    }
    getOctokit() {
        if (!this._octokit) {
            this._octokit = (async () => {
                const session = await vscode.authentication.getSession('github', ['gist', 'user:email'], { createIfNone: true });
                const token = session.accessToken;
                const { Octokit } = await Promise.resolve().then(() => require('@octokit/rest'));
                return new Octokit({
                    request: { agent: net_1.agent },
                    userAgent: 'GitHub VSCode',
                    auth: `token ${token}`
                });
            })();
        }
        return this._octokit;
    }
    async saveProfile(name, content) {
        const octokit = await this.getOctokit();
        const result = await octokit.gists.create({
            public: false,
            files: {
                [name]: {
                    content
                }
            }
        });
        if (result.data.id && result.data.html_url) {
            const link = vscode.Uri.parse(result.data.html_url);
            return { id: result.data.id, link };
        }
        return null;
    }
    getPublicOctokit() {
        if (!this._public_octokit) {
            this._public_octokit = (async () => {
                const { Octokit } = await Promise.resolve().then(() => require('@octokit/rest'));
                return new Octokit({ request: { agent: net_1.agent }, userAgent: 'GitHub VSCode' });
            })();
        }
        return this._public_octokit;
    }
    async readProfile(arg) {
        const gist_id = typeof arg === 'string' ? arg : (0, path_1.basename)(arg.path);
        const octokit = await this.getPublicOctokit();
        try {
            const gist = await octokit.gists.get({ gist_id });
            if (gist.data.files) {
                return gist.data.files[Object.keys(gist.data.files)[0]]?.content ?? null;
            }
        }
        catch (error) {
            // ignore
        }
        return null;
    }
}
vscode.window.registerProfileContentHandler('github', new GitHubGistProfileContentHandler());
//# sourceMappingURL=importExportProfiles.js.map