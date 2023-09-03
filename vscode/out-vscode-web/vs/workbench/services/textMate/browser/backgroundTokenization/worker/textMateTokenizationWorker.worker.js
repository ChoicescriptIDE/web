/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/base/common/lifecycle","vs/base/common/platform","vs/base/common/observableInternal/logging","vs/base/common/observableInternal/base","vs/base/common/errors","vs/editor/common/tokens/lineTokens","vs/base/common/uri","vs/base/common/observableInternal/autorun","vs/base/common/observableInternal/derived","vs/base/common/observable","vs/base/common/buffer","vs/editor/common/core/eolCounter","vs/editor/common/encodedTokenAttributes","vs/editor/common/core/lineRange","vs/editor/common/tokens/contiguousMultilineTokensBuilder","vs/base/common/network","vs/base/common/resources","vs/base/common/async","vs/editor/common/languages/nullTokenize","vs/base/common/amd","vs/base/common/observableInternal/utils","vs/base/common/stream","vs/base/common/symbols","vs/editor/common/model/fixedArray","vs/base/common/arrays","vs/editor/common/tokens/contiguousTokensEditing","vs/editor/common/tokens/contiguousMultilineTokens","vs/base/common/extpath","vs/base/common/path","vs/base/common/strings","vs/amdX","vs/base/common/event","vs/editor/common/languages","vs/editor/common/model/textModelTokens","vs/base/common/stopwatch","vs/workbench/services/textMate/browser/tokenizationSupport/textMateTokenizationSupport","vs/workbench/services/textMate/browser/tokenizationSupport/tokenizationSupportWithLineLimit","vs/workbench/services/textMate/browser/backgroundTokenization/worker/textMateWorkerTokenizer","vs/workbench/services/textMate/common/TMScopeRegistry","vs/workbench/services/textMate/common/TMGrammarFactory","vs/base/common/assert","vs/base/common/lazy","vs/editor/common/core/position","vs/base/common/types","vs/base/common/cancellation","vs/editor/common/core/offsetRange","vs/editor/common/model/mirrorTextModel","vs/workbench/services/textMate/browser/backgroundTokenization/worker/textMateTokenizationWorker.worker"];
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
define(__m[21/*vs/base/common/amd*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$S = exports.$R = void 0;
    // ESM-comment-begin
    exports.$R = false;
    // ESM-comment-end
    // ESM-uncomment-begin
    // export const isESM = true;
    // ESM-uncomment-end
    class $S {
        static get() {
            const amdLoadScript = new Map();
            const amdInvokeFactory = new Map();
            const nodeRequire = new Map();
            const nodeEval = new Map();
            function mark(map, stat) {
                if (map.has(stat.detail)) {
                    // console.warn('BAD events, DOUBLE start', stat);
                    // map.delete(stat.detail);
                    return;
                }
                map.set(stat.detail, -stat.timestamp);
            }
            function diff(map, stat) {
                const duration = map.get(stat.detail);
                if (!duration) {
                    // console.warn('BAD events, end WITHOUT start', stat);
                    // map.delete(stat.detail);
                    return;
                }
                if (duration >= 0) {
                    // console.warn('BAD events, DOUBLE end', stat);
                    // map.delete(stat.detail);
                    return;
                }
                map.set(stat.detail, duration + stat.timestamp);
            }
            let stats = [];
            if (typeof require === 'function' && typeof require.getStats === 'function') {
                stats = require.getStats().slice(0).sort((a, b) => a.timestamp - b.timestamp);
            }
            for (const stat of stats) {
                switch (stat.type) {
                    case 10 /* LoaderEventType.BeginLoadingScript */:
                        mark(amdLoadScript, stat);
                        break;
                    case 11 /* LoaderEventType.EndLoadingScriptOK */:
                    case 12 /* LoaderEventType.EndLoadingScriptError */:
                        diff(amdLoadScript, stat);
                        break;
                    case 21 /* LoaderEventType.BeginInvokeFactory */:
                        mark(amdInvokeFactory, stat);
                        break;
                    case 22 /* LoaderEventType.EndInvokeFactory */:
                        diff(amdInvokeFactory, stat);
                        break;
                    case 33 /* LoaderEventType.NodeBeginNativeRequire */:
                        mark(nodeRequire, stat);
                        break;
                    case 34 /* LoaderEventType.NodeEndNativeRequire */:
                        diff(nodeRequire, stat);
                        break;
                    case 31 /* LoaderEventType.NodeBeginEvaluatingScript */:
                        mark(nodeEval, stat);
                        break;
                    case 32 /* LoaderEventType.NodeEndEvaluatingScript */:
                        diff(nodeEval, stat);
                        break;
                }
            }
            let nodeRequireTotal = 0;
            nodeRequire.forEach(value => nodeRequireTotal += value);
            function to2dArray(map) {
                const res = [];
                map.forEach((value, index) => res.push([index, value]));
                return res;
            }
            return {
                amdLoad: to2dArray(amdLoadScript),
                amdInvoke: to2dArray(amdInvokeFactory),
                nodeRequire: to2dArray(nodeRequire),
                nodeEval: to2dArray(nodeEval),
                nodeRequireTotal
            };
        }
        static toMarkdownTable(header, rows) {
            let result = '';
            const lengths = [];
            header.forEach((cell, ci) => {
                lengths[ci] = cell.length;
            });
            rows.forEach(row => {
                row.forEach((cell, ci) => {
                    if (typeof cell === 'undefined') {
                        cell = row[ci] = '-';
                    }
                    const len = cell.toString().length;
                    lengths[ci] = Math.max(len, lengths[ci]);
                });
            });
            // header
            header.forEach((cell, ci) => { result += `| ${cell + ' '.repeat(lengths[ci] - cell.toString().length)} `; });
            result += '|\n';
            header.forEach((_cell, ci) => { result += `| ${'-'.repeat(lengths[ci])} `; });
            result += '|\n';
            // cells
            rows.forEach(row => {
                row.forEach((cell, ci) => {
                    if (typeof cell !== 'undefined') {
                        result += `| ${cell + ' '.repeat(lengths[ci] - cell.toString().length)} `;
                    }
                });
                result += '|\n';
            });
            return result;
        }
    }
    exports.$S = $S;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[4/*vs/base/common/observableInternal/logging*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$Mc = exports.$Lc = exports.$Kc = void 0;
    let globalObservableLogger;
    function $Kc(logger) {
        globalObservableLogger = logger;
    }
    exports.$Kc = $Kc;
    function $Lc() {
        return globalObservableLogger;
    }
    exports.$Lc = $Lc;
    class $Mc {
        constructor() {
            this.a = 0;
            this.d = new WeakMap();
        }
        b(text) {
            return consoleTextToArgs([
                normalText(repeat('|  ', this.a)),
                text,
            ]);
        }
        c(info) {
            if (!info.hadValue) {
                return [
                    normalText(` `),
                    styled(formatValue(info.newValue, 60), {
                        color: 'green',
                    }),
                    normalText(` (initial)`),
                ];
            }
            return info.didChange
                ? [
                    normalText(` `),
                    styled(formatValue(info.oldValue, 70), {
                        color: 'red',
                        strikeThrough: true,
                    }),
                    normalText(` `),
                    styled(formatValue(info.newValue, 60), {
                        color: 'green',
                    }),
                ]
                : [normalText(` (unchanged)`)];
        }
        handleObservableChanged(observable, info) {
            console.log(...this.b([
                formatKind('observable value changed'),
                styled(observable.debugName, { color: 'BlueViolet' }),
                ...this.c(info),
            ]));
        }
        formatChanges(changes) {
            if (changes.size === 0) {
                return undefined;
            }
            return styled(' (changed deps: ' +
                [...changes].map((o) => o.debugName).join(', ') +
                ')', { color: 'gray' });
        }
        handleDerivedCreated(derived) {
            const existingHandleChange = derived.handleChange;
            this.d.set(derived, new Set());
            derived.handleChange = (observable, change) => {
                this.d.get(derived).add(observable);
                return existingHandleChange.apply(derived, [observable, change]);
            };
        }
        handleDerivedRecomputed(derived, info) {
            const changedObservables = this.d.get(derived);
            console.log(...this.b([
                formatKind('derived recomputed'),
                styled(derived.debugName, { color: 'BlueViolet' }),
                ...this.c(info),
                this.formatChanges(changedObservables),
                { data: [{ fn: derived._computeFn }] }
            ]));
            changedObservables.clear();
        }
        handleFromEventObservableTriggered(observable, info) {
            console.log(...this.b([
                formatKind('observable from event triggered'),
                styled(observable.debugName, { color: 'BlueViolet' }),
                ...this.c(info),
                { data: [{ fn: observable._getValue }] }
            ]));
        }
        handleAutorunCreated(autorun) {
            const existingHandleChange = autorun.handleChange;
            this.d.set(autorun, new Set());
            autorun.handleChange = (observable, change) => {
                this.d.get(autorun).add(observable);
                return existingHandleChange.apply(autorun, [observable, change]);
            };
        }
        handleAutorunTriggered(autorun) {
            const changedObservables = this.d.get(autorun);
            console.log(...this.b([
                formatKind('autorun'),
                styled(autorun.debugName, { color: 'BlueViolet' }),
                this.formatChanges(changedObservables),
                { data: [{ fn: autorun._runFn }] }
            ]));
            changedObservables.clear();
            this.a++;
        }
        handleAutorunFinished(autorun) {
            this.a--;
        }
        handleBeginTransaction(transaction) {
            let transactionName = transaction.getDebugName();
            if (transactionName === undefined) {
                transactionName = '';
            }
            console.log(...this.b([
                formatKind('transaction'),
                styled(transactionName, { color: 'BlueViolet' }),
                { data: [{ fn: transaction._fn }] }
            ]));
            this.a++;
        }
        handleEndTransaction() {
            this.a--;
        }
    }
    exports.$Mc = $Mc;
    function consoleTextToArgs(text) {
        const styles = new Array();
        const data = [];
        let firstArg = '';
        function process(t) {
            if ('length' in t) {
                for (const item of t) {
                    if (item) {
                        process(item);
                    }
                }
            }
            else if ('text' in t) {
                firstArg += `%c${t.text}`;
                styles.push(t.style);
                if (t.data) {
                    data.push(...t.data);
                }
            }
            else if ('data' in t) {
                data.push(...t.data);
            }
        }
        process(text);
        const result = [firstArg, ...styles];
        result.push(...data);
        return result;
    }
    function normalText(text) {
        return styled(text, { color: 'black' });
    }
    function formatKind(kind) {
        return styled(padStr(`${kind}: `, 10), { color: 'black', bold: true });
    }
    function styled(text, options = {
        color: 'black',
    }) {
        function objToCss(styleObj) {
            return Object.entries(styleObj).reduce((styleString, [propName, propValue]) => {
                return `${styleString}${propName}:${propValue};`;
            }, '');
        }
        const style = {
            color: options.color,
        };
        if (options.strikeThrough) {
            style['text-decoration'] = 'line-through';
        }
        if (options.bold) {
            style['font-weight'] = 'bold';
        }
        return {
            text,
            style: objToCss(style),
        };
    }
    function formatValue(value, availableLen) {
        switch (typeof value) {
            case 'number':
                return '' + value;
            case 'string':
                if (value.length + 2 <= availableLen) {
                    return `"${value}"`;
                }
                return `"${value.substr(0, availableLen - 7)}"+...`;
            case 'boolean':
                return value ? 'true' : 'false';
            case 'undefined':
                return 'undefined';
            case 'object':
                if (value === null) {
                    return 'null';
                }
                if (Array.isArray(value)) {
                    return formatArray(value, availableLen);
                }
                return formatObject(value, availableLen);
            case 'symbol':
                return value.toString();
            case 'function':
                return `[[Function${value.name ? ' ' + value.name : ''}]]`;
            default:
                return '' + value;
        }
    }
    function formatArray(value, availableLen) {
        let result = '[ ';
        let first = true;
        for (const val of value) {
            if (!first) {
                result += ', ';
            }
            if (result.length - 5 > availableLen) {
                result += '...';
                break;
            }
            first = false;
            result += `${formatValue(val, availableLen - result.length)}`;
        }
        result += ' ]';
        return result;
    }
    function formatObject(value, availableLen) {
        let result = '{ ';
        let first = true;
        for (const [key, val] of Object.entries(value)) {
            if (!first) {
                result += ', ';
            }
            if (result.length - 5 > availableLen) {
                result += '...';
                break;
            }
            first = false;
            result += `${key}: ${formatValue(val, availableLen - result.length)}`;
        }
        result += ' }';
        return result;
    }
    function repeat(str, count) {
        let result = '';
        for (let i = 1; i <= count; i++) {
            result += str;
        }
        return result;
    }
    function padStr(str, length) {
        while (str.length < length) {
            str += ' ';
        }
        return str;
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[5/*vs/base/common/observableInternal/base*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/observableInternal/logging*/]), function (require, exports, logging_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$3c = exports.$2c = exports.$1c = exports.$Zc = exports.$Yc = exports.$Xc = exports.$Wc = exports.$Vc = exports.$Uc = exports.$Tc = exports.$Sc = void 0;
    let _derived;
    /**
     * @internal
     * This is to allow splitting files.
    */
    function $Sc(derived) {
        _derived = derived;
    }
    exports.$Sc = $Sc;
    class $Tc {
        get TChange() { return null; }
        reportChanges() {
            this.get();
        }
        /** @sealed */
        read(reader) {
            if (reader) {
                return reader.readObservable(this);
            }
            else {
                return this.get();
            }
        }
        /** @sealed */
        map(fn) {
            return _derived((reader) => fn(this.read(reader), reader), () => {
                const name = $Yc(fn);
                if (name !== undefined) {
                    return name;
                }
                // regexp to match `x => x.y` where x and y can be arbitrary identifiers (uses backref):
                const regexp = /^\s*\(?\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\s*\)?\s*=>\s*\1\.([a-zA-Z_$][a-zA-Z_$0-9]*)\s*$/;
                const match = regexp.exec(fn.toString());
                if (match) {
                    return `${this.debugName}.${match[2]}`;
                }
                return `${this.debugName} (mapped)`;
            });
        }
    }
    exports.$Tc = $Tc;
    class $Uc extends $Tc {
        constructor() {
            super(...arguments);
            this.c = new Set();
        }
        addObserver(observer) {
            const len = this.c.size;
            this.c.add(observer);
            if (len === 0) {
                this.f();
            }
        }
        removeObserver(observer) {
            const deleted = this.c.delete(observer);
            if (deleted && this.c.size === 0) {
                this.g();
            }
        }
        f() { }
        g() { }
    }
    exports.$Uc = $Uc;
    function $Vc(fn, getDebugName) {
        const tx = new $Xc(fn, getDebugName);
        try {
            fn(tx);
        }
        finally {
            tx.finish();
        }
    }
    exports.$Vc = $Vc;
    function $Wc(tx, fn, getDebugName) {
        if (!tx) {
            $Vc(fn, getDebugName);
        }
        else {
            fn(tx);
        }
    }
    exports.$Wc = $Wc;
    class $Xc {
        constructor(_fn, b) {
            this._fn = _fn;
            this.b = b;
            this.a = [];
            (0, logging_1.$Lc)()?.handleBeginTransaction(this);
        }
        getDebugName() {
            if (this.b) {
                return this.b();
            }
            return $Yc(this._fn);
        }
        updateObserver(observer, observable) {
            this.a.push({ observer, observable });
            observer.beginUpdate(observable);
        }
        finish() {
            const updatingObservers = this.a;
            // Prevent anyone from updating observers from now on.
            this.a = null;
            for (const { observer, observable } of updatingObservers) {
                observer.endUpdate(observable);
            }
            (0, logging_1.$Lc)()?.handleEndTransaction();
        }
    }
    exports.$Xc = $Xc;
    function $Yc(fn) {
        const fnSrc = fn.toString();
        // Pattern: /** @description ... */
        const regexp = /\/\*\*\s*@description\s*([^*]*)\*\//;
        const match = regexp.exec(fnSrc);
        const result = match ? match[1] : undefined;
        return result?.trim();
    }
    exports.$Yc = $Yc;
    /**
     * Creates an observable value.
     * Observers get informed when the value changes.
     */
    function $Zc(name, initialValue) {
        return new $1c(name, initialValue);
    }
    exports.$Zc = $Zc;
    class $1c extends $Uc {
        constructor(debugName, initialValue) {
            super();
            this.debugName = debugName;
            this.a = initialValue;
        }
        get() {
            return this.a;
        }
        set(value, tx, change) {
            if (this.a === value) {
                return;
            }
            let _tx;
            if (!tx) {
                tx = _tx = new $Xc(() => { }, () => `Setting ${this.debugName}`);
            }
            try {
                const oldValue = this.a;
                this.b(value);
                (0, logging_1.$Lc)()?.handleObservableChanged(this, { oldValue, newValue: value, change, didChange: true, hadValue: true });
                for (const observer of this.c) {
                    tx.updateObserver(observer, this);
                    observer.handleChange(this, change);
                }
            }
            finally {
                if (_tx) {
                    _tx.finish();
                }
            }
        }
        toString() {
            return `${this.debugName}: ${this.a}`;
        }
        b(newValue) {
            this.a = newValue;
        }
    }
    exports.$1c = $1c;
    function $2c(name, initialValue) {
        return new $3c(name, initialValue);
    }
    exports.$2c = $2c;
    class $3c extends $1c {
        b(newValue) {
            if (this.a === newValue) {
                return;
            }
            if (this.a) {
                this.a.dispose();
            }
            this.a = newValue;
        }
        dispose() {
            this.a?.dispose();
        }
    }
    exports.$3c = $3c;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[9/*vs/base/common/observableInternal/autorun*/], __M([0/*require*/,1/*exports*/,42/*vs/base/common/assert*/,2/*vs/base/common/lifecycle*/,5/*vs/base/common/observableInternal/base*/,4/*vs/base/common/observableInternal/logging*/]), function (require, exports, assert_1, lifecycle_1, base_1, logging_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$xc = exports.$wc = exports.$vc = exports.$uc = exports.$tc = exports.$sc = exports.$rc = void 0;
    function $rc(options, fn) {
        return new $wc(options.debugName, fn, undefined, undefined);
    }
    exports.$rc = $rc;
    function $sc(fn) {
        return new $wc(undefined, fn, undefined, undefined);
    }
    exports.$sc = $sc;
    function $tc(options, fn) {
        return new $wc(options.debugName, fn, options.createEmptyChangeSummary, options.handleChange);
    }
    exports.$tc = $tc;
    function $uc(options, fn) {
        const store = new lifecycle_1.$kb();
        const disposable = $tc({
            debugName: options.debugName ?? (() => (0, base_1.$Yc)(fn)),
            createEmptyChangeSummary: options.createEmptyChangeSummary,
            handleChange: options.handleChange,
        }, (reader, changeSummary) => {
            store.clear();
            fn(reader, changeSummary, store);
        });
        return (0, lifecycle_1.$jb)(() => {
            disposable.dispose();
            store.dispose();
        });
    }
    exports.$uc = $uc;
    function $vc(fn) {
        const store = new lifecycle_1.$kb();
        const disposable = $rc({
            debugName: () => (0, base_1.$Yc)(fn) || '(anonymous)',
        }, reader => {
            store.clear();
            fn(reader, store);
        });
        return (0, lifecycle_1.$jb)(() => {
            disposable.dispose();
            store.dispose();
        });
    }
    exports.$vc = $vc;
    var AutorunState;
    (function (AutorunState) {
        /**
         * A dependency could have changed.
         * We need to explicitly ask them if at least one dependency changed.
         */
        AutorunState[AutorunState["dependenciesMightHaveChanged"] = 1] = "dependenciesMightHaveChanged";
        /**
         * A dependency changed and we need to recompute.
         */
        AutorunState[AutorunState["stale"] = 2] = "stale";
        AutorunState[AutorunState["upToDate"] = 3] = "upToDate";
    })(AutorunState || (AutorunState = {}));
    class $wc {
        get debugName() {
            if (typeof this.h === 'string') {
                return this.h;
            }
            if (typeof this.h === 'function') {
                const name = this.h();
                if (name !== undefined) {
                    return name;
                }
            }
            const name = (0, base_1.$Yc)(this._runFn);
            if (name !== undefined) {
                return name;
            }
            return '(anonymous)';
        }
        constructor(h, _runFn, i, j) {
            this.h = h;
            this._runFn = _runFn;
            this.i = i;
            this.j = j;
            this.a = 2 /* AutorunState.stale */;
            this.b = 0;
            this.c = false;
            this.e = new Set();
            this.f = new Set();
            this.g = this.i?.();
            (0, logging_1.$Lc)()?.handleAutorunCreated(this);
            this.k();
        }
        dispose() {
            this.c = true;
            for (const o of this.e) {
                o.removeObserver(this);
            }
            this.e.clear();
        }
        k() {
            if (this.a === 3 /* AutorunState.upToDate */) {
                return;
            }
            const emptySet = this.f;
            this.f = this.e;
            this.e = emptySet;
            this.a = 3 /* AutorunState.upToDate */;
            try {
                if (!this.c) {
                    (0, logging_1.$Lc)()?.handleAutorunTriggered(this);
                    const changeSummary = this.g;
                    this.g = this.i?.();
                    this._runFn(this, changeSummary);
                }
            }
            finally {
                (0, logging_1.$Lc)()?.handleAutorunFinished(this);
                // We don't want our observed observables to think that they are (not even temporarily) not being observed.
                // Thus, we only unsubscribe from observables that are definitely not read anymore.
                for (const o of this.f) {
                    o.removeObserver(this);
                }
                this.f.clear();
            }
        }
        toString() {
            return `Autorun<${this.debugName}>`;
        }
        // IObserver implementation
        beginUpdate() {
            if (this.a === 3 /* AutorunState.upToDate */) {
                this.a = 1 /* AutorunState.dependenciesMightHaveChanged */;
            }
            this.b++;
        }
        endUpdate() {
            if (this.b === 1) {
                do {
                    if (this.a === 1 /* AutorunState.dependenciesMightHaveChanged */) {
                        this.a = 3 /* AutorunState.upToDate */;
                        for (const d of this.e) {
                            d.reportChanges();
                            if (this.a === 2 /* AutorunState.stale */) {
                                // The other dependencies will refresh on demand
                                break;
                            }
                        }
                    }
                    this.k();
                } while (this.a !== 3 /* AutorunState.upToDate */);
            }
            this.b--;
            (0, assert_1.$pc)(() => this.b >= 0);
        }
        handlePossibleChange(observable) {
            if (this.a === 3 /* AutorunState.upToDate */ && this.e.has(observable) && !this.f.has(observable)) {
                this.a = 1 /* AutorunState.dependenciesMightHaveChanged */;
            }
        }
        handleChange(observable, change) {
            if (this.e.has(observable) && !this.f.has(observable)) {
                const shouldReact = this.j ? this.j({
                    changedObservable: observable,
                    change,
                    didChange: o => o === observable,
                }, this.g) : true;
                if (shouldReact) {
                    this.a = 2 /* AutorunState.stale */;
                }
            }
        }
        // IReader implementation
        readObservable(observable) {
            // In case the run action disposes the autorun
            if (this.c) {
                return observable.get();
            }
            observable.addObserver(this);
            const value = observable.get();
            this.e.add(observable);
            this.f.delete(observable);
            return value;
        }
    }
    exports.$wc = $wc;
    (function ($sc) {
        $sc.Observer = $wc;
    })($sc || (exports.$sc = $sc = {}));
    function $xc(observable, handler) {
        let _lastValue;
        return $rc({ debugName: () => (0, base_1.$Yc)(handler) }, (reader) => {
            const newValue = observable.read(reader);
            const lastValue = _lastValue;
            _lastValue = newValue;
            handler({ lastValue, newValue });
        });
    }
    exports.$xc = $xc;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[10/*vs/base/common/observableInternal/derived*/], __M([0/*require*/,1/*exports*/,6/*vs/base/common/errors*/,2/*vs/base/common/lifecycle*/,5/*vs/base/common/observableInternal/base*/,4/*vs/base/common/observableInternal/logging*/]), function (require, exports, errors_1, lifecycle_1, base_1, logging_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$Rc = exports.$Qc = exports.$Pc = exports.$Oc = exports.$Nc = void 0;
    const defaultEqualityComparer = (a, b) => a === b;
    function $Nc(computeFn, debugName) {
        return new $Rc(debugName, computeFn, undefined, undefined, undefined, defaultEqualityComparer);
    }
    exports.$Nc = $Nc;
    function $Oc(options, computeFn) {
        return new $Rc(options.debugName, computeFn, undefined, undefined, undefined, options.equalityComparer ?? defaultEqualityComparer);
    }
    exports.$Oc = $Oc;
    function $Pc(debugName, options, computeFn) {
        return new $Rc(debugName, computeFn, options.createEmptyChangeSummary, options.handleChange, undefined, defaultEqualityComparer);
    }
    exports.$Pc = $Pc;
    function $Qc(name, computeFn) {
        const store = new lifecycle_1.$kb();
        return new $Rc(name, r => {
            store.clear();
            return computeFn(r, store);
        }, undefined, undefined, () => store.dispose(), defaultEqualityComparer);
    }
    exports.$Qc = $Qc;
    (0, base_1.$Sc)($Nc);
    var DerivedState;
    (function (DerivedState) {
        /** Initial state, no previous value, recomputation needed */
        DerivedState[DerivedState["initial"] = 0] = "initial";
        /**
         * A dependency could have changed.
         * We need to explicitly ask them if at least one dependency changed.
         */
        DerivedState[DerivedState["dependenciesMightHaveChanged"] = 1] = "dependenciesMightHaveChanged";
        /**
         * A dependency changed and we need to recompute.
         * After recomputation, we need to check the previous value to see if we changed as well.
         */
        DerivedState[DerivedState["stale"] = 2] = "stale";
        /**
         * No change reported, our cached value is up to date.
         */
        DerivedState[DerivedState["upToDate"] = 3] = "upToDate";
    })(DerivedState || (DerivedState = {}));
    class $Rc extends base_1.$Uc {
        get debugName() {
            if (!this.m) {
                return (0, base_1.$Yc)(this._computeFn) || '(anonymous)';
            }
            return typeof this.m === 'function' ? this.m() : this.m;
        }
        constructor(m, _computeFn, n, p, q = undefined, s) {
            super();
            this.m = m;
            this._computeFn = _computeFn;
            this.n = n;
            this.p = p;
            this.q = q;
            this.s = s;
            this.e = 0 /* DerivedState.initial */;
            this.h = undefined;
            this.i = 0;
            this.j = new Set();
            this.k = new Set();
            this.l = undefined;
            this.l = this.n?.();
            (0, logging_1.$Lc)()?.handleDerivedCreated(this);
        }
        g() {
            /**
             * We are not tracking changes anymore, thus we have to assume
             * that our cache is invalid.
             */
            this.e = 0 /* DerivedState.initial */;
            this.h = undefined;
            for (const d of this.j) {
                d.removeObserver(this);
            }
            this.j.clear();
            this.q?.();
        }
        get() {
            if (this.c.size === 0) {
                // Without observers, we don't know when to clean up stuff.
                // Thus, we don't cache anything to prevent memory leaks.
                const result = this._computeFn(this, this.n?.());
                // Clear new dependencies
                this.g();
                return result;
            }
            else {
                do {
                    // We might not get a notification for a dependency that changed while it is updating,
                    // thus we also have to ask all our depedencies if they changed in this case.
                    if (this.e === 1 /* DerivedState.dependenciesMightHaveChanged */) {
                        for (const d of this.j) {
                            /** might call {@link handleChange} indirectly, which could make us stale */
                            d.reportChanges();
                            if (this.e === 2 /* DerivedState.stale */) {
                                // The other dependencies will refresh on demand, so early break
                                break;
                            }
                        }
                    }
                    // We called report changes of all dependencies.
                    // If we are still not stale, we can assume to be up to date again.
                    if (this.e === 1 /* DerivedState.dependenciesMightHaveChanged */) {
                        this.e = 3 /* DerivedState.upToDate */;
                    }
                    this.u();
                    // In case recomputation changed one of our dependencies, we need to recompute again.
                } while (this.e !== 3 /* DerivedState.upToDate */);
                return this.h;
            }
        }
        u() {
            if (this.e === 3 /* DerivedState.upToDate */) {
                return;
            }
            const emptySet = this.k;
            this.k = this.j;
            this.j = emptySet;
            const hadValue = this.e !== 0 /* DerivedState.initial */;
            const oldValue = this.h;
            this.e = 3 /* DerivedState.upToDate */;
            const changeSummary = this.l;
            this.l = this.n?.();
            try {
                /** might call {@link handleChange} indirectly, which could invalidate us */
                this.h = this._computeFn(this, changeSummary);
            }
            finally {
                // We don't want our observed observables to think that they are (not even temporarily) not being observed.
                // Thus, we only unsubscribe from observables that are definitely not read anymore.
                for (const o of this.k) {
                    o.removeObserver(this);
                }
                this.k.clear();
            }
            const didChange = hadValue && !(this.s(oldValue, this.h));
            (0, logging_1.$Lc)()?.handleDerivedRecomputed(this, {
                oldValue,
                newValue: this.h,
                change: undefined,
                didChange,
                hadValue,
            });
            if (didChange) {
                for (const r of this.c) {
                    r.handleChange(this, undefined);
                }
            }
        }
        toString() {
            return `LazyDerived<${this.debugName}>`;
        }
        // IObserver Implementation
        beginUpdate(_observable) {
            this.i++;
            const propagateBeginUpdate = this.i === 1;
            if (this.e === 3 /* DerivedState.upToDate */) {
                this.e = 1 /* DerivedState.dependenciesMightHaveChanged */;
                // If we propagate begin update, that will already signal a possible change.
                if (!propagateBeginUpdate) {
                    for (const r of this.c) {
                        r.handlePossibleChange(this);
                    }
                }
            }
            if (propagateBeginUpdate) {
                for (const r of this.c) {
                    r.beginUpdate(this); // This signals a possible change
                }
            }
        }
        endUpdate(_observable) {
            this.i--;
            if (this.i === 0) {
                // End update could change the observer list.
                const observers = [...this.c];
                for (const r of observers) {
                    r.endUpdate(this);
                }
            }
            if (this.i < 0) {
                throw new errors_1.$bb();
            }
        }
        handlePossibleChange(observable) {
            // In all other states, observers already know that we might have changed.
            if (this.e === 3 /* DerivedState.upToDate */ && this.j.has(observable) && !this.k.has(observable)) {
                this.e = 1 /* DerivedState.dependenciesMightHaveChanged */;
                for (const r of this.c) {
                    r.handlePossibleChange(this);
                }
            }
        }
        handleChange(observable, change) {
            if (this.j.has(observable) && !this.k.has(observable)) {
                const shouldReact = this.p ? this.p({
                    changedObservable: observable,
                    change,
                    didChange: o => o === observable,
                }, this.l) : true;
                const wasUpToDate = this.e === 3 /* DerivedState.upToDate */;
                if (shouldReact && (this.e === 1 /* DerivedState.dependenciesMightHaveChanged */ || wasUpToDate)) {
                    this.e = 2 /* DerivedState.stale */;
                    if (wasUpToDate) {
                        for (const r of this.c) {
                            r.handlePossibleChange(this);
                        }
                    }
                }
            }
        }
        // IReader Implementation
        readObservable(observable) {
            // Subscribe before getting the value to enable caching
            observable.addObserver(this);
            /** This might call {@link handleChange} indirectly, which could invalidate us */
            const value = observable.get();
            // Which is why we only add the observable to the dependencies now.
            this.j.add(observable);
            this.k.delete(observable);
            return value;
        }
        addObserver(observer) {
            const shouldCallBeginUpdate = !this.c.has(observer) && this.i > 0;
            super.addObserver(observer);
            if (shouldCallBeginUpdate) {
                observer.beginUpdate(this);
            }
        }
        removeObserver(observer) {
            const shouldCallEndUpdate = this.c.has(observer) && this.i > 0;
            super.removeObserver(observer);
            if (shouldCallEndUpdate) {
                // Calling end update after removing the observer makes sure endUpdate cannot be called twice here.
                observer.endUpdate(this);
            }
        }
    }
    exports.$Rc = $Rc;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[22/*vs/base/common/observableInternal/utils*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/lifecycle*/,9/*vs/base/common/observableInternal/autorun*/,5/*vs/base/common/observableInternal/base*/,10/*vs/base/common/observableInternal/derived*/,4/*vs/base/common/observableInternal/logging*/]), function (require, exports, lifecycle_1, autorun_1, base_1, derived_1, logging_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$Jc = exports.$Ic = exports.$Hc = exports.$Gc = exports.$Fc = exports.$Ec = exports.$Dc = exports.$Cc = exports.$Bc = exports.$Ac = exports.$zc = exports.$yc = void 0;
    /**
     * Represents an efficient observable whose value never changes.
     */
    function $yc(value) {
        return new ConstObservable(value);
    }
    exports.$yc = $yc;
    class ConstObservable extends base_1.$Tc {
        constructor(a) {
            super();
            this.a = a;
        }
        get debugName() {
            return this.toString();
        }
        get() {
            return this.a;
        }
        addObserver(observer) {
            // NO OP
        }
        removeObserver(observer) {
            // NO OP
        }
        toString() {
            return `Const: ${this.a}`;
        }
    }
    function $zc(promise) {
        const observable = (0, base_1.$Zc)('promiseValue', {});
        promise.then((value) => {
            observable.set({ value }, undefined);
        });
        return observable;
    }
    exports.$zc = $zc;
    function $Ac(observable, predicate) {
        return new Promise(resolve => {
            let didRun = false;
            let shouldDispose = false;
            const d = (0, autorun_1.$sc)(reader => {
                /** @description waitForState */
                const currentState = observable.read(reader);
                if (predicate(currentState)) {
                    if (!didRun) {
                        shouldDispose = true;
                    }
                    else {
                        d.dispose();
                    }
                    resolve(currentState);
                }
            });
            didRun = true;
            if (shouldDispose) {
                d.dispose();
            }
        });
    }
    exports.$Ac = $Ac;
    function $Bc(event, getValue) {
        return new $Cc(event, getValue);
    }
    exports.$Bc = $Bc;
    class $Cc extends base_1.$Uc {
        constructor(h, _getValue) {
            super();
            this.h = h;
            this._getValue = _getValue;
            this.b = false;
            this.k = (args) => {
                const newValue = this._getValue(args);
                const didChange = !this.b || this.a !== newValue;
                (0, logging_1.$Lc)()?.handleFromEventObservableTriggered(this, { oldValue: this.a, newValue, change: undefined, didChange, hadValue: this.b });
                if (didChange) {
                    this.a = newValue;
                    if (this.b) {
                        (0, base_1.$Vc)((tx) => {
                            for (const o of this.c) {
                                tx.updateObserver(o, this);
                                o.handleChange(this, undefined);
                            }
                        }, () => {
                            const name = this.i();
                            return 'Event fired' + (name ? `: ${name}` : '');
                        });
                    }
                    this.b = true;
                }
            };
        }
        i() {
            return (0, base_1.$Yc)(this._getValue);
        }
        get debugName() {
            const name = this.i();
            return 'From Event' + (name ? `: ${name}` : '');
        }
        f() {
            this.e = this.h(this.k);
        }
        g() {
            this.e.dispose();
            this.e = undefined;
            this.b = false;
            this.a = undefined;
        }
        get() {
            if (this.e) {
                if (!this.b) {
                    this.k(undefined);
                }
                return this.a;
            }
            else {
                // no cache, as there are no subscribers to keep it updated
                return this._getValue(undefined);
            }
        }
    }
    exports.$Cc = $Cc;
    (function ($Bc) {
        $Bc.Observer = $Cc;
    })($Bc || (exports.$Bc = $Bc = {}));
    function $Dc(debugName, event) {
        return new FromEventObservableSignal(debugName, event);
    }
    exports.$Dc = $Dc;
    class FromEventObservableSignal extends base_1.$Uc {
        constructor(debugName, b) {
            super();
            this.debugName = debugName;
            this.b = b;
            this.h = () => {
                (0, base_1.$Vc)((tx) => {
                    for (const o of this.c) {
                        tx.updateObserver(o, this);
                        o.handleChange(this, undefined);
                    }
                }, () => this.debugName);
            };
        }
        f() {
            this.a = this.b(this.h);
        }
        g() {
            this.a.dispose();
            this.a = undefined;
        }
        get() {
            // NO OP
        }
    }
    /**
     * Creates a signal that can be triggered to invalidate observers.
     * Signals don't have a value - when they are triggered they indicate a change.
     * However, signals can carry a delta that is passed to observers.
     */
    function $Ec(debugName) {
        return new ObservableSignal(debugName);
    }
    exports.$Ec = $Ec;
    class ObservableSignal extends base_1.$Uc {
        constructor(debugName) {
            super();
            this.debugName = debugName;
        }
        trigger(tx, change) {
            if (!tx) {
                (0, base_1.$Vc)(tx => {
                    this.trigger(tx, change);
                }, () => `Trigger signal ${this.debugName}`);
                return;
            }
            for (const o of this.c) {
                tx.updateObserver(o, this);
                o.handleChange(this, change);
            }
        }
        get() {
            // NO OP
        }
    }
    function $Fc(observable, debounceMs, disposableStore) {
        const debouncedObservable = (0, base_1.$Zc)('debounced', undefined);
        let timeout = undefined;
        disposableStore.add((0, autorun_1.$sc)(reader => {
            /** @description debounce */
            const value = observable.read(reader);
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                (0, base_1.$Vc)(tx => {
                    debouncedObservable.set(value, tx);
                });
            }, debounceMs);
        }));
        return debouncedObservable;
    }
    exports.$Fc = $Fc;
    function $Gc(event, timeoutMs, disposableStore) {
        const observable = (0, base_1.$Zc)('triggeredRecently', false);
        let timeout = undefined;
        disposableStore.add(event(() => {
            observable.set(true, undefined);
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                observable.set(false, undefined);
            }, timeoutMs);
        }));
        return observable;
    }
    exports.$Gc = $Gc;
    // TODO@hediet: Have `keepCacheAlive` and `recomputeOnChange` instead of forceRecompute
    /**
     * This ensures the observable is being observed.
     * Observed observables (such as {@link $Nc}s) can maintain a cache, as they receive invalidation events.
     * Unobserved observables are forced to recompute their value from scratch every time they are read.
     *
     * @param observable the observable to keep alive
     * @param forceRecompute if true, the observable will be eagerly recomputed after it changed.
     * Use this if recomputing the observables causes side-effects.
    */
    function $Hc(observable, forceRecompute) {
        const o = new KeepAliveObserver(forceRecompute ?? false);
        observable.addObserver(o);
        if (forceRecompute) {
            observable.reportChanges();
        }
        return (0, lifecycle_1.$jb)(() => {
            observable.removeObserver(o);
        });
    }
    exports.$Hc = $Hc;
    class KeepAliveObserver {
        constructor(b) {
            this.b = b;
            this.a = 0;
        }
        beginUpdate(observable) {
            this.a++;
        }
        endUpdate(observable) {
            this.a--;
            if (this.a === 0 && this.b) {
                observable.reportChanges();
            }
        }
        handlePossibleChange(observable) {
            // NO OP
        }
        handleChange(observable, change) {
            // NO OP
        }
    }
    function $Ic(name, computeFn) {
        let lastValue = undefined;
        const observable = (0, derived_1.$Nc)(reader => {
            lastValue = computeFn(reader, lastValue);
            return lastValue;
        }, name);
        return observable;
    }
    exports.$Ic = $Ic;
    function $Jc(name, computeFn) {
        let lastValue = undefined;
        const counter = (0, base_1.$Zc)('derivedObservableWithWritableCache.counter', 0);
        const observable = (0, derived_1.$Nc)(reader => {
            counter.read(reader);
            lastValue = computeFn(reader, lastValue);
            return lastValue;
        }, name);
        return Object.assign(observable, {
            clearCache: (transaction) => {
                lastValue = undefined;
                counter.set(counter.get() + 1, transaction);
            },
        });
    }
    exports.$Jc = $Jc;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[11/*vs/base/common/observable*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/observableInternal/base*/,10/*vs/base/common/observableInternal/derived*/,9/*vs/base/common/observableInternal/autorun*/,22/*vs/base/common/observableInternal/utils*/,4/*vs/base/common/observableInternal/logging*/]), function (require, exports, base_1, derived_1, autorun_1, utils_1, logging_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wasEventTriggeredRecently = exports.waitForState = exports.observableSignalFromEvent = exports.observableSignal = exports.observableFromPromise = exports.observableFromEvent = exports.keepAlive = exports.derivedObservableWithWritableCache = exports.derivedObservableWithCache = exports.debouncedObservable = exports.constObservable = exports.autorunWithStoreHandleChanges = exports.autorunOpts = exports.autorunWithStore = exports.autorunHandleChanges = exports.autorunDelta = exports.autorun = exports.derivedWithStore = exports.derivedHandleChanges = exports.derivedOpts = exports.derived = exports.subtransaction = exports.transaction = exports.disposableObservableValue = exports.observableValue = void 0;
    Object.defineProperty(exports, "observableValue", { enumerable: true, get: function () { return base_1.$Zc; } });
    Object.defineProperty(exports, "disposableObservableValue", { enumerable: true, get: function () { return base_1.$2c; } });
    Object.defineProperty(exports, "transaction", { enumerable: true, get: function () { return base_1.$Vc; } });
    Object.defineProperty(exports, "subtransaction", { enumerable: true, get: function () { return base_1.$Wc; } });
    Object.defineProperty(exports, "derived", { enumerable: true, get: function () { return derived_1.$Nc; } });
    Object.defineProperty(exports, "derivedOpts", { enumerable: true, get: function () { return derived_1.$Oc; } });
    Object.defineProperty(exports, "derivedHandleChanges", { enumerable: true, get: function () { return derived_1.$Pc; } });
    Object.defineProperty(exports, "derivedWithStore", { enumerable: true, get: function () { return derived_1.$Qc; } });
    Object.defineProperty(exports, "autorun", { enumerable: true, get: function () { return autorun_1.$sc; } });
    Object.defineProperty(exports, "autorunDelta", { enumerable: true, get: function () { return autorun_1.$xc; } });
    Object.defineProperty(exports, "autorunHandleChanges", { enumerable: true, get: function () { return autorun_1.$tc; } });
    Object.defineProperty(exports, "autorunWithStore", { enumerable: true, get: function () { return autorun_1.$vc; } });
    Object.defineProperty(exports, "autorunOpts", { enumerable: true, get: function () { return autorun_1.$rc; } });
    Object.defineProperty(exports, "autorunWithStoreHandleChanges", { enumerable: true, get: function () { return autorun_1.$uc; } });
    Object.defineProperty(exports, "constObservable", { enumerable: true, get: function () { return utils_1.$yc; } });
    Object.defineProperty(exports, "debouncedObservable", { enumerable: true, get: function () { return utils_1.$Fc; } });
    Object.defineProperty(exports, "derivedObservableWithCache", { enumerable: true, get: function () { return utils_1.$Ic; } });
    Object.defineProperty(exports, "derivedObservableWithWritableCache", { enumerable: true, get: function () { return utils_1.$Jc; } });
    Object.defineProperty(exports, "keepAlive", { enumerable: true, get: function () { return utils_1.$Hc; } });
    Object.defineProperty(exports, "observableFromEvent", { enumerable: true, get: function () { return utils_1.$Bc; } });
    Object.defineProperty(exports, "observableFromPromise", { enumerable: true, get: function () { return utils_1.$zc; } });
    Object.defineProperty(exports, "observableSignal", { enumerable: true, get: function () { return utils_1.$Ec; } });
    Object.defineProperty(exports, "observableSignalFromEvent", { enumerable: true, get: function () { return utils_1.$Dc; } });
    Object.defineProperty(exports, "waitForState", { enumerable: true, get: function () { return utils_1.$Ac; } });
    Object.defineProperty(exports, "wasEventTriggeredRecently", { enumerable: true, get: function () { return utils_1.$Gc; } });
    const enableLogging = false;
    if (enableLogging) {
        (0, logging_1.$Kc)(new logging_1.$Mc());
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[23/*vs/base/common/stream*/], __M([0/*require*/,1/*exports*/,6/*vs/base/common/errors*/,2/*vs/base/common/lifecycle*/]), function (require, exports, errors_1, lifecycle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$Ib = exports.$Hb = exports.$Gb = exports.$Fb = exports.$Eb = exports.$Db = exports.$Cb = exports.$Bb = exports.$Ab = exports.$zb = exports.$yb = exports.$xb = exports.$wb = exports.$vb = exports.$ub = void 0;
    function $ub(obj) {
        const candidate = obj;
        if (!candidate) {
            return false;
        }
        return typeof candidate.read === 'function';
    }
    exports.$ub = $ub;
    function $vb(obj) {
        const candidate = obj;
        if (!candidate) {
            return false;
        }
        return [candidate.on, candidate.pause, candidate.resume, candidate.destroy].every(fn => typeof fn === 'function');
    }
    exports.$vb = $vb;
    function $wb(obj) {
        const candidate = obj;
        if (!candidate) {
            return false;
        }
        return $vb(candidate.stream) && Array.isArray(candidate.buffer) && typeof candidate.ended === 'boolean';
    }
    exports.$wb = $wb;
    function $xb(reducer, options) {
        return new WriteableStreamImpl(reducer, options);
    }
    exports.$xb = $xb;
    class WriteableStreamImpl {
        constructor(e, f) {
            this.e = e;
            this.f = f;
            this.a = {
                flowing: false,
                ended: false,
                destroyed: false
            };
            this.b = {
                data: [],
                error: []
            };
            this.c = {
                data: [],
                error: [],
                end: []
            };
            this.d = [];
        }
        pause() {
            if (this.a.destroyed) {
                return;
            }
            this.a.flowing = false;
        }
        resume() {
            if (this.a.destroyed) {
                return;
            }
            if (!this.a.flowing) {
                this.a.flowing = true;
                // emit buffered events
                this.j();
                this.k();
                this.l();
            }
        }
        write(data) {
            if (this.a.destroyed) {
                return;
            }
            // flowing: directly send the data to listeners
            if (this.a.flowing) {
                this.g(data);
            }
            // not yet flowing: buffer data until flowing
            else {
                this.b.data.push(data);
                // highWaterMark: if configured, signal back when buffer reached limits
                if (typeof this.f?.highWaterMark === 'number' && this.b.data.length > this.f.highWaterMark) {
                    return new Promise(resolve => this.d.push(resolve));
                }
            }
        }
        error(error) {
            if (this.a.destroyed) {
                return;
            }
            // flowing: directly send the error to listeners
            if (this.a.flowing) {
                this.h(error);
            }
            // not yet flowing: buffer errors until flowing
            else {
                this.b.error.push(error);
            }
        }
        end(result) {
            if (this.a.destroyed) {
                return;
            }
            // end with data if provided
            if (typeof result !== 'undefined') {
                this.write(result);
            }
            // flowing: send end event to listeners
            if (this.a.flowing) {
                this.i();
                this.destroy();
            }
            // not yet flowing: remember state
            else {
                this.a.ended = true;
            }
        }
        g(data) {
            this.c.data.slice(0).forEach(listener => listener(data)); // slice to avoid listener mutation from delivering event
        }
        h(error) {
            if (this.c.error.length === 0) {
                (0, errors_1.$Y)(error); // nobody listened to this error so we log it as unexpected
            }
            else {
                this.c.error.slice(0).forEach(listener => listener(error)); // slice to avoid listener mutation from delivering event
            }
        }
        i() {
            this.c.end.slice(0).forEach(listener => listener()); // slice to avoid listener mutation from delivering event
        }
        on(event, callback) {
            if (this.a.destroyed) {
                return;
            }
            switch (event) {
                case 'data':
                    this.c.data.push(callback);
                    // switch into flowing mode as soon as the first 'data'
                    // listener is added and we are not yet in flowing mode
                    this.resume();
                    break;
                case 'end':
                    this.c.end.push(callback);
                    // emit 'end' event directly if we are flowing
                    // and the end has already been reached
                    //
                    // finish() when it went through
                    if (this.a.flowing && this.l()) {
                        this.destroy();
                    }
                    break;
                case 'error':
                    this.c.error.push(callback);
                    // emit buffered 'error' events unless done already
                    // now that we know that we have at least one listener
                    if (this.a.flowing) {
                        this.k();
                    }
                    break;
            }
        }
        removeListener(event, callback) {
            if (this.a.destroyed) {
                return;
            }
            let listeners = undefined;
            switch (event) {
                case 'data':
                    listeners = this.c.data;
                    break;
                case 'end':
                    listeners = this.c.end;
                    break;
                case 'error':
                    listeners = this.c.error;
                    break;
            }
            if (listeners) {
                const index = listeners.indexOf(callback);
                if (index >= 0) {
                    listeners.splice(index, 1);
                }
            }
        }
        j() {
            if (this.b.data.length > 0) {
                const fullDataBuffer = this.e(this.b.data);
                this.g(fullDataBuffer);
                this.b.data.length = 0;
                // When the buffer is empty, resolve all pending writers
                const pendingWritePromises = [...this.d];
                this.d.length = 0;
                pendingWritePromises.forEach(pendingWritePromise => pendingWritePromise());
            }
        }
        k() {
            if (this.c.error.length > 0) {
                for (const error of this.b.error) {
                    this.h(error);
                }
                this.b.error.length = 0;
            }
        }
        l() {
            if (this.a.ended) {
                this.i();
                return this.c.end.length > 0;
            }
            return false;
        }
        destroy() {
            if (!this.a.destroyed) {
                this.a.destroyed = true;
                this.a.ended = true;
                this.b.data.length = 0;
                this.b.error.length = 0;
                this.c.data.length = 0;
                this.c.error.length = 0;
                this.c.end.length = 0;
                this.d.length = 0;
            }
        }
    }
    /**
     * Helper to fully read a T readable into a T.
     */
    function $yb(readable, reducer) {
        const chunks = [];
        let chunk;
        while ((chunk = readable.read()) !== null) {
            chunks.push(chunk);
        }
        return reducer(chunks);
    }
    exports.$yb = $yb;
    /**
     * Helper to read a T readable up to a maximum of chunks. If the limit is
     * reached, will return a readable instead to ensure all data can still
     * be read.
     */
    function $zb(readable, reducer, maxChunks) {
        const chunks = [];
        let chunk = undefined;
        while ((chunk = readable.read()) !== null && chunks.length < maxChunks) {
            chunks.push(chunk);
        }
        // If the last chunk is null, it means we reached the end of
        // the readable and return all the data at once
        if (chunk === null && chunks.length > 0) {
            return reducer(chunks);
        }
        // Otherwise, we still have a chunk, it means we reached the maxChunks
        // value and as such we return a new Readable that first returns
        // the existing read chunks and then continues with reading from
        // the underlying readable.
        return {
            read: () => {
                // First consume chunks from our array
                if (chunks.length > 0) {
                    return chunks.shift();
                }
                // Then ensure to return our last read chunk
                if (typeof chunk !== 'undefined') {
                    const lastReadChunk = chunk;
                    // explicitly use undefined here to indicate that we consumed
                    // the chunk, which could have either been null or valued.
                    chunk = undefined;
                    return lastReadChunk;
                }
                // Finally delegate back to the Readable
                return readable.read();
            }
        };
    }
    exports.$zb = $zb;
    function $Ab(stream, reducer) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            $Bb(stream, {
                onData: chunk => {
                    if (reducer) {
                        chunks.push(chunk);
                    }
                },
                onError: error => {
                    if (reducer) {
                        reject(error);
                    }
                    else {
                        resolve(undefined);
                    }
                },
                onEnd: () => {
                    if (reducer) {
                        resolve(reducer(chunks));
                    }
                    else {
                        resolve(undefined);
                    }
                }
            });
        });
    }
    exports.$Ab = $Ab;
    /**
     * Helper to listen to all events of a T stream in proper order.
     */
    function $Bb(stream, listener) {
        let destroyed = false;
        stream.on('error', error => {
            if (!destroyed) {
                listener.onError(error);
            }
        });
        stream.on('end', () => {
            if (!destroyed) {
                listener.onEnd();
            }
        });
        // Adding the `data` listener will turn the stream
        // into flowing mode. As such it is important to
        // add this listener last (DO NOT CHANGE!)
        stream.on('data', data => {
            if (!destroyed) {
                listener.onData(data);
            }
        });
        return (0, lifecycle_1.$jb)(() => destroyed = true);
    }
    exports.$Bb = $Bb;
    /**
     * Helper to peek up to `maxChunks` into a stream. The return type signals if
     * the stream has ended or not. If not, caller needs to add a `data` listener
     * to continue reading.
     */
    function $Cb(stream, maxChunks) {
        return new Promise((resolve, reject) => {
            const streamListeners = new lifecycle_1.$kb();
            const buffer = [];
            // Data Listener
            const dataListener = (chunk) => {
                // Add to buffer
                buffer.push(chunk);
                // We reached maxChunks and thus need to return
                if (buffer.length > maxChunks) {
                    // Dispose any listeners and ensure to pause the
                    // stream so that it can be consumed again by caller
                    streamListeners.dispose();
                    stream.pause();
                    return resolve({ stream, buffer, ended: false });
                }
            };
            // Error Listener
            const errorListener = (error) => {
                return reject(error);
            };
            // End Listener
            const endListener = () => {
                return resolve({ stream, buffer, ended: true });
            };
            streamListeners.add((0, lifecycle_1.$jb)(() => stream.removeListener('error', errorListener)));
            stream.on('error', errorListener);
            streamListeners.add((0, lifecycle_1.$jb)(() => stream.removeListener('end', endListener)));
            stream.on('end', endListener);
            // Important: leave the `data` listener last because
            // this can turn the stream into flowing mode and we
            // want `error` events to be received as well.
            streamListeners.add((0, lifecycle_1.$jb)(() => stream.removeListener('data', dataListener)));
            stream.on('data', dataListener);
        });
    }
    exports.$Cb = $Cb;
    /**
     * Helper to create a readable stream from an existing T.
     */
    function $Db(t, reducer) {
        const stream = $xb(reducer);
        stream.end(t);
        return stream;
    }
    exports.$Db = $Db;
    /**
     * Helper to create an empty stream
     */
    function $Eb() {
        const stream = $xb(() => { throw new Error('not supported'); });
        stream.end();
        return stream;
    }
    exports.$Eb = $Eb;
    /**
     * Helper to convert a T into a Readable<T>.
     */
    function $Fb(t) {
        let consumed = false;
        return {
            read: () => {
                if (consumed) {
                    return null;
                }
                consumed = true;
                return t;
            }
        };
    }
    exports.$Fb = $Fb;
    /**
     * Helper to transform a readable stream into another stream.
     */
    function $Gb(stream, transformer, reducer) {
        const target = $xb(reducer);
        $Bb(stream, {
            onData: data => target.write(transformer.data(data)),
            onError: error => target.error(transformer.error ? transformer.error(error) : error),
            onEnd: () => target.end()
        });
        return target;
    }
    exports.$Gb = $Gb;
    /**
     * Helper to take an existing readable that will
     * have a prefix injected to the beginning.
     */
    function $Hb(prefix, readable, reducer) {
        let prefixHandled = false;
        return {
            read: () => {
                const chunk = readable.read();
                // Handle prefix only once
                if (!prefixHandled) {
                    prefixHandled = true;
                    // If we have also a read-result, make
                    // sure to reduce it to a single result
                    if (chunk !== null) {
                        return reducer([prefix, chunk]);
                    }
                    // Otherwise, just return prefix directly
                    return prefix;
                }
                return chunk;
            }
        };
    }
    exports.$Hb = $Hb;
    /**
     * Helper to take an existing stream that will
     * have a prefix injected to the beginning.
     */
    function $Ib(prefix, stream, reducer) {
        let prefixHandled = false;
        const target = $xb(reducer);
        $Bb(stream, {
            onData: data => {
                // Handle prefix only once
                if (!prefixHandled) {
                    prefixHandled = true;
                    return target.write(reducer([prefix, data]));
                }
                return target.write(data);
            },
            onError: error => target.error(error),
            onEnd: () => {
                // Handle prefix only once
                if (!prefixHandled) {
                    prefixHandled = true;
                    target.write(prefix);
                }
                target.end();
            }
        });
        return target;
    }
    exports.$Ib = $Ib;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[12/*vs/base/common/buffer*/], __M([0/*require*/,1/*exports*/,43/*vs/base/common/lazy*/,23/*vs/base/common/stream*/]), function (require, exports, lazy_1, streams) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$4b = exports.$3b = exports.$2b = exports.$1b = exports.$Zb = exports.$Yb = exports.$Xb = exports.$Wb = exports.$Vb = exports.$Ub = exports.$Tb = exports.$Sb = exports.$Rb = exports.$Qb = exports.$Pb = exports.$Ob = exports.$Nb = exports.$Mb = exports.$Lb = exports.$Kb = exports.$Jb = void 0;
    const hasBuffer = (typeof Buffer !== 'undefined');
    const indexOfTable = new lazy_1.$T(() => new Uint8Array(256));
    let textEncoder;
    let textDecoder;
    class $Jb {
        /**
         * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
         * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
         */
        static alloc(byteLength) {
            if (hasBuffer) {
                return new $Jb(Buffer.allocUnsafe(byteLength));
            }
            else {
                return new $Jb(new Uint8Array(byteLength));
            }
        }
        /**
         * When running in a nodejs context, if `actual` is not a nodejs Buffer, the backing store for
         * the returned `VSBuffer` instance might use a nodejs Buffer allocated from node's Buffer pool,
         * which is not transferrable.
         */
        static wrap(actual) {
            if (hasBuffer && !(Buffer.isBuffer(actual))) {
                // https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html#buffer_class_method_buffer_from_arraybuffer_byteoffset_length
                // Create a zero-copy Buffer wrapper around the ArrayBuffer pointed to by the Uint8Array
                actual = Buffer.from(actual.buffer, actual.byteOffset, actual.byteLength);
            }
            return new $Jb(actual);
        }
        /**
         * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
         * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
         */
        static fromString(source, options) {
            const dontUseNodeBuffer = options?.dontUseNodeBuffer || false;
            if (!dontUseNodeBuffer && hasBuffer) {
                return new $Jb(Buffer.from(source));
            }
            else {
                if (!textEncoder) {
                    textEncoder = new TextEncoder();
                }
                return new $Jb(textEncoder.encode(source));
            }
        }
        /**
         * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
         * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
         */
        static fromByteArray(source) {
            const result = $Jb.alloc(source.length);
            for (let i = 0, len = source.length; i < len; i++) {
                result.buffer[i] = source[i];
            }
            return result;
        }
        /**
         * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
         * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
         */
        static concat(buffers, totalLength) {
            if (typeof totalLength === 'undefined') {
                totalLength = 0;
                for (let i = 0, len = buffers.length; i < len; i++) {
                    totalLength += buffers[i].byteLength;
                }
            }
            const ret = $Jb.alloc(totalLength);
            let offset = 0;
            for (let i = 0, len = buffers.length; i < len; i++) {
                const element = buffers[i];
                ret.set(element, offset);
                offset += element.byteLength;
            }
            return ret;
        }
        constructor(buffer) {
            this.buffer = buffer;
            this.byteLength = this.buffer.byteLength;
        }
        /**
         * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
         * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
         */
        clone() {
            const result = $Jb.alloc(this.byteLength);
            result.set(this);
            return result;
        }
        toString() {
            if (hasBuffer) {
                return this.buffer.toString();
            }
            else {
                if (!textDecoder) {
                    textDecoder = new TextDecoder();
                }
                return textDecoder.decode(this.buffer);
            }
        }
        slice(start, end) {
            // IMPORTANT: use subarray instead of slice because TypedArray#slice
            // creates shallow copy and NodeBuffer#slice doesn't. The use of subarray
            // ensures the same, performance, behaviour.
            return new $Jb(this.buffer.subarray(start, end));
        }
        set(array, offset) {
            if (array instanceof $Jb) {
                this.buffer.set(array.buffer, offset);
            }
            else if (array instanceof Uint8Array) {
                this.buffer.set(array, offset);
            }
            else if (array instanceof ArrayBuffer) {
                this.buffer.set(new Uint8Array(array), offset);
            }
            else if (ArrayBuffer.isView(array)) {
                this.buffer.set(new Uint8Array(array.buffer, array.byteOffset, array.byteLength), offset);
            }
            else {
                throw new Error(`Unknown argument 'array'`);
            }
        }
        readUInt32BE(offset) {
            return $Nb(this.buffer, offset);
        }
        writeUInt32BE(value, offset) {
            $Ob(this.buffer, value, offset);
        }
        readUInt32LE(offset) {
            return $Pb(this.buffer, offset);
        }
        writeUInt32LE(value, offset) {
            $Qb(this.buffer, value, offset);
        }
        readUInt8(offset) {
            return $Rb(this.buffer, offset);
        }
        writeUInt8(value, offset) {
            $Sb(this.buffer, value, offset);
        }
        indexOf(subarray, offset = 0) {
            return $Kb(this.buffer, subarray instanceof $Jb ? subarray.buffer : subarray, offset);
        }
    }
    exports.$Jb = $Jb;
    /**
     * Like String.indexOf, but works on Uint8Arrays.
     * Uses the boyer-moore-horspool algorithm to be reasonably speedy.
     */
    function $Kb(haystack, needle, offset = 0) {
        const needleLen = needle.byteLength;
        const haystackLen = haystack.byteLength;
        if (needleLen === 0) {
            return 0;
        }
        if (needleLen === 1) {
            return haystack.indexOf(needle[0]);
        }
        if (needleLen > haystackLen - offset) {
            return -1;
        }
        // find index of the subarray using boyer-moore-horspool algorithm
        const table = indexOfTable.value;
        table.fill(needle.length);
        for (let i = 0; i < needle.length; i++) {
            table[needle[i]] = needle.length - i - 1;
        }
        let i = offset + needle.length - 1;
        let j = i;
        let result = -1;
        while (i < haystackLen) {
            if (haystack[i] === needle[j]) {
                if (j === 0) {
                    result = i;
                    break;
                }
                i--;
                j--;
            }
            else {
                i += Math.max(needle.length - j, table[haystack[i]]);
                j = needle.length - 1;
            }
        }
        return result;
    }
    exports.$Kb = $Kb;
    function $Lb(source, offset) {
        return (((source[offset + 0] << 0) >>> 0) |
            ((source[offset + 1] << 8) >>> 0));
    }
    exports.$Lb = $Lb;
    function $Mb(destination, value, offset) {
        destination[offset + 0] = (value & 0b11111111);
        value = value >>> 8;
        destination[offset + 1] = (value & 0b11111111);
    }
    exports.$Mb = $Mb;
    function $Nb(source, offset) {
        return (source[offset] * 2 ** 24
            + source[offset + 1] * 2 ** 16
            + source[offset + 2] * 2 ** 8
            + source[offset + 3]);
    }
    exports.$Nb = $Nb;
    function $Ob(destination, value, offset) {
        destination[offset + 3] = value;
        value = value >>> 8;
        destination[offset + 2] = value;
        value = value >>> 8;
        destination[offset + 1] = value;
        value = value >>> 8;
        destination[offset] = value;
    }
    exports.$Ob = $Ob;
    function $Pb(source, offset) {
        return (((source[offset + 0] << 0) >>> 0) |
            ((source[offset + 1] << 8) >>> 0) |
            ((source[offset + 2] << 16) >>> 0) |
            ((source[offset + 3] << 24) >>> 0));
    }
    exports.$Pb = $Pb;
    function $Qb(destination, value, offset) {
        destination[offset + 0] = (value & 0b11111111);
        value = value >>> 8;
        destination[offset + 1] = (value & 0b11111111);
        value = value >>> 8;
        destination[offset + 2] = (value & 0b11111111);
        value = value >>> 8;
        destination[offset + 3] = (value & 0b11111111);
    }
    exports.$Qb = $Qb;
    function $Rb(source, offset) {
        return source[offset];
    }
    exports.$Rb = $Rb;
    function $Sb(destination, value, offset) {
        destination[offset] = value;
    }
    exports.$Sb = $Sb;
    function $Tb(readable) {
        return streams.$yb(readable, chunks => $Jb.concat(chunks));
    }
    exports.$Tb = $Tb;
    function $Ub(buffer) {
        return streams.$Fb(buffer);
    }
    exports.$Ub = $Ub;
    function $Vb(stream) {
        return streams.$Ab(stream, chunks => $Jb.concat(chunks));
    }
    exports.$Vb = $Vb;
    async function $Wb(bufferedStream) {
        if (bufferedStream.ended) {
            return $Jb.concat(bufferedStream.buffer);
        }
        return $Jb.concat([
            // Include already read chunks...
            ...bufferedStream.buffer,
            // ...and all additional chunks
            await $Vb(bufferedStream.stream)
        ]);
    }
    exports.$Wb = $Wb;
    function $Xb(buffer) {
        return streams.$Db(buffer, chunks => $Jb.concat(chunks));
    }
    exports.$Xb = $Xb;
    function $Yb(stream) {
        return streams.$Gb(stream, { data: data => typeof data === 'string' ? $Jb.fromString(data) : $Jb.wrap(data) }, chunks => $Jb.concat(chunks));
    }
    exports.$Yb = $Yb;
    function $Zb(options) {
        return streams.$xb(chunks => $Jb.concat(chunks), options);
    }
    exports.$Zb = $Zb;
    function $1b(prefix, readable) {
        return streams.$Hb(prefix, readable, chunks => $Jb.concat(chunks));
    }
    exports.$1b = $1b;
    function $2b(prefix, stream) {
        return streams.$Ib(prefix, stream, chunks => $Jb.concat(chunks));
    }
    exports.$2b = $2b;
    /** Decodes base64 to a uint8 array. URL-encoded and unpadded base64 is allowed. */
    function $3b(encoded) {
        let building = 0;
        let remainder = 0;
        let bufi = 0;
        // The simpler way to do this is `Uint8Array.from(atob(str), c => c.charCodeAt(0))`,
        // but that's about 10-20x slower than this function in current Chromium versions.
        const buffer = new Uint8Array(Math.floor(encoded.length / 4 * 3));
        const append = (value) => {
            switch (remainder) {
                case 3:
                    buffer[bufi++] = building | value;
                    remainder = 0;
                    break;
                case 2:
                    buffer[bufi++] = building | (value >>> 2);
                    building = value << 6;
                    remainder = 3;
                    break;
                case 1:
                    buffer[bufi++] = building | (value >>> 4);
                    building = value << 4;
                    remainder = 2;
                    break;
                default:
                    building = value << 2;
                    remainder = 1;
            }
        };
        for (let i = 0; i < encoded.length; i++) {
            const code = encoded.charCodeAt(i);
            // See https://datatracker.ietf.org/doc/html/rfc4648#section-4
            // This branchy code is about 3x faster than an indexOf on a base64 char string.
            if (code >= 65 && code <= 90) {
                append(code - 65); // A-Z starts ranges from char code 65 to 90
            }
            else if (code >= 97 && code <= 122) {
                append(code - 97 + 26); // a-z starts ranges from char code 97 to 122, starting at byte 26
            }
            else if (code >= 48 && code <= 57) {
                append(code - 48 + 52); // 0-9 starts ranges from char code 48 to 58, starting at byte 52
            }
            else if (code === 43 || code === 45) {
                append(62); // "+" or "-" for URLS
            }
            else if (code === 47 || code === 95) {
                append(63); // "/" or "_" for URLS
            }
            else if (code === 61) {
                break; // "="
            }
            else {
                throw new SyntaxError(`Unexpected base64 character ${encoded[i]}`);
            }
        }
        const unpadded = bufi;
        while (remainder > 0) {
            append(0);
        }
        // slice is needed to account for overestimation due to padding
        return $Jb.wrap(buffer).slice(0, unpadded);
    }
    exports.$3b = $3b;
    const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const base64UrlSafeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    /** Encodes a buffer to a base64 string. */
    function $4b({ buffer }, padded = true, urlSafe = false) {
        const dictionary = urlSafe ? base64UrlSafeAlphabet : base64Alphabet;
        let output = '';
        const remainder = buffer.byteLength % 3;
        let i = 0;
        for (; i < buffer.byteLength - remainder; i += 3) {
            const a = buffer[i + 0];
            const b = buffer[i + 1];
            const c = buffer[i + 2];
            output += dictionary[a >>> 2];
            output += dictionary[(a << 4 | b >>> 4) & 0b111111];
            output += dictionary[(b << 2 | c >>> 6) & 0b111111];
            output += dictionary[c & 0b111111];
        }
        if (remainder === 1) {
            const a = buffer[i + 0];
            output += dictionary[a >>> 2];
            output += dictionary[(a << 4) & 0b111111];
            if (padded) {
                output += '==';
            }
        }
        else if (remainder === 2) {
            const a = buffer[i + 0];
            const b = buffer[i + 1];
            output += dictionary[a >>> 2];
            output += dictionary[(a << 4 | b >>> 4) & 0b111111];
            output += dictionary[(b << 2) & 0b111111];
            if (padded) {
                output += '=';
            }
        }
        return output;
    }
    exports.$4b = $4b;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[24/*vs/base/common/symbols*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$5c = void 0;
    /**
     * Can be passed into the Delayed to defer using a microtask
     * */
    exports.$5c = Symbol('MicrotaskDelay');
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[13/*vs/editor/common/core/eolCounter*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ds = exports.StringEOL = void 0;
    var StringEOL;
    (function (StringEOL) {
        StringEOL[StringEOL["Unknown"] = 0] = "Unknown";
        StringEOL[StringEOL["Invalid"] = 3] = "Invalid";
        StringEOL[StringEOL["LF"] = 1] = "LF";
        StringEOL[StringEOL["CRLF"] = 2] = "CRLF";
    })(StringEOL || (exports.StringEOL = StringEOL = {}));
    function $ds(text) {
        let eolCount = 0;
        let firstLineLength = 0;
        let lastLineStart = 0;
        let eol = 0 /* StringEOL.Unknown */;
        for (let i = 0, len = text.length; i < len; i++) {
            const chr = text.charCodeAt(i);
            if (chr === 13 /* CharCode.CarriageReturn */) {
                if (eolCount === 0) {
                    firstLineLength = i;
                }
                eolCount++;
                if (i + 1 < len && text.charCodeAt(i + 1) === 10 /* CharCode.LineFeed */) {
                    // \r\n... case
                    eol |= 2 /* StringEOL.CRLF */;
                    i++; // skip \n
                }
                else {
                    // \r... case
                    eol |= 3 /* StringEOL.Invalid */;
                }
                lastLineStart = i + 1;
            }
            else if (chr === 10 /* CharCode.LineFeed */) {
                // \n... case
                eol |= 1 /* StringEOL.LF */;
                if (eolCount === 0) {
                    firstLineLength = i;
                }
                eolCount++;
                lastLineStart = i + 1;
            }
        }
        if (eolCount === 0) {
            firstLineLength = text.length;
        }
        return [eolCount, firstLineLength, text.length - lastLineStart, eol];
    }
    exports.$ds = $ds;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[14/*vs/editor/common/encodedTokenAttributes*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$bs = exports.MetadataConsts = exports.StandardTokenType = exports.ColorId = exports.FontStyle = exports.LanguageId = void 0;
    /**
     * Open ended enum at runtime
     */
    var LanguageId;
    (function (LanguageId) {
        LanguageId[LanguageId["Null"] = 0] = "Null";
        LanguageId[LanguageId["PlainText"] = 1] = "PlainText";
    })(LanguageId || (exports.LanguageId = LanguageId = {}));
    /**
     * A font style. Values are 2^x such that a bit mask can be used.
     */
    var FontStyle;
    (function (FontStyle) {
        FontStyle[FontStyle["NotSet"] = -1] = "NotSet";
        FontStyle[FontStyle["None"] = 0] = "None";
        FontStyle[FontStyle["Italic"] = 1] = "Italic";
        FontStyle[FontStyle["Bold"] = 2] = "Bold";
        FontStyle[FontStyle["Underline"] = 4] = "Underline";
        FontStyle[FontStyle["Strikethrough"] = 8] = "Strikethrough";
    })(FontStyle || (exports.FontStyle = FontStyle = {}));
    /**
     * Open ended enum at runtime
     */
    var ColorId;
    (function (ColorId) {
        ColorId[ColorId["None"] = 0] = "None";
        ColorId[ColorId["DefaultForeground"] = 1] = "DefaultForeground";
        ColorId[ColorId["DefaultBackground"] = 2] = "DefaultBackground";
    })(ColorId || (exports.ColorId = ColorId = {}));
    /**
     * A standard token type.
     */
    var StandardTokenType;
    (function (StandardTokenType) {
        StandardTokenType[StandardTokenType["Other"] = 0] = "Other";
        StandardTokenType[StandardTokenType["Comment"] = 1] = "Comment";
        StandardTokenType[StandardTokenType["String"] = 2] = "String";
        StandardTokenType[StandardTokenType["RegEx"] = 3] = "RegEx";
    })(StandardTokenType || (exports.StandardTokenType = StandardTokenType = {}));
    /**
     * Helpers to manage the "collapsed" metadata of an entire StackElement stack.
     * The following assumptions have been made:
     *  - languageId < 256 => needs 8 bits
     *  - unique color count < 512 => needs 9 bits
     *
     * The binary format is:
     * - -------------------------------------------
     *     3322 2222 2222 1111 1111 1100 0000 0000
     *     1098 7654 3210 9876 5432 1098 7654 3210
     * - -------------------------------------------
     *     xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx
     *     bbbb bbbb ffff ffff fFFF FBTT LLLL LLLL
     * - -------------------------------------------
     *  - L = LanguageId (8 bits)
     *  - T = StandardTokenType (2 bits)
     *  - B = Balanced bracket (1 bit)
     *  - F = FontStyle (4 bits)
     *  - f = foreground color (9 bits)
     *  - b = background color (9 bits)
     *
     */
    var MetadataConsts;
    (function (MetadataConsts) {
        MetadataConsts[MetadataConsts["LANGUAGEID_MASK"] = 255] = "LANGUAGEID_MASK";
        MetadataConsts[MetadataConsts["TOKEN_TYPE_MASK"] = 768] = "TOKEN_TYPE_MASK";
        MetadataConsts[MetadataConsts["BALANCED_BRACKETS_MASK"] = 1024] = "BALANCED_BRACKETS_MASK";
        MetadataConsts[MetadataConsts["FONT_STYLE_MASK"] = 30720] = "FONT_STYLE_MASK";
        MetadataConsts[MetadataConsts["FOREGROUND_MASK"] = 16744448] = "FOREGROUND_MASK";
        MetadataConsts[MetadataConsts["BACKGROUND_MASK"] = 4278190080] = "BACKGROUND_MASK";
        MetadataConsts[MetadataConsts["ITALIC_MASK"] = 2048] = "ITALIC_MASK";
        MetadataConsts[MetadataConsts["BOLD_MASK"] = 4096] = "BOLD_MASK";
        MetadataConsts[MetadataConsts["UNDERLINE_MASK"] = 8192] = "UNDERLINE_MASK";
        MetadataConsts[MetadataConsts["STRIKETHROUGH_MASK"] = 16384] = "STRIKETHROUGH_MASK";
        // Semantic tokens cannot set the language id, so we can
        // use the first 8 bits for control purposes
        MetadataConsts[MetadataConsts["SEMANTIC_USE_ITALIC"] = 1] = "SEMANTIC_USE_ITALIC";
        MetadataConsts[MetadataConsts["SEMANTIC_USE_BOLD"] = 2] = "SEMANTIC_USE_BOLD";
        MetadataConsts[MetadataConsts["SEMANTIC_USE_UNDERLINE"] = 4] = "SEMANTIC_USE_UNDERLINE";
        MetadataConsts[MetadataConsts["SEMANTIC_USE_STRIKETHROUGH"] = 8] = "SEMANTIC_USE_STRIKETHROUGH";
        MetadataConsts[MetadataConsts["SEMANTIC_USE_FOREGROUND"] = 16] = "SEMANTIC_USE_FOREGROUND";
        MetadataConsts[MetadataConsts["SEMANTIC_USE_BACKGROUND"] = 32] = "SEMANTIC_USE_BACKGROUND";
        MetadataConsts[MetadataConsts["LANGUAGEID_OFFSET"] = 0] = "LANGUAGEID_OFFSET";
        MetadataConsts[MetadataConsts["TOKEN_TYPE_OFFSET"] = 8] = "TOKEN_TYPE_OFFSET";
        MetadataConsts[MetadataConsts["BALANCED_BRACKETS_OFFSET"] = 10] = "BALANCED_BRACKETS_OFFSET";
        MetadataConsts[MetadataConsts["FONT_STYLE_OFFSET"] = 11] = "FONT_STYLE_OFFSET";
        MetadataConsts[MetadataConsts["FOREGROUND_OFFSET"] = 15] = "FOREGROUND_OFFSET";
        MetadataConsts[MetadataConsts["BACKGROUND_OFFSET"] = 24] = "BACKGROUND_OFFSET";
    })(MetadataConsts || (exports.MetadataConsts = MetadataConsts = {}));
    /**
     */
    class $bs {
        static getLanguageId(metadata) {
            return (metadata & 255 /* MetadataConsts.LANGUAGEID_MASK */) >>> 0 /* MetadataConsts.LANGUAGEID_OFFSET */;
        }
        static getTokenType(metadata) {
            return (metadata & 768 /* MetadataConsts.TOKEN_TYPE_MASK */) >>> 8 /* MetadataConsts.TOKEN_TYPE_OFFSET */;
        }
        static containsBalancedBrackets(metadata) {
            return (metadata & 1024 /* MetadataConsts.BALANCED_BRACKETS_MASK */) !== 0;
        }
        static getFontStyle(metadata) {
            return (metadata & 30720 /* MetadataConsts.FONT_STYLE_MASK */) >>> 11 /* MetadataConsts.FONT_STYLE_OFFSET */;
        }
        static getForeground(metadata) {
            return (metadata & 16744448 /* MetadataConsts.FOREGROUND_MASK */) >>> 15 /* MetadataConsts.FOREGROUND_OFFSET */;
        }
        static getBackground(metadata) {
            return (metadata & 4278190080 /* MetadataConsts.BACKGROUND_MASK */) >>> 24 /* MetadataConsts.BACKGROUND_OFFSET */;
        }
        static getClassNameFromMetadata(metadata) {
            const foreground = this.getForeground(metadata);
            let className = 'mtk' + foreground;
            const fontStyle = this.getFontStyle(metadata);
            if (fontStyle & 1 /* FontStyle.Italic */) {
                className += ' mtki';
            }
            if (fontStyle & 2 /* FontStyle.Bold */) {
                className += ' mtkb';
            }
            if (fontStyle & 4 /* FontStyle.Underline */) {
                className += ' mtku';
            }
            if (fontStyle & 8 /* FontStyle.Strikethrough */) {
                className += ' mtks';
            }
            return className;
        }
        static getInlineStyleFromMetadata(metadata, colorMap) {
            const foreground = this.getForeground(metadata);
            const fontStyle = this.getFontStyle(metadata);
            let result = `color: ${colorMap[foreground]};`;
            if (fontStyle & 1 /* FontStyle.Italic */) {
                result += 'font-style: italic;';
            }
            if (fontStyle & 2 /* FontStyle.Bold */) {
                result += 'font-weight: bold;';
            }
            let textDecoration = '';
            if (fontStyle & 4 /* FontStyle.Underline */) {
                textDecoration += ' underline';
            }
            if (fontStyle & 8 /* FontStyle.Strikethrough */) {
                textDecoration += ' line-through';
            }
            if (textDecoration) {
                result += `text-decoration:${textDecoration};`;
            }
            return result;
        }
        static getPresentationFromMetadata(metadata) {
            const foreground = this.getForeground(metadata);
            const fontStyle = this.getFontStyle(metadata);
            return {
                foreground: foreground,
                italic: Boolean(fontStyle & 1 /* FontStyle.Italic */),
                bold: Boolean(fontStyle & 2 /* FontStyle.Bold */),
                underline: Boolean(fontStyle & 4 /* FontStyle.Underline */),
                strikethrough: Boolean(fontStyle & 8 /* FontStyle.Strikethrough */),
            };
        }
    }
    exports.$bs = $bs;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[25/*vs/editor/common/model/fixedArray*/], __M([0/*require*/,1/*exports*/,26/*vs/base/common/arrays*/]), function (require, exports, arrays_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$fC = void 0;
    /**
     * An array that avoids being sparse by always
     * filling up unused indices with a default value.
     */
    class $fC {
        constructor(b) {
            this.b = b;
            this.a = [];
        }
        get(index) {
            if (index < this.a.length) {
                return this.a[index];
            }
            return this.b;
        }
        set(index, value) {
            while (index >= this.a.length) {
                this.a[this.a.length] = this.b;
            }
            this.a[index] = value;
        }
        replace(index, oldLength, newLength) {
            if (index >= this.a.length) {
                return;
            }
            if (oldLength === 0) {
                this.insert(index, newLength);
                return;
            }
            else if (newLength === 0) {
                this.delete(index, oldLength);
                return;
            }
            const before = this.a.slice(0, index);
            const after = this.a.slice(index + oldLength);
            const insertArr = arrayFill(newLength, this.b);
            this.a = before.concat(insertArr, after);
        }
        delete(deleteIndex, deleteCount) {
            if (deleteCount === 0 || deleteIndex >= this.a.length) {
                return;
            }
            this.a.splice(deleteIndex, deleteCount);
        }
        insert(insertIndex, insertCount) {
            if (insertCount === 0 || insertIndex >= this.a.length) {
                return;
            }
            const arr = [];
            for (let i = 0; i < insertCount; i++) {
                arr[i] = this.b;
            }
            this.a = (0, arrays_1.$zf)(this.a, insertIndex, arr);
        }
    }
    exports.$fC = $fC;
    function arrayFill(length, value) {
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr[i] = value;
        }
        return arr;
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[7/*vs/editor/common/tokens/lineTokens*/], __M([0/*require*/,1/*exports*/,14/*vs/editor/common/encodedTokenAttributes*/]), function (require, exports, encodedTokenAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$es = void 0;
    class $es {
        static { this.defaultTokenMetadata = ((0 /* FontStyle.None */ << 11 /* MetadataConsts.FONT_STYLE_OFFSET */)
            | (1 /* ColorId.DefaultForeground */ << 15 /* MetadataConsts.FOREGROUND_OFFSET */)
            | (2 /* ColorId.DefaultBackground */ << 24 /* MetadataConsts.BACKGROUND_OFFSET */)) >>> 0; }
        static createEmpty(lineContent, decoder) {
            const defaultMetadata = $es.defaultTokenMetadata;
            const tokens = new Uint32Array(2);
            tokens[0] = lineContent.length;
            tokens[1] = defaultMetadata;
            return new $es(tokens, lineContent, decoder);
        }
        constructor(tokens, text, decoder) {
            this._lineTokensBrand = undefined;
            this.a = tokens;
            this.b = (this.a.length >>> 1);
            this.c = text;
            this.d = decoder;
        }
        equals(other) {
            if (other instanceof $es) {
                return this.slicedEquals(other, 0, this.b);
            }
            return false;
        }
        slicedEquals(other, sliceFromTokenIndex, sliceTokenCount) {
            if (this.c !== other.c) {
                return false;
            }
            if (this.b !== other.b) {
                return false;
            }
            const from = (sliceFromTokenIndex << 1);
            const to = from + (sliceTokenCount << 1);
            for (let i = from; i < to; i++) {
                if (this.a[i] !== other.a[i]) {
                    return false;
                }
            }
            return true;
        }
        getLineContent() {
            return this.c;
        }
        getCount() {
            return this.b;
        }
        getStartOffset(tokenIndex) {
            if (tokenIndex > 0) {
                return this.a[(tokenIndex - 1) << 1];
            }
            return 0;
        }
        getMetadata(tokenIndex) {
            const metadata = this.a[(tokenIndex << 1) + 1];
            return metadata;
        }
        getLanguageId(tokenIndex) {
            const metadata = this.a[(tokenIndex << 1) + 1];
            const languageId = encodedTokenAttributes_1.$bs.getLanguageId(metadata);
            return this.d.decodeLanguageId(languageId);
        }
        getStandardTokenType(tokenIndex) {
            const metadata = this.a[(tokenIndex << 1) + 1];
            return encodedTokenAttributes_1.$bs.getTokenType(metadata);
        }
        getForeground(tokenIndex) {
            const metadata = this.a[(tokenIndex << 1) + 1];
            return encodedTokenAttributes_1.$bs.getForeground(metadata);
        }
        getClassName(tokenIndex) {
            const metadata = this.a[(tokenIndex << 1) + 1];
            return encodedTokenAttributes_1.$bs.getClassNameFromMetadata(metadata);
        }
        getInlineStyle(tokenIndex, colorMap) {
            const metadata = this.a[(tokenIndex << 1) + 1];
            return encodedTokenAttributes_1.$bs.getInlineStyleFromMetadata(metadata, colorMap);
        }
        getPresentation(tokenIndex) {
            const metadata = this.a[(tokenIndex << 1) + 1];
            return encodedTokenAttributes_1.$bs.getPresentationFromMetadata(metadata);
        }
        getEndOffset(tokenIndex) {
            return this.a[tokenIndex << 1];
        }
        /**
         * Find the token containing offset `offset`.
         * @param offset The search offset
         * @return The index of the token containing the offset.
         */
        findTokenIndexAtOffset(offset) {
            return $es.findIndexInTokensArray(this.a, offset);
        }
        inflate() {
            return this;
        }
        sliceAndInflate(startOffset, endOffset, deltaOffset) {
            return new SliceLineTokens(this, startOffset, endOffset, deltaOffset);
        }
        static convertToEndOffset(tokens, lineTextLength) {
            const tokenCount = (tokens.length >>> 1);
            const lastTokenIndex = tokenCount - 1;
            for (let tokenIndex = 0; tokenIndex < lastTokenIndex; tokenIndex++) {
                tokens[tokenIndex << 1] = tokens[(tokenIndex + 1) << 1];
            }
            tokens[lastTokenIndex << 1] = lineTextLength;
        }
        static findIndexInTokensArray(tokens, desiredIndex) {
            if (tokens.length <= 2) {
                return 0;
            }
            let low = 0;
            let high = (tokens.length >>> 1) - 1;
            while (low < high) {
                const mid = low + Math.floor((high - low) / 2);
                const endOffset = tokens[(mid << 1)];
                if (endOffset === desiredIndex) {
                    return mid + 1;
                }
                else if (endOffset < desiredIndex) {
                    low = mid + 1;
                }
                else if (endOffset > desiredIndex) {
                    high = mid;
                }
            }
            return low;
        }
        /**
         * @pure
         * @param insertTokens Must be sorted by offset.
        */
        withInserted(insertTokens) {
            if (insertTokens.length === 0) {
                return this;
            }
            let nextOriginalTokenIdx = 0;
            let nextInsertTokenIdx = 0;
            let text = '';
            const newTokens = new Array();
            let originalEndOffset = 0;
            while (true) {
                const nextOriginalTokenEndOffset = nextOriginalTokenIdx < this.b ? this.a[nextOriginalTokenIdx << 1] : -1;
                const nextInsertToken = nextInsertTokenIdx < insertTokens.length ? insertTokens[nextInsertTokenIdx] : null;
                if (nextOriginalTokenEndOffset !== -1 && (nextInsertToken === null || nextOriginalTokenEndOffset <= nextInsertToken.offset)) {
                    // original token ends before next insert token
                    text += this.c.substring(originalEndOffset, nextOriginalTokenEndOffset);
                    const metadata = this.a[(nextOriginalTokenIdx << 1) + 1];
                    newTokens.push(text.length, metadata);
                    nextOriginalTokenIdx++;
                    originalEndOffset = nextOriginalTokenEndOffset;
                }
                else if (nextInsertToken) {
                    if (nextInsertToken.offset > originalEndOffset) {
                        // insert token is in the middle of the next token.
                        text += this.c.substring(originalEndOffset, nextInsertToken.offset);
                        const metadata = this.a[(nextOriginalTokenIdx << 1) + 1];
                        newTokens.push(text.length, metadata);
                        originalEndOffset = nextInsertToken.offset;
                    }
                    text += nextInsertToken.text;
                    newTokens.push(text.length, nextInsertToken.tokenMetadata);
                    nextInsertTokenIdx++;
                }
                else {
                    break;
                }
            }
            return new $es(new Uint32Array(newTokens), text, this.d);
        }
    }
    exports.$es = $es;
    class SliceLineTokens {
        constructor(source, startOffset, endOffset, deltaOffset) {
            this.a = source;
            this.b = startOffset;
            this.c = endOffset;
            this.d = deltaOffset;
            this.e = source.findTokenIndexAtOffset(startOffset);
            this.f = 0;
            for (let i = this.e, len = source.getCount(); i < len; i++) {
                const tokenStartOffset = source.getStartOffset(i);
                if (tokenStartOffset >= endOffset) {
                    break;
                }
                this.f++;
            }
        }
        getMetadata(tokenIndex) {
            return this.a.getMetadata(this.e + tokenIndex);
        }
        getLanguageId(tokenIndex) {
            return this.a.getLanguageId(this.e + tokenIndex);
        }
        getLineContent() {
            return this.a.getLineContent().substring(this.b, this.c);
        }
        equals(other) {
            if (other instanceof SliceLineTokens) {
                return (this.b === other.b
                    && this.c === other.c
                    && this.d === other.d
                    && this.a.slicedEquals(other.a, this.e, this.f));
            }
            return false;
        }
        getCount() {
            return this.f;
        }
        getForeground(tokenIndex) {
            return this.a.getForeground(this.e + tokenIndex);
        }
        getEndOffset(tokenIndex) {
            const tokenEndOffset = this.a.getEndOffset(this.e + tokenIndex);
            return Math.min(this.c, tokenEndOffset) - this.b + this.d;
        }
        getClassName(tokenIndex) {
            return this.a.getClassName(this.e + tokenIndex);
        }
        getInlineStyle(tokenIndex, colorMap) {
            return this.a.getInlineStyle(this.e + tokenIndex, colorMap);
        }
        getPresentation(tokenIndex) {
            return this.a.getPresentation(this.e + tokenIndex);
        }
        findTokenIndexAtOffset(offset) {
            return this.a.findTokenIndexAtOffset(offset + this.b - this.d) - this.e;
        }
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[27/*vs/editor/common/tokens/contiguousTokensEditing*/], __M([0/*require*/,1/*exports*/,7/*vs/editor/common/tokens/lineTokens*/]), function (require, exports, lineTokens_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$hs = exports.$gs = exports.$fs = void 0;
    exports.$fs = (new Uint32Array(0)).buffer;
    class $gs {
        static deleteBeginning(lineTokens, toChIndex) {
            if (lineTokens === null || lineTokens === exports.$fs) {
                return lineTokens;
            }
            return $gs.delete(lineTokens, 0, toChIndex);
        }
        static deleteEnding(lineTokens, fromChIndex) {
            if (lineTokens === null || lineTokens === exports.$fs) {
                return lineTokens;
            }
            const tokens = $hs(lineTokens);
            const lineTextLength = tokens[tokens.length - 2];
            return $gs.delete(lineTokens, fromChIndex, lineTextLength);
        }
        static delete(lineTokens, fromChIndex, toChIndex) {
            if (lineTokens === null || lineTokens === exports.$fs || fromChIndex === toChIndex) {
                return lineTokens;
            }
            const tokens = $hs(lineTokens);
            const tokensCount = (tokens.length >>> 1);
            // special case: deleting everything
            if (fromChIndex === 0 && tokens[tokens.length - 2] === toChIndex) {
                return exports.$fs;
            }
            const fromTokenIndex = lineTokens_1.$es.findIndexInTokensArray(tokens, fromChIndex);
            const fromTokenStartOffset = (fromTokenIndex > 0 ? tokens[(fromTokenIndex - 1) << 1] : 0);
            const fromTokenEndOffset = tokens[fromTokenIndex << 1];
            if (toChIndex < fromTokenEndOffset) {
                // the delete range is inside a single token
                const delta = (toChIndex - fromChIndex);
                for (let i = fromTokenIndex; i < tokensCount; i++) {
                    tokens[i << 1] -= delta;
                }
                return lineTokens;
            }
            let dest;
            let lastEnd;
            if (fromTokenStartOffset !== fromChIndex) {
                tokens[fromTokenIndex << 1] = fromChIndex;
                dest = ((fromTokenIndex + 1) << 1);
                lastEnd = fromChIndex;
            }
            else {
                dest = (fromTokenIndex << 1);
                lastEnd = fromTokenStartOffset;
            }
            const delta = (toChIndex - fromChIndex);
            for (let tokenIndex = fromTokenIndex + 1; tokenIndex < tokensCount; tokenIndex++) {
                const tokenEndOffset = tokens[tokenIndex << 1] - delta;
                if (tokenEndOffset > lastEnd) {
                    tokens[dest++] = tokenEndOffset;
                    tokens[dest++] = tokens[(tokenIndex << 1) + 1];
                    lastEnd = tokenEndOffset;
                }
            }
            if (dest === tokens.length) {
                // nothing to trim
                return lineTokens;
            }
            const tmp = new Uint32Array(dest);
            tmp.set(tokens.subarray(0, dest), 0);
            return tmp.buffer;
        }
        static append(lineTokens, _otherTokens) {
            if (_otherTokens === exports.$fs) {
                return lineTokens;
            }
            if (lineTokens === exports.$fs) {
                return _otherTokens;
            }
            if (lineTokens === null) {
                return lineTokens;
            }
            if (_otherTokens === null) {
                // cannot determine combined line length...
                return null;
            }
            const myTokens = $hs(lineTokens);
            const otherTokens = $hs(_otherTokens);
            const otherTokensCount = (otherTokens.length >>> 1);
            const result = new Uint32Array(myTokens.length + otherTokens.length);
            result.set(myTokens, 0);
            let dest = myTokens.length;
            const delta = myTokens[myTokens.length - 2];
            for (let i = 0; i < otherTokensCount; i++) {
                result[dest++] = otherTokens[(i << 1)] + delta;
                result[dest++] = otherTokens[(i << 1) + 1];
            }
            return result.buffer;
        }
        static insert(lineTokens, chIndex, textLength) {
            if (lineTokens === null || lineTokens === exports.$fs) {
                // nothing to do
                return lineTokens;
            }
            const tokens = $hs(lineTokens);
            const tokensCount = (tokens.length >>> 1);
            let fromTokenIndex = lineTokens_1.$es.findIndexInTokensArray(tokens, chIndex);
            if (fromTokenIndex > 0) {
                const fromTokenStartOffset = tokens[(fromTokenIndex - 1) << 1];
                if (fromTokenStartOffset === chIndex) {
                    fromTokenIndex--;
                }
            }
            for (let tokenIndex = fromTokenIndex; tokenIndex < tokensCount; tokenIndex++) {
                tokens[tokenIndex << 1] += textLength;
            }
            return lineTokens;
        }
    }
    exports.$gs = $gs;
    function $hs(arr) {
        if (arr instanceof Uint32Array) {
            return arr;
        }
        else {
            return new Uint32Array(arr);
        }
    }
    exports.$hs = $hs;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[28/*vs/editor/common/tokens/contiguousMultilineTokens*/], __M([0/*require*/,1/*exports*/,26/*vs/base/common/arrays*/,12/*vs/base/common/buffer*/,44/*vs/editor/common/core/position*/,13/*vs/editor/common/core/eolCounter*/,27/*vs/editor/common/tokens/contiguousTokensEditing*/,15/*vs/editor/common/core/lineRange*/]), function (require, exports, arrays, buffer_1, position_1, eolCounter_1, contiguousTokensEditing_1, lineRange_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$is = void 0;
    /**
     * Represents contiguous tokens over a contiguous range of lines.
     */
    class $is {
        static deserialize(buff, offset, result) {
            const view32 = new Uint32Array(buff.buffer);
            const startLineNumber = (0, buffer_1.$Nb)(buff, offset);
            offset += 4;
            const count = (0, buffer_1.$Nb)(buff, offset);
            offset += 4;
            const tokens = [];
            for (let i = 0; i < count; i++) {
                const byteCount = (0, buffer_1.$Nb)(buff, offset);
                offset += 4;
                tokens.push(view32.subarray(offset / 4, offset / 4 + byteCount / 4));
                offset += byteCount;
            }
            result.push(new $is(startLineNumber, tokens));
            return offset;
        }
        /**
         * (Inclusive) start line number for these tokens.
         */
        get startLineNumber() {
            return this.a;
        }
        /**
         * (Inclusive) end line number for these tokens.
         */
        get endLineNumber() {
            return this.a + this.b.length - 1;
        }
        constructor(startLineNumber, tokens) {
            this.a = startLineNumber;
            this.b = tokens;
        }
        getLineRange() {
            return new lineRange_1.$Nr(this.a, this.a + this.b.length);
        }
        /**
         * @see {@link b}
         */
        getLineTokens(lineNumber) {
            return this.b[lineNumber - this.a];
        }
        appendLineTokens(lineTokens) {
            this.b.push(lineTokens);
        }
        serializeSize() {
            let result = 0;
            result += 4; // 4 bytes for the start line number
            result += 4; // 4 bytes for the line count
            for (let i = 0; i < this.b.length; i++) {
                const lineTokens = this.b[i];
                if (!(lineTokens instanceof Uint32Array)) {
                    throw new Error(`Not supported!`);
                }
                result += 4; // 4 bytes for the byte count
                result += lineTokens.byteLength;
            }
            return result;
        }
        serialize(destination, offset) {
            (0, buffer_1.$Ob)(destination, this.a, offset);
            offset += 4;
            (0, buffer_1.$Ob)(destination, this.b.length, offset);
            offset += 4;
            for (let i = 0; i < this.b.length; i++) {
                const lineTokens = this.b[i];
                if (!(lineTokens instanceof Uint32Array)) {
                    throw new Error(`Not supported!`);
                }
                (0, buffer_1.$Ob)(destination, lineTokens.byteLength, offset);
                offset += 4;
                destination.set(new Uint8Array(lineTokens.buffer), offset);
                offset += lineTokens.byteLength;
            }
            return offset;
        }
        applyEdit(range, text) {
            const [eolCount, firstLineLength] = (0, eolCounter_1.$ds)(text);
            this.c(range);
            this.d(new position_1.$Lr(range.startLineNumber, range.startColumn), eolCount, firstLineLength);
        }
        c(range) {
            if (range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn) {
                // Nothing to delete
                return;
            }
            const firstLineIndex = range.startLineNumber - this.a;
            const lastLineIndex = range.endLineNumber - this.a;
            if (lastLineIndex < 0) {
                // this deletion occurs entirely before this block, so we only need to adjust line numbers
                const deletedLinesCount = lastLineIndex - firstLineIndex;
                this.a -= deletedLinesCount;
                return;
            }
            if (firstLineIndex >= this.b.length) {
                // this deletion occurs entirely after this block, so there is nothing to do
                return;
            }
            if (firstLineIndex < 0 && lastLineIndex >= this.b.length) {
                // this deletion completely encompasses this block
                this.a = 0;
                this.b = [];
                return;
            }
            if (firstLineIndex === lastLineIndex) {
                // a delete on a single line
                this.b[firstLineIndex] = contiguousTokensEditing_1.$gs.delete(this.b[firstLineIndex], range.startColumn - 1, range.endColumn - 1);
                return;
            }
            if (firstLineIndex >= 0) {
                // The first line survives
                this.b[firstLineIndex] = contiguousTokensEditing_1.$gs.deleteEnding(this.b[firstLineIndex], range.startColumn - 1);
                if (lastLineIndex < this.b.length) {
                    // The last line survives
                    const lastLineTokens = contiguousTokensEditing_1.$gs.deleteBeginning(this.b[lastLineIndex], range.endColumn - 1);
                    // Take remaining text on last line and append it to remaining text on first line
                    this.b[firstLineIndex] = contiguousTokensEditing_1.$gs.append(this.b[firstLineIndex], lastLineTokens);
                    // Delete middle lines
                    this.b.splice(firstLineIndex + 1, lastLineIndex - firstLineIndex);
                }
                else {
                    // The last line does not survive
                    // Take remaining text on last line and append it to remaining text on first line
                    this.b[firstLineIndex] = contiguousTokensEditing_1.$gs.append(this.b[firstLineIndex], null);
                    // Delete lines
                    this.b = this.b.slice(0, firstLineIndex + 1);
                }
            }
            else {
                // The first line does not survive
                const deletedBefore = -firstLineIndex;
                this.a -= deletedBefore;
                // Remove beginning from last line
                this.b[lastLineIndex] = contiguousTokensEditing_1.$gs.deleteBeginning(this.b[lastLineIndex], range.endColumn - 1);
                // Delete lines
                this.b = this.b.slice(lastLineIndex);
            }
        }
        d(position, eolCount, firstLineLength) {
            if (eolCount === 0 && firstLineLength === 0) {
                // Nothing to insert
                return;
            }
            const lineIndex = position.lineNumber - this.a;
            if (lineIndex < 0) {
                // this insertion occurs before this block, so we only need to adjust line numbers
                this.a += eolCount;
                return;
            }
            if (lineIndex >= this.b.length) {
                // this insertion occurs after this block, so there is nothing to do
                return;
            }
            if (eolCount === 0) {
                // Inserting text on one line
                this.b[lineIndex] = contiguousTokensEditing_1.$gs.insert(this.b[lineIndex], position.column - 1, firstLineLength);
                return;
            }
            this.b[lineIndex] = contiguousTokensEditing_1.$gs.deleteEnding(this.b[lineIndex], position.column - 1);
            this.b[lineIndex] = contiguousTokensEditing_1.$gs.insert(this.b[lineIndex], position.column - 1, firstLineLength);
            this.e(position.lineNumber, eolCount);
        }
        e(insertIndex, insertCount) {
            if (insertCount === 0) {
                return;
            }
            const lineTokens = [];
            for (let i = 0; i < insertCount; i++) {
                lineTokens[i] = null;
            }
            this.b = arrays.$zf(this.b, insertIndex, lineTokens);
        }
    }
    exports.$is = $is;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[16/*vs/editor/common/tokens/contiguousMultilineTokensBuilder*/], __M([0/*require*/,1/*exports*/,12/*vs/base/common/buffer*/,28/*vs/editor/common/tokens/contiguousMultilineTokens*/]), function (require, exports, buffer_1, contiguousMultilineTokens_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$gC = void 0;
    class $gC {
        static deserialize(buff) {
            let offset = 0;
            const count = (0, buffer_1.$Nb)(buff, offset);
            offset += 4;
            const result = [];
            for (let i = 0; i < count; i++) {
                offset = contiguousMultilineTokens_1.$is.deserialize(buff, offset, result);
            }
            return result;
        }
        constructor() {
            this.a = [];
        }
        add(lineNumber, lineTokens) {
            if (this.a.length > 0) {
                const last = this.a[this.a.length - 1];
                if (last.endLineNumber + 1 === lineNumber) {
                    // append
                    last.appendLineTokens(lineTokens);
                    return;
                }
            }
            this.a.push(new contiguousMultilineTokens_1.$is(lineNumber, [lineTokens]));
        }
        finalize() {
            return this.a;
        }
        serialize() {
            const size = this.b();
            const result = new Uint8Array(size);
            this.c(result);
            return result;
        }
        b() {
            let result = 0;
            result += 4; // 4 bytes for the count
            for (let i = 0; i < this.a.length; i++) {
                result += this.a[i].serializeSize();
            }
            return result;
        }
        c(destination) {
            let offset = 0;
            (0, buffer_1.$Ob)(destination, this.a.length, offset);
            offset += 4;
            for (let i = 0; i < this.a.length; i++) {
                offset = this.a[i].serialize(destination, offset);
            }
        }
    }
    exports.$gC = $gC;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[29/*vs/base/common/extpath*/], __M([0/*require*/,1/*exports*/,30/*vs/base/common/path*/,3/*vs/base/common/platform*/,31/*vs/base/common/strings*/,45/*vs/base/common/types*/]), function (require, exports, path_1, platform_1, strings_1, types_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$Oe = exports.$Ne = exports.$Me = exports.$Le = exports.$Ke = exports.$Je = exports.$Ie = exports.$He = exports.$Ge = exports.$Fe = exports.$Ee = exports.$De = exports.$Ce = exports.$Be = exports.$Ae = exports.$ze = void 0;
    function $ze(code) {
        return code === 47 /* CharCode.Slash */ || code === 92 /* CharCode.Backslash */;
    }
    exports.$ze = $ze;
    /**
     * Takes a Windows OS path and changes backward slashes to forward slashes.
     * This should only be done for OS paths from Windows (or user provided paths potentially from Windows).
     * Using it on a Linux or MaxOS path might change it.
     */
    function $Ae(osPath) {
        return osPath.replace(/[\\/]/g, path_1.$0b.sep);
    }
    exports.$Ae = $Ae;
    /**
     * Takes a Windows OS path (using backward or forward slashes) and turns it into a posix path:
     * - turns backward slashes into forward slashes
     * - makes it absolute if it starts with a drive letter
     * This should only be done for OS paths from Windows (or user provided paths potentially from Windows).
     * Using it on a Linux or MaxOS path might change it.
     */
    function $Be(osPath) {
        if (osPath.indexOf('/') === -1) {
            osPath = $Ae(osPath);
        }
        if (/^[a-zA-Z]:(\/|$)/.test(osPath)) { // starts with a drive letter
            osPath = '/' + osPath;
        }
        return osPath;
    }
    exports.$Be = $Be;
    /**
     * Computes the _root_ this path, like `getRoot('c:\files') === c:\`,
     * `getRoot('files:///files/path') === files:///`,
     * or `getRoot('\\server\shares\path') === \\server\shares\`
     */
    function $Ce(path, sep = path_1.$0b.sep) {
        if (!path) {
            return '';
        }
        const len = path.length;
        const firstLetter = path.charCodeAt(0);
        if ($ze(firstLetter)) {
            if ($ze(path.charCodeAt(1))) {
                // UNC candidate \\localhost\shares\ddd
                //               ^^^^^^^^^^^^^^^^^^^
                if (!$ze(path.charCodeAt(2))) {
                    let pos = 3;
                    const start = pos;
                    for (; pos < len; pos++) {
                        if ($ze(path.charCodeAt(pos))) {
                            break;
                        }
                    }
                    if (start !== pos && !$ze(path.charCodeAt(pos + 1))) {
                        pos += 1;
                        for (; pos < len; pos++) {
                            if ($ze(path.charCodeAt(pos))) {
                                return path.slice(0, pos + 1) // consume this separator
                                    .replace(/[\\/]/g, sep);
                            }
                        }
                    }
                }
            }
            // /user/far
            // ^
            return sep;
        }
        else if ($He(firstLetter)) {
            // check for windows drive letter c:\ or c:
            if (path.charCodeAt(1) === 58 /* CharCode.Colon */) {
                if ($ze(path.charCodeAt(2))) {
                    // C:\fff
                    // ^^^
                    return path.slice(0, 2) + sep;
                }
                else {
                    // C:
                    // ^^
                    return path.slice(0, 2);
                }
            }
        }
        // check for URI
        // scheme://authority/path
        // ^^^^^^^^^^^^^^^^^^^
        let pos = path.indexOf('://');
        if (pos !== -1) {
            pos += 3; // 3 -> "://".length
            for (; pos < len; pos++) {
                if ($ze(path.charCodeAt(pos))) {
                    return path.slice(0, pos + 1); // consume this separator
                }
            }
        }
        return '';
    }
    exports.$Ce = $Ce;
    /**
     * Check if the path follows this pattern: `\\hostname\sharename`.
     *
     * @see https://msdn.microsoft.com/en-us/library/gg465305.aspx
     * @return A boolean indication if the path is a UNC path, on none-windows
     * always false.
     */
    function $De(path) {
        if (!platform_1.$i) {
            // UNC is a windows concept
            return false;
        }
        if (!path || path.length < 5) {
            // at least \\a\b
            return false;
        }
        let code = path.charCodeAt(0);
        if (code !== 92 /* CharCode.Backslash */) {
            return false;
        }
        code = path.charCodeAt(1);
        if (code !== 92 /* CharCode.Backslash */) {
            return false;
        }
        let pos = 2;
        const start = pos;
        for (; pos < path.length; pos++) {
            code = path.charCodeAt(pos);
            if (code === 92 /* CharCode.Backslash */) {
                break;
            }
        }
        if (start === pos) {
            return false;
        }
        code = path.charCodeAt(pos + 1);
        if (isNaN(code) || code === 92 /* CharCode.Backslash */) {
            return false;
        }
        return true;
    }
    exports.$De = $De;
    // Reference: https://en.wikipedia.org/wiki/Filename
    const WINDOWS_INVALID_FILE_CHARS = /[\\/:\*\?"<>\|]/g;
    const UNIX_INVALID_FILE_CHARS = /[\\/]/g;
    const WINDOWS_FORBIDDEN_NAMES = /^(con|prn|aux|clock\$|nul|lpt[0-9]|com[0-9])(\.(.*?))?$/i;
    function $Ee(name, isWindowsOS = platform_1.$i) {
        const invalidFileChars = isWindowsOS ? WINDOWS_INVALID_FILE_CHARS : UNIX_INVALID_FILE_CHARS;
        if (!name || name.length === 0 || /^\s+$/.test(name)) {
            return false; // require a name that is not just whitespace
        }
        invalidFileChars.lastIndex = 0; // the holy grail of software development
        if (invalidFileChars.test(name)) {
            return false; // check for certain invalid file characters
        }
        if (isWindowsOS && WINDOWS_FORBIDDEN_NAMES.test(name)) {
            return false; // check for certain invalid file names
        }
        if (name === '.' || name === '..') {
            return false; // check for reserved values
        }
        if (isWindowsOS && name[name.length - 1] === '.') {
            return false; // Windows: file cannot end with a "."
        }
        if (isWindowsOS && name.length !== name.trim().length) {
            return false; // Windows: file cannot end with a whitespace
        }
        if (name.length > 255) {
            return false; // most file systems do not allow files > 255 length
        }
        return true;
    }
    exports.$Ee = $Ee;
    /**
     * @deprecated please use `IUriIdentityService.extUri.isEqual` instead. If you are
     * in a context without services, consider to pass down the `extUri` from the outside
     * or use `extUriBiasedIgnorePathCase` if you know what you are doing.
     */
    function $Fe(pathA, pathB, ignoreCase) {
        const identityEquals = (pathA === pathB);
        if (!ignoreCase || identityEquals) {
            return identityEquals;
        }
        if (!pathA || !pathB) {
            return false;
        }
        return (0, strings_1.$Kd)(pathA, pathB);
    }
    exports.$Fe = $Fe;
    /**
     * @deprecated please use `IUriIdentityService.extUri.isEqualOrParent` instead. If
     * you are in a context without services, consider to pass down the `extUri` from the
     * outside, or use `extUriBiasedIgnorePathCase` if you know what you are doing.
     */
    function $Ge(base, parentCandidate, ignoreCase, separator = path_1.sep) {
        if (base === parentCandidate) {
            return true;
        }
        if (!base || !parentCandidate) {
            return false;
        }
        if (parentCandidate.length > base.length) {
            return false;
        }
        if (ignoreCase) {
            const beginsWith = (0, strings_1.$Ld)(base, parentCandidate);
            if (!beginsWith) {
                return false;
            }
            if (parentCandidate.length === base.length) {
                return true; // same path, different casing
            }
            let sepOffset = parentCandidate.length;
            if (parentCandidate.charAt(parentCandidate.length - 1) === separator) {
                sepOffset--; // adjust the expected sep offset in case our candidate already ends in separator character
            }
            return base.charAt(sepOffset) === separator;
        }
        if (parentCandidate.charAt(parentCandidate.length - 1) !== separator) {
            parentCandidate += separator;
        }
        return base.indexOf(parentCandidate) === 0;
    }
    exports.$Ge = $Ge;
    function $He(char0) {
        return char0 >= 65 /* CharCode.A */ && char0 <= 90 /* CharCode.Z */ || char0 >= 97 /* CharCode.a */ && char0 <= 122 /* CharCode.z */;
    }
    exports.$He = $He;
    function $Ie(candidate, cwd) {
        // Special case: allow to open a drive letter without trailing backslash
        if (platform_1.$i && candidate.endsWith(':')) {
            candidate += path_1.sep;
        }
        // Ensure absolute
        if (!(0, path_1.$_b)(candidate)) {
            candidate = (0, path_1.$ac)(cwd, candidate);
        }
        // Ensure normalized
        candidate = (0, path_1.$$b)(candidate);
        // Ensure no trailing slash/backslash
        if (platform_1.$i) {
            candidate = (0, strings_1.$td)(candidate, path_1.sep);
            // Special case: allow to open drive root ('C:\')
            if (candidate.endsWith(':')) {
                candidate += path_1.sep;
            }
        }
        else {
            candidate = (0, strings_1.$td)(candidate, path_1.sep);
            // Special case: allow to open root ('/')
            if (!candidate) {
                candidate = path_1.sep;
            }
        }
        return candidate;
    }
    exports.$Ie = $Ie;
    function $Je(path) {
        const pathNormalized = (0, path_1.$$b)(path);
        if (platform_1.$i) {
            if (path.length > 3) {
                return false;
            }
            return $Ke(pathNormalized) &&
                (path.length === 2 || pathNormalized.charCodeAt(2) === 92 /* CharCode.Backslash */);
        }
        return pathNormalized === path_1.$0b.sep;
    }
    exports.$Je = $Je;
    function $Ke(path, isWindowsOS = platform_1.$i) {
        if (isWindowsOS) {
            return $He(path.charCodeAt(0)) && path.charCodeAt(1) === 58 /* CharCode.Colon */;
        }
        return false;
    }
    exports.$Ke = $Ke;
    function $Le(path, isWindowsOS = platform_1.$i) {
        return $Ke(path, isWindowsOS) ? path[0] : undefined;
    }
    exports.$Le = $Le;
    function $Me(path, candidate, ignoreCase) {
        if (candidate.length > path.length) {
            return -1;
        }
        if (path === candidate) {
            return 0;
        }
        if (ignoreCase) {
            path = path.toLowerCase();
            candidate = candidate.toLowerCase();
        }
        return path.indexOf(candidate);
    }
    exports.$Me = $Me;
    function $Ne(rawPath) {
        const segments = rawPath.split(':'); // C:\file.txt:<line>:<column>
        let path = undefined;
        let line = undefined;
        let column = undefined;
        for (const segment of segments) {
            const segmentAsNumber = Number(segment);
            if (!(0, types_1.$le)(segmentAsNumber)) {
                path = !!path ? [path, segment].join(':') : segment; // a colon can well be part of a path (e.g. C:\...)
            }
            else if (line === undefined) {
                line = segmentAsNumber;
            }
            else if (column === undefined) {
                column = segmentAsNumber;
            }
        }
        if (!path) {
            throw new Error('Format for `--goto` should be: `FILE:LINE(:COLUMN)`');
        }
        return {
            path,
            line: line !== undefined ? line : undefined,
            column: column !== undefined ? column : line !== undefined ? 1 : undefined // if we have a line, make sure column is also set
        };
    }
    exports.$Ne = $Ne;
    const pathChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const windowsSafePathFirstChars = 'BDEFGHIJKMOQRSTUVWXYZbdefghijkmoqrstuvwxyz0123456789';
    function $Oe(parent, prefix, randomLength = 8) {
        let suffix = '';
        for (let i = 0; i < randomLength; i++) {
            let pathCharsTouse;
            if (i === 0 && platform_1.$i && !prefix && (randomLength === 3 || randomLength === 4)) {
                // Windows has certain reserved file names that cannot be used, such
                // as AUX, CON, PRN, etc. We want to avoid generating a random name
                // that matches that pattern, so we use a different set of characters
                // for the first character of the name that does not include any of
                // the reserved names first characters.
                pathCharsTouse = windowsSafePathFirstChars;
            }
            else {
                pathCharsTouse = pathChars;
            }
            suffix += pathCharsTouse.charAt(Math.floor(Math.random() * pathCharsTouse.length));
        }
        let randomFileName;
        if (prefix) {
            randomFileName = `${prefix}-${suffix}`;
        }
        else {
            randomFileName = suffix;
        }
        if (parent) {
            return (0, path_1.$ac)(parent, randomFileName);
        }
        return randomFileName;
    }
    exports.$Oe = $Oe;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[17/*vs/base/common/network*/], __M([0/*require*/,1/*exports*/,6/*vs/base/common/errors*/,3/*vs/base/common/platform*/,8/*vs/base/common/uri*/]), function (require, exports, errors, platform, uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.COI = exports.$Ze = exports.$Ye = exports.$Xe = exports.$We = exports.$Ve = exports.$Ue = exports.$Te = exports.$Se = exports.Schemas = void 0;
    var Schemas;
    (function (Schemas) {
        /**
         * A schema that is used for models that exist in memory
         * only and that have no correspondence on a server or such.
         */
        Schemas.inMemory = 'inmemory';
        /**
         * A schema that is used for setting files
         */
        Schemas.vscode = 'vscode';
        /**
         * A schema that is used for internal private files
         */
        Schemas.internal = 'private';
        /**
         * A walk-through document.
         */
        Schemas.walkThrough = 'walkThrough';
        /**
         * An embedded code snippet.
         */
        Schemas.walkThroughSnippet = 'walkThroughSnippet';
        Schemas.http = 'http';
        Schemas.https = 'https';
        Schemas.file = 'file';
        Schemas.mailto = 'mailto';
        Schemas.untitled = 'untitled';
        Schemas.data = 'data';
        Schemas.command = 'command';
        Schemas.vscodeRemote = 'vscode-remote';
        Schemas.vscodeRemoteResource = 'vscode-remote-resource';
        Schemas.vscodeManagedRemoteResource = 'vscode-managed-remote-resource';
        Schemas.vscodeUserData = 'vscode-userdata';
        Schemas.vscodeCustomEditor = 'vscode-custom-editor';
        Schemas.vscodeNotebookCell = 'vscode-notebook-cell';
        Schemas.vscodeNotebookCellMetadata = 'vscode-notebook-cell-metadata';
        Schemas.vscodeNotebookCellOutput = 'vscode-notebook-cell-output';
        Schemas.vscodeInteractiveInput = 'vscode-interactive-input';
        Schemas.vscodeSettings = 'vscode-settings';
        Schemas.vscodeWorkspaceTrust = 'vscode-workspace-trust';
        Schemas.vscodeTerminal = 'vscode-terminal';
        Schemas.vscodeChatSesssion = 'vscode-chat-editor';
        /**
         * Scheme used internally for webviews that aren't linked to a resource (i.e. not custom editors)
         */
        Schemas.webviewPanel = 'webview-panel';
        /**
         * Scheme used for loading the wrapper html and script in webviews.
         */
        Schemas.vscodeWebview = 'vscode-webview';
        /**
         * Scheme used for extension pages
         */
        Schemas.extension = 'extension';
        /**
         * Scheme used as a replacement of `file` scheme to load
         * files with our custom protocol handler (desktop only).
         */
        Schemas.vscodeFileResource = 'vscode-file';
        /**
         * Scheme used for temporary resources
         */
        Schemas.tmp = 'tmp';
        /**
         * Scheme used vs live share
         */
        Schemas.vsls = 'vsls';
        /**
         * Scheme used for the Source Control commit input's text document
         */
        Schemas.vscodeSourceControl = 'vscode-scm';
    })(Schemas || (exports.Schemas = Schemas = {}));
    exports.$Se = 'vscode-tkn';
    exports.$Te = 'tkn';
    class RemoteAuthoritiesImpl {
        constructor() {
            this.a = Object.create(null);
            this.b = Object.create(null);
            this.c = Object.create(null);
            this.d = 'http';
            this.e = null;
            this.f = `/${Schemas.vscodeRemoteResource}`;
        }
        setPreferredWebSchema(schema) {
            this.d = schema;
        }
        setDelegate(delegate) {
            this.e = delegate;
        }
        setServerRootPath(serverRootPath) {
            this.f = `${serverRootPath}/${Schemas.vscodeRemoteResource}`;
        }
        set(authority, host, port) {
            this.a[authority] = host;
            this.b[authority] = port;
        }
        setConnectionToken(authority, connectionToken) {
            this.c[authority] = connectionToken;
        }
        getPreferredWebSchema() {
            return this.d;
        }
        rewrite(uri) {
            if (this.e) {
                try {
                    return this.e(uri);
                }
                catch (err) {
                    errors.$Y(err);
                    return uri;
                }
            }
            const authority = uri.authority;
            let host = this.a[authority];
            if (host && host.indexOf(':') !== -1 && host.indexOf('[') === -1) {
                host = `[${host}]`;
            }
            const port = this.b[authority];
            const connectionToken = this.c[authority];
            let query = `path=${encodeURIComponent(uri.path)}`;
            if (typeof connectionToken === 'string') {
                query += `&${exports.$Te}=${encodeURIComponent(connectionToken)}`;
            }
            return uri_1.URI.from({
                scheme: platform.$o ? this.d : Schemas.vscodeRemoteResource,
                authority: `${host}:${port}`,
                path: this.f,
                query
            });
        }
    }
    exports.$Ue = new RemoteAuthoritiesImpl();
    exports.$Ve = 'vs/../../extensions';
    exports.$We = 'vs/../../node_modules';
    exports.$Xe = 'vs/../../node_modules.asar';
    exports.$Ye = 'vs/../../node_modules.asar.unpacked';
    class FileAccessImpl {
        static { this.a = 'vscode-app'; }
        /**
         * Returns a URI to use in contexts where the browser is responsible
         * for loading (e.g. fetch()) or when used within the DOM.
         *
         * **Note:** use `dom.ts#asCSSUrl` whenever the URL is to be used in CSS context.
         */
        asBrowserUri(resourcePath) {
            const uri = this.b(resourcePath, require);
            return this.uriToBrowserUri(uri);
        }
        /**
         * Returns a URI to use in contexts where the browser is responsible
         * for loading (e.g. fetch()) or when used within the DOM.
         *
         * **Note:** use `dom.ts#asCSSUrl` whenever the URL is to be used in CSS context.
         */
        uriToBrowserUri(uri) {
            // Handle remote URIs via `RemoteAuthorities`
            if (uri.scheme === Schemas.vscodeRemote) {
                return exports.$Ue.rewrite(uri);
            }
            // Convert to `vscode-file` resource..
            if (
            // ...only ever for `file` resources
            uri.scheme === Schemas.file &&
                (
                // ...and we run in native environments
                platform.$m ||
                    // ...or web worker extensions on desktop
                    (platform.$p && platform.$g.origin === `${Schemas.vscodeFileResource}://${FileAccessImpl.a}`))) {
                return uri.with({
                    scheme: Schemas.vscodeFileResource,
                    // We need to provide an authority here so that it can serve
                    // as origin for network and loading matters in chromium.
                    // If the URI is not coming with an authority already, we
                    // add our own
                    authority: uri.authority || FileAccessImpl.a,
                    query: null,
                    fragment: null
                });
            }
            return uri;
        }
        /**
         * Returns the `file` URI to use in contexts where node.js
         * is responsible for loading.
         */
        asFileUri(resourcePath) {
            const uri = this.b(resourcePath, require);
            return this.uriToFileUri(uri);
        }
        /**
         * Returns the `file` URI to use in contexts where node.js
         * is responsible for loading.
         */
        uriToFileUri(uri) {
            // Only convert the URI if it is `vscode-file:` scheme
            if (uri.scheme === Schemas.vscodeFileResource) {
                return uri.with({
                    scheme: Schemas.file,
                    // Only preserve the `authority` if it is different from
                    // our fallback authority. This ensures we properly preserve
                    // Windows UNC paths that come with their own authority.
                    authority: uri.authority !== FileAccessImpl.a ? uri.authority : null,
                    query: null,
                    fragment: null
                });
            }
            return uri;
        }
        b(uriOrModule, moduleIdToUrl) {
            if (uri_1.URI.isUri(uriOrModule)) {
                return uriOrModule;
            }
            return uri_1.URI.parse(moduleIdToUrl.toUrl(uriOrModule));
        }
    }
    exports.$Ze = new FileAccessImpl();
    var COI;
    (function (COI) {
        const coiHeaders = new Map([
            ['1', { 'Cross-Origin-Opener-Policy': 'same-origin' }],
            ['2', { 'Cross-Origin-Embedder-Policy': 'require-corp' }],
            ['3', { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' }],
        ]);
        COI.CoopAndCoep = Object.freeze(coiHeaders.get('3'));
        const coiSearchParamName = 'vscode-coi';
        /**
         * Extract desired headers from `vscode-coi` invocation
         */
        function getHeadersFromQuery(url) {
            let params;
            if (typeof url === 'string') {
                params = new URL(url).searchParams;
            }
            else if (url instanceof URL) {
                params = url.searchParams;
            }
            else if (uri_1.URI.isUri(url)) {
                params = new URL(url.toString(true)).searchParams;
            }
            const value = params?.get(coiSearchParamName);
            if (!value) {
                return undefined;
            }
            return coiHeaders.get(value);
        }
        COI.getHeadersFromQuery = getHeadersFromQuery;
        /**
         * Add the `vscode-coi` query attribute based on wanting `COOP` and `COEP`. Will be a noop when `crossOriginIsolated`
         * isn't enabled the current context
         */
        function addSearchParam(urlOrSearch, coop, coep) {
            if (!globalThis.crossOriginIsolated) {
                // depends on the current context being COI
                return;
            }
            const value = coop && coep ? '3' : coep ? '2' : '1';
            if (urlOrSearch instanceof URLSearchParams) {
                urlOrSearch.set(coiSearchParamName, value);
            }
            else {
                urlOrSearch[coiSearchParamName] = value;
            }
        }
        COI.addSearchParam = addSearchParam;
    })(COI || (exports.COI = COI = {}));
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[32/*vs/amdX*/], __M([0/*require*/,1/*exports*/,21/*vs/base/common/amd*/,17/*vs/base/common/network*/,3/*vs/base/common/platform*/,8/*vs/base/common/uri*/]), function (require, exports, amd_1, network_1, platform, uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$UC = void 0;
    class DefineCall {
        constructor(id, dependencies, callback) {
            this.id = id;
            this.dependencies = dependencies;
            this.callback = callback;
        }
    }
    class AMDModuleImporter {
        static { this.INSTANCE = new AMDModuleImporter(); }
        constructor() {
            this.a = (typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope');
            this.b = typeof document === 'object';
            this.c = [];
            this.d = false;
        }
        g() {
            if (this.d) {
                return;
            }
            this.d = true;
            globalThis.define = (id, dependencies, callback) => {
                if (typeof id !== 'string') {
                    callback = dependencies;
                    dependencies = id;
                    id = null;
                }
                if (typeof dependencies !== 'object' || !Array.isArray(dependencies)) {
                    callback = dependencies;
                    dependencies = null;
                }
                // if (!dependencies) {
                // 	dependencies = ['require', 'exports', 'module'];
                // }
                this.c.push(new DefineCall(id, dependencies, callback));
            };
            globalThis.define.amd = true;
            if (this.b) {
                this.f = window.trustedTypes?.createPolicy('amdLoader', {
                    createScriptURL(value) {
                        if (value.startsWith(window.location.origin)) {
                            return value;
                        }
                        if (value.startsWith('vscode-file://vscode-app')) {
                            return value;
                        }
                        throw new Error(`[trusted_script_src] Invalid script url: ${value}`);
                    }
                });
            }
            else if (this.a) {
                this.f = globalThis.trustedTypes?.createPolicy('amdLoader', {
                    createScriptURL(value) {
                        return value;
                    }
                });
            }
        }
        async load(scriptSrc) {
            this.g();
            const defineCall = await (this.a ? this.i(scriptSrc) : this.b ? this.h(scriptSrc) : this.j(scriptSrc));
            if (!defineCall) {
                throw new Error(`Did not receive a define call from script ${scriptSrc}`);
            }
            // TODO require, exports, module
            if (Array.isArray(defineCall.dependencies) && defineCall.dependencies.length > 0) {
                throw new Error(`Cannot resolve dependencies for script ${scriptSrc}. The dependencies are: ${defineCall.dependencies.join(', ')}`);
            }
            if (typeof defineCall.callback === 'function') {
                return defineCall.callback([]);
            }
            else {
                return defineCall.callback;
            }
        }
        h(scriptSrc) {
            return new Promise((resolve, reject) => {
                const scriptElement = document.createElement('script');
                scriptElement.setAttribute('async', 'async');
                scriptElement.setAttribute('type', 'text/javascript');
                const unbind = () => {
                    scriptElement.removeEventListener('load', loadEventListener);
                    scriptElement.removeEventListener('error', errorEventListener);
                };
                const loadEventListener = (e) => {
                    unbind();
                    resolve(this.c.pop());
                };
                const errorEventListener = (e) => {
                    unbind();
                    reject(e);
                };
                scriptElement.addEventListener('load', loadEventListener);
                scriptElement.addEventListener('error', errorEventListener);
                if (this.f) {
                    scriptSrc = this.f.createScriptURL(scriptSrc);
                }
                scriptElement.setAttribute('src', scriptSrc);
                document.getElementsByTagName('head')[0].appendChild(scriptElement);
            });
        }
        i(scriptSrc) {
            return new Promise((resolve, reject) => {
                try {
                    if (this.f) {
                        scriptSrc = this.f.createScriptURL(scriptSrc);
                    }
                    importScripts(scriptSrc);
                    resolve(this.c.pop());
                }
                catch (err) {
                    reject(err);
                }
            });
        }
        async j(scriptSrc) {
            try {
                const fs = globalThis._VSCODE_NODE_MODULES['fs'];
                const vm = globalThis._VSCODE_NODE_MODULES['vm'];
                const module = globalThis._VSCODE_NODE_MODULES['module'];
                const filePath = uri_1.URI.parse(scriptSrc).fsPath;
                const content = fs.readFileSync(filePath).toString();
                const scriptSource = module.wrap(content.replace(/^#!.*/, ''));
                const script = new vm.Script(scriptSource);
                const compileWrapper = script.runInThisContext();
                compileWrapper.apply();
                return this.c.pop();
            }
            catch (error) {
                throw error;
            }
        }
    }
    const cache = new Map();
    let _paths = {};
    if (typeof globalThis.require === 'object') {
        _paths = globalThis.require.paths ?? {};
    }
    /**
     * Utility for importing an AMD node module. This util supports AMD and ESM contexts and should be used while the ESM adoption
     * is on its way.
     *
     * e.g. pass in `vscode-textmate/release/main.js`
     */
    async function $UC(nodeModuleName, pathInsideNodeModule, isBuilt) {
        if (amd_1.$R) {
            if (isBuilt === undefined) {
                const product = globalThis._VSCODE_PRODUCT_JSON;
                isBuilt = Boolean((product ?? globalThis.vscode?.context?.configuration()?.product)?.commit);
            }
            if (_paths[nodeModuleName]) {
                nodeModuleName = _paths[nodeModuleName];
            }
            const nodeModulePath = `${nodeModuleName}/${pathInsideNodeModule}`;
            if (cache.has(nodeModulePath)) {
                return cache.get(nodeModulePath);
            }
            let scriptSrc;
            if (/^\w[\w\d+.-]*:\/\//.test(nodeModulePath)) {
                // looks like a URL
                // bit of a special case for: src/vs/workbench/services/languageDetection/browser/languageDetectionSimpleWorker.ts
                scriptSrc = nodeModulePath;
            }
            else {
                const useASAR = (isBuilt && !platform.$o);
                const actualNodeModulesPath = (useASAR ? network_1.$Xe : network_1.$We);
                const resourcePath = `${actualNodeModulesPath}/${nodeModulePath}`;
                scriptSrc = network_1.$Ze.asBrowserUri(resourcePath).toString(true);
            }
            const result = AMDModuleImporter.INSTANCE.load(scriptSrc);
            cache.set(nodeModulePath, result);
            return result;
        }
        else {
            return await new Promise((resolve_1, reject_1) => { require([nodeModuleName], resolve_1, reject_1); });
        }
    }
    exports.$UC = $UC;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[18/*vs/base/common/resources*/], __M([0/*require*/,1/*exports*/,29/*vs/base/common/extpath*/,17/*vs/base/common/network*/,30/*vs/base/common/path*/,3/*vs/base/common/platform*/,31/*vs/base/common/strings*/,8/*vs/base/common/uri*/]), function (require, exports, extpath, network_1, paths, platform_1, strings_1, uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$dg = exports.DataUri = exports.$cg = exports.$bg = exports.$ag = exports.$_f = exports.$$f = exports.$0f = exports.$9f = exports.$8f = exports.$7f = exports.$6f = exports.$5f = exports.$4f = exports.$3f = exports.$2f = exports.$1f = exports.$Zf = exports.$Yf = exports.$Xf = exports.$Wf = exports.$Vf = exports.$Uf = exports.$Tf = void 0;
    function $Tf(uri) {
        return (0, uri_1.$Re)(uri, true);
    }
    exports.$Tf = $Tf;
    class $Uf {
        constructor(a) {
            this.a = a;
        }
        compare(uri1, uri2, ignoreFragment = false) {
            if (uri1 === uri2) {
                return 0;
            }
            return (0, strings_1.$Dd)(this.getComparisonKey(uri1, ignoreFragment), this.getComparisonKey(uri2, ignoreFragment));
        }
        isEqual(uri1, uri2, ignoreFragment = false) {
            if (uri1 === uri2) {
                return true;
            }
            if (!uri1 || !uri2) {
                return false;
            }
            return this.getComparisonKey(uri1, ignoreFragment) === this.getComparisonKey(uri2, ignoreFragment);
        }
        getComparisonKey(uri, ignoreFragment = false) {
            return uri.with({
                path: this.a(uri) ? uri.path.toLowerCase() : undefined,
                fragment: ignoreFragment ? null : undefined
            }).toString();
        }
        ignorePathCasing(uri) {
            return this.a(uri);
        }
        isEqualOrParent(base, parentCandidate, ignoreFragment = false) {
            if (base.scheme === parentCandidate.scheme) {
                if (base.scheme === network_1.Schemas.file) {
                    return extpath.$Ge($Tf(base), $Tf(parentCandidate), this.a(base)) && base.query === parentCandidate.query && (ignoreFragment || base.fragment === parentCandidate.fragment);
                }
                if ((0, exports.$$f)(base.authority, parentCandidate.authority)) {
                    return extpath.$Ge(base.path, parentCandidate.path, this.a(base), '/') && base.query === parentCandidate.query && (ignoreFragment || base.fragment === parentCandidate.fragment);
                }
            }
            return false;
        }
        // --- path math
        joinPath(resource, ...pathFragment) {
            return uri_1.URI.joinPath(resource, ...pathFragment);
        }
        basenameOrAuthority(resource) {
            return (0, exports.$3f)(resource) || resource.authority;
        }
        basename(resource) {
            return paths.$0b.basename(resource.path);
        }
        extname(resource) {
            return paths.$0b.extname(resource.path);
        }
        dirname(resource) {
            if (resource.path.length === 0) {
                return resource;
            }
            let dirname;
            if (resource.scheme === network_1.Schemas.file) {
                dirname = uri_1.URI.file(paths.$dc($Tf(resource))).path;
            }
            else {
                dirname = paths.$0b.dirname(resource.path);
                if (resource.authority && dirname.length && dirname.charCodeAt(0) !== 47 /* CharCode.Slash */) {
                    console.error(`dirname("${resource.toString})) resulted in a relative path`);
                    dirname = '/'; // If a URI contains an authority component, then the path component must either be empty or begin with a CharCode.Slash ("/") character
                }
            }
            return resource.with({
                path: dirname
            });
        }
        normalizePath(resource) {
            if (!resource.path.length) {
                return resource;
            }
            let normalizedPath;
            if (resource.scheme === network_1.Schemas.file) {
                normalizedPath = uri_1.URI.file(paths.$$b($Tf(resource))).path;
            }
            else {
                normalizedPath = paths.$0b.normalize(resource.path);
            }
            return resource.with({
                path: normalizedPath
            });
        }
        relativePath(from, to) {
            if (from.scheme !== to.scheme || !(0, exports.$$f)(from.authority, to.authority)) {
                return undefined;
            }
            if (from.scheme === network_1.Schemas.file) {
                const relativePath = paths.$cc($Tf(from), $Tf(to));
                return platform_1.$i ? extpath.$Ae(relativePath) : relativePath;
            }
            let fromPath = from.path || '/';
            const toPath = to.path || '/';
            if (this.a(from)) {
                // make casing of fromPath match toPath
                let i = 0;
                for (const len = Math.min(fromPath.length, toPath.length); i < len; i++) {
                    if (fromPath.charCodeAt(i) !== toPath.charCodeAt(i)) {
                        if (fromPath.charAt(i).toLowerCase() !== toPath.charAt(i).toLowerCase()) {
                            break;
                        }
                    }
                }
                fromPath = toPath.substr(0, i) + fromPath.substr(i);
            }
            return paths.$0b.relative(fromPath, toPath);
        }
        resolvePath(base, path) {
            if (base.scheme === network_1.Schemas.file) {
                const newURI = uri_1.URI.file(paths.$bc($Tf(base), path));
                return base.with({
                    authority: newURI.authority,
                    path: newURI.path
                });
            }
            path = extpath.$Be(path); // we allow path to be a windows path
            return base.with({
                path: paths.$0b.resolve(base.path, path)
            });
        }
        // --- misc
        isAbsolutePath(resource) {
            return !!resource.path && resource.path[0] === '/';
        }
        isEqualAuthority(a1, a2) {
            return a1 === a2 || (a1 !== undefined && a2 !== undefined && (0, strings_1.$Kd)(a1, a2));
        }
        hasTrailingPathSeparator(resource, sep = paths.sep) {
            if (resource.scheme === network_1.Schemas.file) {
                const fsp = $Tf(resource);
                return fsp.length > extpath.$Ce(fsp).length && fsp[fsp.length - 1] === sep;
            }
            else {
                const p = resource.path;
                return (p.length > 1 && p.charCodeAt(p.length - 1) === 47 /* CharCode.Slash */) && !(/^[a-zA-Z]:(\/$|\\$)/.test(resource.fsPath)); // ignore the slash at offset 0
            }
        }
        removeTrailingPathSeparator(resource, sep = paths.sep) {
            // Make sure that the path isn't a drive letter. A trailing separator there is not removable.
            if ((0, exports.$_f)(resource, sep)) {
                return resource.with({ path: resource.path.substr(0, resource.path.length - 1) });
            }
            return resource;
        }
        addTrailingPathSeparator(resource, sep = paths.sep) {
            let isRootSep = false;
            if (resource.scheme === network_1.Schemas.file) {
                const fsp = $Tf(resource);
                isRootSep = ((fsp !== undefined) && (fsp.length === extpath.$Ce(fsp).length) && (fsp[fsp.length - 1] === sep));
            }
            else {
                sep = '/';
                const p = resource.path;
                isRootSep = p.length === 1 && p.charCodeAt(p.length - 1) === 47 /* CharCode.Slash */;
            }
            if (!isRootSep && !(0, exports.$_f)(resource, sep)) {
                return resource.with({ path: resource.path + '/' });
            }
            return resource;
        }
    }
    exports.$Uf = $Uf;
    /**
     * Unbiased utility that takes uris "as they are". This means it can be interchanged with
     * uri#toString() usages. The following is true
     * ```
     * assertEqual(aUri.toString() === bUri.toString(), exturi.isEqual(aUri, bUri))
     * ```
     */
    exports.$Vf = new $Uf(() => false);
    /**
     * BIASED utility that _mostly_ ignored the case of urs paths. ONLY use this util if you
     * understand what you are doing.
     *
     * This utility is INCOMPATIBLE with `uri.toString()`-usages and both CANNOT be used interchanged.
     *
     * When dealing with uris from files or documents, `extUri` (the unbiased friend)is sufficient
     * because those uris come from a "trustworthy source". When creating unknown uris it's always
     * better to use `IUriIdentityService` which exposes an `IExtUri`-instance which knows when path
     * casing matters.
     */
    exports.$Wf = new $Uf(uri => {
        // A file scheme resource is in the same platform as code, so ignore case for non linux platforms
        // Resource can be from another platform. Lowering the case as an hack. Should come from File system provider
        return uri.scheme === network_1.Schemas.file ? !platform_1.$k : true;
    });
    /**
     * BIASED utility that always ignores the casing of uris paths. ONLY use this util if you
     * understand what you are doing.
     *
     * This utility is INCOMPATIBLE with `uri.toString()`-usages and both CANNOT be used interchanged.
     *
     * When dealing with uris from files or documents, `extUri` (the unbiased friend)is sufficient
     * because those uris come from a "trustworthy source". When creating unknown uris it's always
     * better to use `IUriIdentityService` which exposes an `IExtUri`-instance which knows when path
     * casing matters.
     */
    exports.$Xf = new $Uf(_ => true);
    exports.$Yf = exports.$Vf.isEqual.bind(exports.$Vf);
    exports.$Zf = exports.$Vf.isEqualOrParent.bind(exports.$Vf);
    exports.$1f = exports.$Vf.getComparisonKey.bind(exports.$Vf);
    exports.$2f = exports.$Vf.basenameOrAuthority.bind(exports.$Vf);
    exports.$3f = exports.$Vf.basename.bind(exports.$Vf);
    exports.$4f = exports.$Vf.extname.bind(exports.$Vf);
    exports.$5f = exports.$Vf.dirname.bind(exports.$Vf);
    exports.$6f = exports.$Vf.joinPath.bind(exports.$Vf);
    exports.$7f = exports.$Vf.normalizePath.bind(exports.$Vf);
    exports.$8f = exports.$Vf.relativePath.bind(exports.$Vf);
    exports.$9f = exports.$Vf.resolvePath.bind(exports.$Vf);
    exports.$0f = exports.$Vf.isAbsolutePath.bind(exports.$Vf);
    exports.$$f = exports.$Vf.isEqualAuthority.bind(exports.$Vf);
    exports.$_f = exports.$Vf.hasTrailingPathSeparator.bind(exports.$Vf);
    exports.$ag = exports.$Vf.removeTrailingPathSeparator.bind(exports.$Vf);
    exports.$bg = exports.$Vf.addTrailingPathSeparator.bind(exports.$Vf);
    //#endregion
    function $cg(items, resourceAccessor) {
        const distinctParents = [];
        for (let i = 0; i < items.length; i++) {
            const candidateResource = resourceAccessor(items[i]);
            if (items.some((otherItem, index) => {
                if (index === i) {
                    return false;
                }
                return (0, exports.$Zf)(candidateResource, resourceAccessor(otherItem));
            })) {
                continue;
            }
            distinctParents.push(items[i]);
        }
        return distinctParents;
    }
    exports.$cg = $cg;
    /**
     * Data URI related helpers.
     */
    var DataUri;
    (function (DataUri) {
        DataUri.META_DATA_LABEL = 'label';
        DataUri.META_DATA_DESCRIPTION = 'description';
        DataUri.META_DATA_SIZE = 'size';
        DataUri.META_DATA_MIME = 'mime';
        function parseMetaData(dataUri) {
            const metadata = new Map();
            // Given a URI of:  data:image/png;size:2313;label:SomeLabel;description:SomeDescription;base64,77+9UE5...
            // the metadata is: size:2313;label:SomeLabel;description:SomeDescription
            const meta = dataUri.path.substring(dataUri.path.indexOf(';') + 1, dataUri.path.lastIndexOf(';'));
            meta.split(';').forEach(property => {
                const [key, value] = property.split(':');
                if (key && value) {
                    metadata.set(key, value);
                }
            });
            // Given a URI of:  data:image/png;size:2313;label:SomeLabel;description:SomeDescription;base64,77+9UE5...
            // the mime is: image/png
            const mime = dataUri.path.substring(0, dataUri.path.indexOf(';'));
            if (mime) {
                metadata.set(DataUri.META_DATA_MIME, mime);
            }
            return metadata;
        }
        DataUri.parseMetaData = parseMetaData;
    })(DataUri || (exports.DataUri = DataUri = {}));
    function $dg(resource, authority, localScheme) {
        if (authority) {
            let path = resource.path;
            if (path && path[0] !== paths.$0b.sep) {
                path = paths.$0b.sep + path;
            }
            return resource.with({ scheme: localScheme, authority, path });
        }
        return resource.with({ scheme: localScheme });
    }
    exports.$dg = $dg;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[19/*vs/base/common/async*/], __M([0/*require*/,1/*exports*/,46/*vs/base/common/cancellation*/,6/*vs/base/common/errors*/,33/*vs/base/common/event*/,2/*vs/base/common/lifecycle*/,18/*vs/base/common/resources*/,3/*vs/base/common/platform*/,24/*vs/base/common/symbols*/]), function (require, exports, cancellation_1, errors_1, event_1, lifecycle_1, resources_1, platform_1, symbols_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$Og = exports.$Ng = exports.$Mg = exports.Promises = exports.$Lg = exports.$Kg = exports.$Jg = exports.$Ig = exports.$Hg = exports.$Gg = exports.$Fg = exports.$Eg = exports.$Dg = exports.$Cg = exports.$Bg = exports.$Ag = exports.$zg = exports.$yg = exports.$xg = exports.$wg = exports.$vg = exports.$ug = exports.$tg = exports.$sg = exports.$rg = exports.$qg = exports.$pg = exports.$og = exports.$ng = exports.$mg = exports.$lg = exports.$kg = exports.$jg = exports.$ig = exports.$hg = exports.$gg = exports.$fg = exports.$eg = void 0;
    function $eg(obj) {
        return !!obj && typeof obj.then === 'function';
    }
    exports.$eg = $eg;
    function $fg(callback) {
        const source = new cancellation_1.$ed();
        const thenable = callback(source.token);
        const promise = new Promise((resolve, reject) => {
            const subscription = source.token.onCancellationRequested(() => {
                subscription.dispose();
                source.dispose();
                reject(new errors_1.$3());
            });
            Promise.resolve(thenable).then(value => {
                subscription.dispose();
                source.dispose();
                resolve(value);
            }, err => {
                subscription.dispose();
                source.dispose();
                reject(err);
            });
        });
        return new class {
            cancel() {
                source.cancel();
            }
            then(resolve, reject) {
                return promise.then(resolve, reject);
            }
            catch(reject) {
                return this.then(undefined, reject);
            }
            finally(onfinally) {
                return promise.finally(onfinally);
            }
        };
    }
    exports.$fg = $fg;
    function $gg(promise, token, defaultValue) {
        return new Promise((resolve, reject) => {
            const ref = token.onCancellationRequested(() => {
                ref.dispose();
                resolve(defaultValue);
            });
            promise.then(resolve, reject).finally(() => ref.dispose());
        });
    }
    exports.$gg = $gg;
    /**
     * Returns a promise that rejects with an {@CancellationError} as soon as the passed token is cancelled.
     * @see {@link $gg}
     */
    function $hg(promise, token) {
        return new Promise((resolve, reject) => {
            const ref = token.onCancellationRequested(() => {
                ref.dispose();
                reject(new errors_1.$3());
            });
            promise.then(resolve, reject).finally(() => ref.dispose());
        });
    }
    exports.$hg = $hg;
    /**
     * Returns as soon as one of the promises resolves or rejects and cancels remaining promises
     */
    async function $ig(cancellablePromises) {
        let resolvedPromiseIndex = -1;
        const promises = cancellablePromises.map((promise, index) => promise.then(result => { resolvedPromiseIndex = index; return result; }));
        try {
            const result = await Promise.race(promises);
            return result;
        }
        finally {
            cancellablePromises.forEach((cancellablePromise, index) => {
                if (index !== resolvedPromiseIndex) {
                    cancellablePromise.cancel();
                }
            });
        }
    }
    exports.$ig = $ig;
    function $jg(promise, timeout, onTimeout) {
        let promiseResolve = undefined;
        const timer = setTimeout(() => {
            promiseResolve?.(undefined);
            onTimeout?.();
        }, timeout);
        return Promise.race([
            promise.finally(() => clearTimeout(timer)),
            new Promise(resolve => promiseResolve = resolve)
        ]);
    }
    exports.$jg = $jg;
    function $kg(callback) {
        return new Promise((resolve, reject) => {
            const item = callback();
            if ($eg(item)) {
                item.then(resolve, reject);
            }
            else {
                resolve(item);
            }
        });
    }
    exports.$kg = $kg;
    /**
     * A helper to prevent accumulation of sequential async tasks.
     *
     * Imagine a mail man with the sole task of delivering letters. As soon as
     * a letter submitted for delivery, he drives to the destination, delivers it
     * and returns to his base. Imagine that during the trip, N more letters were submitted.
     * When the mail man returns, he picks those N letters and delivers them all in a
     * single trip. Even though N+1 submissions occurred, only 2 deliveries were made.
     *
     * The throttler implements this via the queue() method, by providing it a task
     * factory. Following the example:
     *
     * 		const throttler = new Throttler();
     * 		const letters = [];
     *
     * 		function deliver() {
     * 			const lettersToDeliver = letters;
     * 			letters = [];
     * 			return makeTheTrip(lettersToDeliver);
     * 		}
     *
     * 		function onLetterReceived(l) {
     * 			letters.push(l);
     * 			throttler.queue(deliver);
     * 		}
     */
    class $lg {
        constructor() {
            this.f = false;
            this.a = null;
            this.b = null;
            this.d = null;
        }
        queue(promiseFactory) {
            if (this.f) {
                throw new Error('Throttler is disposed');
            }
            if (this.a) {
                this.d = promiseFactory;
                if (!this.b) {
                    const onComplete = () => {
                        this.b = null;
                        if (this.f) {
                            return;
                        }
                        const result = this.queue(this.d);
                        this.d = null;
                        return result;
                    };
                    this.b = new Promise(resolve => {
                        this.a.then(onComplete, onComplete).then(resolve);
                    });
                }
                return new Promise((resolve, reject) => {
                    this.b.then(resolve, reject);
                });
            }
            this.a = promiseFactory();
            return new Promise((resolve, reject) => {
                this.a.then((result) => {
                    this.a = null;
                    resolve(result);
                }, (err) => {
                    this.a = null;
                    reject(err);
                });
            });
        }
        dispose() {
            this.f = true;
        }
    }
    exports.$lg = $lg;
    class $mg {
        constructor() {
            this.a = Promise.resolve(null);
        }
        queue(promiseTask) {
            return this.a = this.a.then(() => promiseTask(), () => promiseTask());
        }
    }
    exports.$mg = $mg;
    class $ng {
        constructor() {
            this.a = new Map();
        }
        queue(key, promiseTask) {
            const runningPromise = this.a.get(key) ?? Promise.resolve();
            const newPromise = runningPromise
                .catch(() => { })
                .then(promiseTask)
                .finally(() => {
                if (this.a.get(key) === newPromise) {
                    this.a.delete(key);
                }
            });
            this.a.set(key, newPromise);
            return newPromise;
        }
    }
    exports.$ng = $ng;
    const timeoutDeferred = (timeout, fn) => {
        let scheduled = true;
        const handle = setTimeout(() => {
            scheduled = false;
            fn();
        }, timeout);
        return {
            isTriggered: () => scheduled,
            dispose: () => {
                clearTimeout(handle);
                scheduled = false;
            },
        };
    };
    const microtaskDeferred = (fn) => {
        let scheduled = true;
        queueMicrotask(() => {
            if (scheduled) {
                scheduled = false;
                fn();
            }
        });
        return {
            isTriggered: () => scheduled,
            dispose: () => { scheduled = false; },
        };
    };
    /**
     * A helper to delay (debounce) execution of a task that is being requested often.
     *
     * Following the throttler, now imagine the mail man wants to optimize the number of
     * trips proactively. The trip itself can be long, so he decides not to make the trip
     * as soon as a letter is submitted. Instead he waits a while, in case more
     * letters are submitted. After said waiting period, if no letters were submitted, he
     * decides to make the trip. Imagine that N more letters were submitted after the first
     * one, all within a short period of time between each other. Even though N+1
     * submissions occurred, only 1 delivery was made.
     *
     * The delayer offers this behavior via the trigger() method, into which both the task
     * to be executed and the waiting period (delay) must be passed in as arguments. Following
     * the example:
     *
     * 		const delayer = new Delayer(WAITING_PERIOD);
     * 		const letters = [];
     *
     * 		function letterReceived(l) {
     * 			letters.push(l);
     * 			delayer.trigger(() => { return makeTheTrip(); });
     * 		}
     */
    class $og {
        constructor(defaultDelay) {
            this.defaultDelay = defaultDelay;
            this.a = null;
            this.b = null;
            this.d = null;
            this.f = null;
            this.g = null;
        }
        trigger(task, delay = this.defaultDelay) {
            this.g = task;
            this.h();
            if (!this.b) {
                this.b = new Promise((resolve, reject) => {
                    this.d = resolve;
                    this.f = reject;
                }).then(() => {
                    this.b = null;
                    this.d = null;
                    if (this.g) {
                        const task = this.g;
                        this.g = null;
                        return task();
                    }
                    return undefined;
                });
            }
            const fn = () => {
                this.a = null;
                this.d?.(null);
            };
            this.a = delay === symbols_1.$5c ? microtaskDeferred(fn) : timeoutDeferred(delay, fn);
            return this.b;
        }
        isTriggered() {
            return !!this.a?.isTriggered();
        }
        cancel() {
            this.h();
            if (this.b) {
                this.f?.(new errors_1.$3());
                this.b = null;
            }
        }
        h() {
            this.a?.dispose();
            this.a = null;
        }
        dispose() {
            this.cancel();
        }
    }
    exports.$og = $og;
    /**
     * A helper to delay execution of a task that is being requested often, while
     * preventing accumulation of consecutive executions, while the task runs.
     *
     * The mail man is clever and waits for a certain amount of time, before going
     * out to deliver letters. While the mail man is going out, more letters arrive
     * and can only be delivered once he is back. Once he is back the mail man will
     * do one more trip to deliver the letters that have accumulated while he was out.
     */
    class $pg {
        constructor(defaultDelay) {
            this.a = new $og(defaultDelay);
            this.b = new $lg();
        }
        trigger(promiseFactory, delay) {
            return this.a.trigger(() => this.b.queue(promiseFactory), delay);
        }
        isTriggered() {
            return this.a.isTriggered();
        }
        cancel() {
            this.a.cancel();
        }
        dispose() {
            this.a.dispose();
            this.b.dispose();
        }
    }
    exports.$pg = $pg;
    /**
     * A barrier that is initially closed and then becomes opened permanently.
     */
    class $qg {
        constructor() {
            this.a = false;
            this.b = new Promise((c, e) => {
                this.d = c;
            });
        }
        isOpen() {
            return this.a;
        }
        open() {
            this.a = true;
            this.d(true);
        }
        wait() {
            return this.b;
        }
    }
    exports.$qg = $qg;
    /**
     * A barrier that is initially closed and then becomes opened permanently after a certain period of
     * time or when open is called explicitly
     */
    class $rg extends $qg {
        constructor(autoOpenTimeMs) {
            super();
            this.f = setTimeout(() => this.open(), autoOpenTimeMs);
        }
        open() {
            clearTimeout(this.f);
            super.open();
        }
    }
    exports.$rg = $rg;
    function $sg(millis, token) {
        if (!token) {
            return $fg(token => $sg(millis, token));
        }
        return new Promise((resolve, reject) => {
            const handle = setTimeout(() => {
                disposable.dispose();
                resolve();
            }, millis);
            const disposable = token.onCancellationRequested(() => {
                clearTimeout(handle);
                disposable.dispose();
                reject(new errors_1.$3());
            });
        });
    }
    exports.$sg = $sg;
    function $tg(handler, timeout = 0) {
        const timer = setTimeout(handler, timeout);
        return (0, lifecycle_1.$jb)(() => clearTimeout(timer));
    }
    exports.$tg = $tg;
    /**
     * Runs the provided list of promise factories in sequential order. The returned
     * promise will complete to an array of results from each promise.
     */
    function $ug(promiseFactories) {
        const results = [];
        let index = 0;
        const len = promiseFactories.length;
        function next() {
            return index < len ? promiseFactories[index++]() : null;
        }
        function thenHandler(result) {
            if (result !== undefined && result !== null) {
                results.push(result);
            }
            const n = next();
            if (n) {
                return n.then(thenHandler);
            }
            return Promise.resolve(results);
        }
        return Promise.resolve(null).then(thenHandler);
    }
    exports.$ug = $ug;
    function $vg(promiseFactories, shouldStop = t => !!t, defaultValue = null) {
        let index = 0;
        const len = promiseFactories.length;
        const loop = () => {
            if (index >= len) {
                return Promise.resolve(defaultValue);
            }
            const factory = promiseFactories[index++];
            const promise = Promise.resolve(factory());
            return promise.then(result => {
                if (shouldStop(result)) {
                    return Promise.resolve(result);
                }
                return loop();
            });
        };
        return loop();
    }
    exports.$vg = $vg;
    function $wg(promiseList, shouldStop = t => !!t, defaultValue = null) {
        if (promiseList.length === 0) {
            return Promise.resolve(defaultValue);
        }
        let todo = promiseList.length;
        const finish = () => {
            todo = -1;
            for (const promise of promiseList) {
                promise.cancel?.();
            }
        };
        return new Promise((resolve, reject) => {
            for (const promise of promiseList) {
                promise.then(result => {
                    if (--todo >= 0 && shouldStop(result)) {
                        finish();
                        resolve(result);
                    }
                    else if (todo === 0) {
                        resolve(defaultValue);
                    }
                })
                    .catch(err => {
                    if (--todo >= 0) {
                        finish();
                        reject(err);
                    }
                });
            }
        });
    }
    exports.$wg = $wg;
    /**
     * A helper to queue N promises and run them all with a max degree of parallelism. The helper
     * ensures that at any time no more than M promises are running at the same time.
     */
    class $xg {
        constructor(maxDegreeOfParalellism) {
            this.a = 0;
            this.d = maxDegreeOfParalellism;
            this.f = [];
            this.b = 0;
            this.g = new event_1.$8c();
        }
        /**
         * An event that fires when every promise in the queue
         * has started to execute. In other words: no work is
         * pending to be scheduled.
         *
         * This is NOT an event that signals when all promises
         * have finished though.
         */
        get onDrained() {
            return this.g.event;
        }
        get size() {
            return this.a;
        }
        queue(factory) {
            this.a++;
            return new Promise((c, e) => {
                this.f.push({ factory, c, e });
                this.h();
            });
        }
        h() {
            while (this.f.length && this.b < this.d) {
                const iLimitedTask = this.f.shift();
                this.b++;
                const promise = iLimitedTask.factory();
                promise.then(iLimitedTask.c, iLimitedTask.e);
                promise.then(() => this.j(), () => this.j());
            }
        }
        j() {
            this.a--;
            this.b--;
            if (this.f.length > 0) {
                this.h();
            }
            else {
                this.g.fire();
            }
        }
        dispose() {
            this.g.dispose();
        }
    }
    exports.$xg = $xg;
    /**
     * A queue is handles one promise at a time and guarantees that at any time only one promise is executing.
     */
    class $yg extends $xg {
        constructor() {
            super(1);
        }
    }
    exports.$yg = $yg;
    /**
     * A helper to organize queues per resource. The ResourceQueue makes sure to manage queues per resource
     * by disposing them once the queue is empty.
     */
    class $zg {
        constructor() {
            this.a = new Map();
            this.b = new Set();
        }
        async whenDrained() {
            if (this.d()) {
                return;
            }
            const promise = new $Lg();
            this.b.add(promise);
            return promise.p;
        }
        d() {
            for (const [, queue] of this.a) {
                if (queue.size > 0) {
                    return false;
                }
            }
            return true;
        }
        queueFor(resource, extUri = resources_1.$Vf) {
            const key = extUri.getComparisonKey(resource);
            let queue = this.a.get(key);
            if (!queue) {
                queue = new $yg();
                event_1.Event.once(queue.onDrained)(() => {
                    queue?.dispose();
                    this.a.delete(key);
                    this.f();
                });
                this.a.set(key, queue);
            }
            return queue;
        }
        f() {
            if (!this.d()) {
                return; // not done yet
            }
            this.g();
        }
        g() {
            for (const drainer of this.b) {
                drainer.complete();
            }
            this.b.clear();
        }
        dispose() {
            for (const [, queue] of this.a) {
                queue.dispose();
            }
            this.a.clear();
            // Even though we might still have pending
            // tasks queued, after the queues have been
            // disposed, we can no longer track them, so
            // we release drainers to prevent hanging
            // promises when the resource queue is being
            // disposed.
            this.g();
        }
    }
    exports.$zg = $zg;
    class $Ag {
        constructor(runner, timeout) {
            this.a = -1;
            if (typeof runner === 'function' && typeof timeout === 'number') {
                this.setIfNotSet(runner, timeout);
            }
        }
        dispose() {
            this.cancel();
        }
        cancel() {
            if (this.a !== -1) {
                clearTimeout(this.a);
                this.a = -1;
            }
        }
        cancelAndSet(runner, timeout) {
            this.cancel();
            this.a = setTimeout(() => {
                this.a = -1;
                runner();
            }, timeout);
        }
        setIfNotSet(runner, timeout) {
            if (this.a !== -1) {
                // timer is already set
                return;
            }
            this.a = setTimeout(() => {
                this.a = -1;
                runner();
            }, timeout);
        }
    }
    exports.$Ag = $Ag;
    class $Bg {
        constructor() {
            this.a = -1;
        }
        dispose() {
            this.cancel();
        }
        cancel() {
            if (this.a !== -1) {
                clearInterval(this.a);
                this.a = -1;
            }
        }
        cancelAndSet(runner, interval) {
            this.cancel();
            this.a = setInterval(() => {
                runner();
            }, interval);
        }
    }
    exports.$Bg = $Bg;
    class $Cg {
        constructor(runner, delay) {
            this.b = -1;
            this.a = runner;
            this.d = delay;
            this.f = this.g.bind(this);
        }
        /**
         * Dispose RunOnceScheduler
         */
        dispose() {
            this.cancel();
            this.a = null;
        }
        /**
         * Cancel current scheduled runner (if any).
         */
        cancel() {
            if (this.isScheduled()) {
                clearTimeout(this.b);
                this.b = -1;
            }
        }
        /**
         * Cancel previous runner (if any) & schedule a new runner.
         */
        schedule(delay = this.d) {
            this.cancel();
            this.b = setTimeout(this.f, delay);
        }
        get delay() {
            return this.d;
        }
        set delay(value) {
            this.d = value;
        }
        /**
         * Returns true if scheduled.
         */
        isScheduled() {
            return this.b !== -1;
        }
        flush() {
            if (this.isScheduled()) {
                this.cancel();
                this.h();
            }
        }
        g() {
            this.b = -1;
            if (this.a) {
                this.h();
            }
        }
        h() {
            this.a?.();
        }
    }
    exports.$Cg = $Cg;
    /**
     * Same as `RunOnceScheduler`, but doesn't count the time spent in sleep mode.
     * > **NOTE**: Only offers 1s resolution.
     *
     * When calling `setTimeout` with 3hrs, and putting the computer immediately to sleep
     * for 8hrs, `setTimeout` will fire **as soon as the computer wakes from sleep**. But
     * this scheduler will execute 3hrs **after waking the computer from sleep**.
     */
    class $Dg {
        constructor(runner, delay) {
            if (delay % 1000 !== 0) {
                console.warn(`ProcessTimeRunOnceScheduler resolution is 1s, ${delay}ms is not a multiple of 1000ms.`);
            }
            this.a = runner;
            this.b = delay;
            this.d = 0;
            this.f = -1;
            this.g = this.h.bind(this);
        }
        dispose() {
            this.cancel();
            this.a = null;
        }
        cancel() {
            if (this.isScheduled()) {
                clearInterval(this.f);
                this.f = -1;
            }
        }
        /**
         * Cancel previous runner (if any) & schedule a new runner.
         */
        schedule(delay = this.b) {
            if (delay % 1000 !== 0) {
                console.warn(`ProcessTimeRunOnceScheduler resolution is 1s, ${delay}ms is not a multiple of 1000ms.`);
            }
            this.cancel();
            this.d = Math.ceil(delay / 1000);
            this.f = setInterval(this.g, 1000);
        }
        /**
         * Returns true if scheduled.
         */
        isScheduled() {
            return this.f !== -1;
        }
        h() {
            this.d--;
            if (this.d > 0) {
                // still need to wait
                return;
            }
            // time elapsed
            clearInterval(this.f);
            this.f = -1;
            this.a?.();
        }
    }
    exports.$Dg = $Dg;
    class $Eg extends $Cg {
        constructor(runner, timeout) {
            super(runner, timeout);
            this.j = [];
        }
        work(unit) {
            this.j.push(unit);
            if (!this.isScheduled()) {
                this.schedule();
            }
        }
        h() {
            const units = this.j;
            this.j = [];
            this.a?.(units);
        }
        dispose() {
            this.j = [];
            super.dispose();
        }
    }
    exports.$Eg = $Eg;
    /**
     * The `ThrottledWorker` will accept units of work `T`
     * to handle. The contract is:
     * * there is a maximum of units the worker can handle at once (via `maxWorkChunkSize`)
     * * there is a maximum of units the worker will keep in memory for processing (via `maxBufferedWork`)
     * * after having handled `maxWorkChunkSize` units, the worker needs to rest (via `throttleDelay`)
     */
    class $Fg extends lifecycle_1.$lb {
        constructor(g, h) {
            super();
            this.g = g;
            this.h = h;
            this.a = [];
            this.b = this.B(new lifecycle_1.$mb());
            this.f = false;
        }
        /**
         * The number of work units that are pending to be processed.
         */
        get pending() { return this.a.length; }
        /**
         * Add units to be worked on. Use `pending` to figure out
         * how many units are not yet processed after this method
         * was called.
         *
         * @returns whether the work was accepted or not. If the
         * worker is disposed, it will not accept any more work.
         * If the number of pending units would become larger
         * than `maxPendingWork`, more work will also not be accepted.
         */
        work(units) {
            if (this.f) {
                return false; // work not accepted: disposed
            }
            // Check for reaching maximum of pending work
            if (typeof this.g.maxBufferedWork === 'number') {
                // Throttled: simple check if pending + units exceeds max pending
                if (this.b.value) {
                    if (this.pending + units.length > this.g.maxBufferedWork) {
                        return false; // work not accepted: too much pending work
                    }
                }
                // Unthrottled: same as throttled, but account for max chunk getting
                // worked on directly without being pending
                else {
                    if (this.pending + units.length - this.g.maxWorkChunkSize > this.g.maxBufferedWork) {
                        return false; // work not accepted: too much pending work
                    }
                }
            }
            // Add to pending units first
            for (const unit of units) {
                this.a.push(unit);
            }
            // If not throttled, start working directly
            // Otherwise, when the throttle delay has
            // past, pending work will be worked again.
            if (!this.b.value) {
                this.j();
            }
            return true; // work accepted
        }
        j() {
            // Extract chunk to handle and handle it
            this.h(this.a.splice(0, this.g.maxWorkChunkSize));
            // If we have remaining work, schedule it after a delay
            if (this.a.length > 0) {
                this.b.value = new $Cg(() => {
                    this.b.clear();
                    this.j();
                }, this.g.throttleDelay);
                this.b.value.schedule();
            }
        }
        dispose() {
            super.dispose();
            this.f = true;
        }
    }
    exports.$Fg = $Fg;
    (function () {
        if (typeof requestIdleCallback !== 'function' || typeof cancelIdleCallback !== 'function') {
            exports.$Gg = (runner) => {
                (0, platform_1.$A)(() => {
                    if (disposed) {
                        return;
                    }
                    const end = Date.now() + 15; // one frame at 64fps
                    runner(Object.freeze({
                        didTimeout: true,
                        timeRemaining() {
                            return Math.max(0, end - Date.now());
                        }
                    }));
                });
                let disposed = false;
                return {
                    dispose() {
                        if (disposed) {
                            return;
                        }
                        disposed = true;
                    }
                };
            };
        }
        else {
            exports.$Gg = (runner, timeout) => {
                const handle = requestIdleCallback(runner, typeof timeout === 'number' ? { timeout } : undefined);
                let disposed = false;
                return {
                    dispose() {
                        if (disposed) {
                            return;
                        }
                        disposed = true;
                        cancelIdleCallback(handle);
                    }
                };
            };
        }
    })();
    /**
     * An implementation of the "idle-until-urgent"-strategy as introduced
     * here: https://philipwalton.com/articles/idle-until-urgent/
     */
    class $Hg {
        constructor(executor) {
            this.d = false;
            this.a = () => {
                try {
                    this.f = executor();
                }
                catch (err) {
                    this.g = err;
                }
                finally {
                    this.d = true;
                }
            };
            this.b = (0, exports.$Gg)(() => this.a());
        }
        dispose() {
            this.b.dispose();
        }
        get value() {
            if (!this.d) {
                this.b.dispose();
                this.a();
            }
            if (this.g) {
                throw this.g;
            }
            return this.f;
        }
        get isInitialized() {
            return this.d;
        }
    }
    exports.$Hg = $Hg;
    //#endregion
    async function $Ig(task, delay, retries) {
        let lastError;
        for (let i = 0; i < retries; i++) {
            try {
                return await task();
            }
            catch (error) {
                lastError = error;
                await $sg(delay);
            }
        }
        throw lastError;
    }
    exports.$Ig = $Ig;
    class $Jg {
        hasPending(taskId) {
            if (!this.a) {
                return false;
            }
            if (typeof taskId === 'number') {
                return this.a.taskId === taskId;
            }
            return !!this.a;
        }
        get pending() {
            return this.a?.promise;
        }
        cancelPending() {
            this.a?.cancel();
        }
        setPending(taskId, promise, onCancel) {
            this.a = { taskId, cancel: () => onCancel?.(), promise };
            promise.then(() => this.d(taskId), () => this.d(taskId));
            return promise;
        }
        d(taskId) {
            if (this.a && taskId === this.a.taskId) {
                // only set pending to done if the promise finished that is associated with that taskId
                this.a = undefined;
                // schedule the next task now that we are free if we have any
                this.f();
            }
        }
        f() {
            if (this.b) {
                const next = this.b;
                this.b = undefined;
                // Run next task and complete on the associated promise
                next.run().then(next.promiseResolve, next.promiseReject);
            }
        }
        setNext(run) {
            // this is our first next task, so we create associated promise with it
            // so that we can return a promise that completes when the task has
            // completed.
            if (!this.b) {
                let promiseResolve;
                let promiseReject;
                const promise = new Promise((resolve, reject) => {
                    promiseResolve = resolve;
                    promiseReject = reject;
                });
                this.b = {
                    run,
                    promise,
                    promiseResolve: promiseResolve,
                    promiseReject: promiseReject
                };
            }
            // we have a previous next task, just overwrite it
            else {
                this.b.run = run;
            }
            return this.b.promise;
        }
        hasNext() {
            return !!this.b;
        }
        async join() {
            return this.b?.promise ?? this.a?.promise;
        }
    }
    exports.$Jg = $Jg;
    //#endregion
    //#region
    /**
     * The `IntervalCounter` allows to count the number
     * of calls to `increment()` over a duration of
     * `interval`. This utility can be used to conditionally
     * throttle a frequent task when a certain threshold
     * is reached.
     */
    class $Kg {
        constructor(d, f = () => Date.now()) {
            this.d = d;
            this.f = f;
            this.a = 0;
            this.b = 0;
        }
        increment() {
            const now = this.f();
            // We are outside of the range of `interval` and as such
            // start counting from 0 and remember the time
            if (now - this.a > this.d) {
                this.a = now;
                this.b = 0;
            }
            this.b++;
            return this.b;
        }
    }
    exports.$Kg = $Kg;
    var DeferredOutcome;
    (function (DeferredOutcome) {
        DeferredOutcome[DeferredOutcome["Resolved"] = 0] = "Resolved";
        DeferredOutcome[DeferredOutcome["Rejected"] = 1] = "Rejected";
    })(DeferredOutcome || (DeferredOutcome = {}));
    /**
     * Creates a promise whose resolution or rejection can be controlled imperatively.
     */
    class $Lg {
        get isRejected() {
            return this.d?.outcome === 1 /* DeferredOutcome.Rejected */;
        }
        get isResolved() {
            return this.d?.outcome === 0 /* DeferredOutcome.Resolved */;
        }
        get isSettled() {
            return !!this.d;
        }
        get value() {
            return this.d?.outcome === 0 /* DeferredOutcome.Resolved */ ? this.d?.value : undefined;
        }
        constructor() {
            this.p = new Promise((c, e) => {
                this.a = c;
                this.b = e;
            });
        }
        complete(value) {
            return new Promise(resolve => {
                this.a(value);
                this.d = { outcome: 0 /* DeferredOutcome.Resolved */, value };
                resolve();
            });
        }
        error(err) {
            return new Promise(resolve => {
                this.b(err);
                this.d = { outcome: 1 /* DeferredOutcome.Rejected */, value: err };
                resolve();
            });
        }
        cancel() {
            return this.error(new errors_1.$3());
        }
    }
    exports.$Lg = $Lg;
    //#endregion
    //#region Promises
    var Promises;
    (function (Promises) {
        /**
         * A drop-in replacement for `Promise.all` with the only difference
         * that the method awaits every promise to either fulfill or reject.
         *
         * Similar to `Promise.all`, only the first error will be returned
         * if any.
         */
        async function settled(promises) {
            let firstError = undefined;
            const result = await Promise.all(promises.map(promise => promise.then(value => value, error => {
                if (!firstError) {
                    firstError = error;
                }
                return undefined; // do not rethrow so that other promises can settle
            })));
            if (typeof firstError !== 'undefined') {
                throw firstError;
            }
            return result; // cast is needed and protected by the `throw` above
        }
        Promises.settled = settled;
        /**
         * A helper to create a new `Promise<T>` with a body that is a promise
         * itself. By default, an error that raises from the async body will
         * end up as a unhandled rejection, so this utility properly awaits the
         * body and rejects the promise as a normal promise does without async
         * body.
         *
         * This method should only be used in rare cases where otherwise `async`
         * cannot be used (e.g. when callbacks are involved that require this).
         */
        function withAsyncBody(bodyFn) {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise(async (resolve, reject) => {
                try {
                    await bodyFn(resolve, reject);
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        Promises.withAsyncBody = withAsyncBody;
    })(Promises || (exports.Promises = Promises = {}));
    //#endregion
    //#region
    var AsyncIterableSourceState;
    (function (AsyncIterableSourceState) {
        AsyncIterableSourceState[AsyncIterableSourceState["Initial"] = 0] = "Initial";
        AsyncIterableSourceState[AsyncIterableSourceState["DoneOK"] = 1] = "DoneOK";
        AsyncIterableSourceState[AsyncIterableSourceState["DoneError"] = 2] = "DoneError";
    })(AsyncIterableSourceState || (AsyncIterableSourceState = {}));
    /**
     * A rich implementation for an `AsyncIterable<T>`.
     */
    class $Mg {
        static fromArray(items) {
            return new $Mg((writer) => {
                writer.emitMany(items);
            });
        }
        static fromPromise(promise) {
            return new $Mg(async (emitter) => {
                emitter.emitMany(await promise);
            });
        }
        static fromPromises(promises) {
            return new $Mg(async (emitter) => {
                await Promise.all(promises.map(async (p) => emitter.emitOne(await p)));
            });
        }
        static merge(iterables) {
            return new $Mg(async (emitter) => {
                await Promise.all(iterables.map(async (iterable) => {
                    for await (const item of iterable) {
                        emitter.emitOne(item);
                    }
                }));
            });
        }
        static { this.EMPTY = $Mg.fromArray([]); }
        constructor(executor) {
            this.a = 0 /* AsyncIterableSourceState.Initial */;
            this.b = [];
            this.d = null;
            this.f = new event_1.$8c();
            queueMicrotask(async () => {
                const writer = {
                    emitOne: (item) => this.g(item),
                    emitMany: (items) => this.h(items),
                    reject: (error) => this.k(error)
                };
                try {
                    await Promise.resolve(executor(writer));
                    this.j();
                }
                catch (err) {
                    this.k(err);
                }
                finally {
                    writer.emitOne = undefined;
                    writer.emitMany = undefined;
                    writer.reject = undefined;
                }
            });
        }
        [Symbol.asyncIterator]() {
            let i = 0;
            return {
                next: async () => {
                    do {
                        if (this.a === 2 /* AsyncIterableSourceState.DoneError */) {
                            throw this.d;
                        }
                        if (i < this.b.length) {
                            return { done: false, value: this.b[i++] };
                        }
                        if (this.a === 1 /* AsyncIterableSourceState.DoneOK */) {
                            return { done: true, value: undefined };
                        }
                        await event_1.Event.toPromise(this.f.event);
                    } while (true);
                }
            };
        }
        static map(iterable, mapFn) {
            return new $Mg(async (emitter) => {
                for await (const item of iterable) {
                    emitter.emitOne(mapFn(item));
                }
            });
        }
        map(mapFn) {
            return $Mg.map(this, mapFn);
        }
        static filter(iterable, filterFn) {
            return new $Mg(async (emitter) => {
                for await (const item of iterable) {
                    if (filterFn(item)) {
                        emitter.emitOne(item);
                    }
                }
            });
        }
        filter(filterFn) {
            return $Mg.filter(this, filterFn);
        }
        static coalesce(iterable) {
            return $Mg.filter(iterable, item => !!item);
        }
        coalesce() {
            return $Mg.coalesce(this);
        }
        static async toPromise(iterable) {
            const result = [];
            for await (const item of iterable) {
                result.push(item);
            }
            return result;
        }
        toPromise() {
            return $Mg.toPromise(this);
        }
        /**
         * The value will be appended at the end.
         *
         * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
         */
        g(value) {
            if (this.a !== 0 /* AsyncIterableSourceState.Initial */) {
                return;
            }
            // it is important to add new values at the end,
            // as we may have iterators already running on the array
            this.b.push(value);
            this.f.fire();
        }
        /**
         * The values will be appended at the end.
         *
         * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
         */
        h(values) {
            if (this.a !== 0 /* AsyncIterableSourceState.Initial */) {
                return;
            }
            // it is important to add new values at the end,
            // as we may have iterators already running on the array
            this.b = this.b.concat(values);
            this.f.fire();
        }
        /**
         * Calling `resolve()` will mark the result array as complete.
         *
         * **NOTE** `resolve()` must be called, otherwise all consumers of this iterable will hang indefinitely, similar to a non-resolved promise.
         * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
         */
        j() {
            if (this.a !== 0 /* AsyncIterableSourceState.Initial */) {
                return;
            }
            this.a = 1 /* AsyncIterableSourceState.DoneOK */;
            this.f.fire();
        }
        /**
         * Writing an error will permanently invalidate this iterable.
         * The current users will receive an error thrown, as will all future users.
         *
         * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
         */
        k(error) {
            if (this.a !== 0 /* AsyncIterableSourceState.Initial */) {
                return;
            }
            this.a = 2 /* AsyncIterableSourceState.DoneError */;
            this.d = error;
            this.f.fire();
        }
    }
    exports.$Mg = $Mg;
    class $Ng extends $Mg {
        constructor(l, executor) {
            super(executor);
            this.l = l;
        }
        cancel() {
            this.l.cancel();
        }
    }
    exports.$Ng = $Ng;
    function $Og(callback) {
        const source = new cancellation_1.$ed();
        const innerIterable = callback(source.token);
        return new $Ng(source, async (emitter) => {
            const subscription = source.token.onCancellationRequested(() => {
                subscription.dispose();
                source.dispose();
                emitter.reject(new errors_1.$3());
            });
            try {
                for await (const item of innerIterable) {
                    if (source.token.isCancellationRequested) {
                        // canceled in the meantime
                        return;
                    }
                    emitter.emitOne(item);
                }
                subscription.dispose();
                source.dispose();
            }
            catch (err) {
                subscription.dispose();
                source.dispose();
                emitter.reject(err);
            }
        });
    }
    exports.$Og = $Og;
});
//#endregion

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[20/*vs/editor/common/languages/nullTokenize*/], __M([0/*require*/,1/*exports*/,34/*vs/editor/common/languages*/]), function (require, exports, languages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$eC = exports.$dC = exports.$cC = void 0;
    exports.$cC = new class {
        clone() {
            return this;
        }
        equals(other) {
            return (this === other);
        }
    };
    function $dC(languageId, state) {
        return new languages_1.$ls([new languages_1.$ks(0, '', languageId)], state);
    }
    exports.$dC = $dC;
    function $eC(languageId, state) {
        const tokens = new Uint32Array(2);
        tokens[0] = 0;
        tokens[1] = ((languageId << 0 /* MetadataConsts.LANGUAGEID_OFFSET */)
            | (0 /* StandardTokenType.Other */ << 8 /* MetadataConsts.TOKEN_TYPE_OFFSET */)
            | (0 /* FontStyle.None */ << 11 /* MetadataConsts.FONT_STYLE_OFFSET */)
            | (1 /* ColorId.DefaultForeground */ << 15 /* MetadataConsts.FOREGROUND_OFFSET */)
            | (2 /* ColorId.DefaultBackground */ << 24 /* MetadataConsts.BACKGROUND_OFFSET */)) >>> 0;
        return new languages_1.$ms(tokens, state === null ? exports.$cC : state);
    }
    exports.$eC = $eC;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[35/*vs/editor/common/model/textModelTokens*/], __M([0/*require*/,1/*exports*/,19/*vs/base/common/async*/,6/*vs/base/common/errors*/,3/*vs/base/common/platform*/,36/*vs/base/common/stopwatch*/,13/*vs/editor/common/core/eolCounter*/,15/*vs/editor/common/core/lineRange*/,47/*vs/editor/common/core/offsetRange*/,20/*vs/editor/common/languages/nullTokenize*/,25/*vs/editor/common/model/fixedArray*/,16/*vs/editor/common/tokens/contiguousMultilineTokensBuilder*/,7/*vs/editor/common/tokens/lineTokens*/]), function (require, exports, async_1, errors_1, platform_1, stopwatch_1, eolCounter_1, lineRange_1, offsetRange_1, nullTokenize_1, fixedArray_1, contiguousMultilineTokensBuilder_1, lineTokens_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$mC = exports.$lC = exports.$kC = exports.$jC = exports.$iC = exports.$hC = void 0;
    var Constants;
    (function (Constants) {
        Constants[Constants["CHEAP_TOKENIZATION_LENGTH_LIMIT"] = 2048] = "CHEAP_TOKENIZATION_LENGTH_LIMIT";
    })(Constants || (Constants = {}));
    class $hC {
        constructor(lineCount, tokenizationSupport) {
            this.tokenizationSupport = tokenizationSupport;
            this.a = this.tokenizationSupport.getInitialState();
            this.store = new $jC(lineCount);
        }
        getStartState(lineNumber) {
            return this.store.getStartState(lineNumber, this.a);
        }
        getFirstInvalidLine() {
            return this.store.getFirstInvalidLine(this.a);
        }
    }
    exports.$hC = $hC;
    class $iC extends $hC {
        constructor(lineCount, tokenizationSupport, _textModel, _languageIdCodec) {
            super(lineCount, tokenizationSupport);
            this._textModel = _textModel;
            this._languageIdCodec = _languageIdCodec;
        }
        updateTokensUntilLine(builder, lineNumber) {
            const languageId = this._textModel.getLanguageId();
            while (true) {
                const lineToTokenize = this.getFirstInvalidLine();
                if (!lineToTokenize || lineToTokenize.lineNumber > lineNumber) {
                    break;
                }
                const text = this._textModel.getLineContent(lineToTokenize.lineNumber);
                const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, text, true, lineToTokenize.startState);
                builder.add(lineToTokenize.lineNumber, r.tokens);
                this.store.setEndState(lineToTokenize.lineNumber, r.endState);
            }
        }
        /** assumes state is up to date */
        getTokenTypeIfInsertingCharacter(position, character) {
            // TODO@hediet: use tokenizeLineWithEdit
            const lineStartState = this.getStartState(position.lineNumber);
            if (!lineStartState) {
                return 0 /* StandardTokenType.Other */;
            }
            const languageId = this._textModel.getLanguageId();
            const lineContent = this._textModel.getLineContent(position.lineNumber);
            // Create the text as if `character` was inserted
            const text = (lineContent.substring(0, position.column - 1)
                + character
                + lineContent.substring(position.column - 1));
            const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, text, true, lineStartState);
            const lineTokens = new lineTokens_1.$es(r.tokens, text, this._languageIdCodec);
            if (lineTokens.getCount() === 0) {
                return 0 /* StandardTokenType.Other */;
            }
            const tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
            return lineTokens.getStandardTokenType(tokenIndex);
        }
        /** assumes state is up to date */
        tokenizeLineWithEdit(position, length, newText) {
            const lineNumber = position.lineNumber;
            const column = position.column;
            const lineStartState = this.getStartState(lineNumber);
            if (!lineStartState) {
                return null;
            }
            const curLineContent = this._textModel.getLineContent(lineNumber);
            const newLineContent = curLineContent.substring(0, column - 1)
                + newText + curLineContent.substring(column - 1 + length);
            const languageId = this._textModel.getLanguageIdAtPosition(lineNumber, 0);
            const result = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, newLineContent, true, lineStartState);
            const lineTokens = new lineTokens_1.$es(result.tokens, newLineContent, this._languageIdCodec);
            return lineTokens;
        }
        isCheapToTokenize(lineNumber) {
            const firstInvalidLineNumber = this.store.getFirstInvalidEndStateLineNumberOrMax();
            if (lineNumber < firstInvalidLineNumber) {
                return true;
            }
            if (lineNumber === firstInvalidLineNumber
                && this._textModel.getLineLength(lineNumber) < 2048 /* Constants.CHEAP_TOKENIZATION_LENGTH_LIMIT */) {
                return true;
            }
            return false;
        }
        /**
         * The result is not cached.
         */
        tokenizeHeuristically(builder, startLineNumber, endLineNumber) {
            if (endLineNumber <= this.store.getFirstInvalidEndStateLineNumberOrMax()) {
                // nothing to do
                return { heuristicTokens: false };
            }
            if (startLineNumber <= this.store.getFirstInvalidEndStateLineNumberOrMax()) {
                // tokenization has reached the viewport start...
                this.updateTokensUntilLine(builder, endLineNumber);
                return { heuristicTokens: false };
            }
            let state = this.b(startLineNumber);
            const languageId = this._textModel.getLanguageId();
            for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
                const text = this._textModel.getLineContent(lineNumber);
                const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, text, true, state);
                builder.add(lineNumber, r.tokens);
                state = r.endState;
            }
            return { heuristicTokens: true };
        }
        b(lineNumber) {
            let nonWhitespaceColumn = this._textModel.getLineFirstNonWhitespaceColumn(lineNumber);
            const likelyRelevantLines = [];
            let initialState = null;
            for (let i = lineNumber - 1; nonWhitespaceColumn > 1 && i >= 1; i--) {
                const newNonWhitespaceIndex = this._textModel.getLineFirstNonWhitespaceColumn(i);
                // Ignore lines full of whitespace
                if (newNonWhitespaceIndex === 0) {
                    continue;
                }
                if (newNonWhitespaceIndex < nonWhitespaceColumn) {
                    likelyRelevantLines.push(this._textModel.getLineContent(i));
                    nonWhitespaceColumn = newNonWhitespaceIndex;
                    initialState = this.getStartState(i);
                    if (initialState) {
                        break;
                    }
                }
            }
            if (!initialState) {
                initialState = this.tokenizationSupport.getInitialState();
            }
            likelyRelevantLines.reverse();
            const languageId = this._textModel.getLanguageId();
            let state = initialState;
            for (const line of likelyRelevantLines) {
                const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, line, false, state);
                state = r.endState;
            }
            return state;
        }
    }
    exports.$iC = $iC;
    /**
     * **Invariant:**
     * If the text model is retokenized from line 1 to {@link getFirstInvalidEndStateLineNumber}() - 1,
     * then the recomputed end state for line l will be equal to {@link getEndState}(l).
     */
    class $jC {
        constructor(d) {
            this.d = d;
            this.a = new $kC();
            this.b = new $lC();
            this.b.addRange(new offsetRange_1.$bC(1, d + 1));
        }
        getEndState(lineNumber) {
            return this.a.getEndState(lineNumber);
        }
        /**
         * @returns if the end state has changed.
         */
        setEndState(lineNumber, state) {
            if (!state) {
                throw new errors_1.$bb('Cannot set null/undefined state');
            }
            this.b.delete(lineNumber);
            const r = this.a.setEndState(lineNumber, state);
            if (r && lineNumber < this.d) {
                // because the state changed, we cannot trust the next state anymore and have to invalidate it.
                this.b.addRange(new offsetRange_1.$bC(lineNumber + 1, lineNumber + 2));
            }
            return r;
        }
        acceptChange(range, newLineCount) {
            this.d += newLineCount - range.length;
            this.a.acceptChange(range, newLineCount);
            this.b.addRangeAndResize(new offsetRange_1.$bC(range.startLineNumber, range.endLineNumberExclusive), newLineCount);
        }
        acceptChanges(changes) {
            for (const c of changes) {
                const [eolCount] = (0, eolCounter_1.$ds)(c.text);
                this.acceptChange(new lineRange_1.$Nr(c.range.startLineNumber, c.range.endLineNumber + 1), eolCount + 1);
            }
        }
        invalidateEndStateRange(range) {
            this.b.addRange(new offsetRange_1.$bC(range.startLineNumber, range.endLineNumberExclusive));
        }
        getFirstInvalidEndStateLineNumber() { return this.b.min; }
        getFirstInvalidEndStateLineNumberOrMax() {
            return this.getFirstInvalidEndStateLineNumber() || Number.MAX_SAFE_INTEGER;
        }
        allStatesValid() { return this.b.min === null; }
        getStartState(lineNumber, initialState) {
            if (lineNumber === 1) {
                return initialState;
            }
            return this.getEndState(lineNumber - 1);
        }
        getFirstInvalidLine(initialState) {
            const lineNumber = this.getFirstInvalidEndStateLineNumber();
            if (lineNumber === null) {
                return null;
            }
            const startState = this.getStartState(lineNumber, initialState);
            if (!startState) {
                throw new errors_1.$bb('Start state must be defined');
            }
            return { lineNumber, startState };
        }
    }
    exports.$jC = $jC;
    class $kC {
        constructor() {
            this.a = new fixedArray_1.$fC(null);
        }
        getEndState(lineNumber) {
            return this.a.get(lineNumber);
        }
        setEndState(lineNumber, state) {
            const oldState = this.a.get(lineNumber);
            if (oldState && oldState.equals(state)) {
                return false;
            }
            this.a.set(lineNumber, state);
            return true;
        }
        acceptChange(range, newLineCount) {
            let length = range.length;
            if (newLineCount > 0 && length > 0) {
                // Keep the last state, even though it is unrelated.
                // But if the new state happens to agree with this last state, then we know we can stop tokenizing.
                length--;
                newLineCount--;
            }
            this.a.replace(range.startLineNumber, length, newLineCount);
        }
        acceptChanges(changes) {
            for (const c of changes) {
                const [eolCount] = (0, eolCounter_1.$ds)(c.text);
                this.acceptChange(new lineRange_1.$Nr(c.range.startLineNumber, c.range.endLineNumber + 1), eolCount + 1);
            }
        }
    }
    exports.$kC = $kC;
    class $lC {
        constructor() {
            this.a = [];
        }
        getRanges() {
            return this.a;
        }
        get min() {
            if (this.a.length === 0) {
                return null;
            }
            return this.a[0].start;
        }
        removeMin() {
            if (this.a.length === 0) {
                return null;
            }
            const range = this.a[0];
            if (range.start + 1 === range.endExclusive) {
                this.a.shift();
            }
            else {
                this.a[0] = new offsetRange_1.$bC(range.start + 1, range.endExclusive);
            }
            return range.start;
        }
        delete(value) {
            const idx = this.a.findIndex(r => r.contains(value));
            if (idx !== -1) {
                const range = this.a[idx];
                if (range.start === value) {
                    if (range.endExclusive === value + 1) {
                        this.a.splice(idx, 1);
                    }
                    else {
                        this.a[idx] = new offsetRange_1.$bC(value + 1, range.endExclusive);
                    }
                }
                else {
                    if (range.endExclusive === value + 1) {
                        this.a[idx] = new offsetRange_1.$bC(range.start, value);
                    }
                    else {
                        this.a.splice(idx, 1, new offsetRange_1.$bC(range.start, value), new offsetRange_1.$bC(value + 1, range.endExclusive));
                    }
                }
            }
        }
        addRange(range) {
            offsetRange_1.$bC.addRange(range, this.a);
        }
        addRangeAndResize(range, newLength) {
            let idxFirstMightBeIntersecting = 0;
            while (!(idxFirstMightBeIntersecting >= this.a.length || range.start <= this.a[idxFirstMightBeIntersecting].endExclusive)) {
                idxFirstMightBeIntersecting++;
            }
            let idxFirstIsAfter = idxFirstMightBeIntersecting;
            while (!(idxFirstIsAfter >= this.a.length || range.endExclusive < this.a[idxFirstIsAfter].start)) {
                idxFirstIsAfter++;
            }
            const delta = newLength - range.length;
            for (let i = idxFirstIsAfter; i < this.a.length; i++) {
                this.a[i] = this.a[i].delta(delta);
            }
            if (idxFirstMightBeIntersecting === idxFirstIsAfter) {
                const newRange = new offsetRange_1.$bC(range.start, range.start + newLength);
                if (!newRange.isEmpty) {
                    this.a.splice(idxFirstMightBeIntersecting, 0, newRange);
                }
            }
            else {
                const start = Math.min(range.start, this.a[idxFirstMightBeIntersecting].start);
                const endEx = Math.max(range.endExclusive, this.a[idxFirstIsAfter - 1].endExclusive);
                const newRange = new offsetRange_1.$bC(start, endEx + delta);
                if (!newRange.isEmpty) {
                    this.a.splice(idxFirstMightBeIntersecting, idxFirstIsAfter - idxFirstMightBeIntersecting, newRange);
                }
                else {
                    this.a.splice(idxFirstMightBeIntersecting, idxFirstIsAfter - idxFirstMightBeIntersecting);
                }
            }
        }
        toString() {
            return this.a.map(r => r.toString()).join(' + ');
        }
    }
    exports.$lC = $lC;
    function safeTokenize(languageIdCodec, languageId, tokenizationSupport, text, hasEOL, state) {
        let r = null;
        if (tokenizationSupport) {
            try {
                r = tokenizationSupport.tokenizeEncoded(text, hasEOL, state.clone());
            }
            catch (e) {
                (0, errors_1.$Y)(e);
            }
        }
        if (!r) {
            r = (0, nullTokenize_1.$eC)(languageIdCodec.encodeLanguageId(languageId), state);
        }
        lineTokens_1.$es.convertToEndOffset(r.tokens, text.length);
        return r;
    }
    class $mC {
        constructor(b, d) {
            this.b = b;
            this.d = d;
            this.a = false;
            this.f = false;
        }
        dispose() {
            this.a = true;
        }
        handleChanges() {
            this.g();
        }
        g() {
            if (this.f || !this.b._textModel.isAttachedToEditor() || !this.k()) {
                return;
            }
            this.f = true;
            (0, async_1.$Gg)((deadline) => {
                this.f = false;
                this.h(deadline);
            });
        }
        /**
         * Tokenize until the deadline occurs, but try to yield every 1-2ms.
         */
        h(deadline) {
            // Read the time remaining from the `deadline` immediately because it is unclear
            // if the `deadline` object will be valid after execution leaves this function.
            const endTime = Date.now() + deadline.timeRemaining();
            const execute = () => {
                if (this.a || !this.b._textModel.isAttachedToEditor() || !this.k()) {
                    // disposed in the meantime or detached or finished
                    return;
                }
                this.j();
                if (Date.now() < endTime) {
                    // There is still time before reaching the deadline, so yield to the browser and then
                    // continue execution
                    (0, platform_1.$A)(execute);
                }
                else {
                    // The deadline has been reached, so schedule a new idle callback if necessary
                    this.g();
                }
            };
            execute();
        }
        /**
         * Tokenize for at least 1ms.
         */
        j() {
            const lineCount = this.b._textModel.getLineCount();
            const builder = new contiguousMultilineTokensBuilder_1.$gC();
            const sw = stopwatch_1.$4c.create(false);
            do {
                if (sw.elapsed() > 1) {
                    // the comparison is intentionally > 1 and not >= 1 to ensure that
                    // a full millisecond has elapsed, given how microseconds are rounded
                    // to milliseconds
                    break;
                }
                const tokenizedLineNumber = this.l(builder);
                if (tokenizedLineNumber >= lineCount) {
                    break;
                }
            } while (this.k());
            this.d.setTokens(builder.finalize());
            this.checkFinished();
        }
        k() {
            if (!this.b) {
                return false;
            }
            return !this.b.store.allStatesValid();
        }
        l(builder) {
            const firstInvalidLine = this.b?.getFirstInvalidLine();
            if (!firstInvalidLine) {
                return this.b._textModel.getLineCount() + 1;
            }
            this.b.updateTokensUntilLine(builder, firstInvalidLine.lineNumber);
            return firstInvalidLine.lineNumber;
        }
        checkFinished() {
            if (this.a) {
                return;
            }
            if (this.b.store.allStatesValid()) {
                this.d.backgroundTokenizationFinished();
            }
        }
        requestTokens(startLineNumber, endLineNumberExclusive) {
            this.b.store.invalidateEndStateRange(new lineRange_1.$Nr(startLineNumber, endLineNumberExclusive));
        }
    }
    exports.$mC = $mC;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[37/*vs/workbench/services/textMate/browser/tokenizationSupport/textMateTokenizationSupport*/], __M([0/*require*/,1/*exports*/,33/*vs/base/common/event*/,2/*vs/base/common/lifecycle*/,36/*vs/base/common/stopwatch*/,14/*vs/editor/common/encodedTokenAttributes*/,34/*vs/editor/common/languages*/]), function (require, exports, event_1, lifecycle_1, stopwatch_1, encodedTokenAttributes_1, languages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$5zb = void 0;
    class $5zb extends lifecycle_1.$lb {
        constructor(c, f, g, h, j, k, l) {
            super();
            this.c = c;
            this.f = f;
            this.g = g;
            this.h = h;
            this.j = j;
            this.k = k;
            this.l = l;
            this.a = [];
            this.b = this.B(new event_1.$8c());
            this.onDidEncounterLanguage = this.b.event;
        }
        get backgroundTokenizerShouldOnlyVerifyTokens() {
            return this.j();
        }
        getInitialState() {
            return this.f;
        }
        tokenize(line, hasEOL, state) {
            throw new Error('Not supported!');
        }
        createBackgroundTokenizer(textModel, store) {
            if (this.h) {
                return this.h(textModel, store);
            }
            return undefined;
        }
        tokenizeEncoded(line, hasEOL, state) {
            const isRandomSample = Math.random() * 10000 < 1;
            const shouldMeasure = this.l || isRandomSample;
            const sw = shouldMeasure ? new stopwatch_1.$4c(true) : undefined;
            const textMateResult = this.c.tokenizeLine2(line, state, 500);
            if (shouldMeasure) {
                const timeMS = sw.elapsed();
                if (isRandomSample || timeMS > 32) {
                    this.k(timeMS, line.length, isRandomSample);
                }
            }
            if (textMateResult.stoppedEarly) {
                console.warn(`Time limit reached when tokenizing line: ${line.substring(0, 100)}`);
                // return the state at the beginning of the line
                return new languages_1.$ms(textMateResult.tokens, state);
            }
            if (this.g) {
                const seenLanguages = this.a;
                const tokens = textMateResult.tokens;
                // Must check if any of the embedded languages was hit
                for (let i = 0, len = (tokens.length >>> 1); i < len; i++) {
                    const metadata = tokens[(i << 1) + 1];
                    const languageId = encodedTokenAttributes_1.$bs.getLanguageId(metadata);
                    if (!seenLanguages[languageId]) {
                        seenLanguages[languageId] = true;
                        this.b.fire(languageId);
                    }
                }
            }
            let endState;
            // try to save an object if possible
            if (state.equals(textMateResult.ruleStack)) {
                endState = state;
            }
            else {
                endState = textMateResult.ruleStack;
            }
            return new languages_1.$ms(textMateResult.tokens, endState);
        }
    }
    exports.$5zb = $5zb;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[38/*vs/workbench/services/textMate/browser/tokenizationSupport/tokenizationSupportWithLineLimit*/], __M([0/*require*/,1/*exports*/,20/*vs/editor/common/languages/nullTokenize*/,2/*vs/base/common/lifecycle*/,11/*vs/base/common/observable*/]), function (require, exports, nullTokenize_1, lifecycle_1, observable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$6zb = void 0;
    class $6zb extends lifecycle_1.$lb {
        get backgroundTokenizerShouldOnlyVerifyTokens() {
            return this.b.backgroundTokenizerShouldOnlyVerifyTokens;
        }
        constructor(a, b, c) {
            super();
            this.a = a;
            this.b = b;
            this.c = c;
            this.B((0, observable_1.keepAlive)(this.c));
        }
        getInitialState() {
            return this.b.getInitialState();
        }
        tokenize(line, hasEOL, state) {
            throw new Error('Not supported!');
        }
        tokenizeEncoded(line, hasEOL, state) {
            // Do not attempt to tokenize if a line is too long
            if (line.length >= this.c.get()) {
                return (0, nullTokenize_1.$eC)(this.a, state);
            }
            return this.b.tokenizeEncoded(line, hasEOL, state);
        }
        createBackgroundTokenizer(textModel, store) {
            if (this.b.createBackgroundTokenizer) {
                return this.b.createBackgroundTokenizer(textModel, store);
            }
            else {
                return undefined;
            }
        }
    }
    exports.$6zb = $6zb;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[39/*vs/workbench/services/textMate/browser/backgroundTokenization/worker/textMateWorkerTokenizer*/], __M([0/*require*/,1/*exports*/,32/*vs/amdX*/,19/*vs/base/common/async*/,11/*vs/base/common/observable*/,3/*vs/base/common/platform*/,15/*vs/editor/common/core/lineRange*/,48/*vs/editor/common/model/mirrorTextModel*/,35/*vs/editor/common/model/textModelTokens*/,16/*vs/editor/common/tokens/contiguousMultilineTokensBuilder*/,7/*vs/editor/common/tokens/lineTokens*/,37/*vs/workbench/services/textMate/browser/tokenizationSupport/textMateTokenizationSupport*/,38/*vs/workbench/services/textMate/browser/tokenizationSupport/tokenizationSupportWithLineLimit*/]), function (require, exports, amdX_1, async_1, observable_1, platform_1, lineRange_1, mirrorTextModel_1, textModelTokens_1, contiguousMultilineTokensBuilder_1, lineTokens_1, textMateTokenizationSupport_1, tokenizationSupportWithLineLimit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$$zb = void 0;
    class $$zb extends mirrorTextModel_1.$uu {
        constructor(uri, lines, eol, versionId, s, t, u, maxTokenizationLineLength) {
            super(uri, lines, eol, versionId);
            this.s = s;
            this.t = t;
            this.u = u;
            this.a = null;
            this.b = false;
            this.c = (0, observable_1.observableValue)('_maxTokenizationLineLength', -1);
            this.q = new async_1.$Cg(() => this.w(), 10);
            this.c.set(maxTokenizationLineLength, undefined);
            this.v();
        }
        dispose() {
            this.b = true;
            super.dispose();
        }
        onLanguageId(languageId, encodedLanguageId) {
            this.t = languageId;
            this.u = encodedLanguageId;
            this.v();
        }
        onEvents(e) {
            super.onEvents(e);
            this.a?.store.acceptChanges(e.changes);
            this.q.schedule();
        }
        acceptMaxTokenizationLineLength(maxTokenizationLineLength) {
            this.c.set(maxTokenizationLineLength, undefined);
        }
        retokenize(startLineNumber, endLineNumberExclusive) {
            if (this.a) {
                this.a.store.invalidateEndStateRange(new lineRange_1.$Nr(startLineNumber, endLineNumberExclusive));
                this.q.schedule();
            }
        }
        async v() {
            this.a = null;
            const languageId = this.t;
            const encodedLanguageId = this.u;
            const r = await this.s.getOrCreateGrammar(languageId, encodedLanguageId);
            if (this.b || languageId !== this.t || encodedLanguageId !== this.u || !r) {
                return;
            }
            if (r.grammar) {
                const tokenizationSupport = new tokenizationSupportWithLineLimit_1.$6zb(this.u, new textMateTokenizationSupport_1.$5zb(r.grammar, r.initialState, false, undefined, () => false, (timeMs, lineLength, isRandomSample) => {
                    this.s.reportTokenizationTime(timeMs, languageId, r.sourceExtensionId, lineLength, isRandomSample);
                }, false), this.c);
                this.a = new textModelTokens_1.$hC(this.f.length, tokenizationSupport);
            }
            else {
                this.a = null;
            }
            this.w();
        }
        async w() {
            if (this.b || !this.a) {
                return;
            }
            if (!this.m) {
                const { diffStateStacksRefEq } = await (0, amdX_1.$UC)('vscode-textmate', 'release/main.js');
                this.m = diffStateStacksRefEq;
            }
            const startTime = new Date().getTime();
            while (true) {
                let tokenizedLines = 0;
                const tokenBuilder = new contiguousMultilineTokensBuilder_1.$gC();
                const stateDeltaBuilder = new StateDeltaBuilder();
                while (true) {
                    const lineToTokenize = this.a.getFirstInvalidLine();
                    if (lineToTokenize === null || tokenizedLines > 200) {
                        break;
                    }
                    tokenizedLines++;
                    const text = this.f[lineToTokenize.lineNumber - 1];
                    const r = this.a.tokenizationSupport.tokenizeEncoded(text, true, lineToTokenize.startState);
                    if (this.a.store.setEndState(lineToTokenize.lineNumber, r.endState)) {
                        const delta = this.m(lineToTokenize.startState, r.endState);
                        stateDeltaBuilder.setState(lineToTokenize.lineNumber, delta);
                    }
                    else {
                        stateDeltaBuilder.setState(lineToTokenize.lineNumber, null);
                    }
                    lineTokens_1.$es.convertToEndOffset(r.tokens, text.length);
                    tokenBuilder.add(lineToTokenize.lineNumber, r.tokens);
                    const deltaMs = new Date().getTime() - startTime;
                    if (deltaMs > 20) {
                        // yield to check for changes
                        break;
                    }
                }
                if (tokenizedLines === 0) {
                    break;
                }
                const stateDeltas = stateDeltaBuilder.getStateDeltas();
                this.s.setTokensAndStates(this.h, tokenBuilder.serialize(), stateDeltas);
                const deltaMs = new Date().getTime() - startTime;
                if (deltaMs > 20) {
                    // yield to check for changes
                    (0, platform_1.$A)(() => this.w());
                    return;
                }
            }
        }
    }
    exports.$$zb = $$zb;
    class StateDeltaBuilder {
        constructor() {
            this.a = -1;
            this.b = [];
        }
        setState(lineNumber, stackDiff) {
            if (lineNumber === this.a + 1) {
                this.b[this.b.length - 1].stateDeltas.push(stackDiff);
            }
            else {
                this.b.push({ startLineNumber: lineNumber, stateDeltas: [stackDiff] });
            }
            this.a = lineNumber;
        }
        getStateDeltas() {
            return this.b;
        }
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[40/*vs/workbench/services/textMate/common/TMScopeRegistry*/], __M([0/*require*/,1/*exports*/,18/*vs/base/common/resources*/]), function (require, exports, resources) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$8zb = void 0;
    class $8zb {
        constructor() {
            this.a = Object.create(null);
        }
        reset() {
            this.a = Object.create(null);
        }
        register(def) {
            if (this.a[def.scopeName]) {
                const existingRegistration = this.a[def.scopeName];
                if (!resources.$Yf(existingRegistration.location, def.location)) {
                    console.warn(`Overwriting grammar scope name to file mapping for scope ${def.scopeName}.\n` +
                        `Old grammar file: ${existingRegistration.location.toString()}.\n` +
                        `New grammar file: ${def.location.toString()}`);
                }
            }
            this.a[def.scopeName] = def;
        }
        getGrammarDefinition(scopeName) {
            return this.a[scopeName] || null;
        }
    }
    exports.$8zb = $8zb;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[41/*vs/workbench/services/textMate/common/TMGrammarFactory*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/lifecycle*/,40/*vs/workbench/services/textMate/common/TMScopeRegistry*/]), function (require, exports, lifecycle_1, TMScopeRegistry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$0zb = exports.$9zb = void 0;
    exports.$9zb = 'No TM Grammar registered for this language.';
    class $0zb extends lifecycle_1.$lb {
        constructor(host, grammarDefinitions, vscodeTextmate, onigLib) {
            super();
            this.a = host;
            this.b = vscodeTextmate.INITIAL;
            this.c = new TMScopeRegistry_1.$8zb();
            this.f = {};
            this.g = {};
            this.h = new Map();
            this.j = this.B(new vscodeTextmate.Registry({
                onigLib: onigLib,
                loadGrammar: async (scopeName) => {
                    const grammarDefinition = this.c.getGrammarDefinition(scopeName);
                    if (!grammarDefinition) {
                        this.a.logTrace(`No grammar found for scope ${scopeName}`);
                        return null;
                    }
                    const location = grammarDefinition.location;
                    try {
                        const content = await this.a.readFile(location);
                        return vscodeTextmate.parseRawGrammar(content, location.path);
                    }
                    catch (e) {
                        this.a.logError(`Unable to load and parse grammar for scope ${scopeName} from ${location}`, e);
                        return null;
                    }
                },
                getInjections: (scopeName) => {
                    const scopeParts = scopeName.split('.');
                    let injections = [];
                    for (let i = 1; i <= scopeParts.length; i++) {
                        const subScopeName = scopeParts.slice(0, i).join('.');
                        injections = [...injections, ...(this.f[subScopeName] || [])];
                    }
                    return injections;
                }
            }));
            for (const validGrammar of grammarDefinitions) {
                this.c.register(validGrammar);
                if (validGrammar.injectTo) {
                    for (const injectScope of validGrammar.injectTo) {
                        let injections = this.f[injectScope];
                        if (!injections) {
                            this.f[injectScope] = injections = [];
                        }
                        injections.push(validGrammar.scopeName);
                    }
                    if (validGrammar.embeddedLanguages) {
                        for (const injectScope of validGrammar.injectTo) {
                            let injectedEmbeddedLanguages = this.g[injectScope];
                            if (!injectedEmbeddedLanguages) {
                                this.g[injectScope] = injectedEmbeddedLanguages = [];
                            }
                            injectedEmbeddedLanguages.push(validGrammar.embeddedLanguages);
                        }
                    }
                }
                if (validGrammar.language) {
                    this.h.set(validGrammar.language, validGrammar.scopeName);
                }
            }
        }
        has(languageId) {
            return this.h.has(languageId);
        }
        setTheme(theme, colorMap) {
            this.j.setTheme(theme, colorMap);
        }
        getColorMap() {
            return this.j.getColorMap();
        }
        async createGrammar(languageId, encodedLanguageId) {
            const scopeName = this.h.get(languageId);
            if (typeof scopeName !== 'string') {
                // No TM grammar defined
                throw new Error(exports.$9zb);
            }
            const grammarDefinition = this.c.getGrammarDefinition(scopeName);
            if (!grammarDefinition) {
                // No TM grammar defined
                throw new Error(exports.$9zb);
            }
            const embeddedLanguages = grammarDefinition.embeddedLanguages;
            if (this.g[scopeName]) {
                const injectedEmbeddedLanguages = this.g[scopeName];
                for (const injected of injectedEmbeddedLanguages) {
                    for (const scope of Object.keys(injected)) {
                        embeddedLanguages[scope] = injected[scope];
                    }
                }
            }
            const containsEmbeddedLanguages = (Object.keys(embeddedLanguages).length > 0);
            let grammar;
            try {
                grammar = await this.j.loadGrammarWithConfiguration(scopeName, encodedLanguageId, {
                    embeddedLanguages,
                    tokenTypes: grammarDefinition.tokenTypes,
                    balancedBracketSelectors: grammarDefinition.balancedBracketSelectors,
                    unbalancedBracketSelectors: grammarDefinition.unbalancedBracketSelectors,
                });
            }
            catch (err) {
                if (err.message && err.message.startsWith('No grammar provided for')) {
                    // No TM grammar defined
                    throw new Error(exports.$9zb);
                }
                throw err;
            }
            return {
                languageId: languageId,
                grammar: grammar,
                initialState: this.b,
                containsEmbeddedLanguages: containsEmbeddedLanguages,
                sourceExtensionId: grammarDefinition.sourceExtensionId,
            };
        }
    }
    exports.$0zb = $0zb;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[49/*vs/workbench/services/textMate/browser/backgroundTokenization/worker/textMateTokenizationWorker.worker*/], __M([0/*require*/,1/*exports*/,8/*vs/base/common/uri*/,41/*vs/workbench/services/textMate/common/TMGrammarFactory*/,39/*vs/workbench/services/textMate/browser/backgroundTokenization/worker/textMateWorkerTokenizer*/]), function (require, exports, uri_1, TMGrammarFactory_1, textMateWorkerTokenizer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextMateTokenizationWorker = exports.create = void 0;
    /**
     * Defines the worker entry point. Must be exported and named `create`.
     */
    function create(ctx, createData) {
        return new TextMateTokenizationWorker(ctx, createData);
    }
    exports.create = create;
    class TextMateTokenizationWorker {
        constructor(ctx, f) {
            this.f = f;
            this.b = new Map();
            this.c = [];
            this.a = ctx.host;
            const grammarDefinitions = f.grammarDefinitions.map((def) => {
                return {
                    location: uri_1.URI.revive(def.location),
                    language: def.language,
                    scopeName: def.scopeName,
                    embeddedLanguages: def.embeddedLanguages,
                    tokenTypes: def.tokenTypes,
                    injectTo: def.injectTo,
                    balancedBracketSelectors: def.balancedBracketSelectors,
                    unbalancedBracketSelectors: def.unbalancedBracketSelectors,
                    sourceExtensionId: def.sourceExtensionId,
                };
            });
            this.d = this.g(grammarDefinitions);
        }
        async g(grammarDefinitions) {
            const uri = this.f.textmateMainUri;
            const vscodeTextmate = await new Promise((resolve_1, reject_1) => { require([uri], resolve_1, reject_1); });
            const vscodeOniguruma = await new Promise((resolve_2, reject_2) => { require([this.f.onigurumaMainUri], resolve_2, reject_2); });
            const response = await fetch(this.f.onigurumaWASMUri);
            // Using the response directly only works if the server sets the MIME type 'application/wasm'.
            // Otherwise, a TypeError is thrown when using the streaming compiler.
            // We therefore use the non-streaming compiler :(.
            const bytes = await response.arrayBuffer();
            await vscodeOniguruma.loadWASM(bytes);
            const onigLib = Promise.resolve({
                createOnigScanner: (sources) => vscodeOniguruma.createOnigScanner(sources),
                createOnigString: (str) => vscodeOniguruma.createOnigString(str)
            });
            return new TMGrammarFactory_1.$0zb({
                logTrace: (msg) => { },
                logError: (msg, err) => console.error(msg, err),
                readFile: (resource) => this.a.readFile(resource)
            }, grammarDefinitions, vscodeTextmate, onigLib);
        }
        // These methods are called by the renderer
        acceptNewModel(data) {
            const uri = uri_1.URI.revive(data.uri);
            const that = this;
            this.b.set(data.controllerId, new textMateWorkerTokenizer_1.$$zb(uri, data.lines, data.EOL, data.versionId, {
                async getOrCreateGrammar(languageId, encodedLanguageId) {
                    const grammarFactory = await that.d;
                    if (!grammarFactory) {
                        return Promise.resolve(null);
                    }
                    if (!that.c[encodedLanguageId]) {
                        that.c[encodedLanguageId] = grammarFactory.createGrammar(languageId, encodedLanguageId);
                    }
                    return that.c[encodedLanguageId];
                },
                setTokensAndStates(versionId, tokens, stateDeltas) {
                    that.a.setTokensAndStates(data.controllerId, versionId, tokens, stateDeltas);
                },
                reportTokenizationTime(timeMs, languageId, sourceExtensionId, lineLength, isRandomSample) {
                    that.a.reportTokenizationTime(timeMs, languageId, sourceExtensionId, lineLength, isRandomSample);
                },
            }, data.languageId, data.encodedLanguageId, data.maxTokenizationLineLength));
        }
        acceptModelChanged(controllerId, e) {
            this.b.get(controllerId).onEvents(e);
        }
        retokenize(controllerId, startLineNumber, endLineNumberExclusive) {
            this.b.get(controllerId).retokenize(startLineNumber, endLineNumberExclusive);
        }
        acceptModelLanguageChanged(controllerId, newLanguageId, newEncodedLanguageId) {
            this.b.get(controllerId).onLanguageId(newLanguageId, newEncodedLanguageId);
        }
        acceptRemovedModel(controllerId) {
            const model = this.b.get(controllerId);
            if (model) {
                model.dispose();
                this.b.delete(controllerId);
            }
        }
        async acceptTheme(theme, colorMap) {
            const grammarFactory = await this.d;
            grammarFactory?.setTheme(theme, colorMap);
        }
        acceptMaxTokenizationLineLength(controllerId, value) {
            this.b.get(controllerId).acceptMaxTokenizationLineLength(value);
        }
    }
    exports.TextMateTokenizationWorker = TextMateTokenizationWorker;
});

}).call(this);
//# sourceMappingURL=textMateTokenizationWorker.worker.js.map
