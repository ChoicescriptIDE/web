"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptServerSpawner = void 0;
const vscode = require("vscode");
const configuration_1 = require("../configuration/configuration");
const typescriptService_1 = require("../typescriptService");
const memoize_1 = require("../utils/memoize");
const platform_1 = require("../utils/platform");
const api_1 = require("./api");
const server_1 = require("./server");
class TypeScriptServerSpawner {
    static get tsServerLogOutputChannel() {
        return vscode.window.createOutputChannel(vscode.l10n.t("TypeScript Server Log"));
    }
    constructor(_versionProvider, _versionManager, _logDirectoryProvider, _pluginPathsProvider, _logger, _telemetryReporter, _tracer, _factory) {
        this._versionProvider = _versionProvider;
        this._versionManager = _versionManager;
        this._logDirectoryProvider = _logDirectoryProvider;
        this._pluginPathsProvider = _pluginPathsProvider;
        this._logger = _logger;
        this._telemetryReporter = _telemetryReporter;
        this._tracer = _tracer;
        this._factory = _factory;
    }
    spawn(version, capabilities, configuration, pluginManager, cancellerFactory, delegate) {
        let primaryServer;
        const serverType = this.getCompositeServerType(version, capabilities, configuration);
        const shouldUseSeparateDiagnosticsServer = this.shouldUseSeparateDiagnosticsServer(configuration);
        switch (serverType) {
            case 1 /* CompositeServerType.SeparateSyntax */:
            case 2 /* CompositeServerType.DynamicSeparateSyntax */:
                {
                    const enableDynamicRouting = !shouldUseSeparateDiagnosticsServer && serverType === 2 /* CompositeServerType.DynamicSeparateSyntax */;
                    primaryServer = new server_1.SyntaxRoutingTsServer({
                        syntax: this.spawnTsServer("syntax" /* TsServerProcessKind.Syntax */, version, configuration, pluginManager, cancellerFactory),
                        semantic: this.spawnTsServer("semantic" /* TsServerProcessKind.Semantic */, version, configuration, pluginManager, cancellerFactory),
                    }, delegate, enableDynamicRouting);
                    break;
                }
            case 0 /* CompositeServerType.Single */:
                {
                    primaryServer = this.spawnTsServer("main" /* TsServerProcessKind.Main */, version, configuration, pluginManager, cancellerFactory);
                    break;
                }
            case 3 /* CompositeServerType.SyntaxOnly */:
                {
                    primaryServer = this.spawnTsServer("syntax" /* TsServerProcessKind.Syntax */, version, configuration, pluginManager, cancellerFactory);
                    break;
                }
        }
        if (shouldUseSeparateDiagnosticsServer) {
            return new server_1.GetErrRoutingTsServer({
                getErr: this.spawnTsServer("diagnostics" /* TsServerProcessKind.Diagnostics */, version, configuration, pluginManager, cancellerFactory),
                primary: primaryServer,
            }, delegate);
        }
        return primaryServer;
    }
    getCompositeServerType(version, capabilities, configuration) {
        if (!capabilities.has(typescriptService_1.ClientCapability.Semantic)) {
            return 3 /* CompositeServerType.SyntaxOnly */;
        }
        switch (configuration.useSyntaxServer) {
            case 1 /* SyntaxServerConfiguration.Always */:
                return 3 /* CompositeServerType.SyntaxOnly */;
            case 0 /* SyntaxServerConfiguration.Never */:
                return 0 /* CompositeServerType.Single */;
            case 2 /* SyntaxServerConfiguration.Auto */:
                if (version.apiVersion?.gte(api_1.API.v340)) {
                    return version.apiVersion?.gte(api_1.API.v400)
                        ? 2 /* CompositeServerType.DynamicSeparateSyntax */
                        : 1 /* CompositeServerType.SeparateSyntax */;
                }
                return 0 /* CompositeServerType.Single */;
        }
    }
    shouldUseSeparateDiagnosticsServer(configuration) {
        return configuration.enableProjectDiagnostics;
    }
    spawnTsServer(kind, version, configuration, pluginManager, cancellerFactory) {
        const apiVersion = version.apiVersion || api_1.API.defaultVersion;
        const canceller = cancellerFactory.create(kind, this._tracer);
        const { args, tsServerLog, tsServerTraceDirectory } = this.getTsServerArgs(kind, configuration, version, apiVersion, pluginManager, canceller.cancellationPipeName);
        if (TypeScriptServerSpawner.isLoggingEnabled(configuration)) {
            if (tsServerLog?.type === 'file') {
                this._logger.info(`<${kind}> Log file: ${tsServerLog.uri.fsPath}`);
            }
            else if (tsServerLog?.type === 'output') {
                this._logger.info(`<${kind}> Logging to output`);
            }
            else {
                this._logger.error(`<${kind}> Could not create TS Server log`);
            }
        }
        if (configuration.enableTsServerTracing) {
            if (tsServerTraceDirectory) {
                this._logger.info(`<${kind}> Trace directory: ${tsServerTraceDirectory.fsPath}`);
            }
            else {
                this._logger.error(`<${kind}> Could not create trace directory`);
            }
        }
        this._logger.info(`<${kind}> Forking...`);
        const process = this._factory.fork(version, args, kind, configuration, this._versionManager, tsServerLog);
        this._logger.info(`<${kind}> Starting...`);
        return new server_1.SingleTsServer(kind, this.kindToServerType(kind), process, tsServerLog, canceller, version, this._telemetryReporter, this._tracer);
    }
    kindToServerType(kind) {
        switch (kind) {
            case "syntax" /* TsServerProcessKind.Syntax */:
                return typescriptService_1.ServerType.Syntax;
            case "main" /* TsServerProcessKind.Main */:
            case "semantic" /* TsServerProcessKind.Semantic */:
            case "diagnostics" /* TsServerProcessKind.Diagnostics */:
            default:
                return typescriptService_1.ServerType.Semantic;
        }
    }
    getTsServerArgs(kind, configuration, currentVersion, apiVersion, pluginManager, cancellationPipeName) {
        const args = [];
        let tsServerLog;
        let tsServerTraceDirectory;
        if (kind === "syntax" /* TsServerProcessKind.Syntax */) {
            if (apiVersion.gte(api_1.API.v401)) {
                args.push('--serverMode', 'partialSemantic');
            }
            else {
                args.push('--syntaxOnly');
            }
        }
        args.push('--useInferredProjectPerProjectRoot');
        if (configuration.disableAutomaticTypeAcquisition || kind === "syntax" /* TsServerProcessKind.Syntax */ || kind === "diagnostics" /* TsServerProcessKind.Diagnostics */) {
            args.push('--disableAutomaticTypingAcquisition');
        }
        if (kind === "semantic" /* TsServerProcessKind.Semantic */ || kind === "main" /* TsServerProcessKind.Main */) {
            args.push('--enableTelemetry');
        }
        if (cancellationPipeName) {
            args.push('--cancellationPipeName', cancellationPipeName + '*');
        }
        if (TypeScriptServerSpawner.isLoggingEnabled(configuration)) {
            if ((0, platform_1.isWeb)()) {
                args.push('--logVerbosity', configuration_1.TsServerLogLevel.toString(configuration.tsServerLogLevel));
                tsServerLog = { type: 'output', output: TypeScriptServerSpawner.tsServerLogOutputChannel };
            }
            else {
                const logDir = this._logDirectoryProvider.getNewLogDirectory();
                if (logDir) {
                    const logFilePath = vscode.Uri.joinPath(logDir, `tsserver.log`);
                    tsServerLog = { type: 'file', uri: logFilePath };
                    args.push('--logVerbosity', configuration_1.TsServerLogLevel.toString(configuration.tsServerLogLevel));
                    args.push('--logFile', logFilePath.fsPath);
                }
            }
        }
        if (configuration.enableTsServerTracing && !(0, platform_1.isWeb)()) {
            tsServerTraceDirectory = this._logDirectoryProvider.getNewLogDirectory();
            if (tsServerTraceDirectory) {
                args.push('--traceDirectory', tsServerTraceDirectory.fsPath);
            }
        }
        const pluginPaths = (0, platform_1.isWeb)() ? [] : this._pluginPathsProvider.getPluginPaths();
        if (pluginManager.plugins.length) {
            args.push('--globalPlugins', pluginManager.plugins.map(x => x.name).join(','));
            const isUsingBundledTypeScriptVersion = currentVersion.path === this._versionProvider.defaultVersion.path;
            for (const plugin of pluginManager.plugins) {
                if (isUsingBundledTypeScriptVersion || plugin.enableForWorkspaceTypeScriptVersions) {
                    pluginPaths.push((0, platform_1.isWeb)() ? plugin.uri.toString() : plugin.uri.fsPath);
                }
            }
        }
        if (pluginPaths.length !== 0) {
            args.push('--pluginProbeLocations', pluginPaths.join(','));
        }
        if (configuration.npmLocation && !(0, platform_1.isWeb)()) {
            args.push('--npmLocation', `"${configuration.npmLocation}"`);
        }
        args.push('--locale', TypeScriptServerSpawner.getTsLocale(configuration));
        args.push('--noGetErrOnBackgroundUpdate');
        args.push('--validateDefaultNpmLocation');
        if ((0, platform_1.isWebAndHasSharedArrayBuffers)()) {
            args.push('--enableProjectWideIntelliSenseOnWeb');
        }
        return { args, tsServerLog, tsServerTraceDirectory };
    }
    static isLoggingEnabled(configuration) {
        return configuration.tsServerLogLevel !== configuration_1.TsServerLogLevel.Off;
    }
    static getTsLocale(configuration) {
        return configuration.locale
            ? configuration.locale
            : vscode.env.language;
    }
}
exports.TypeScriptServerSpawner = TypeScriptServerSpawner;
__decorate([
    memoize_1.memoize
], TypeScriptServerSpawner, "tsServerLogOutputChannel", null);
//# sourceMappingURL=spawner.js.map