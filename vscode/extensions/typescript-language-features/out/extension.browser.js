"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const extension_telemetry_1 = require("@vscode/extension-telemetry");
const vscode = require("vscode");
const api_1 = require("./api");
const commandManager_1 = require("./commands/commandManager");
const index_1 = require("./commands/index");
const experimentTelemetryReporter_1 = require("./experimentTelemetryReporter");
const lazyClientHost_1 = require("./lazyClientHost");
const remoteRepositories_browser_1 = require("./remoteRepositories.browser");
const api_2 = require("./tsServer/api");
const cancellation_1 = require("./tsServer/cancellation");
const logDirectoryProvider_1 = require("./tsServer/logDirectoryProvider");
const serverProcess_browser_1 = require("./tsServer/serverProcess.browser");
const versionProvider_1 = require("./tsServer/versionProvider");
const activeJsTsEditorTracker_1 = require("./ui/activeJsTsEditorTracker");
const configuration_browser_1 = require("./configuration/configuration.browser");
const logger_1 = require("./logging/logger");
const packageInfo_1 = require("./utils/packageInfo");
const platform_1 = require("./utils/platform");
const plugins_1 = require("./tsServer/plugins");
const dispose_1 = require("./utils/dispose");
class StaticVersionProvider {
    constructor(_version) {
        this._version = _version;
        this.globalVersion = undefined;
        this.localVersion = undefined;
        this.localVersions = [];
    }
    updateConfiguration(_configuration) {
        // noop
    }
    get defaultVersion() { return this._version; }
    get bundledVersion() { return this._version; }
}
async function activate(context) {
    const pluginManager = new plugins_1.PluginManager();
    context.subscriptions.push(pluginManager);
    const commandManager = new commandManager_1.CommandManager();
    context.subscriptions.push(commandManager);
    const onCompletionAccepted = new vscode.EventEmitter();
    context.subscriptions.push(onCompletionAccepted);
    const activeJsTsEditorTracker = new activeJsTsEditorTracker_1.ActiveJsTsEditorTracker();
    context.subscriptions.push(activeJsTsEditorTracker);
    const versionProvider = new StaticVersionProvider(new versionProvider_1.TypeScriptVersion("bundled" /* TypeScriptVersionSource.Bundled */, vscode.Uri.joinPath(context.extensionUri, 'dist/browser/typescript/tsserver.web.js').toString(), api_2.API.fromSimpleString('5.1.3')));
    let experimentTelemetryReporter;
    const packageInfo = (0, packageInfo_1.getPackageInfo)(context);
    if (packageInfo) {
        const { aiKey } = packageInfo;
        const vscTelemetryReporter = new extension_telemetry_1.default(aiKey);
        experimentTelemetryReporter = new experimentTelemetryReporter_1.ExperimentationTelemetryReporter(vscTelemetryReporter);
        context.subscriptions.push(experimentTelemetryReporter);
    }
    const logger = new logger_1.Logger();
    const lazyClientHost = (0, lazyClientHost_1.createLazyClientHost)(context, false, {
        pluginManager,
        commandManager,
        logDirectoryProvider: logDirectoryProvider_1.noopLogDirectoryProvider,
        cancellerFactory: cancellation_1.noopRequestCancellerFactory,
        versionProvider,
        processFactory: new serverProcess_browser_1.WorkerServerProcessFactory(context.extensionUri, logger),
        activeJsTsEditorTracker,
        serviceConfigurationProvider: new configuration_browser_1.BrowserServiceConfigurationProvider(),
        experimentTelemetryReporter,
        logger,
    }, item => {
        onCompletionAccepted.fire(item);
    });
    (0, index_1.registerBaseCommands)(commandManager, lazyClientHost, pluginManager, activeJsTsEditorTracker);
    // context.subscriptions.push(task.register(lazyClientHost.map(x => x.serviceClient)));
    Promise.resolve().then(() => require('./languageFeatures/tsconfig')).then(module => {
        context.subscriptions.push(module.register());
    });
    context.subscriptions.push((0, lazyClientHost_1.lazilyActivateClient)(lazyClientHost, pluginManager, activeJsTsEditorTracker, async () => {
        await startPreloadWorkspaceContentsIfNeeded(context, logger);
    }));
    return (0, api_1.getExtensionApi)(onCompletionAccepted.event, pluginManager);
}
exports.activate = activate;
async function startPreloadWorkspaceContentsIfNeeded(context, logger) {
    if (!(0, platform_1.isWebAndHasSharedArrayBuffers)()) {
        return;
    }
    const workspaceUri = vscode.workspace.workspaceFolders?.[0].uri;
    if (!workspaceUri || workspaceUri.scheme !== 'vscode-vfs' || !workspaceUri.authority.startsWith('github')) {
        logger.info(`Skipped loading workspace contents for repository ${workspaceUri?.toString()}`);
        return;
    }
    const loader = new RemoteWorkspaceContentsPreloader(workspaceUri, logger);
    context.subscriptions.push(loader);
    return loader.triggerPreload();
}
class RemoteWorkspaceContentsPreloader extends dispose_1.Disposable {
    constructor(workspaceUri, logger) {
        super();
        this.workspaceUri = workspaceUri;
        this.logger = logger;
        const fsWatcher = this._register(vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(workspaceUri, '*')));
        this._register(fsWatcher.onDidChange(uri => {
            if (uri.toString() === workspaceUri.toString()) {
                this._preload = undefined;
                this.triggerPreload();
            }
        }));
    }
    async triggerPreload() {
        this._preload ?? (this._preload = this.doPreload());
        return this._preload;
    }
    async doPreload() {
        try {
            const remoteHubApi = await remoteRepositories_browser_1.default.getApi();
            if (await remoteHubApi.loadWorkspaceContents?.(this.workspaceUri)) {
                this.logger.info(`Successfully loaded workspace content for repository ${this.workspaceUri.toString()}`);
            }
            else {
                this.logger.info(`Failed to load workspace content for repository ${this.workspaceUri.toString()}`);
            }
        }
        catch (error) {
            this.logger.info(`Loading workspace content for repository ${this.workspaceUri.toString()} failed: ${error instanceof Error ? error.toString() : 'Unknown reason'}`);
            console.error(error);
        }
    }
}
//# sourceMappingURL=extension.browser.js.map