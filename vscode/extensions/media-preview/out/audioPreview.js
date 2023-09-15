"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAudioPreviewSupport = void 0;
const vscode = require("vscode");
const mediaPreview_1 = require("./mediaPreview");
const dom_1 = require("./util/dom");
class AudioPreviewProvider {
    constructor(extensionRoot, binarySizeStatusBarEntry) {
        this.extensionRoot = extensionRoot;
        this.binarySizeStatusBarEntry = binarySizeStatusBarEntry;
    }
    async openCustomDocument(uri) {
        return { uri, dispose: () => { } };
    }
    async resolveCustomEditor(document, webviewEditor) {
        new AudioPreview(this.extensionRoot, document.uri, webviewEditor, this.binarySizeStatusBarEntry);
    }
}
AudioPreviewProvider.viewType = 'vscode.audioPreview';
class AudioPreview extends mediaPreview_1.MediaPreview {
    constructor(extensionRoot, resource, webviewEditor, binarySizeStatusBarEntry) {
        super(extensionRoot, resource, webviewEditor, binarySizeStatusBarEntry);
        this.extensionRoot = extensionRoot;
        this._register(webviewEditor.webview.onDidReceiveMessage(message => {
            switch (message.type) {
                case 'reopen-as-text': {
                    (0, mediaPreview_1.reopenAsText)(resource, webviewEditor.viewColumn);
                    break;
                }
            }
        }));
        this.updateBinarySize();
        this.render();
        this.updateState();
    }
    async getWebviewContents() {
        const version = Date.now().toString();
        const settings = {
            src: await this.getResourcePath(this.webviewEditor, this.resource, version),
        };
        const nonce = (0, dom_1.getNonce)();
        const cspSource = this.webviewEditor.webview.cspSource;
        return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">

	<!-- Disable pinch zooming -->
	<meta name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">

	<title>Audio Preview</title>

	<link rel="stylesheet" href="${(0, dom_1.escapeAttribute)(this.extensionResource('media', 'audioPreview.css'))}" type="text/css" media="screen" nonce="${nonce}">

	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: ${cspSource}; media-src ${cspSource}; script-src 'nonce-${nonce}'; style-src ${cspSource} 'nonce-${nonce}';">
	<meta id="settings" data-settings="${(0, dom_1.escapeAttribute)(JSON.stringify(settings))}">
</head>
<body class="container loading" data-vscode-context='{ "preventDefaultContextMenuItems": true }'>
	<div class="loading-indicator"></div>
	<div class="loading-error">
		<p>${vscode.l10n.t("An error occurred while loading the audio file.")}</p>
		<a href="#" class="open-file-link">${vscode.l10n.t("Open file using VS Code's standard text/binary editor?")}</a>
	</div>
	<script src="${(0, dom_1.escapeAttribute)(this.extensionResource('media', 'audioPreview.js'))}" nonce="${nonce}"></script>
</body>
</html>`;
    }
    async getResourcePath(webviewEditor, resource, version) {
        if (resource.scheme === 'git') {
            const stat = await vscode.workspace.fs.stat(resource);
            if (stat.size === 0) {
                // The file is stored on git lfs
                return null;
            }
        }
        // Avoid adding cache busting if there is already a query string
        if (resource.query) {
            return webviewEditor.webview.asWebviewUri(resource).toString();
        }
        return webviewEditor.webview.asWebviewUri(resource).with({ query: `version=${version}` }).toString();
    }
    extensionResource(...parts) {
        return this.webviewEditor.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionRoot, ...parts));
    }
}
function registerAudioPreviewSupport(context, binarySizeStatusBarEntry) {
    const provider = new AudioPreviewProvider(context.extensionUri, binarySizeStatusBarEntry);
    return vscode.window.registerCustomEditorProvider(AudioPreviewProvider.viewType, provider, {
        supportsMultipleEditorsPerDocument: true,
        webviewOptions: {
            retainContextWhenHidden: true,
        }
    });
}
exports.registerAudioPreviewSupport = registerAudioPreviewSupport;
//# sourceMappingURL=audioPreview.js.map