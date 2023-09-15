"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerVideoPreviewSupport = void 0;
const vscode = require("vscode");
const mediaPreview_1 = require("./mediaPreview");
const dom_1 = require("./util/dom");
class VideoPreviewProvider {
    constructor(extensionRoot, binarySizeStatusBarEntry) {
        this.extensionRoot = extensionRoot;
        this.binarySizeStatusBarEntry = binarySizeStatusBarEntry;
    }
    async openCustomDocument(uri) {
        return { uri, dispose: () => { } };
    }
    async resolveCustomEditor(document, webviewEditor) {
        new VideoPreview(this.extensionRoot, document.uri, webviewEditor, this.binarySizeStatusBarEntry);
    }
}
VideoPreviewProvider.viewType = 'vscode.videoPreview';
class VideoPreview extends mediaPreview_1.MediaPreview {
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
        const configurations = vscode.workspace.getConfiguration('mediaPreview.video');
        const settings = {
            src: await this.getResourcePath(this.webviewEditor, this.resource, version),
            autoplay: configurations.get('autoPlay'),
            loop: configurations.get('loop'),
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

	<title>Video Preview</title>

	<link rel="stylesheet" href="${(0, dom_1.escapeAttribute)(this.extensionResource('media', 'videoPreview.css'))}" type="text/css" media="screen" nonce="${nonce}">

	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: ${cspSource}; media-src ${cspSource}; script-src 'nonce-${nonce}'; style-src ${cspSource} 'nonce-${nonce}';">
	<meta id="settings" data-settings="${(0, dom_1.escapeAttribute)(JSON.stringify(settings))}">
</head>
<body class="loading" data-vscode-context='{ "preventDefaultContextMenuItems": true }'>
	<div class="loading-indicator"></div>
	<div class="loading-error">
		<p>${vscode.l10n.t("An error occurred while loading the video file.")}</p>
		<a href="#" class="open-file-link">${vscode.l10n.t("Open file using VS Code's standard text/binary editor?")}</a>
	</div>
	<script src="${(0, dom_1.escapeAttribute)(this.extensionResource('media', 'videoPreview.js'))}" nonce="${nonce}"></script>
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
function registerVideoPreviewSupport(context, binarySizeStatusBarEntry) {
    const provider = new VideoPreviewProvider(context.extensionUri, binarySizeStatusBarEntry);
    return vscode.window.registerCustomEditorProvider(VideoPreviewProvider.viewType, provider, {
        supportsMultipleEditorsPerDocument: true,
        webviewOptions: {
            retainContextWhenHidden: true,
        }
    });
}
exports.registerVideoPreviewSupport = registerVideoPreviewSupport;
//# sourceMappingURL=videoPreview.js.map