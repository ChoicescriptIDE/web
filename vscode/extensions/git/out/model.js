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
exports.Model = void 0;
const vscode_1 = require("vscode");
const repository_1 = require("./repository");
const decorators_1 = require("./decorators");
const util_1 = require("./util");
const path = require("path");
const fs = require("fs");
const uri_1 = require("./uri");
const api1_1 = require("./api/api1");
class RepositoryPick {
    get label() {
        return path.basename(this.repository.root);
    }
    get description() {
        return [this.repository.headLabel, this.repository.syncLabel]
            .filter(l => !!l)
            .join(' ');
    }
    constructor(repository, index) {
        this.repository = repository;
        this.index = index;
    }
}
__decorate([
    decorators_1.memoize
], RepositoryPick.prototype, "label", null);
__decorate([
    decorators_1.memoize
], RepositoryPick.prototype, "description", null);
class ClosedRepositoriesManager {
    get repositories() {
        return [...this._repositories.values()];
    }
    constructor(workspaceState) {
        this.workspaceState = workspaceState;
        this._repositories = new Set(workspaceState.get('closedRepositories', []));
        this.onDidChangeRepositories();
    }
    addRepository(repository) {
        this._repositories.add(repository);
        this.onDidChangeRepositories();
    }
    deleteRepository(repository) {
        const result = this._repositories.delete(repository);
        if (result) {
            this.onDidChangeRepositories();
        }
        return result;
    }
    isRepositoryClosed(repository) {
        return this._repositories.has(repository);
    }
    onDidChangeRepositories() {
        this.workspaceState.update('closedRepositories', [...this._repositories.values()]);
        vscode_1.commands.executeCommand('setContext', 'git.closedRepositoryCount', this._repositories.size);
    }
}
class ParentRepositoriesManager {
    get repositories() {
        return [...this._repositories.values()];
    }
    constructor(globalState) {
        this.globalState = globalState;
        /**
         * Key   - normalized path used in user interface
         * Value - value indicating whether the repository should be opened
         */
        this._repositories = new Set;
        this.onDidChangeRepositories();
    }
    addRepository(repository) {
        this._repositories.add(repository);
        this.onDidChangeRepositories();
    }
    deleteRepository(repository) {
        const result = this._repositories.delete(repository);
        if (result) {
            this.onDidChangeRepositories();
        }
        return result;
    }
    hasRepository(repository) {
        return this._repositories.has(repository);
    }
    openRepository(repository) {
        this.globalState.update(`parentRepository:${repository}`, true);
        this.deleteRepository(repository);
    }
    onDidChangeRepositories() {
        vscode_1.commands.executeCommand('setContext', 'git.parentRepositoryCount', this._repositories.size);
    }
}
class UnsafeRepositoriesManager {
    get repositories() {
        return [...this._repositories.keys()];
    }
    constructor() {
        /**
         * Key   - normalized path used in user interface
         * Value - path extracted from the output of the `git status` command
         *         used when calling `git config --global --add safe.directory`
         */
        this._repositories = new Map();
        this.onDidChangeRepositories();
    }
    addRepository(repository, path) {
        this._repositories.set(repository, path);
        this.onDidChangeRepositories();
    }
    deleteRepository(repository) {
        const result = this._repositories.delete(repository);
        if (result) {
            this.onDidChangeRepositories();
        }
        return result;
    }
    getRepositoryPath(repository) {
        return this._repositories.get(repository);
    }
    hasRepository(repository) {
        return this._repositories.has(repository);
    }
    onDidChangeRepositories() {
        vscode_1.commands.executeCommand('setContext', 'git.unsafeRepositoryCount', this._repositories.size);
    }
}
class Model {
    get repositories() { return this.openRepositories.map(r => r.repository); }
    firePublishEvent(repository, branch) {
        this._onDidPublish.fire({ repository: new api1_1.ApiRepository(repository), branch: branch });
    }
    get state() { return this._state; }
    setState(state) {
        this._state = state;
        this._onDidChangeState.fire(state);
        vscode_1.commands.executeCommand('setContext', 'git.state', state);
    }
    get isInitialized() {
        if (this._state === 'initialized') {
            return Promise.resolve();
        }
        return (0, util_1.eventToPromise)((0, util_1.filterEvent)(this.onDidChangeState, s => s === 'initialized'));
    }
    get unsafeRepositories() {
        return this._unsafeRepositoriesManager.repositories;
    }
    get parentRepositories() {
        return this._parentRepositoriesManager.repositories;
    }
    get closedRepositories() {
        return [...this._closedRepositoriesManager.repositories];
    }
    constructor(git, askpass, globalState, workspaceState, logger, telemetryReporter) {
        this.git = git;
        this.askpass = askpass;
        this.globalState = globalState;
        this.workspaceState = workspaceState;
        this.logger = logger;
        this.telemetryReporter = telemetryReporter;
        this._onDidOpenRepository = new vscode_1.EventEmitter();
        this.onDidOpenRepository = this._onDidOpenRepository.event;
        this._onDidCloseRepository = new vscode_1.EventEmitter();
        this.onDidCloseRepository = this._onDidCloseRepository.event;
        this._onDidChangeRepository = new vscode_1.EventEmitter();
        this.onDidChangeRepository = this._onDidChangeRepository.event;
        this._onDidChangeOriginalResource = new vscode_1.EventEmitter();
        this.onDidChangeOriginalResource = this._onDidChangeOriginalResource.event;
        this.openRepositories = [];
        this.possibleGitRepositoryPaths = new Set();
        this._onDidChangeState = new vscode_1.EventEmitter();
        this.onDidChangeState = this._onDidChangeState.event;
        this._onDidPublish = new vscode_1.EventEmitter();
        this.onDidPublish = this._onDidPublish.event;
        this._state = 'uninitialized';
        this.remoteSourcePublishers = new Set();
        this._onDidAddRemoteSourcePublisher = new vscode_1.EventEmitter();
        this.onDidAddRemoteSourcePublisher = this._onDidAddRemoteSourcePublisher.event;
        this._onDidRemoveRemoteSourcePublisher = new vscode_1.EventEmitter();
        this.onDidRemoveRemoteSourcePublisher = this._onDidRemoveRemoteSourcePublisher.event;
        this.postCommitCommandsProviders = new Set();
        this._onDidChangePostCommitCommandsProviders = new vscode_1.EventEmitter();
        this.onDidChangePostCommitCommandsProviders = this._onDidChangePostCommitCommandsProviders.event;
        this.branchProtectionProviders = new Map();
        this._onDidChangeBranchProtectionProviders = new vscode_1.EventEmitter();
        this.onDidChangeBranchProtectionProviders = this._onDidChangeBranchProtectionProviders.event;
        this.pushErrorHandlers = new Set();
        /**
         * We maintain a map containing both the path and the canonical path of the
         * workspace folders. We are doing this as `git.exe` expands the symbolic links
         * while there are scenarios in which VS Code does not.
         *
         * Key   - path of the workspace folder
         * Value - canonical path of the workspace folder
         */
        this._workspaceFolders = new Map();
        this.disposables = [];
        // Repositories managers
        this._closedRepositoriesManager = new ClosedRepositoriesManager(workspaceState);
        this._parentRepositoriesManager = new ParentRepositoriesManager(globalState);
        this._unsafeRepositoriesManager = new UnsafeRepositoriesManager();
        vscode_1.workspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders, this, this.disposables);
        vscode_1.window.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors, this, this.disposables);
        vscode_1.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this.disposables);
        const fsWatcher = vscode_1.workspace.createFileSystemWatcher('**');
        this.disposables.push(fsWatcher);
        const onWorkspaceChange = (0, util_1.anyEvent)(fsWatcher.onDidChange, fsWatcher.onDidCreate, fsWatcher.onDidDelete);
        const onGitRepositoryChange = (0, util_1.filterEvent)(onWorkspaceChange, uri => /\/\.git/.test(uri.path));
        const onPossibleGitRepositoryChange = (0, util_1.filterEvent)(onGitRepositoryChange, uri => !this.getRepository(uri));
        onPossibleGitRepositoryChange(this.onPossibleGitRepositoryChange, this, this.disposables);
        this.setState('uninitialized');
        this.doInitialScan().finally(() => this.setState('initialized'));
    }
    async doInitialScan() {
        const config = vscode_1.workspace.getConfiguration('git');
        const autoRepositoryDetection = config.get('autoRepositoryDetection');
        const parentRepositoryConfig = config.get('openRepositoryInParentFolders', 'prompt');
        // Initial repository scan function
        const initialScanFn = () => Promise.all([
            this.onDidChangeWorkspaceFolders({ added: vscode_1.workspace.workspaceFolders || [], removed: [] }),
            this.onDidChangeVisibleTextEditors(vscode_1.window.visibleTextEditors),
            this.scanWorkspaceFolders()
        ]);
        if (config.get('showProgress', true)) {
            await vscode_1.window.withProgress({ location: vscode_1.ProgressLocation.SourceControl }, initialScanFn);
        }
        else {
            await initialScanFn();
        }
        if (this.parentRepositories.length !== 0 &&
            parentRepositoryConfig === 'prompt') {
            // Parent repositories notification
            this.showParentRepositoryNotification();
        }
        else if (this.unsafeRepositories.length !== 0) {
            // Unsafe repositories notification
            this.showUnsafeRepositoryNotification();
        }
        /* __GDPR__
            "git.repositoryInitialScan" : {
                "owner": "lszomoru",
                "autoRepositoryDetection": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "Setting that controls the initial repository scan" },
                "repositoryCount": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true, "comment": "Number of repositories opened during initial repository scan" }
            }
        */
        this.telemetryReporter.sendTelemetryEvent('git.repositoryInitialScan', { autoRepositoryDetection: String(autoRepositoryDetection) }, { repositoryCount: this.openRepositories.length });
    }
    /**
     * Scans each workspace folder, looking for git repositories. By
     * default it scans one level deep but that can be changed using
     * the git.repositoryScanMaxDepth setting.
     */
    async scanWorkspaceFolders() {
        const config = vscode_1.workspace.getConfiguration('git');
        const autoRepositoryDetection = config.get('autoRepositoryDetection');
        this.logger.trace(`[swsf] Scan workspace sub folders. autoRepositoryDetection=${autoRepositoryDetection}`);
        if (autoRepositoryDetection !== true && autoRepositoryDetection !== 'subFolders') {
            return;
        }
        await Promise.all((vscode_1.workspace.workspaceFolders || []).map(async (folder) => {
            const root = folder.uri.fsPath;
            this.logger.trace(`[swsf] Workspace folder: ${root}`);
            // Workspace folder children
            const repositoryScanMaxDepth = (vscode_1.workspace.isTrusted ? vscode_1.workspace.getConfiguration('git', folder.uri) : config).get('repositoryScanMaxDepth', 1);
            const repositoryScanIgnoredFolders = (vscode_1.workspace.isTrusted ? vscode_1.workspace.getConfiguration('git', folder.uri) : config).get('repositoryScanIgnoredFolders', []);
            const subfolders = new Set(await this.traverseWorkspaceFolder(root, repositoryScanMaxDepth, repositoryScanIgnoredFolders));
            // Repository scan folders
            const scanPaths = (vscode_1.workspace.isTrusted ? vscode_1.workspace.getConfiguration('git', folder.uri) : config).get('scanRepositories') || [];
            this.logger.trace(`[swsf] Workspace scan settings: repositoryScanMaxDepth=${repositoryScanMaxDepth}; repositoryScanIgnoredFolders=[${repositoryScanIgnoredFolders.join(', ')}]; scanRepositories=[${scanPaths.join(', ')}]`);
            for (const scanPath of scanPaths) {
                if (scanPath === '.git') {
                    this.logger.trace('[swsf] \'.git\' not supported in \'git.scanRepositories\' setting.');
                    continue;
                }
                if (path.isAbsolute(scanPath)) {
                    const notSupportedMessage = vscode_1.l10n.t('Absolute paths not supported in "git.scanRepositories" setting.');
                    this.logger.warn(notSupportedMessage);
                    console.warn(notSupportedMessage);
                    continue;
                }
                subfolders.add(path.join(root, scanPath));
            }
            this.logger.trace(`[swsf] Workspace scan sub folders: [${[...subfolders].join(', ')}]`);
            await Promise.all([...subfolders].map(f => this.openRepository(f)));
        }));
    }
    async traverseWorkspaceFolder(workspaceFolder, maxDepth, repositoryScanIgnoredFolders) {
        const result = [];
        const foldersToTravers = [{ path: workspaceFolder, depth: 0 }];
        while (foldersToTravers.length > 0) {
            const currentFolder = foldersToTravers.shift();
            if (currentFolder.depth < maxDepth || maxDepth === -1) {
                const children = await fs.promises.readdir(currentFolder.path, { withFileTypes: true });
                const childrenFolders = children
                    .filter(dirent => dirent.isDirectory() && dirent.name !== '.git' &&
                    !repositoryScanIgnoredFolders.find(f => (0, util_1.pathEquals)(dirent.name, f)))
                    .map(dirent => path.join(currentFolder.path, dirent.name));
                result.push(...childrenFolders);
                foldersToTravers.push(...childrenFolders.map(folder => {
                    return { path: folder, depth: currentFolder.depth + 1 };
                }));
            }
        }
        return result;
    }
    onPossibleGitRepositoryChange(uri) {
        const config = vscode_1.workspace.getConfiguration('git');
        const autoRepositoryDetection = config.get('autoRepositoryDetection');
        if (autoRepositoryDetection === false) {
            return;
        }
        this.eventuallyScanPossibleGitRepository(uri.fsPath.replace(/\.git.*$/, ''));
    }
    eventuallyScanPossibleGitRepository(path) {
        this.possibleGitRepositoryPaths.add(path);
        this.eventuallyScanPossibleGitRepositories();
    }
    eventuallyScanPossibleGitRepositories() {
        for (const path of this.possibleGitRepositoryPaths) {
            this.openRepository(path);
        }
        this.possibleGitRepositoryPaths.clear();
    }
    async onDidChangeWorkspaceFolders({ added, removed }) {
        const possibleRepositoryFolders = added
            .filter(folder => !this.getOpenRepository(folder.uri));
        const activeRepositoriesList = vscode_1.window.visibleTextEditors
            .map(editor => this.getRepository(editor.document.uri))
            .filter(repository => !!repository);
        const activeRepositories = new Set(activeRepositoriesList);
        const openRepositoriesToDispose = removed
            .map(folder => this.getOpenRepository(folder.uri))
            .filter(r => !!r)
            .filter(r => !activeRepositories.has(r.repository))
            .filter(r => !(vscode_1.workspace.workspaceFolders || []).some(f => (0, util_1.isDescendant)(f.uri.fsPath, r.repository.root)));
        openRepositoriesToDispose.forEach(r => r.dispose());
        this.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);
        await Promise.all(possibleRepositoryFolders.map(p => this.openRepository(p.uri.fsPath)));
    }
    onDidChangeConfiguration() {
        const possibleRepositoryFolders = (vscode_1.workspace.workspaceFolders || [])
            .filter(folder => vscode_1.workspace.getConfiguration('git', folder.uri).get('enabled') === true)
            .filter(folder => !this.getOpenRepository(folder.uri));
        const openRepositoriesToDispose = this.openRepositories
            .map(repository => ({ repository, root: vscode_1.Uri.file(repository.repository.root) }))
            .filter(({ root }) => vscode_1.workspace.getConfiguration('git', root).get('enabled') !== true)
            .map(({ repository }) => repository);
        this.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);
        possibleRepositoryFolders.forEach(p => this.openRepository(p.uri.fsPath));
        openRepositoriesToDispose.forEach(r => r.dispose());
    }
    async onDidChangeVisibleTextEditors(editors) {
        if (!vscode_1.workspace.isTrusted) {
            this.logger.trace('[svte] Workspace is not trusted.');
            return;
        }
        const config = vscode_1.workspace.getConfiguration('git');
        const autoRepositoryDetection = config.get('autoRepositoryDetection');
        this.logger.trace(`[svte] Scan visible text editors. autoRepositoryDetection=${autoRepositoryDetection}`);
        if (autoRepositoryDetection !== true && autoRepositoryDetection !== 'openEditors') {
            return;
        }
        await Promise.all(editors.map(async (editor) => {
            const uri = editor.document.uri;
            if (uri.scheme !== 'file') {
                return;
            }
            const repository = this.getRepository(uri);
            if (repository) {
                this.logger.trace(`[svte] Repository for editor resource ${uri.fsPath} already exists: ${repository.root}`);
                return;
            }
            this.logger.trace(`[svte] Open repository for editor resource ${uri.fsPath}`);
            await this.openRepository(path.dirname(uri.fsPath));
        }));
    }
    async openRepository(repoPath, openIfClosed = false) {
        this.logger.trace(`Opening repository: ${repoPath}`);
        const existingRepository = await this.getRepositoryExact(repoPath);
        if (existingRepository) {
            this.logger.trace(`Repository for path ${repoPath} already exists: ${existingRepository.root})`);
            return;
        }
        const config = vscode_1.workspace.getConfiguration('git', vscode_1.Uri.file(repoPath));
        const enabled = config.get('enabled') === true;
        if (!enabled) {
            this.logger.trace('Git is not enabled');
            return;
        }
        if (!vscode_1.workspace.isTrusted) {
            // Check if the folder is a bare repo: if it has a file named HEAD && `rev-parse --show -cdup` is empty
            try {
                fs.accessSync(path.join(repoPath, 'HEAD'), fs.constants.F_OK);
                const result = await this.git.exec(repoPath, ['-C', repoPath, 'rev-parse', '--show-cdup']);
                if (result.stderr.trim() === '' && result.stdout.trim() === '') {
                    this.logger.trace(`Bare repository: ${repoPath}`);
                    return;
                }
            }
            catch {
                // If this throw, we should be good to open the repo (e.g. HEAD doesn't exist)
            }
        }
        try {
            const { repositoryRoot, unsafeRepositoryMatch } = await this.getRepositoryRoot(repoPath);
            this.logger.trace(`Repository root for path ${repoPath} is: ${repositoryRoot}`);
            const existingRepository = await this.getRepositoryExact(repositoryRoot);
            if (existingRepository) {
                this.logger.trace(`Repository for path ${repositoryRoot} already exists: ${existingRepository.root}`);
                return;
            }
            if (this.shouldRepositoryBeIgnored(repositoryRoot)) {
                this.logger.trace(`Repository for path ${repositoryRoot} is ignored`);
                return;
            }
            // Handle git repositories that are in parent folders
            const parentRepositoryConfig = config.get('openRepositoryInParentFolders', 'prompt');
            if (parentRepositoryConfig !== 'always' && this.globalState.get(`parentRepository:${repositoryRoot}`) !== true) {
                const isRepositoryOutsideWorkspace = await this.isRepositoryOutsideWorkspace(repositoryRoot);
                if (isRepositoryOutsideWorkspace) {
                    this.logger.trace(`Repository in parent folder: ${repositoryRoot}`);
                    if (!this._parentRepositoriesManager.hasRepository(repositoryRoot)) {
                        // Show a notification if the parent repository is opened after the initial scan
                        if (this.state === 'initialized' && parentRepositoryConfig === 'prompt') {
                            this.showParentRepositoryNotification();
                        }
                        this._parentRepositoriesManager.addRepository(repositoryRoot);
                    }
                    return;
                }
            }
            // Handle unsafe repositories
            if (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {
                this.logger.trace(`Unsafe repository: ${repositoryRoot}`);
                // Show a notification if the unsafe repository is opened after the initial scan
                if (this._state === 'initialized' && !this._unsafeRepositoriesManager.hasRepository(repositoryRoot)) {
                    this.showUnsafeRepositoryNotification();
                }
                this._unsafeRepositoriesManager.addRepository(repositoryRoot, unsafeRepositoryMatch[2]);
                return;
            }
            // Handle repositories that were closed by the user
            if (!openIfClosed && this._closedRepositoriesManager.isRepositoryClosed(repositoryRoot)) {
                this.logger.trace(`Repository for path ${repositoryRoot} is closed`);
                return;
            }
            // Open repository
            const dotGit = await this.git.getRepositoryDotGit(repositoryRoot);
            const repository = new repository_1.Repository(this.git.open(repositoryRoot, dotGit, this.logger), this, this, this, this, this.globalState, this.logger, this.telemetryReporter);
            this.open(repository);
            this._closedRepositoriesManager.deleteRepository(repository.root);
            // Do not await this, we want SCM
            // to know about the repo asap
            repository.status();
        }
        catch (err) {
            // noop
            this.logger.trace(`Opening repository for path='${repoPath}' failed; ex=${err}`);
        }
    }
    async openParentRepository(repoPath) {
        await this.openRepository(repoPath);
        this._parentRepositoriesManager.openRepository(repoPath);
    }
    async getRepositoryRoot(repoPath) {
        try {
            const rawRoot = await this.git.getRepositoryRoot(repoPath);
            // This can happen whenever `path` has the wrong case sensitivity in case
            // insensitive file systems https://github.com/microsoft/vscode/issues/33498
            return { repositoryRoot: vscode_1.Uri.file(rawRoot).fsPath, unsafeRepositoryMatch: null };
        }
        catch (err) {
            // Handle unsafe repository
            const unsafeRepositoryMatch = /^fatal: detected dubious ownership in repository at \'([^']+)\'[\s\S]*git config --global --add safe\.directory '?([^'\n]+)'?$/m.exec(err.stderr);
            if (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {
                return { repositoryRoot: path.normalize(unsafeRepositoryMatch[1]), unsafeRepositoryMatch };
            }
            throw err;
        }
    }
    shouldRepositoryBeIgnored(repositoryRoot) {
        const config = vscode_1.workspace.getConfiguration('git');
        const ignoredRepos = config.get('ignoredRepositories') || [];
        for (const ignoredRepo of ignoredRepos) {
            if (path.isAbsolute(ignoredRepo)) {
                if ((0, util_1.pathEquals)(ignoredRepo, repositoryRoot)) {
                    return true;
                }
            }
            else {
                for (const folder of vscode_1.workspace.workspaceFolders || []) {
                    if ((0, util_1.pathEquals)(path.join(folder.uri.fsPath, ignoredRepo), repositoryRoot)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    open(repository) {
        this.logger.info(`Open repository: ${repository.root}`);
        const onDidDisappearRepository = (0, util_1.filterEvent)(repository.onDidChangeState, state => state === 1 /* RepositoryState.Disposed */);
        const disappearListener = onDidDisappearRepository(() => dispose());
        const changeListener = repository.onDidChangeRepository(uri => this._onDidChangeRepository.fire({ repository, uri }));
        const originalResourceChangeListener = repository.onDidChangeOriginalResource(uri => this._onDidChangeOriginalResource.fire({ repository, uri }));
        const shouldDetectSubmodules = vscode_1.workspace
            .getConfiguration('git', vscode_1.Uri.file(repository.root))
            .get('detectSubmodules');
        const submodulesLimit = vscode_1.workspace
            .getConfiguration('git', vscode_1.Uri.file(repository.root))
            .get('detectSubmodulesLimit');
        const checkForSubmodules = () => {
            if (!shouldDetectSubmodules) {
                this.logger.trace('Automatic detection of git submodules is not enabled.');
                return;
            }
            if (repository.submodules.length > submodulesLimit) {
                vscode_1.window.showWarningMessage(vscode_1.l10n.t('The "{0}" repository has {1} submodules which won\'t be opened automatically. You can still open each one individually by opening a file within.', path.basename(repository.root), repository.submodules.length));
                statusListener.dispose();
            }
            repository.submodules
                .slice(0, submodulesLimit)
                .map(r => path.join(repository.root, r.path))
                .forEach(p => {
                this.logger.trace(`Opening submodule: '${p}'`);
                this.eventuallyScanPossibleGitRepository(p);
            });
        };
        const updateMergeChanges = () => {
            // set mergeChanges context
            const mergeChanges = [];
            for (const { repository } of this.openRepositories.values()) {
                for (const state of repository.mergeGroup.resourceStates) {
                    mergeChanges.push(state.resourceUri);
                }
            }
            vscode_1.commands.executeCommand('setContext', 'git.mergeChanges', mergeChanges);
        };
        const statusListener = repository.onDidRunGitStatus(() => {
            checkForSubmodules();
            updateMergeChanges();
        });
        checkForSubmodules();
        const updateOperationInProgressContext = () => {
            let operationInProgress = false;
            for (const { repository } of this.openRepositories.values()) {
                if (repository.operations.shouldDisableCommands()) {
                    operationInProgress = true;
                }
            }
            vscode_1.commands.executeCommand('setContext', 'operationInProgress', operationInProgress);
        };
        const operationEvent = (0, util_1.anyEvent)(repository.onDidRunOperation, repository.onRunOperation);
        const operationListener = operationEvent(() => updateOperationInProgressContext());
        updateOperationInProgressContext();
        const dispose = () => {
            disappearListener.dispose();
            changeListener.dispose();
            originalResourceChangeListener.dispose();
            statusListener.dispose();
            operationListener.dispose();
            repository.dispose();
            this.openRepositories = this.openRepositories.filter(e => e !== openRepository);
            this._onDidCloseRepository.fire(repository);
        };
        const openRepository = { repository, dispose };
        this.openRepositories.push(openRepository);
        updateMergeChanges();
        this._onDidOpenRepository.fire(repository);
    }
    close(repository) {
        const openRepository = this.getOpenRepository(repository);
        if (!openRepository) {
            return;
        }
        this.logger.info(`Close repository: ${repository.root}`);
        this._closedRepositoriesManager.addRepository(openRepository.repository.root);
        openRepository.dispose();
    }
    async pickRepository() {
        if (this.openRepositories.length === 0) {
            throw new Error(vscode_1.l10n.t('There are no available repositories'));
        }
        const picks = this.openRepositories.map((e, index) => new RepositoryPick(e.repository, index));
        const active = vscode_1.window.activeTextEditor;
        const repository = active && this.getRepository(active.document.fileName);
        const index = picks.findIndex(pick => pick.repository === repository);
        // Move repository pick containing the active text editor to appear first
        if (index > -1) {
            picks.unshift(...picks.splice(index, 1));
        }
        const placeHolder = vscode_1.l10n.t('Choose a repository');
        const pick = await vscode_1.window.showQuickPick(picks, { placeHolder });
        return pick && pick.repository;
    }
    getRepository(hint) {
        const liveRepository = this.getOpenRepository(hint);
        return liveRepository && liveRepository.repository;
    }
    async getRepositoryExact(repoPath) {
        const repoPathCanonical = await fs.promises.realpath(repoPath, { encoding: 'utf8' });
        for (const openRepository of this.openRepositories) {
            const rootPathCanonical = await fs.promises.realpath(openRepository.repository.root, { encoding: 'utf8' });
            if ((0, util_1.pathEquals)(rootPathCanonical, repoPathCanonical)) {
                return openRepository.repository;
            }
        }
        return undefined;
    }
    getOpenRepository(hint) {
        if (!hint) {
            return undefined;
        }
        if (hint instanceof repository_1.Repository) {
            return this.openRepositories.filter(r => r.repository === hint)[0];
        }
        if (hint instanceof api1_1.ApiRepository) {
            return this.openRepositories.filter(r => r.repository === hint.repository)[0];
        }
        if (typeof hint === 'string') {
            hint = vscode_1.Uri.file(hint);
        }
        if (hint instanceof vscode_1.Uri) {
            let resourcePath;
            if (hint.scheme === 'git') {
                resourcePath = (0, uri_1.fromGitUri)(hint).path;
            }
            else {
                resourcePath = hint.fsPath;
            }
            outer: for (const liveRepository of this.openRepositories.sort((a, b) => b.repository.root.length - a.repository.root.length)) {
                if (!(0, util_1.isDescendant)(liveRepository.repository.root, resourcePath)) {
                    continue;
                }
                for (const submodule of liveRepository.repository.submodules) {
                    const submoduleRoot = path.join(liveRepository.repository.root, submodule.path);
                    if ((0, util_1.isDescendant)(submoduleRoot, resourcePath)) {
                        continue outer;
                    }
                }
                return liveRepository;
            }
            return undefined;
        }
        for (const liveRepository of this.openRepositories) {
            const repository = liveRepository.repository;
            if (hint === repository.sourceControl) {
                return liveRepository;
            }
            if (hint === repository.mergeGroup || hint === repository.indexGroup || hint === repository.workingTreeGroup || hint === repository.untrackedGroup) {
                return liveRepository;
            }
        }
        return undefined;
    }
    getRepositoryForSubmodule(submoduleUri) {
        for (const repository of this.repositories) {
            for (const submodule of repository.submodules) {
                const submodulePath = path.join(repository.root, submodule.path);
                if (submodulePath === submoduleUri.fsPath) {
                    return repository;
                }
            }
        }
        return undefined;
    }
    registerRemoteSourcePublisher(publisher) {
        this.remoteSourcePublishers.add(publisher);
        this._onDidAddRemoteSourcePublisher.fire(publisher);
        return (0, util_1.toDisposable)(() => {
            this.remoteSourcePublishers.delete(publisher);
            this._onDidRemoveRemoteSourcePublisher.fire(publisher);
        });
    }
    getRemoteSourcePublishers() {
        return [...this.remoteSourcePublishers.values()];
    }
    registerBranchProtectionProvider(root, provider) {
        const providerDisposables = [];
        this.branchProtectionProviders.set(root.toString(), (this.branchProtectionProviders.get(root.toString()) ?? new Set()).add(provider));
        providerDisposables.push(provider.onDidChangeBranchProtection(uri => this._onDidChangeBranchProtectionProviders.fire(uri)));
        this._onDidChangeBranchProtectionProviders.fire(root);
        return (0, util_1.toDisposable)(() => {
            const providers = this.branchProtectionProviders.get(root.toString());
            if (providers && providers.has(provider)) {
                providers.delete(provider);
                this.branchProtectionProviders.set(root.toString(), providers);
                this._onDidChangeBranchProtectionProviders.fire(root);
            }
            (0, util_1.dispose)(providerDisposables);
        });
    }
    getBranchProtectionProviders(root) {
        return [...(this.branchProtectionProviders.get(root.toString()) ?? new Set()).values()];
    }
    registerPostCommitCommandsProvider(provider) {
        this.postCommitCommandsProviders.add(provider);
        this._onDidChangePostCommitCommandsProviders.fire();
        return (0, util_1.toDisposable)(() => {
            this.postCommitCommandsProviders.delete(provider);
            this._onDidChangePostCommitCommandsProviders.fire();
        });
    }
    getPostCommitCommandsProviders() {
        return [...this.postCommitCommandsProviders.values()];
    }
    registerCredentialsProvider(provider) {
        return this.askpass.registerCredentialsProvider(provider);
    }
    registerPushErrorHandler(handler) {
        this.pushErrorHandlers.add(handler);
        return (0, util_1.toDisposable)(() => this.pushErrorHandlers.delete(handler));
    }
    getPushErrorHandlers() {
        return [...this.pushErrorHandlers];
    }
    getUnsafeRepositoryPath(repository) {
        return this._unsafeRepositoriesManager.getRepositoryPath(repository);
    }
    deleteUnsafeRepository(repository) {
        return this._unsafeRepositoriesManager.deleteRepository(repository);
    }
    async isRepositoryOutsideWorkspace(repositoryPath) {
        const workspaceFolders = (vscode_1.workspace.workspaceFolders || [])
            .filter(folder => folder.uri.scheme === 'file');
        if (workspaceFolders.length === 0) {
            return true;
        }
        // The repository path may be a canonical path or it may contain a symbolic link so we have
        // to match it against the workspace folders and the canonical paths of the workspace folders
        const workspaceFolderPaths = new Set([
            ...workspaceFolders.map(folder => folder.uri.fsPath),
            ...await Promise.all(workspaceFolders.map(folder => this.getWorkspaceFolderRealPath(folder)))
        ]);
        return !Array.from(workspaceFolderPaths).some(folder => folder && ((0, util_1.pathEquals)(folder, repositoryPath) || (0, util_1.isDescendant)(folder, repositoryPath)));
    }
    async getWorkspaceFolderRealPath(workspaceFolder) {
        let result = this._workspaceFolders.get(workspaceFolder.uri.fsPath);
        if (!result) {
            try {
                result = await fs.promises.realpath(workspaceFolder.uri.fsPath, { encoding: 'utf8' });
                this._workspaceFolders.set(workspaceFolder.uri.fsPath, result);
            }
            catch (err) {
                // noop - Workspace folder does not exist
                this.logger.trace(`Failed to resolve workspace folder: "${workspaceFolder.uri.fsPath}". ${err}`);
            }
        }
        return result;
    }
    async showParentRepositoryNotification() {
        const message = this.parentRepositories.length === 1 ?
            vscode_1.l10n.t('A git repository was found in the parent folders of the workspace or the open file(s). Would you like to open the repository?') :
            vscode_1.l10n.t('Git repositories were found in the parent folders of the workspace or the open file(s). Would you like to open the repositories?');
        const yes = vscode_1.l10n.t('Yes');
        const always = vscode_1.l10n.t('Always');
        const never = vscode_1.l10n.t('Never');
        const choice = await vscode_1.window.showInformationMessage(message, yes, always, never);
        if (choice === yes) {
            // Open Parent Repositories
            vscode_1.commands.executeCommand('git.openRepositoriesInParentFolders');
        }
        else if (choice === always || choice === never) {
            // Update setting
            const config = vscode_1.workspace.getConfiguration('git');
            await config.update('openRepositoryInParentFolders', choice === always ? 'always' : 'never', true);
            if (choice === always) {
                for (const parentRepository of this.parentRepositories) {
                    await this.openParentRepository(parentRepository);
                }
            }
        }
    }
    async showUnsafeRepositoryNotification() {
        // If no repositories are open, we will use a welcome view to inform the user
        // that a potentially unsafe repository was found so we do not have to show
        // the notification
        if (this.repositories.length === 0) {
            return;
        }
        const message = this.unsafeRepositories.length === 1 ?
            vscode_1.l10n.t('The git repository in the current folder is potentially unsafe as the folder is owned by someone other than the current user.') :
            vscode_1.l10n.t('The git repositories in the current folder are potentially unsafe as the folders are owned by someone other than the current user.');
        const manageUnsafeRepositories = vscode_1.l10n.t('Manage Unsafe Repositories');
        const learnMore = vscode_1.l10n.t('Learn More');
        const choice = await vscode_1.window.showErrorMessage(message, manageUnsafeRepositories, learnMore);
        if (choice === manageUnsafeRepositories) {
            // Manage Unsafe Repositories
            vscode_1.commands.executeCommand('git.manageUnsafeRepositories');
        }
        else if (choice === learnMore) {
            // Learn More
            vscode_1.commands.executeCommand('vscode.open', vscode_1.Uri.parse('https://aka.ms/vscode-git-unsafe-repository'));
        }
    }
    dispose() {
        const openRepositories = [...this.openRepositories];
        openRepositories.forEach(r => r.dispose());
        this.openRepositories = [];
        this.possibleGitRepositoryPaths.clear();
        this.disposables = (0, util_1.dispose)(this.disposables);
    }
}
exports.Model = Model;
__decorate([
    decorators_1.memoize
], Model.prototype, "isInitialized", null);
__decorate([
    (0, decorators_1.debounce)(500)
], Model.prototype, "eventuallyScanPossibleGitRepositories", null);
__decorate([
    decorators_1.sequentialize
], Model.prototype, "openRepository", null);
//# sourceMappingURL=model.js.map