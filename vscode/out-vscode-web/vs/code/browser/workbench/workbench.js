/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["vs/code/browser/workbench/workbench","require","exports","vs/base/browser/browser","vs/base/common/marshalling","vs/base/common/event","vs/base/common/lifecycle","vs/base/common/network","vs/base/common/resources","vs/base/common/uri","vs/platform/product/common/product","vs/platform/window/common/window","vs/workbench/workbench.web.main","vs/base/common/path","vs/base/common/strings"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[0/*vs/code/browser/workbench/workbench*/], __M([1/*require*/,2/*exports*/,3/*vs/base/browser/browser*/,4/*vs/base/common/marshalling*/,5/*vs/base/common/event*/,6/*vs/base/common/lifecycle*/,7/*vs/base/common/network*/,8/*vs/base/common/resources*/,9/*vs/base/common/uri*/,10/*vs/platform/product/common/product*/,11/*vs/platform/window/common/window*/,12/*vs/workbench/workbench.web.main*/,13/*vs/base/common/path*/,14/*vs/base/common/strings*/]), function (require, exports, browser_1, marshalling_1, event_1, lifecycle_1, network_1, resources_1, uri_1, product_1, window_1, workbench_web_main_1, path_1, strings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocalStorageSecretStorageProvider {
        static { this.a = 'secrets.provider'; }
        constructor() {
            this.type = 'persisted';
            let authSessionInfo;
            const authSessionElement = document.getElementById('vscode-workbench-auth-session');
            const authSessionElementAttribute = authSessionElement ? authSessionElement.getAttribute('data-settings') : undefined;
            if (authSessionElementAttribute) {
                try {
                    authSessionInfo = JSON.parse(authSessionElementAttribute);
                }
                catch (error) { /* Invalid session is passed. Ignore. */ }
            }
            if (authSessionInfo) {
                // Settings Sync Entry
                this.set(`${product_1.default.urlProtocol}.loginAccount`, JSON.stringify(authSessionInfo));
                // Auth extension Entry
                if (authSessionInfo.providerId !== 'github') {
                    console.error(`Unexpected auth provider: ${authSessionInfo.providerId}. Expected 'github'.`);
                    return;
                }
                const authAccount = JSON.stringify({ extensionId: 'vscode.github-authentication', key: 'github.auth' });
                this.set(authAccount, JSON.stringify(authSessionInfo.scopes.map(scopes => ({
                    id: authSessionInfo.id,
                    scopes,
                    accessToken: authSessionInfo.accessToken
                }))));
            }
        }
        get(key) {
            return Promise.resolve(this.c[key]);
        }
        set(key, value) {
            this.c[key] = value;
            this.d();
            return Promise.resolve();
        }
        async delete(key) {
            delete this.c[key];
            this.d();
            return Promise.resolve();
        }
        get c() {
            if (!this.b) {
                try {
                    const serializedCredentials = window.localStorage.getItem(LocalStorageSecretStorageProvider.a);
                    if (serializedCredentials) {
                        this.b = JSON.parse(serializedCredentials);
                    }
                }
                catch (error) {
                    // ignore
                }
                if (!(this.b instanceof Object)) {
                    this.b = {};
                }
            }
            return this.b;
        }
        d() {
            window.localStorage.setItem(LocalStorageSecretStorageProvider.a, JSON.stringify(this.c));
        }
    }
    class LocalStorageURLCallbackProvider extends lifecycle_1.$lb {
        static { this.a = 0; }
        static { this.b = [
            'scheme',
            'authority',
            'path',
            'query',
            'fragment'
        ]; }
        constructor(j) {
            super();
            this.j = j;
            this.c = this.B(new event_1.$8c());
            this.onCallback = this.c.event;
            this.f = new Set();
            this.g = Date.now();
            this.h = undefined;
        }
        create(options = {}) {
            const id = ++LocalStorageURLCallbackProvider.a;
            const queryParams = [`vscode-reqid=${id}`];
            for (const key of LocalStorageURLCallbackProvider.b) {
                const value = options[key];
                if (value) {
                    queryParams.push(`vscode-${key}=${encodeURIComponent(value)}`);
                }
            }
            // TODO@joao remove eventually
            // https://github.com/microsoft/vscode-dev/issues/62
            // https://github.com/microsoft/vscode/blob/159479eb5ae451a66b5dac3c12d564f32f454796/extensions/github-authentication/src/githubServer.ts#L50-L50
            if (!(options.authority === 'vscode.github-authentication' && options.path === '/dummy')) {
                const key = `vscode-web.url-callbacks[${id}]`;
                window.localStorage.removeItem(key);
                this.f.add(id);
                this.k();
            }
            return uri_1.URI.parse(window.location.href).with({ path: this.j, query: queryParams.join('&') });
        }
        k() {
            if (this.i) {
                return;
            }
            const fn = () => this.m();
            window.addEventListener('storage', fn);
            this.i = { dispose: () => window.removeEventListener('storage', fn) };
        }
        l() {
            this.i?.dispose();
            this.i = undefined;
        }
        // this fires every time local storage changes, but we
        // don't want to check more often than once a second
        async m() {
            const ellapsed = Date.now() - this.g;
            if (ellapsed > 1000) {
                this.n();
            }
            else if (this.h === undefined) {
                this.h = setTimeout(() => {
                    this.h = undefined;
                    this.n();
                }, 1000 - ellapsed);
            }
        }
        n() {
            let pendingCallbacks;
            for (const id of this.f) {
                const key = `vscode-web.url-callbacks[${id}]`;
                const result = window.localStorage.getItem(key);
                if (result !== null) {
                    try {
                        this.c.fire(uri_1.URI.revive(JSON.parse(result)));
                    }
                    catch (error) {
                        console.error(error);
                    }
                    pendingCallbacks = pendingCallbacks ?? new Set(this.f);
                    pendingCallbacks.delete(id);
                    window.localStorage.removeItem(key);
                }
            }
            if (pendingCallbacks) {
                this.f = pendingCallbacks;
                if (this.f.size === 0) {
                    this.l();
                }
            }
            this.g = Date.now();
        }
    }
    class WorkspaceProvider {
        static { this.a = 'ew'; }
        static { this.b = 'folder'; }
        static { this.c = 'workspace'; }
        static { this.d = 'payload'; }
        static create(config) {
            let foundWorkspace = false;
            let workspace;
            let payload = Object.create(null);
            const query = new URL(document.location.href).searchParams;
            query.forEach((value, key) => {
                switch (key) {
                    // Folder
                    case WorkspaceProvider.b:
                        if (config.remoteAuthority && value.startsWith(path_1.$0b.sep)) {
                            // when connected to a remote and having a value
                            // that is a path (begins with a `/`), assume this
                            // is a vscode-remote resource as simplified URL.
                            workspace = { folderUri: uri_1.URI.from({ scheme: network_1.Schemas.vscodeRemote, path: value, authority: config.remoteAuthority }) };
                        }
                        else {
                            workspace = { folderUri: uri_1.URI.parse(value) };
                        }
                        foundWorkspace = true;
                        break;
                    // Workspace
                    case WorkspaceProvider.c:
                        if (config.remoteAuthority && value.startsWith(path_1.$0b.sep)) {
                            // when connected to a remote and having a value
                            // that is a path (begins with a `/`), assume this
                            // is a vscode-remote resource as simplified URL.
                            workspace = { workspaceUri: uri_1.URI.from({ scheme: network_1.Schemas.vscodeRemote, path: value, authority: config.remoteAuthority }) };
                        }
                        else {
                            workspace = { workspaceUri: uri_1.URI.parse(value) };
                        }
                        foundWorkspace = true;
                        break;
                    // Empty
                    case WorkspaceProvider.a:
                        workspace = undefined;
                        foundWorkspace = true;
                        break;
                    // Payload
                    case WorkspaceProvider.d:
                        try {
                            payload = (0, marshalling_1.$Tg)(value); // use marshalling#parse() to revive potential URIs
                        }
                        catch (error) {
                            console.error(error); // possible invalid JSON
                        }
                        break;
                }
            });
            // If no workspace is provided through the URL, check for config
            // attribute from server
            if (!foundWorkspace) {
                if (config.folderUri) {
                    workspace = { folderUri: uri_1.URI.revive(config.folderUri) };
                }
                else if (config.workspaceUri) {
                    workspace = { workspaceUri: uri_1.URI.revive(config.workspaceUri) };
                }
            }
            return new WorkspaceProvider(workspace, payload, config);
        }
        constructor(workspace, payload, e) {
            this.workspace = workspace;
            this.payload = payload;
            this.e = e;
            this.trusted = true;
        }
        async open(workspace, options) {
            if (options?.reuse && !options.payload && this.h(this.workspace, workspace)) {
                return true; // return early if workspace and environment is not changing and we are reusing window
            }
            const targetHref = this.f(workspace, options);
            if (targetHref) {
                if (options?.reuse) {
                    window.location.href = targetHref;
                    return true;
                }
                else {
                    let result;
                    if ((0, browser_1.$KN)()) {
                        result = window.open(targetHref, '_blank', 'toolbar=no'); // ensures to open another 'standalone' window!
                    }
                    else {
                        result = window.open(targetHref);
                    }
                    return !!result;
                }
            }
            return false;
        }
        f(workspace, options) {
            // Empty
            let targetHref = undefined;
            if (!workspace) {
                targetHref = `${document.location.origin}${document.location.pathname}?${WorkspaceProvider.a}=true`;
            }
            // Folder
            else if ((0, window_1.$zD)(workspace)) {
                const queryParamFolder = this.g(workspace.folderUri);
                targetHref = `${document.location.origin}${document.location.pathname}?${WorkspaceProvider.b}=${queryParamFolder}`;
            }
            // Workspace
            else if ((0, window_1.$yD)(workspace)) {
                const queryParamWorkspace = this.g(workspace.workspaceUri);
                targetHref = `${document.location.origin}${document.location.pathname}?${WorkspaceProvider.c}=${queryParamWorkspace}`;
            }
            // Append payload if any
            if (options?.payload) {
                targetHref += `&${WorkspaceProvider.d}=${encodeURIComponent(JSON.stringify(options.payload))}`;
            }
            return targetHref;
        }
        g(uri) {
            if (this.e.remoteAuthority && uri.scheme === network_1.Schemas.vscodeRemote) {
                // when connected to a remote and having a folder
                // or workspace for that remote, only use the path
                // as query value to form shorter, nicer URLs.
                // however, we still need to `encodeURIComponent`
                // to ensure to preserve special characters, such
                // as `+` in the path.
                return encodeURIComponent(`${path_1.$0b.sep}${(0, strings_1.$sd)(uri.path, path_1.$0b.sep)}`).replaceAll('%2F', '/');
            }
            return encodeURIComponent(uri.toString(true));
        }
        h(workspaceA, workspaceB) {
            if (!workspaceA || !workspaceB) {
                return workspaceA === workspaceB; // both empty
            }
            if ((0, window_1.$zD)(workspaceA) && (0, window_1.$zD)(workspaceB)) {
                return (0, resources_1.$Yf)(workspaceA.folderUri, workspaceB.folderUri); // same workspace
            }
            if ((0, window_1.$yD)(workspaceA) && (0, window_1.$yD)(workspaceB)) {
                return (0, resources_1.$Yf)(workspaceA.workspaceUri, workspaceB.workspaceUri); // same workspace
            }
            return false;
        }
        hasRemote() {
            if (this.workspace) {
                if ((0, window_1.$zD)(this.workspace)) {
                    return this.workspace.folderUri.scheme === network_1.Schemas.vscodeRemote;
                }
                if ((0, window_1.$yD)(this.workspace)) {
                    return this.workspace.workspaceUri.scheme === network_1.Schemas.vscodeRemote;
                }
            }
            return true;
        }
    }
    (function () {
        // Find config by checking for DOM
        const configElement = document.getElementById('vscode-workbench-web-configuration');
        const configElementAttribute = configElement ? configElement.getAttribute('data-settings') : undefined;
        if (!configElement || !configElementAttribute) {
            throw new Error('Missing web configuration element');
        }
        const config = JSON.parse(configElementAttribute);
        // Create workbench
        (0, workbench_web_main_1.create)(document.body, {
            ...config,
            windowIndicator: config.windowIndicator ?? { label: '$(remote)', tooltip: `${product_1.default.nameShort} Web` },
            settingsSyncOptions: config.settingsSyncOptions ? { enabled: config.settingsSyncOptions.enabled, } : undefined,
            workspaceProvider: WorkspaceProvider.create(config),
            urlCallbackProvider: new LocalStorageURLCallbackProvider(config.callbackRoute),
            secretStorageProvider: config.remoteAuthority ? undefined /* with a remote, we don't use a local secret storage provider */ : new LocalStorageSecretStorageProvider()
        });
    })();
});

}).call(this);
//# sourceMappingURL=workbench.js.map
