/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/base/common/errors","vs/base/common/functional","vs/base/common/lifecycle","vs/base/common/event","vs/base/common/iterator","vs/base/common/lazy","vs/base/common/linkedList","vs/base/common/stopwatch","vs/base/common/cancellation","vs/base/common/cache","vs/base/common/strings","vs/base/common/types","vs/base/common/objects","vs/nls!vs/base/common/platform","vs/base/common/platform","vs/nls","vs/nls!vs/base/common/worker/simpleWorker","vs/base/common/worker/simpleWorker"];
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
define(__m[2/*vs/base/common/errors*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$bb = exports.$ab = exports.$_ = exports.$$ = exports.$0 = exports.$9 = exports.$8 = exports.$7 = exports.$6 = exports.$5 = exports.$4 = exports.$3 = exports.$2 = exports.$1 = exports.$Z = exports.$Y = exports.$X = exports.setUnexpectedErrorHandler = exports.$V = exports.$U = void 0;
    // Avoid circular dependency on EventEmitter by implementing a subset of the interface.
    class $U {
        constructor() {
            this.b = [];
            this.a = function (e) {
                setTimeout(() => {
                    if (e.stack) {
                        if ($ab.isErrorNoTelemetry(e)) {
                            throw new $ab(e.message + '\n\n' + e.stack);
                        }
                        throw new Error(e.message + '\n\n' + e.stack);
                    }
                    throw e;
                }, 0);
            };
        }
        addListener(listener) {
            this.b.push(listener);
            return () => {
                this.d(listener);
            };
        }
        c(e) {
            this.b.forEach((listener) => {
                listener(e);
            });
        }
        d(listener) {
            this.b.splice(this.b.indexOf(listener), 1);
        }
        setUnexpectedErrorHandler(newUnexpectedErrorHandler) {
            this.a = newUnexpectedErrorHandler;
        }
        getUnexpectedErrorHandler() {
            return this.a;
        }
        onUnexpectedError(e) {
            this.a(e);
            this.c(e);
        }
        // For external errors, we don't want the listeners to be called
        onUnexpectedExternalError(e) {
            this.a(e);
        }
    }
    exports.$U = $U;
    exports.$V = new $U();
    /** @skipMangle */
    function setUnexpectedErrorHandler(newUnexpectedErrorHandler) {
        exports.$V.setUnexpectedErrorHandler(newUnexpectedErrorHandler);
    }
    exports.setUnexpectedErrorHandler = setUnexpectedErrorHandler;
    /**
     * Returns if the error is a SIGPIPE error. SIGPIPE errors should generally be
     * logged at most once, to avoid a loop.
     *
     * @see https://github.com/microsoft/vscode-remote-release/issues/6481
     */
    function $X(e) {
        if (!e || typeof e !== 'object') {
            return false;
        }
        const cast = e;
        return cast.code === 'EPIPE' && cast.syscall?.toUpperCase() === 'WRITE';
    }
    exports.$X = $X;
    function $Y(e) {
        // ignore errors from cancelled promises
        if (!$2(e)) {
            exports.$V.onUnexpectedError(e);
        }
        return undefined;
    }
    exports.$Y = $Y;
    function $Z(e) {
        // ignore errors from cancelled promises
        if (!$2(e)) {
            exports.$V.onUnexpectedExternalError(e);
        }
        return undefined;
    }
    exports.$Z = $Z;
    function $1(error) {
        if (error instanceof Error) {
            const { name, message } = error;
            const stack = error.stacktrace || error.stack;
            return {
                $isError: true,
                name,
                message,
                stack,
                noTelemetry: $ab.isErrorNoTelemetry(error)
            };
        }
        // return as is
        return error;
    }
    exports.$1 = $1;
    const canceledName = 'Canceled';
    /**
     * Checks if the given error is a promise in canceled state
     */
    function $2(error) {
        if (error instanceof $3) {
            return true;
        }
        return error instanceof Error && error.name === canceledName && error.message === canceledName;
    }
    exports.$2 = $2;
    // !!!IMPORTANT!!!
    // Do NOT change this class because it is also used as an API-type.
    class $3 extends Error {
        constructor() {
            super(canceledName);
            this.name = this.message;
        }
    }
    exports.$3 = $3;
    /**
     * @deprecated use {@link $3 `new CancellationError()`} instead
     */
    function $4() {
        const error = new Error(canceledName);
        error.name = error.message;
        return error;
    }
    exports.$4 = $4;
    function $5(name) {
        if (name) {
            return new Error(`Illegal argument: ${name}`);
        }
        else {
            return new Error('Illegal argument');
        }
    }
    exports.$5 = $5;
    function $6(name) {
        if (name) {
            return new Error(`Illegal state: ${name}`);
        }
        else {
            return new Error('Illegal state');
        }
    }
    exports.$6 = $6;
    function $7(name) {
        return name
            ? new Error(`readonly property '${name} cannot be changed'`)
            : new Error('readonly property cannot be changed');
    }
    exports.$7 = $7;
    function $8(what) {
        const result = new Error(`${what} has been disposed`);
        result.name = 'DISPOSED';
        return result;
    }
    exports.$8 = $8;
    function $9(err) {
        if (!err) {
            return 'Error';
        }
        if (err.message) {
            return err.message;
        }
        if (err.stack) {
            return err.stack.split('\n')[0];
        }
        return String(err);
    }
    exports.$9 = $9;
    class $0 extends Error {
        constructor(message) {
            super('NotImplemented');
            if (message) {
                this.message = message;
            }
        }
    }
    exports.$0 = $0;
    class $$ extends Error {
        constructor(message) {
            super('NotSupported');
            if (message) {
                this.message = message;
            }
        }
    }
    exports.$$ = $$;
    class $_ extends Error {
        constructor() {
            super(...arguments);
            this.isExpected = true;
        }
    }
    exports.$_ = $_;
    /**
     * Error that when thrown won't be logged in telemetry as an unhandled error.
     */
    class $ab extends Error {
        constructor(msg) {
            super(msg);
            this.name = 'CodeExpectedError';
        }
        static fromError(err) {
            if (err instanceof $ab) {
                return err;
            }
            const result = new $ab();
            result.message = err.message;
            result.stack = err.stack;
            return result;
        }
        static isErrorNoTelemetry(err) {
            return err.name === 'CodeExpectedError';
        }
    }
    exports.$ab = $ab;
    /**
     * This error indicates a bug.
     * Do not throw this for invalid user input.
     * Only catch this error to recover gracefully from bugs.
     */
    class $bb extends Error {
        constructor(message) {
            super(message || 'An unexpected bug occurred.');
            Object.setPrototypeOf(this, $bb.prototype);
            // Because we know for sure only buggy code throws this,
            // we definitely want to break here and fix the bug.
            // eslint-disable-next-line no-debugger
            // debugger;
        }
    }
    exports.$bb = $bb;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[3/*vs/base/common/functional*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$cb = void 0;
    function $cb(fn) {
        const _this = this;
        let didCall = false;
        let result;
        return function () {
            if (didCall) {
                return result;
            }
            didCall = true;
            result = fn.apply(_this, arguments);
            return result;
        };
    }
    exports.$cb = $cb;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[6/*vs/base/common/iterator*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Iterable = void 0;
    var Iterable;
    (function (Iterable) {
        function is(thing) {
            return thing && typeof thing === 'object' && typeof thing[Symbol.iterator] === 'function';
        }
        Iterable.is = is;
        const _empty = Object.freeze([]);
        function empty() {
            return _empty;
        }
        Iterable.empty = empty;
        function* single(element) {
            yield element;
        }
        Iterable.single = single;
        function wrap(iterableOrElement) {
            if (is(iterableOrElement)) {
                return iterableOrElement;
            }
            else {
                return single(iterableOrElement);
            }
        }
        Iterable.wrap = wrap;
        function from(iterable) {
            return iterable || _empty;
        }
        Iterable.from = from;
        function isEmpty(iterable) {
            return !iterable || iterable[Symbol.iterator]().next().done === true;
        }
        Iterable.isEmpty = isEmpty;
        function first(iterable) {
            return iterable[Symbol.iterator]().next().value;
        }
        Iterable.first = first;
        function some(iterable, predicate) {
            for (const element of iterable) {
                if (predicate(element)) {
                    return true;
                }
            }
            return false;
        }
        Iterable.some = some;
        function find(iterable, predicate) {
            for (const element of iterable) {
                if (predicate(element)) {
                    return element;
                }
            }
            return undefined;
        }
        Iterable.find = find;
        function* filter(iterable, predicate) {
            for (const element of iterable) {
                if (predicate(element)) {
                    yield element;
                }
            }
        }
        Iterable.filter = filter;
        function* map(iterable, fn) {
            let index = 0;
            for (const element of iterable) {
                yield fn(element, index++);
            }
        }
        Iterable.map = map;
        function* concat(...iterables) {
            for (const iterable of iterables) {
                for (const element of iterable) {
                    yield element;
                }
            }
        }
        Iterable.concat = concat;
        function reduce(iterable, reducer, initialValue) {
            let value = initialValue;
            for (const element of iterable) {
                value = reducer(value, element);
            }
            return value;
        }
        Iterable.reduce = reduce;
        /**
         * Returns an iterable slice of the array, with the same semantics as `array.slice()`.
         */
        function* slice(arr, from, to = arr.length) {
            if (from < 0) {
                from += arr.length;
            }
            if (to < 0) {
                to += arr.length;
            }
            else if (to > arr.length) {
                to = arr.length;
            }
            for (; from < to; from++) {
                yield arr[from];
            }
        }
        Iterable.slice = slice;
        /**
         * Consumes `atMost` elements from iterable and returns the consumed elements,
         * and an iterable for the rest of the elements.
         */
        function consume(iterable, atMost = Number.POSITIVE_INFINITY) {
            const consumed = [];
            if (atMost === 0) {
                return [consumed, iterable];
            }
            const iterator = iterable[Symbol.iterator]();
            for (let i = 0; i < atMost; i++) {
                const next = iterator.next();
                if (next.done) {
                    return [consumed, Iterable.empty()];
                }
                consumed.push(next.value);
            }
            return [consumed, { [Symbol.iterator]() { return iterator; } }];
        }
        Iterable.consume = consume;
    })(Iterable || (exports.Iterable = Iterable = {}));
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[7/*vs/base/common/lazy*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$T = void 0;
    class $T {
        constructor(d) {
            this.d = d;
            this.a = false;
        }
        /**
         * True if the lazy value has been resolved.
         */
        get hasValue() { return this.a; }
        /**
         * Get the wrapped value.
         *
         * This will force evaluation of the lazy value if it has not been resolved yet. Lazy values are only
         * resolved once. `getValue` will re-throw exceptions that are hit while resolving the value
         */
        get value() {
            if (!this.a) {
                try {
                    this.b = this.d();
                }
                catch (err) {
                    this.c = err;
                }
                finally {
                    this.a = true;
                }
            }
            if (this.c) {
                throw this.c;
            }
            return this.b;
        }
        /**
         * Get the wrapped value without forcing evaluation.
         */
        get rawValue() { return this.b; }
    }
    exports.$T = $T;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[4/*vs/base/common/lifecycle*/], __M([0/*require*/,1/*exports*/,3/*vs/base/common/functional*/,6/*vs/base/common/iterator*/]), function (require, exports, functional_1, iterator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$tb = exports.$sb = exports.$rb = exports.$qb = exports.$pb = exports.$ob = exports.$nb = exports.$mb = exports.$lb = exports.$kb = exports.$jb = exports.$ib = exports.$hb = exports.$gb = exports.$fb = exports.$eb = exports.$db = void 0;
    // #region Disposable Tracking
    /**
     * Enables logging of potentially leaked disposables.
     *
     * A disposable is considered leaked if it is not disposed or not registered as the child of
     * another disposable. This tracking is very simple an only works for classes that either
     * extend Disposable or use a DisposableStore. This means there are a lot of false positives.
     */
    const TRACK_DISPOSABLES = false;
    let disposableTracker = null;
    function $db(tracker) {
        disposableTracker = tracker;
    }
    exports.$db = $db;
    if (TRACK_DISPOSABLES) {
        const __is_disposable_tracked__ = '__is_disposable_tracked__';
        $db(new class {
            trackDisposable(x) {
                const stack = new Error('Potentially leaked disposable').stack;
                setTimeout(() => {
                    if (!x[__is_disposable_tracked__]) {
                        console.log(stack);
                    }
                }, 3000);
            }
            setParent(child, parent) {
                if (child && child !== $lb.None) {
                    try {
                        child[__is_disposable_tracked__] = true;
                    }
                    catch {
                        // noop
                    }
                }
            }
            markAsDisposed(disposable) {
                if (disposable && disposable !== $lb.None) {
                    try {
                        disposable[__is_disposable_tracked__] = true;
                    }
                    catch {
                        // noop
                    }
                }
            }
            markAsSingleton(disposable) { }
        });
    }
    function trackDisposable(x) {
        disposableTracker?.trackDisposable(x);
        return x;
    }
    function markAsDisposed(disposable) {
        disposableTracker?.markAsDisposed(disposable);
    }
    function setParentOfDisposable(child, parent) {
        disposableTracker?.setParent(child, parent);
    }
    function setParentOfDisposables(children, parent) {
        if (!disposableTracker) {
            return;
        }
        for (const child of children) {
            disposableTracker.setParent(child, parent);
        }
    }
    /**
     * Indicates that the given object is a singleton which does not need to be disposed.
    */
    function $eb(singleton) {
        disposableTracker?.markAsSingleton(singleton);
        return singleton;
    }
    exports.$eb = $eb;
    /**
     * Check if `thing` is {@link IDisposable disposable}.
     */
    function $fb(thing) {
        return typeof thing.dispose === 'function' && thing.dispose.length === 0;
    }
    exports.$fb = $fb;
    function $gb(arg) {
        if (iterator_1.Iterable.is(arg)) {
            const errors = [];
            for (const d of arg) {
                if (d) {
                    try {
                        d.dispose();
                    }
                    catch (e) {
                        errors.push(e);
                    }
                }
            }
            if (errors.length === 1) {
                throw errors[0];
            }
            else if (errors.length > 1) {
                throw new AggregateError(errors, 'Encountered errors while disposing of store');
            }
            return Array.isArray(arg) ? [] : arg;
        }
        else if (arg) {
            arg.dispose();
            return arg;
        }
    }
    exports.$gb = $gb;
    function $hb(disposables) {
        for (const d of disposables) {
            if ($fb(d)) {
                d.dispose();
            }
        }
        return [];
    }
    exports.$hb = $hb;
    /**
     * Combine multiple disposable values into a single {@link IDisposable}.
     */
    function $ib(...disposables) {
        const parent = $jb(() => $gb(disposables));
        setParentOfDisposables(disposables, parent);
        return parent;
    }
    exports.$ib = $ib;
    /**
     * Turn a function that implements dispose into an {@link IDisposable}.
     *
     * @param fn Clean up function, guaranteed to be called only **once**.
     */
    function $jb(fn) {
        const self = trackDisposable({
            dispose: (0, functional_1.$cb)(() => {
                markAsDisposed(self);
                fn();
            })
        });
        return self;
    }
    exports.$jb = $jb;
    /**
     * Manages a collection of disposable values.
     *
     * This is the preferred way to manage multiple disposables. A `DisposableStore` is safer to work with than an
     * `IDisposable[]` as it considers edge cases, such as registering the same value multiple times or adding an item to a
     * store that has already been disposed of.
     */
    class $kb {
        static { this.DISABLE_DISPOSED_WARNING = false; }
        constructor() {
            this.f = new Set();
            this.g = false;
            trackDisposable(this);
        }
        /**
         * Dispose of all registered disposables and mark this object as disposed.
         *
         * Any future disposables added to this object will be disposed of on `add`.
         */
        dispose() {
            if (this.g) {
                return;
            }
            markAsDisposed(this);
            this.g = true;
            this.clear();
        }
        /**
         * @return `true` if this object has been disposed of.
         */
        get isDisposed() {
            return this.g;
        }
        /**
         * Dispose of all registered disposables but do not mark this object as disposed.
         */
        clear() {
            if (this.f.size === 0) {
                return;
            }
            try {
                $gb(this.f);
            }
            finally {
                this.f.clear();
            }
        }
        /**
         * Add a new {@link IDisposable disposable} to the collection.
         */
        add(o) {
            if (!o) {
                return o;
            }
            if (o === this) {
                throw new Error('Cannot register a disposable on itself!');
            }
            setParentOfDisposable(o, this);
            if (this.g) {
                if (!$kb.DISABLE_DISPOSED_WARNING) {
                    console.warn(new Error('Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!').stack);
                }
            }
            else {
                this.f.add(o);
            }
            return o;
        }
    }
    exports.$kb = $kb;
    /**
     * Abstract base class for a {@link IDisposable disposable} object.
     *
     * Subclasses can {@linkcode B} disposables that will be automatically cleaned up when this object is disposed of.
     */
    class $lb {
        /**
         * A disposable that does nothing when it is disposed of.
         *
         * TODO: This should not be a static property.
         */
        static { this.None = Object.freeze({ dispose() { } }); }
        constructor() {
            this.q = new $kb();
            trackDisposable(this);
            setParentOfDisposable(this.q, this);
        }
        dispose() {
            markAsDisposed(this);
            this.q.dispose();
        }
        /**
         * Adds `o` to the collection of disposables managed by this object.
         */
        B(o) {
            if (o === this) {
                throw new Error('Cannot register a disposable on itself!');
            }
            return this.q.add(o);
        }
    }
    exports.$lb = $lb;
    /**
     * Manages the lifecycle of a disposable value that may be changed.
     *
     * This ensures that when the disposable value is changed, the previously held disposable is disposed of. You can
     * also register a `MutableDisposable` on a `Disposable` to ensure it is automatically cleaned up.
     */
    class $mb {
        constructor() {
            this.b = false;
            trackDisposable(this);
        }
        get value() {
            return this.b ? undefined : this.a;
        }
        set value(value) {
            if (this.b || value === this.a) {
                return;
            }
            this.a?.dispose();
            if (value) {
                setParentOfDisposable(value, this);
            }
            this.a = value;
        }
        /**
         * Resets the stored value and disposed of the previously stored value.
         */
        clear() {
            this.value = undefined;
        }
        dispose() {
            this.b = true;
            markAsDisposed(this);
            this.a?.dispose();
            this.a = undefined;
        }
        /**
         * Clears the value, but does not dispose it.
         * The old value is returned.
        */
        clearAndLeak() {
            const oldValue = this.a;
            this.a = undefined;
            if (oldValue) {
                setParentOfDisposable(oldValue, null);
            }
            return oldValue;
        }
    }
    exports.$mb = $mb;
    class $nb {
        constructor(b) {
            this.b = b;
            this.a = 1;
        }
        acquire() {
            this.a++;
            return this;
        }
        release() {
            if (--this.a === 0) {
                this.b.dispose();
            }
            return this;
        }
    }
    exports.$nb = $nb;
    /**
     * A safe disposable can be `unset` so that a leaked reference (listener)
     * can be cut-off.
     */
    class $ob {
        constructor() {
            this.dispose = () => { };
            this.unset = () => { };
            this.isset = () => false;
            trackDisposable(this);
        }
        set(fn) {
            let callback = fn;
            this.unset = () => callback = undefined;
            this.isset = () => callback !== undefined;
            this.dispose = () => {
                if (callback) {
                    callback();
                    callback = undefined;
                    markAsDisposed(this);
                }
            };
            return this;
        }
    }
    exports.$ob = $ob;
    class $pb {
        constructor() {
            this.a = new Map();
        }
        acquire(key, ...args) {
            let reference = this.a.get(key);
            if (!reference) {
                reference = { counter: 0, object: this.b(key, ...args) };
                this.a.set(key, reference);
            }
            const { object } = reference;
            const dispose = (0, functional_1.$cb)(() => {
                if (--reference.counter === 0) {
                    this.c(key, reference.object);
                    this.a.delete(key);
                }
            });
            reference.counter++;
            return { object, dispose };
        }
    }
    exports.$pb = $pb;
    /**
     * Unwraps a reference collection of promised values. Makes sure
     * references are disposed whenever promises get rejected.
     */
    class $qb {
        constructor(a) {
            this.a = a;
        }
        async acquire(key, ...args) {
            const ref = this.a.acquire(key, ...args);
            try {
                const object = await ref.object;
                return {
                    object,
                    dispose: () => ref.dispose()
                };
            }
            catch (error) {
                ref.dispose();
                throw error;
            }
        }
    }
    exports.$qb = $qb;
    class $rb {
        constructor(object) {
            this.object = object;
        }
        dispose() { }
    }
    exports.$rb = $rb;
    function $sb(fn) {
        const store = new $kb();
        try {
            fn(store);
        }
        finally {
            store.dispose();
        }
    }
    exports.$sb = $sb;
    /**
     * A map the manages the lifecycle of the values that it stores.
     */
    class $tb {
        constructor() {
            this.a = new Map();
            this.b = false;
            trackDisposable(this);
        }
        /**
         * Disposes of all stored values and mark this object as disposed.
         *
         * Trying to use this object after it has been disposed of is an error.
         */
        dispose() {
            markAsDisposed(this);
            this.b = true;
            this.clearAndDisposeAll();
        }
        /**
         * Disposes of all stored values and clear the map, but DO NOT mark this object as disposed.
         */
        clearAndDisposeAll() {
            if (!this.a.size) {
                return;
            }
            try {
                $gb(this.a.values());
            }
            finally {
                this.a.clear();
            }
        }
        has(key) {
            return this.a.has(key);
        }
        get(key) {
            return this.a.get(key);
        }
        set(key, value, skipDisposeOnOverwrite = false) {
            if (this.b) {
                console.warn(new Error('Trying to add a disposable to a DisposableMap that has already been disposed of. The added object will be leaked!').stack);
            }
            if (!skipDisposeOnOverwrite) {
                this.a.get(key)?.dispose();
            }
            this.a.set(key, value);
        }
        /**
         * Delete the value stored for `key` from this map and also dispose of it.
         */
        deleteAndDispose(key) {
            this.a.get(key)?.dispose();
            this.a.delete(key);
        }
        [Symbol.iterator]() {
            return this.a[Symbol.iterator]();
        }
    }
    exports.$tb = $tb;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[8/*vs/base/common/linkedList*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$lc = void 0;
    class Node {
        static { this.Undefined = new Node(undefined); }
        constructor(element) {
            this.element = element;
            this.next = Node.Undefined;
            this.prev = Node.Undefined;
        }
    }
    class $lc {
        constructor() {
            this.a = Node.Undefined;
            this.b = Node.Undefined;
            this.c = 0;
        }
        get size() {
            return this.c;
        }
        isEmpty() {
            return this.a === Node.Undefined;
        }
        clear() {
            let node = this.a;
            while (node !== Node.Undefined) {
                const next = node.next;
                node.prev = Node.Undefined;
                node.next = Node.Undefined;
                node = next;
            }
            this.a = Node.Undefined;
            this.b = Node.Undefined;
            this.c = 0;
        }
        unshift(element) {
            return this.d(element, false);
        }
        push(element) {
            return this.d(element, true);
        }
        d(element, atTheEnd) {
            const newNode = new Node(element);
            if (this.a === Node.Undefined) {
                this.a = newNode;
                this.b = newNode;
            }
            else if (atTheEnd) {
                // push
                const oldLast = this.b;
                this.b = newNode;
                newNode.prev = oldLast;
                oldLast.next = newNode;
            }
            else {
                // unshift
                const oldFirst = this.a;
                this.a = newNode;
                newNode.next = oldFirst;
                oldFirst.prev = newNode;
            }
            this.c += 1;
            let didRemove = false;
            return () => {
                if (!didRemove) {
                    didRemove = true;
                    this.e(newNode);
                }
            };
        }
        shift() {
            if (this.a === Node.Undefined) {
                return undefined;
            }
            else {
                const res = this.a.element;
                this.e(this.a);
                return res;
            }
        }
        pop() {
            if (this.b === Node.Undefined) {
                return undefined;
            }
            else {
                const res = this.b.element;
                this.e(this.b);
                return res;
            }
        }
        e(node) {
            if (node.prev !== Node.Undefined && node.next !== Node.Undefined) {
                // middle
                const anchor = node.prev;
                anchor.next = node.next;
                node.next.prev = anchor;
            }
            else if (node.prev === Node.Undefined && node.next === Node.Undefined) {
                // only node
                this.a = Node.Undefined;
                this.b = Node.Undefined;
            }
            else if (node.next === Node.Undefined) {
                // last
                this.b = this.b.prev;
                this.b.next = Node.Undefined;
            }
            else if (node.prev === Node.Undefined) {
                // first
                this.a = this.a.next;
                this.a.prev = Node.Undefined;
            }
            // done
            this.c -= 1;
        }
        *[Symbol.iterator]() {
            let node = this.a;
            while (node !== Node.Undefined) {
                yield node.element;
                node = node.next;
            }
        }
    }
    exports.$lc = $lc;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[9/*vs/base/common/stopwatch*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$4c = void 0;
    const hasPerformanceNow = (globalThis.performance && typeof globalThis.performance.now === 'function');
    class $4c {
        static create(highResolution) {
            return new $4c(highResolution);
        }
        constructor(highResolution) {
            this.c = hasPerformanceNow && highResolution === false ? Date.now : globalThis.performance.now.bind(globalThis.performance);
            this.a = this.c();
            this.b = -1;
        }
        stop() {
            this.b = this.c();
        }
        reset() {
            this.a = this.c();
            this.b = -1;
        }
        elapsed() {
            if (this.b !== -1) {
                return this.b - this.a;
            }
            return this.c() - this.a;
        }
    }
    exports.$4c = $4c;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[5/*vs/base/common/event*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/errors*/,3/*vs/base/common/functional*/,4/*vs/base/common/lifecycle*/,8/*vs/base/common/linkedList*/,9/*vs/base/common/stopwatch*/]), function (require, exports, errors_1, functional_1, lifecycle_1, linkedList_1, stopwatch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$dd = exports.$cd = exports.$bd = exports.$ad = exports.$_c = exports.$$c = exports.$0c = exports.$9c = exports.$8c = exports.$7c = exports.$6c = exports.Event = void 0;
    // -----------------------------------------------------------------------------------------------------------------------
    // Uncomment the next line to print warnings whenever an emitter with listeners is disposed. That is a sign of code smell.
    // -----------------------------------------------------------------------------------------------------------------------
    const _enableDisposeWithListenerWarning = false;
    // _enableDisposeWithListenerWarning = Boolean("TRUE"); // causes a linter warning so that it cannot be pushed
    // -----------------------------------------------------------------------------------------------------------------------
    // Uncomment the next line to print warnings whenever a snapshotted event is used repeatedly without cleanup.
    // See https://github.com/microsoft/vscode/issues/142851
    // -----------------------------------------------------------------------------------------------------------------------
    const _enableSnapshotPotentialLeakWarning = false;
    var Event;
    (function (Event) {
        Event.None = () => lifecycle_1.$lb.None;
        function _addLeakageTraceLogic(options) {
            if (_enableSnapshotPotentialLeakWarning) {
                const { onDidAddListener: origListenerDidAdd } = options;
                const stack = Stacktrace.create();
                let count = 0;
                options.onDidAddListener = () => {
                    if (++count === 2) {
                        console.warn('snapshotted emitter LIKELY used public and SHOULD HAVE BEEN created with DisposableStore. snapshotted here');
                        stack.print();
                    }
                    origListenerDidAdd?.();
                };
            }
        }
        /**
         * Given an event, returns another event which debounces calls and defers the listeners to a later task via a shared
         * `setTimeout`. The event is converted into a signal (`Event<void>`) to avoid additional object creation as a
         * result of merging events and to try prevent race conditions that could arise when using related deferred and
         * non-deferred events.
         *
         * This is useful for deferring non-critical work (eg. general UI updates) to ensure it does not block critical work
         * (eg. latency of keypress to text rendered).
         *
         * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
         * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
         * returned event causes this utility to leak a listener on the original event.
         *
         * @param event The event source for the new event.
         * @param disposable A disposable store to add the new EventEmitter to.
         */
        function defer(event, disposable) {
            return debounce(event, () => void 0, 0, undefined, true, undefined, disposable);
        }
        Event.defer = defer;
        /**
         * Given an event, returns another event which only fires once.
         *
         * @param event The event source for the new event.
         */
        function once(event) {
            return (listener, thisArgs = null, disposables) => {
                // we need this, in case the event fires during the listener call
                let didFire = false;
                let result = undefined;
                result = event(e => {
                    if (didFire) {
                        return;
                    }
                    else if (result) {
                        result.dispose();
                    }
                    else {
                        didFire = true;
                    }
                    return listener.call(thisArgs, e);
                }, null, disposables);
                if (didFire) {
                    result.dispose();
                }
                return result;
            };
        }
        Event.once = once;
        /**
         * Maps an event of one type into an event of another type using a mapping function, similar to how
         * `Array.prototype.map` works.
         *
         * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
         * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
         * returned event causes this utility to leak a listener on the original event.
         *
         * @param event The event source for the new event.
         * @param map The mapping function.
         * @param disposable A disposable store to add the new EventEmitter to.
         */
        function map(event, map, disposable) {
            return snapshot((listener, thisArgs = null, disposables) => event(i => listener.call(thisArgs, map(i)), null, disposables), disposable);
        }
        Event.map = map;
        /**
         * Wraps an event in another event that performs some function on the event object before firing.
         *
         * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
         * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
         * returned event causes this utility to leak a listener on the original event.
         *
         * @param event The event source for the new event.
         * @param each The function to perform on the event object.
         * @param disposable A disposable store to add the new EventEmitter to.
         */
        function forEach(event, each, disposable) {
            return snapshot((listener, thisArgs = null, disposables) => event(i => { each(i); listener.call(thisArgs, i); }, null, disposables), disposable);
        }
        Event.forEach = forEach;
        function filter(event, filter, disposable) {
            return snapshot((listener, thisArgs = null, disposables) => event(e => filter(e) && listener.call(thisArgs, e), null, disposables), disposable);
        }
        Event.filter = filter;
        /**
         * Given an event, returns the same event but typed as `Event<void>`.
         */
        function signal(event) {
            return event;
        }
        Event.signal = signal;
        function any(...events) {
            return (listener, thisArgs = null, disposables) => (0, lifecycle_1.$ib)(...events.map(event => event(e => listener.call(thisArgs, e), null, disposables)));
        }
        Event.any = any;
        /**
         * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
         * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
         * returned event causes this utility to leak a listener on the original event.
         */
        function reduce(event, merge, initial, disposable) {
            let output = initial;
            return map(event, e => {
                output = merge(output, e);
                return output;
            }, disposable);
        }
        Event.reduce = reduce;
        function snapshot(event, disposable) {
            let listener;
            const options = {
                onWillAddFirstListener() {
                    listener = event(emitter.fire, emitter);
                },
                onDidRemoveLastListener() {
                    listener?.dispose();
                }
            };
            if (!disposable) {
                _addLeakageTraceLogic(options);
            }
            const emitter = new $8c(options);
            disposable?.add(emitter);
            return emitter.event;
        }
        function debounce(event, merge, delay = 100, leading = false, flushOnListenerRemove = false, leakWarningThreshold, disposable) {
            let subscription;
            let output = undefined;
            let handle = undefined;
            let numDebouncedCalls = 0;
            let doFire;
            const options = {
                leakWarningThreshold,
                onWillAddFirstListener() {
                    subscription = event(cur => {
                        numDebouncedCalls++;
                        output = merge(output, cur);
                        if (leading && !handle) {
                            emitter.fire(output);
                            output = undefined;
                        }
                        doFire = () => {
                            const _output = output;
                            output = undefined;
                            handle = undefined;
                            if (!leading || numDebouncedCalls > 1) {
                                emitter.fire(_output);
                            }
                            numDebouncedCalls = 0;
                        };
                        if (typeof delay === 'number') {
                            clearTimeout(handle);
                            handle = setTimeout(doFire, delay);
                        }
                        else {
                            if (handle === undefined) {
                                handle = 0;
                                queueMicrotask(doFire);
                            }
                        }
                    });
                },
                onWillRemoveListener() {
                    if (flushOnListenerRemove && numDebouncedCalls > 0) {
                        doFire?.();
                    }
                },
                onDidRemoveLastListener() {
                    doFire = undefined;
                    subscription.dispose();
                }
            };
            if (!disposable) {
                _addLeakageTraceLogic(options);
            }
            const emitter = new $8c(options);
            disposable?.add(emitter);
            return emitter.event;
        }
        Event.debounce = debounce;
        /**
         * Debounces an event, firing after some delay (default=0) with an array of all event original objects.
         *
         * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
         * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
         * returned event causes this utility to leak a listener on the original event.
         */
        function accumulate(event, delay = 0, disposable) {
            return Event.debounce(event, (last, e) => {
                if (!last) {
                    return [e];
                }
                last.push(e);
                return last;
            }, delay, undefined, true, undefined, disposable);
        }
        Event.accumulate = accumulate;
        /**
         * Filters an event such that some condition is _not_ met more than once in a row, effectively ensuring duplicate
         * event objects from different sources do not fire the same event object.
         *
         * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
         * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
         * returned event causes this utility to leak a listener on the original event.
         *
         * @param event The event source for the new event.
         * @param equals The equality condition.
         * @param disposable A disposable store to add the new EventEmitter to.
         *
         * @example
         * ```
         * // Fire only one time when a single window is opened or focused
         * Event.latch(Event.any(onDidOpenWindow, onDidFocusWindow))
         * ```
         */
        function latch(event, equals = (a, b) => a === b, disposable) {
            let firstCall = true;
            let cache;
            return filter(event, value => {
                const shouldEmit = firstCall || !equals(value, cache);
                firstCall = false;
                cache = value;
                return shouldEmit;
            }, disposable);
        }
        Event.latch = latch;
        /**
         * Splits an event whose parameter is a union type into 2 separate events for each type in the union.
         *
         * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
         * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
         * returned event causes this utility to leak a listener on the original event.
         *
         * @example
         * ```
         * const event = new EventEmitter<number | undefined>().event;
         * const [numberEvent, undefinedEvent] = Event.split(event, isUndefined);
         * ```
         *
         * @param event The event source for the new event.
         * @param isT A function that determines what event is of the first type.
         * @param disposable A disposable store to add the new EventEmitter to.
         */
        function split(event, isT, disposable) {
            return [
                Event.filter(event, isT, disposable),
                Event.filter(event, e => !isT(e), disposable),
            ];
        }
        Event.split = split;
        /**
         * Buffers an event until it has a listener attached.
         *
         * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
         * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
         * returned event causes this utility to leak a listener on the original event.
         *
         * @param event The event source for the new event.
         * @param flushAfterTimeout Determines whether to flush the buffer after a timeout immediately or after a
         * `setTimeout` when the first event listener is added.
         * @param _buffer Internal: A source event array used for tests.
         *
         * @example
         * ```
         * // Start accumulating events, when the first listener is attached, flush
         * // the event after a timeout such that multiple listeners attached before
         * // the timeout would receive the event
         * this.onInstallExtension = Event.buffer(service.onInstallExtension, true);
         * ```
         */
        function buffer(event, flushAfterTimeout = false, _buffer = []) {
            let buffer = _buffer.slice();
            let listener = event(e => {
                if (buffer) {
                    buffer.push(e);
                }
                else {
                    emitter.fire(e);
                }
            });
            const flush = () => {
                buffer?.forEach(e => emitter.fire(e));
                buffer = null;
            };
            const emitter = new $8c({
                onWillAddFirstListener() {
                    if (!listener) {
                        listener = event(e => emitter.fire(e));
                    }
                },
                onDidAddFirstListener() {
                    if (buffer) {
                        if (flushAfterTimeout) {
                            setTimeout(flush);
                        }
                        else {
                            flush();
                        }
                    }
                },
                onDidRemoveLastListener() {
                    if (listener) {
                        listener.dispose();
                    }
                    listener = null;
                }
            });
            return emitter.event;
        }
        Event.buffer = buffer;
        class ChainableEvent {
            constructor(event) {
                this.event = event;
                this.d = new lifecycle_1.$kb();
            }
            /** @see {@link Event.map} */
            map(fn) {
                return new ChainableEvent(map(this.event, fn, this.d));
            }
            /** @see {@link Event.forEach} */
            forEach(fn) {
                return new ChainableEvent(forEach(this.event, fn, this.d));
            }
            filter(fn) {
                return new ChainableEvent(filter(this.event, fn, this.d));
            }
            /** @see {@link Event.reduce} */
            reduce(merge, initial) {
                return new ChainableEvent(reduce(this.event, merge, initial, this.d));
            }
            /** @see {@link Event.reduce} */
            latch() {
                return new ChainableEvent(latch(this.event, undefined, this.d));
            }
            debounce(merge, delay = 100, leading = false, flushOnListenerRemove = false, leakWarningThreshold) {
                return new ChainableEvent(debounce(this.event, merge, delay, leading, flushOnListenerRemove, leakWarningThreshold, this.d));
            }
            /**
             * Attach a listener to the event.
             */
            on(listener, thisArgs, disposables) {
                return this.event(listener, thisArgs, disposables);
            }
            /** @see {@link Event.once} */
            once(listener, thisArgs, disposables) {
                return once(this.event)(listener, thisArgs, disposables);
            }
            dispose() {
                this.d.dispose();
            }
        }
        /**
         * Wraps the event in an {@link IChainableEvent}, allowing a more functional programming style.
         *
         * @example
         * ```
         * // Normal
         * const onEnterPressNormal = Event.filter(
         *   Event.map(onKeyPress.event, e => new StandardKeyboardEvent(e)),
         *   e.keyCode === KeyCode.Enter
         * ).event;
         *
         * // Using chain
         * const onEnterPressChain = Event.chain(onKeyPress.event)
         *   .map(e => new StandardKeyboardEvent(e))
         *   .filter(e => e.keyCode === KeyCode.Enter)
         *   .event;
         * ```
         */
        function chain(event) {
            return new ChainableEvent(event);
        }
        Event.chain = chain;
        /**
         * Creates an {@link Event} from a node event emitter.
         */
        function fromNodeEventEmitter(emitter, eventName, map = id => id) {
            const fn = (...args) => result.fire(map(...args));
            const onFirstListenerAdd = () => emitter.on(eventName, fn);
            const onLastListenerRemove = () => emitter.removeListener(eventName, fn);
            const result = new $8c({ onWillAddFirstListener: onFirstListenerAdd, onDidRemoveLastListener: onLastListenerRemove });
            return result.event;
        }
        Event.fromNodeEventEmitter = fromNodeEventEmitter;
        /**
         * Creates an {@link Event} from a DOM event emitter.
         */
        function fromDOMEventEmitter(emitter, eventName, map = id => id) {
            const fn = (...args) => result.fire(map(...args));
            const onFirstListenerAdd = () => emitter.addEventListener(eventName, fn);
            const onLastListenerRemove = () => emitter.removeEventListener(eventName, fn);
            const result = new $8c({ onWillAddFirstListener: onFirstListenerAdd, onDidRemoveLastListener: onLastListenerRemove });
            return result.event;
        }
        Event.fromDOMEventEmitter = fromDOMEventEmitter;
        /**
         * Creates a promise out of an event, using the {@link Event.once} helper.
         */
        function toPromise(event) {
            return new Promise(resolve => once(event)(resolve));
        }
        Event.toPromise = toPromise;
        /**
         * Adds a listener to an event and calls the listener immediately with undefined as the event object.
         *
         * @example
         * ```
         * // Initialize the UI and update it when dataChangeEvent fires
         * runAndSubscribe(dataChangeEvent, () => this._updateUI());
         * ```
         */
        function runAndSubscribe(event, handler) {
            handler(undefined);
            return event(e => handler(e));
        }
        Event.runAndSubscribe = runAndSubscribe;
        /**
         * Adds a listener to an event and calls the listener immediately with undefined as the event object. A new
         * {@link $kb} is passed to the listener which is disposed when the returned disposable is disposed.
         */
        function runAndSubscribeWithStore(event, handler) {
            let store = null;
            function run(e) {
                store?.dispose();
                store = new lifecycle_1.$kb();
                handler(e, store);
            }
            run(undefined);
            const disposable = event(e => run(e));
            return (0, lifecycle_1.$jb)(() => {
                disposable.dispose();
                store?.dispose();
            });
        }
        Event.runAndSubscribeWithStore = runAndSubscribeWithStore;
        class EmitterObserver {
            constructor(_observable, store) {
                this._observable = _observable;
                this.d = 0;
                this.f = false;
                const options = {
                    onWillAddFirstListener: () => {
                        _observable.addObserver(this);
                    },
                    onDidRemoveLastListener: () => {
                        _observable.removeObserver(this);
                    }
                };
                if (!store) {
                    _addLeakageTraceLogic(options);
                }
                this.emitter = new $8c(options);
                if (store) {
                    store.add(this.emitter);
                }
            }
            beginUpdate(_observable) {
                // assert(_observable === this.obs);
                this.d++;
            }
            handlePossibleChange(_observable) {
                // assert(_observable === this.obs);
            }
            handleChange(_observable, _change) {
                // assert(_observable === this.obs);
                this.f = true;
            }
            endUpdate(_observable) {
                // assert(_observable === this.obs);
                this.d--;
                if (this.d === 0) {
                    this._observable.reportChanges();
                    if (this.f) {
                        this.f = false;
                        this.emitter.fire(this._observable.get());
                    }
                }
            }
        }
        /**
         * Creates an event emitter that is fired when the observable changes.
         * Each listeners subscribes to the emitter.
         */
        function fromObservable(obs, store) {
            const observer = new EmitterObserver(obs, store);
            return observer.emitter.event;
        }
        Event.fromObservable = fromObservable;
        /**
         * Each listener is attached to the observable directly.
         */
        function fromObservableLight(observable) {
            return (listener) => {
                let count = 0;
                let didChange = false;
                const observer = {
                    beginUpdate() {
                        count++;
                    },
                    endUpdate() {
                        count--;
                        if (count === 0) {
                            observable.reportChanges();
                            if (didChange) {
                                didChange = false;
                                listener();
                            }
                        }
                    },
                    handlePossibleChange() {
                        // noop
                    },
                    handleChange() {
                        didChange = true;
                    }
                };
                observable.addObserver(observer);
                observable.reportChanges();
                return {
                    dispose() {
                        observable.removeObserver(observer);
                    }
                };
            };
        }
        Event.fromObservableLight = fromObservableLight;
    })(Event || (exports.Event = Event = {}));
    class $6c {
        static { this.all = new Set(); }
        static { this.d = 0; }
        constructor(name) {
            this.listenerCount = 0;
            this.invocationCount = 0;
            this.elapsedOverall = 0;
            this.durations = [];
            this.name = `${name}_${$6c.d++}`;
            $6c.all.add(this);
        }
        start(listenerCount) {
            this.f = new stopwatch_1.$4c();
            this.listenerCount = listenerCount;
        }
        stop() {
            if (this.f) {
                const elapsed = this.f.elapsed();
                this.durations.push(elapsed);
                this.elapsedOverall += elapsed;
                this.invocationCount += 1;
                this.f = undefined;
            }
        }
    }
    exports.$6c = $6c;
    let _globalLeakWarningThreshold = -1;
    function $7c(n) {
        const oldValue = _globalLeakWarningThreshold;
        _globalLeakWarningThreshold = n;
        return {
            dispose() {
                _globalLeakWarningThreshold = oldValue;
            }
        };
    }
    exports.$7c = $7c;
    class LeakageMonitor {
        constructor(threshold, name = Math.random().toString(18).slice(2, 5)) {
            this.threshold = threshold;
            this.name = name;
            this.f = 0;
        }
        dispose() {
            this.d?.clear();
        }
        check(stack, listenerCount) {
            const threshold = this.threshold;
            if (threshold <= 0 || listenerCount < threshold) {
                return undefined;
            }
            if (!this.d) {
                this.d = new Map();
            }
            const count = (this.d.get(stack.value) || 0);
            this.d.set(stack.value, count + 1);
            this.f -= 1;
            if (this.f <= 0) {
                // only warn on first exceed and then every time the limit
                // is exceeded by 50% again
                this.f = threshold * 0.5;
                // find most frequent listener and print warning
                let topStack;
                let topCount = 0;
                for (const [stack, count] of this.d) {
                    if (!topStack || topCount < count) {
                        topStack = stack;
                        topCount = count;
                    }
                }
                console.warn(`[${this.name}] potential listener LEAK detected, having ${listenerCount} listeners already. MOST frequent listener (${topCount}):`);
                console.warn(topStack);
            }
            return () => {
                const count = (this.d.get(stack.value) || 0);
                this.d.set(stack.value, count - 1);
            };
        }
    }
    class Stacktrace {
        static create() {
            return new Stacktrace(new Error().stack ?? '');
        }
        constructor(value) {
            this.value = value;
        }
        print() {
            console.warn(this.value.split('\n').slice(2).join('\n'));
        }
    }
    let id = 0;
    class UniqueContainer {
        constructor(value) {
            this.value = value;
            this.id = id++;
        }
    }
    const compactionThreshold = 2;
    const forEachListener = (listeners, fn) => {
        if (listeners instanceof UniqueContainer) {
            fn(listeners);
        }
        else {
            for (let i = 0; i < listeners.length; i++) {
                const l = listeners[i];
                if (l) {
                    fn(l);
                }
            }
        }
    };
    /**
     * The Emitter can be used to expose an Event to the public
     * to fire it from the insides.
     * Sample:
        class Document {
    
            private readonly _onDidChange = new Emitter<(value:string)=>any>();
    
            public onDidChange = this._onDidChange.event;
    
            // getter-style
            // get onDidChange(): Event<(value:string)=>any> {
            // 	return this._onDidChange.event;
            // }
    
            private _doIt() {
                //...
                this._onDidChange.fire(value);
            }
        }
     */
    class $8c {
        constructor(options) {
            this.u = 0;
            this.d = options;
            this.f = _globalLeakWarningThreshold > 0 || this.d?.leakWarningThreshold ? new LeakageMonitor(this.d?.leakWarningThreshold ?? _globalLeakWarningThreshold) : undefined;
            this.g = this.d?._profName ? new $6c(this.d._profName) : undefined;
            this.t = this.d?.deliveryQueue;
        }
        dispose() {
            if (!this.j) {
                this.j = true;
                // It is bad to have listeners at the time of disposing an emitter, it is worst to have listeners keep the emitter
                // alive via the reference that's embedded in their disposables. Therefore we loop over all remaining listeners and
                // unset their subscriptions/disposables. Looping and blaming remaining listeners is done on next tick because the
                // the following programming pattern is very popular:
                //
                // const someModel = this._disposables.add(new ModelObject()); // (1) create and register model
                // this._disposables.add(someModel.onDidChange(() => { ... }); // (2) subscribe and register model-event listener
                // ...later...
                // this._disposables.dispose(); disposes (1) then (2): don't warn after (1) but after the "overall dispose" is done
                if (this.t?.current === this) {
                    this.t.reset();
                }
                if (this.q) {
                    if (_enableDisposeWithListenerWarning) {
                        const listeners = this.q;
                        queueMicrotask(() => {
                            forEachListener(listeners, l => l.stack?.print());
                        });
                    }
                    this.q = undefined;
                    this.u = 0;
                }
                this.d?.onDidRemoveLastListener?.();
                this.f?.dispose();
            }
        }
        /**
         * For the public to allow to subscribe
         * to events from this Emitter
         */
        get event() {
            this.m ??= (callback, thisArgs, disposables) => {
                if (this.f && this.u > this.f.threshold * 3) {
                    console.warn(`[${this.f.name}] REFUSES to accept new listeners because it exceeded its threshold by far`);
                    return lifecycle_1.$lb.None;
                }
                if (this.j) {
                    // todo: should we warn if a listener is added to a disposed emitter? This happens often
                    return lifecycle_1.$lb.None;
                }
                if (thisArgs) {
                    callback = callback.bind(thisArgs);
                }
                const contained = new UniqueContainer(callback);
                let removeMonitor;
                let stack;
                if (this.f && this.u >= Math.ceil(this.f.threshold * 0.2)) {
                    // check and record this emitter for potential leakage
                    contained.stack = Stacktrace.create();
                    removeMonitor = this.f.check(contained.stack, this.u + 1);
                }
                if (_enableDisposeWithListenerWarning) {
                    contained.stack = stack ?? Stacktrace.create();
                }
                if (!this.q) {
                    this.d?.onWillAddFirstListener?.(this);
                    this.q = contained;
                    this.d?.onDidAddFirstListener?.(this);
                }
                else if (this.q instanceof UniqueContainer) {
                    this.t ??= new EventDeliveryQueuePrivate();
                    this.q = [this.q, contained];
                }
                else {
                    this.q.push(contained);
                }
                this.u++;
                const result = (0, lifecycle_1.$jb)(() => { removeMonitor?.(); this.v(contained); });
                if (disposables instanceof lifecycle_1.$kb) {
                    disposables.add(result);
                }
                else if (Array.isArray(disposables)) {
                    disposables.push(result);
                }
                return result;
            };
            return this.m;
        }
        v(listener) {
            this.d?.onWillRemoveListener?.(this);
            if (!this.q) {
                return; // expected if a listener gets disposed
            }
            if (this.u === 1) {
                this.q = undefined;
                this.d?.onDidRemoveLastListener?.(this);
                this.u = 0;
                return;
            }
            // size > 1 which requires that listeners be a list:
            const listeners = this.q;
            const index = listeners.indexOf(listener);
            if (index === -1) {
                console.log('disposed?', this.j);
                console.log('size?', this.u);
                console.log('arr?', JSON.stringify(this.q));
                throw new Error('Attempted to dispose unknown listener');
            }
            this.u--;
            listeners[index] = undefined;
            const adjustDeliveryQueue = this.t.current === this;
            if (this.u * compactionThreshold <= listeners.length) {
                let n = 0;
                for (let i = 0; i < listeners.length; i++) {
                    if (listeners[i]) {
                        listeners[n++] = listeners[i];
                    }
                    else if (adjustDeliveryQueue) {
                        this.t.end--;
                        if (n < this.t.i) {
                            this.t.i--;
                        }
                    }
                }
                listeners.length = n;
            }
        }
        w(listener, value) {
            if (!listener) {
                return;
            }
            const errorHandler = this.d?.onListenerError || errors_1.$Y;
            if (!errorHandler) {
                listener.value(value);
                return;
            }
            try {
                listener.value(value);
            }
            catch (e) {
                errorHandler(e);
            }
        }
        /** Delivers items in the queue. Assumes the queue is ready to go. */
        x(dq) {
            const listeners = dq.current.q;
            while (dq.i < dq.end) {
                // important: dq.i is incremented before calling deliver() because it might reenter deliverQueue()
                this.w(listeners[dq.i++], dq.value);
            }
            dq.reset();
        }
        /**
         * To be kept private to fire an event to
         * subscribers
         */
        fire(event) {
            if (this.t?.current) {
                this.x(this.t);
                this.g?.stop(); // last fire() will have starting perfmon, stop it before starting the next dispatch
            }
            this.g?.start(this.u);
            if (!this.q) {
                // no-op
            }
            else if (this.q instanceof UniqueContainer) {
                this.w(this.q, event);
            }
            else {
                const dq = this.t;
                dq.enqueue(this, event, this.q.length);
                this.x(dq);
            }
            this.g?.stop();
        }
        hasListeners() {
            return this.u > 0;
        }
    }
    exports.$8c = $8c;
    const $9c = () => new EventDeliveryQueuePrivate();
    exports.$9c = $9c;
    class EventDeliveryQueuePrivate {
        constructor() {
            /**
             * Index in current's listener list.
             */
            this.i = -1;
            /**
             * The last index in the listener's list to deliver.
             */
            this.end = 0;
        }
        enqueue(emitter, value, end) {
            this.i = 0;
            this.end = end;
            this.current = emitter;
            this.value = value;
        }
        reset() {
            this.i = this.end; // force any current emission loop to stop, mainly for during dispose
            this.current = undefined;
            this.value = undefined;
        }
    }
    class $0c extends $8c {
        async fireAsync(data, token, promiseJoin) {
            if (!this.q) {
                return;
            }
            if (!this.h) {
                this.h = new linkedList_1.$lc();
            }
            forEachListener(this.q, listener => this.h.push([listener.value, data]));
            while (this.h.size > 0 && !token.isCancellationRequested) {
                const [listener, data] = this.h.shift();
                const thenables = [];
                const event = {
                    ...data,
                    token,
                    waitUntil: (p) => {
                        if (Object.isFrozen(thenables)) {
                            throw new Error('waitUntil can NOT be called asynchronous');
                        }
                        if (promiseJoin) {
                            p = promiseJoin(p, listener);
                        }
                        thenables.push(p);
                    }
                };
                try {
                    listener(event);
                }
                catch (e) {
                    (0, errors_1.$Y)(e);
                    continue;
                }
                // freeze thenables-collection to enforce sync-calls to
                // wait until and then wait for all thenables to resolve
                Object.freeze(thenables);
                await Promise.allSettled(thenables).then(values => {
                    for (const value of values) {
                        if (value.status === 'rejected') {
                            (0, errors_1.$Y)(value.reason);
                        }
                    }
                });
            }
        }
    }
    exports.$0c = $0c;
    class $$c extends $8c {
        get isPaused() {
            return this.h !== 0;
        }
        constructor(options) {
            super(options);
            this.h = 0;
            this.s = new linkedList_1.$lc();
            this.y = options?.merge;
        }
        pause() {
            this.h++;
        }
        resume() {
            if (this.h !== 0 && --this.h === 0) {
                if (this.y) {
                    // use the merge function to create a single composite
                    // event. make a copy in case firing pauses this emitter
                    if (this.s.size > 0) {
                        const events = Array.from(this.s);
                        this.s.clear();
                        super.fire(this.y(events));
                    }
                }
                else {
                    // no merging, fire each event individually and test
                    // that this emitter isn't paused halfway through
                    while (!this.h && this.s.size !== 0) {
                        super.fire(this.s.shift());
                    }
                }
            }
        }
        fire(event) {
            if (this.u) {
                if (this.h !== 0) {
                    this.s.push(event);
                }
                else {
                    super.fire(event);
                }
            }
        }
    }
    exports.$$c = $$c;
    class $_c extends $$c {
        constructor(options) {
            super(options);
            this.k = options.delay ?? 100;
        }
        fire(event) {
            if (!this.o) {
                this.pause();
                this.o = setTimeout(() => {
                    this.o = undefined;
                    this.resume();
                }, this.k);
            }
            super.fire(event);
        }
    }
    exports.$_c = $_c;
    /**
     * An emitter which queue all events and then process them at the
     * end of the event loop.
     */
    class $ad extends $8c {
        constructor(options) {
            super(options);
            this.h = [];
            this.k = options?.merge;
        }
        fire(event) {
            if (!this.hasListeners()) {
                return;
            }
            this.h.push(event);
            if (this.h.length === 1) {
                queueMicrotask(() => {
                    if (this.k) {
                        super.fire(this.k(this.h));
                    }
                    else {
                        this.h.forEach(e => super.fire(e));
                    }
                    this.h = [];
                });
            }
        }
    }
    exports.$ad = $ad;
    class $bd {
        constructor() {
            this.f = false;
            this.g = [];
            this.d = new $8c({
                onWillAddFirstListener: () => this.h(),
                onDidRemoveLastListener: () => this.j()
            });
        }
        get event() {
            return this.d.event;
        }
        add(event) {
            const e = { event: event, listener: null };
            this.g.push(e);
            if (this.f) {
                this.k(e);
            }
            const dispose = () => {
                if (this.f) {
                    this.m(e);
                }
                const idx = this.g.indexOf(e);
                this.g.splice(idx, 1);
            };
            return (0, lifecycle_1.$jb)((0, functional_1.$cb)(dispose));
        }
        h() {
            this.f = true;
            this.g.forEach(e => this.k(e));
        }
        j() {
            this.f = false;
            this.g.forEach(e => this.m(e));
        }
        k(e) {
            e.listener = e.event(r => this.d.fire(r));
        }
        m(e) {
            if (e.listener) {
                e.listener.dispose();
            }
            e.listener = null;
        }
        dispose() {
            this.d.dispose();
        }
    }
    exports.$bd = $bd;
    /**
     * The EventBufferer is useful in situations in which you want
     * to delay firing your events during some code.
     * You can wrap that code and be sure that the event will not
     * be fired during that wrap.
     *
     * ```
     * const emitter: Emitter;
     * const delayer = new EventDelayer();
     * const delayedEvent = delayer.wrapEvent(emitter.event);
     *
     * delayedEvent(console.log);
     *
     * delayer.bufferEvents(() => {
     *   emitter.fire(); // event will not be fired yet
     * });
     *
     * // event will only be fired at this point
     * ```
     */
    class $cd {
        constructor() {
            this.d = [];
        }
        wrapEvent(event) {
            return (listener, thisArgs, disposables) => {
                return event(i => {
                    const buffer = this.d[this.d.length - 1];
                    if (buffer) {
                        buffer.push(() => listener.call(thisArgs, i));
                    }
                    else {
                        listener.call(thisArgs, i);
                    }
                }, undefined, disposables);
            };
        }
        bufferEvents(fn) {
            const buffer = [];
            this.d.push(buffer);
            const r = fn();
            this.d.pop();
            buffer.forEach(flush => flush());
            return r;
        }
    }
    exports.$cd = $cd;
    /**
     * A Relay is an event forwarder which functions as a replugabble event pipe.
     * Once created, you can connect an input event to it and it will simply forward
     * events from that input event through its own `event` property. The `input`
     * can be changed at any point in time.
     */
    class $dd {
        constructor() {
            this.d = false;
            this.f = Event.None;
            this.g = lifecycle_1.$lb.None;
            this.h = new $8c({
                onDidAddFirstListener: () => {
                    this.d = true;
                    this.g = this.f(this.h.fire, this.h);
                },
                onDidRemoveLastListener: () => {
                    this.d = false;
                    this.g.dispose();
                }
            });
            this.event = this.h.event;
        }
        set input(event) {
            this.f = event;
            if (this.d) {
                this.g.dispose();
                this.g = event(this.h.fire, this.h);
            }
        }
        dispose() {
            this.g.dispose();
            this.h.dispose();
        }
    }
    exports.$dd = $dd;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[10/*vs/base/common/cancellation*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/event*/]), function (require, exports, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ed = exports.CancellationToken = void 0;
    const shortcutEvent = Object.freeze(function (callback, context) {
        const handle = setTimeout(callback.bind(context), 0);
        return { dispose() { clearTimeout(handle); } };
    });
    var CancellationToken;
    (function (CancellationToken) {
        function isCancellationToken(thing) {
            if (thing === CancellationToken.None || thing === CancellationToken.Cancelled) {
                return true;
            }
            if (thing instanceof MutableToken) {
                return true;
            }
            if (!thing || typeof thing !== 'object') {
                return false;
            }
            return typeof thing.isCancellationRequested === 'boolean'
                && typeof thing.onCancellationRequested === 'function';
        }
        CancellationToken.isCancellationToken = isCancellationToken;
        CancellationToken.None = Object.freeze({
            isCancellationRequested: false,
            onCancellationRequested: event_1.Event.None
        });
        CancellationToken.Cancelled = Object.freeze({
            isCancellationRequested: true,
            onCancellationRequested: shortcutEvent
        });
    })(CancellationToken || (exports.CancellationToken = CancellationToken = {}));
    class MutableToken {
        constructor() {
            this.a = false;
            this.b = null;
        }
        cancel() {
            if (!this.a) {
                this.a = true;
                if (this.b) {
                    this.b.fire(undefined);
                    this.dispose();
                }
            }
        }
        get isCancellationRequested() {
            return this.a;
        }
        get onCancellationRequested() {
            if (this.a) {
                return shortcutEvent;
            }
            if (!this.b) {
                this.b = new event_1.$8c();
            }
            return this.b.event;
        }
        dispose() {
            if (this.b) {
                this.b.dispose();
                this.b = null;
            }
        }
    }
    class $ed {
        constructor(parent) {
            this.a = undefined;
            this.b = undefined;
            this.b = parent && parent.onCancellationRequested(this.cancel, this);
        }
        get token() {
            if (!this.a) {
                // be lazy and create the token only when
                // actually needed
                this.a = new MutableToken();
            }
            return this.a;
        }
        cancel() {
            if (!this.a) {
                // save an object by returning the default
                // cancelled token when cancellation happens
                // before someone asks for the token
                this.a = CancellationToken.Cancelled;
            }
            else if (this.a instanceof MutableToken) {
                // actually cancel
                this.a.cancel();
            }
        }
        dispose(cancel = false) {
            if (cancel) {
                this.cancel();
            }
            this.b?.dispose();
            if (!this.a) {
                // ensure to initialize with an empty token if we had none
                this.a = CancellationToken.None;
            }
            else if (this.a instanceof MutableToken) {
                // actually dispose
                this.a.dispose();
            }
        }
    }
    exports.$ed = $ed;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[11/*vs/base/common/cache*/], __M([0/*require*/,1/*exports*/,10/*vs/base/common/cancellation*/]), function (require, exports, cancellation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$hd = exports.$gd = exports.$fd = void 0;
    class $fd {
        constructor(b) {
            this.b = b;
            this.a = null;
        }
        get() {
            if (this.a) {
                return this.a;
            }
            const cts = new cancellation_1.$ed();
            const promise = this.b(cts.token);
            this.a = {
                promise,
                dispose: () => {
                    this.a = null;
                    cts.cancel();
                    cts.dispose();
                }
            };
            return this.a;
        }
    }
    exports.$fd = $fd;
    /**
     * Uses a LRU cache to make a given parametrized function cached.
     * Caches just the last value.
     * The key must be JSON serializable.
    */
    class $gd {
        constructor(c) {
            this.c = c;
            this.a = undefined;
            this.b = undefined;
        }
        get(arg) {
            const key = JSON.stringify(arg);
            if (this.b !== key) {
                this.b = key;
                this.a = this.c(arg);
            }
            return this.a;
        }
    }
    exports.$gd = $gd;
    /**
     * Uses an unbounded cache (referential equality) to memoize the results of the given function.
    */
    class $hd {
        get cachedValues() {
            return this.a;
        }
        constructor(b) {
            this.b = b;
            this.a = new Map();
        }
        get(arg) {
            if (this.a.has(arg)) {
                return this.a.get(arg);
            }
            const value = this.b(arg);
            this.a.set(arg, value);
            return value;
        }
    }
    exports.$hd = $hd;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[12/*vs/base/common/strings*/], __M([0/*require*/,1/*exports*/,11/*vs/base/common/cache*/,7/*vs/base/common/lazy*/]), function (require, exports, cache_1, lazy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ge = exports.$fe = exports.$ee = exports.$de = exports.GraphemeBreakType = exports.$ce = exports.$be = exports.$ae = exports.$_d = exports.$$d = exports.$0d = exports.$9d = exports.$8d = exports.$7d = exports.$6d = exports.$5d = exports.$4d = exports.$3d = exports.$2d = exports.$1d = exports.$Zd = exports.$Yd = exports.$Xd = exports.$Wd = exports.$Vd = exports.$Ud = exports.$Td = exports.$Sd = exports.$Rd = exports.$Qd = exports.$Pd = exports.$Od = exports.$Nd = exports.$Md = exports.$Ld = exports.$Kd = exports.$Jd = exports.$Id = exports.$Hd = exports.$Gd = exports.$Fd = exports.$Ed = exports.$Dd = exports.$Cd = exports.$Bd = exports.$Ad = exports.$zd = exports.$yd = exports.$xd = exports.$wd = exports.$vd = exports.$ud = exports.$td = exports.$sd = exports.$rd = exports.$qd = exports.$pd = exports.$od = exports.$nd = exports.$md = exports.$ld = exports.$kd = void 0;
    function $kd(str) {
        if (!str || typeof str !== 'string') {
            return true;
        }
        return str.trim().length === 0;
    }
    exports.$kd = $kd;
    const _formatRegexp = /{(\d+)}/g;
    /**
     * Helper to produce a string with a variable number of arguments. Insert variable segments
     * into the string using the {n} notation where N is the index of the argument following the string.
     * @param value string to which formatting is applied
     * @param args replacements for {n}-entries
     */
    function $ld(value, ...args) {
        if (args.length === 0) {
            return value;
        }
        return value.replace(_formatRegexp, function (match, group) {
            const idx = parseInt(group, 10);
            return isNaN(idx) || idx < 0 || idx >= args.length ?
                match :
                args[idx];
        });
    }
    exports.$ld = $ld;
    const _format2Regexp = /{([^}]+)}/g;
    /**
     * Helper to create a string from a template and a string record.
     * Similar to `format` but with objects instead of positional arguments.
     */
    function $md(template, values) {
        return template.replace(_format2Regexp, (match, group) => (values[group] ?? match));
    }
    exports.$md = $md;
    /**
     * Converts HTML characters inside the string to use entities instead. Makes the string safe from
     * being used e.g. in HTMLElement.innerHTML.
     */
    function $nd(html) {
        return html.replace(/[<>&]/g, function (match) {
            switch (match) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                default: return match;
            }
        });
    }
    exports.$nd = $nd;
    /**
     * Escapes regular expression characters in a given string
     */
    function $od(value) {
        return value.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, '\\$&');
    }
    exports.$od = $od;
    /**
     * Counts how often `character` occurs inside `value`.
     */
    function $pd(value, character) {
        let result = 0;
        const ch = character.charCodeAt(0);
        for (let i = value.length - 1; i >= 0; i--) {
            if (value.charCodeAt(i) === ch) {
                result++;
            }
        }
        return result;
    }
    exports.$pd = $pd;
    function $qd(value, maxLength, suffix = '…') {
        if (value.length <= maxLength) {
            return value;
        }
        return `${value.substr(0, maxLength)}${suffix}`;
    }
    exports.$qd = $qd;
    /**
     * Removes all occurrences of needle from the beginning and end of haystack.
     * @param haystack string to trim
     * @param needle the thing to trim (default is a blank)
     */
    function $rd(haystack, needle = ' ') {
        const trimmed = $sd(haystack, needle);
        return $td(trimmed, needle);
    }
    exports.$rd = $rd;
    /**
     * Removes all occurrences of needle from the beginning of haystack.
     * @param haystack string to trim
     * @param needle the thing to trim
     */
    function $sd(haystack, needle) {
        if (!haystack || !needle) {
            return haystack;
        }
        const needleLen = needle.length;
        if (needleLen === 0 || haystack.length === 0) {
            return haystack;
        }
        let offset = 0;
        while (haystack.indexOf(needle, offset) === offset) {
            offset = offset + needleLen;
        }
        return haystack.substring(offset);
    }
    exports.$sd = $sd;
    /**
     * Removes all occurrences of needle from the end of haystack.
     * @param haystack string to trim
     * @param needle the thing to trim
     */
    function $td(haystack, needle) {
        if (!haystack || !needle) {
            return haystack;
        }
        const needleLen = needle.length, haystackLen = haystack.length;
        if (needleLen === 0 || haystackLen === 0) {
            return haystack;
        }
        let offset = haystackLen, idx = -1;
        while (true) {
            idx = haystack.lastIndexOf(needle, offset - 1);
            if (idx === -1 || idx + needleLen !== offset) {
                break;
            }
            if (idx === 0) {
                return '';
            }
            offset = idx;
        }
        return haystack.substring(0, offset);
    }
    exports.$td = $td;
    function $ud(pattern) {
        return pattern.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&').replace(/[\*]/g, '.*');
    }
    exports.$ud = $ud;
    function $vd(pattern) {
        return pattern.replace(/\*/g, '');
    }
    exports.$vd = $vd;
    function $wd(searchString, isRegex, options = {}) {
        if (!searchString) {
            throw new Error('Cannot create regex from empty string');
        }
        if (!isRegex) {
            searchString = $od(searchString);
        }
        if (options.wholeWord) {
            if (!/\B/.test(searchString.charAt(0))) {
                searchString = '\\b' + searchString;
            }
            if (!/\B/.test(searchString.charAt(searchString.length - 1))) {
                searchString = searchString + '\\b';
            }
        }
        let modifiers = '';
        if (options.global) {
            modifiers += 'g';
        }
        if (!options.matchCase) {
            modifiers += 'i';
        }
        if (options.multiline) {
            modifiers += 'm';
        }
        if (options.unicode) {
            modifiers += 'u';
        }
        return new RegExp(searchString, modifiers);
    }
    exports.$wd = $wd;
    function $xd(regexp) {
        // Exit early if it's one of these special cases which are meant to match
        // against an empty string
        if (regexp.source === '^' || regexp.source === '^$' || regexp.source === '$' || regexp.source === '^\\s*$') {
            return false;
        }
        // We check against an empty string. If the regular expression doesn't advance
        // (e.g. ends in an endless loop) it will match an empty string.
        const match = regexp.exec('');
        return !!(match && regexp.lastIndex === 0);
    }
    exports.$xd = $xd;
    function $yd(str) {
        return str.split(/\r\n|\r|\n/);
    }
    exports.$yd = $yd;
    /**
     * Returns first index of the string that is not whitespace.
     * If string is empty or contains only whitespaces, returns -1
     */
    function $zd(str) {
        for (let i = 0, len = str.length; i < len; i++) {
            const chCode = str.charCodeAt(i);
            if (chCode !== 32 /* CharCode.Space */ && chCode !== 9 /* CharCode.Tab */) {
                return i;
            }
        }
        return -1;
    }
    exports.$zd = $zd;
    /**
     * Returns the leading whitespace of the string.
     * If the string contains only whitespaces, returns entire string
     */
    function $Ad(str, start = 0, end = str.length) {
        for (let i = start; i < end; i++) {
            const chCode = str.charCodeAt(i);
            if (chCode !== 32 /* CharCode.Space */ && chCode !== 9 /* CharCode.Tab */) {
                return str.substring(start, i);
            }
        }
        return str.substring(start, end);
    }
    exports.$Ad = $Ad;
    /**
     * Returns last index of the string that is not whitespace.
     * If string is empty or contains only whitespaces, returns -1
     */
    function $Bd(str, startIndex = str.length - 1) {
        for (let i = startIndex; i >= 0; i--) {
            const chCode = str.charCodeAt(i);
            if (chCode !== 32 /* CharCode.Space */ && chCode !== 9 /* CharCode.Tab */) {
                return i;
            }
        }
        return -1;
    }
    exports.$Bd = $Bd;
    /**
     * Function that works identically to String.prototype.replace, except, the
     * replace function is allowed to be async and return a Promise.
     */
    function $Cd(str, search, replacer) {
        const parts = [];
        let last = 0;
        for (const match of str.matchAll(search)) {
            parts.push(str.slice(last, match.index));
            if (match.index === undefined) {
                throw new Error('match.index should be defined');
            }
            last = match.index + match[0].length;
            parts.push(replacer(match[0], ...match.slice(1), match.index, str, match.groups));
        }
        parts.push(str.slice(last));
        return Promise.all(parts).then(p => p.join(''));
    }
    exports.$Cd = $Cd;
    function $Dd(a, b) {
        if (a < b) {
            return -1;
        }
        else if (a > b) {
            return 1;
        }
        else {
            return 0;
        }
    }
    exports.$Dd = $Dd;
    function $Ed(a, b, aStart = 0, aEnd = a.length, bStart = 0, bEnd = b.length) {
        for (; aStart < aEnd && bStart < bEnd; aStart++, bStart++) {
            const codeA = a.charCodeAt(aStart);
            const codeB = b.charCodeAt(bStart);
            if (codeA < codeB) {
                return -1;
            }
            else if (codeA > codeB) {
                return 1;
            }
        }
        const aLen = aEnd - aStart;
        const bLen = bEnd - bStart;
        if (aLen < bLen) {
            return -1;
        }
        else if (aLen > bLen) {
            return 1;
        }
        return 0;
    }
    exports.$Ed = $Ed;
    function $Fd(a, b) {
        return $Gd(a, b, 0, a.length, 0, b.length);
    }
    exports.$Fd = $Fd;
    function $Gd(a, b, aStart = 0, aEnd = a.length, bStart = 0, bEnd = b.length) {
        for (; aStart < aEnd && bStart < bEnd; aStart++, bStart++) {
            let codeA = a.charCodeAt(aStart);
            let codeB = b.charCodeAt(bStart);
            if (codeA === codeB) {
                // equal
                continue;
            }
            if (codeA >= 128 || codeB >= 128) {
                // not ASCII letters -> fallback to lower-casing strings
                return $Ed(a.toLowerCase(), b.toLowerCase(), aStart, aEnd, bStart, bEnd);
            }
            // mapper lower-case ascii letter onto upper-case varinats
            // [97-122] (lower ascii) --> [65-90] (upper ascii)
            if ($Id(codeA)) {
                codeA -= 32;
            }
            if ($Id(codeB)) {
                codeB -= 32;
            }
            // compare both code points
            const diff = codeA - codeB;
            if (diff === 0) {
                continue;
            }
            return diff;
        }
        const aLen = aEnd - aStart;
        const bLen = bEnd - bStart;
        if (aLen < bLen) {
            return -1;
        }
        else if (aLen > bLen) {
            return 1;
        }
        return 0;
    }
    exports.$Gd = $Gd;
    function $Hd(code) {
        return code >= 48 /* CharCode.Digit0 */ && code <= 57 /* CharCode.Digit9 */;
    }
    exports.$Hd = $Hd;
    function $Id(code) {
        return code >= 97 /* CharCode.a */ && code <= 122 /* CharCode.z */;
    }
    exports.$Id = $Id;
    function $Jd(code) {
        return code >= 65 /* CharCode.A */ && code <= 90 /* CharCode.Z */;
    }
    exports.$Jd = $Jd;
    function $Kd(a, b) {
        return a.length === b.length && $Gd(a, b) === 0;
    }
    exports.$Kd = $Kd;
    function $Ld(str, candidate) {
        const candidateLength = candidate.length;
        if (candidate.length > str.length) {
            return false;
        }
        return $Gd(str, candidate, 0, candidateLength) === 0;
    }
    exports.$Ld = $Ld;
    /**
     * @returns the length of the common prefix of the two strings.
     */
    function $Md(a, b) {
        const len = Math.min(a.length, b.length);
        let i;
        for (i = 0; i < len; i++) {
            if (a.charCodeAt(i) !== b.charCodeAt(i)) {
                return i;
            }
        }
        return len;
    }
    exports.$Md = $Md;
    /**
     * @returns the length of the common suffix of the two strings.
     */
    function $Nd(a, b) {
        const len = Math.min(a.length, b.length);
        let i;
        const aLastIndex = a.length - 1;
        const bLastIndex = b.length - 1;
        for (i = 0; i < len; i++) {
            if (a.charCodeAt(aLastIndex - i) !== b.charCodeAt(bLastIndex - i)) {
                return i;
            }
        }
        return len;
    }
    exports.$Nd = $Nd;
    /**
     * See http://en.wikipedia.org/wiki/Surrogate_pair
     */
    function $Od(charCode) {
        return (0xD800 <= charCode && charCode <= 0xDBFF);
    }
    exports.$Od = $Od;
    /**
     * See http://en.wikipedia.org/wiki/Surrogate_pair
     */
    function $Pd(charCode) {
        return (0xDC00 <= charCode && charCode <= 0xDFFF);
    }
    exports.$Pd = $Pd;
    /**
     * See http://en.wikipedia.org/wiki/Surrogate_pair
     */
    function $Qd(highSurrogate, lowSurrogate) {
        return ((highSurrogate - 0xD800) << 10) + (lowSurrogate - 0xDC00) + 0x10000;
    }
    exports.$Qd = $Qd;
    /**
     * get the code point that begins at offset `offset`
     */
    function $Rd(str, len, offset) {
        const charCode = str.charCodeAt(offset);
        if ($Od(charCode) && offset + 1 < len) {
            const nextCharCode = str.charCodeAt(offset + 1);
            if ($Pd(nextCharCode)) {
                return $Qd(charCode, nextCharCode);
            }
        }
        return charCode;
    }
    exports.$Rd = $Rd;
    /**
     * get the code point that ends right before offset `offset`
     */
    function getPrevCodePoint(str, offset) {
        const charCode = str.charCodeAt(offset - 1);
        if ($Pd(charCode) && offset > 1) {
            const prevCharCode = str.charCodeAt(offset - 2);
            if ($Od(prevCharCode)) {
                return $Qd(prevCharCode, charCode);
            }
        }
        return charCode;
    }
    class $Sd {
        get offset() {
            return this.e;
        }
        constructor(str, offset = 0) {
            this.c = str;
            this.d = str.length;
            this.e = offset;
        }
        setOffset(offset) {
            this.e = offset;
        }
        prevCodePoint() {
            const codePoint = getPrevCodePoint(this.c, this.e);
            this.e -= (codePoint >= 65536 /* Constants.UNICODE_SUPPLEMENTARY_PLANE_BEGIN */ ? 2 : 1);
            return codePoint;
        }
        nextCodePoint() {
            const codePoint = $Rd(this.c, this.d, this.e);
            this.e += (codePoint >= 65536 /* Constants.UNICODE_SUPPLEMENTARY_PLANE_BEGIN */ ? 2 : 1);
            return codePoint;
        }
        eol() {
            return (this.e >= this.d);
        }
    }
    exports.$Sd = $Sd;
    class $Td {
        get offset() {
            return this.c.offset;
        }
        constructor(str, offset = 0) {
            this.c = new $Sd(str, offset);
        }
        nextGraphemeLength() {
            const graphemeBreakTree = GraphemeBreakTree.getInstance();
            const iterator = this.c;
            const initialOffset = iterator.offset;
            let graphemeBreakType = graphemeBreakTree.getGraphemeBreakType(iterator.nextCodePoint());
            while (!iterator.eol()) {
                const offset = iterator.offset;
                const nextGraphemeBreakType = graphemeBreakTree.getGraphemeBreakType(iterator.nextCodePoint());
                if (breakBetweenGraphemeBreakType(graphemeBreakType, nextGraphemeBreakType)) {
                    // move iterator back
                    iterator.setOffset(offset);
                    break;
                }
                graphemeBreakType = nextGraphemeBreakType;
            }
            return (iterator.offset - initialOffset);
        }
        prevGraphemeLength() {
            const graphemeBreakTree = GraphemeBreakTree.getInstance();
            const iterator = this.c;
            const initialOffset = iterator.offset;
            let graphemeBreakType = graphemeBreakTree.getGraphemeBreakType(iterator.prevCodePoint());
            while (iterator.offset > 0) {
                const offset = iterator.offset;
                const prevGraphemeBreakType = graphemeBreakTree.getGraphemeBreakType(iterator.prevCodePoint());
                if (breakBetweenGraphemeBreakType(prevGraphemeBreakType, graphemeBreakType)) {
                    // move iterator back
                    iterator.setOffset(offset);
                    break;
                }
                graphemeBreakType = prevGraphemeBreakType;
            }
            return (initialOffset - iterator.offset);
        }
        eol() {
            return this.c.eol();
        }
    }
    exports.$Td = $Td;
    function $Ud(str, initialOffset) {
        const iterator = new $Td(str, initialOffset);
        return iterator.nextGraphemeLength();
    }
    exports.$Ud = $Ud;
    function $Vd(str, initialOffset) {
        const iterator = new $Td(str, initialOffset);
        return iterator.prevGraphemeLength();
    }
    exports.$Vd = $Vd;
    function $Wd(str, offset) {
        if (offset > 0 && $Pd(str.charCodeAt(offset))) {
            offset--;
        }
        const endOffset = offset + $Ud(str, offset);
        const startOffset = endOffset - $Vd(str, endOffset);
        return [startOffset, endOffset];
    }
    exports.$Wd = $Wd;
    function $Xd(str) {
        const iterator = new $Td(str);
        let length = 0;
        while (!iterator.eol()) {
            length++;
            iterator.nextGraphemeLength();
        }
        return length;
    }
    exports.$Xd = $Xd;
    let CONTAINS_RTL = undefined;
    function makeContainsRtl() {
        // Generated using https://github.com/alexdima/unicode-utils/blob/main/rtl-test.js
        return /(?:[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u0710\u0712-\u072F\u074D-\u07A5\u07B1-\u07EA\u07F4\u07F5\u07FA\u07FE-\u0815\u081A\u0824\u0828\u0830-\u0858\u085E-\u088E\u08A0-\u08C9\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFD3D\uFD50-\uFDC7\uFDF0-\uFDFC\uFE70-\uFEFC]|\uD802[\uDC00-\uDD1B\uDD20-\uDE00\uDE10-\uDE35\uDE40-\uDEE4\uDEEB-\uDF35\uDF40-\uDFFF]|\uD803[\uDC00-\uDD23\uDE80-\uDEA9\uDEAD-\uDF45\uDF51-\uDF81\uDF86-\uDFF6]|\uD83A[\uDC00-\uDCCF\uDD00-\uDD43\uDD4B-\uDFFF]|\uD83B[\uDC00-\uDEBB])/;
    }
    /**
     * Returns true if `str` contains any Unicode character that is classified as "R" or "AL".
     */
    function $Yd(str) {
        if (!CONTAINS_RTL) {
            CONTAINS_RTL = makeContainsRtl();
        }
        return CONTAINS_RTL.test(str);
    }
    exports.$Yd = $Yd;
    const IS_BASIC_ASCII = /^[\t\n\r\x20-\x7E]*$/;
    /**
     * Returns true if `str` contains only basic ASCII characters in the range 32 - 126 (including 32 and 126) or \n, \r, \t
     */
    function $Zd(str) {
        return IS_BASIC_ASCII.test(str);
    }
    exports.$Zd = $Zd;
    exports.$1d = /[\u2028\u2029]/; // LINE SEPARATOR (LS) or PARAGRAPH SEPARATOR (PS)
    /**
     * Returns true if `str` contains unusual line terminators, like LS or PS
     */
    function $2d(str) {
        return exports.$1d.test(str);
    }
    exports.$2d = $2d;
    function $3d(charCode) {
        // Do a cheap trick to better support wrapping of wide characters, treat them as 2 columns
        // http://jrgraphix.net/research/unicode_blocks.php
        //          2E80 - 2EFF   CJK Radicals Supplement
        //          2F00 - 2FDF   Kangxi Radicals
        //          2FF0 - 2FFF   Ideographic Description Characters
        //          3000 - 303F   CJK Symbols and Punctuation
        //          3040 - 309F   Hiragana
        //          30A0 - 30FF   Katakana
        //          3100 - 312F   Bopomofo
        //          3130 - 318F   Hangul Compatibility Jamo
        //          3190 - 319F   Kanbun
        //          31A0 - 31BF   Bopomofo Extended
        //          31F0 - 31FF   Katakana Phonetic Extensions
        //          3200 - 32FF   Enclosed CJK Letters and Months
        //          3300 - 33FF   CJK Compatibility
        //          3400 - 4DBF   CJK Unified Ideographs Extension A
        //          4DC0 - 4DFF   Yijing Hexagram Symbols
        //          4E00 - 9FFF   CJK Unified Ideographs
        //          A000 - A48F   Yi Syllables
        //          A490 - A4CF   Yi Radicals
        //          AC00 - D7AF   Hangul Syllables
        // [IGNORE] D800 - DB7F   High Surrogates
        // [IGNORE] DB80 - DBFF   High Private Use Surrogates
        // [IGNORE] DC00 - DFFF   Low Surrogates
        // [IGNORE] E000 - F8FF   Private Use Area
        //          F900 - FAFF   CJK Compatibility Ideographs
        // [IGNORE] FB00 - FB4F   Alphabetic Presentation Forms
        // [IGNORE] FB50 - FDFF   Arabic Presentation Forms-A
        // [IGNORE] FE00 - FE0F   Variation Selectors
        // [IGNORE] FE20 - FE2F   Combining Half Marks
        // [IGNORE] FE30 - FE4F   CJK Compatibility Forms
        // [IGNORE] FE50 - FE6F   Small Form Variants
        // [IGNORE] FE70 - FEFF   Arabic Presentation Forms-B
        //          FF00 - FFEF   Halfwidth and Fullwidth Forms
        //               [https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms]
        //               of which FF01 - FF5E fullwidth ASCII of 21 to 7E
        // [IGNORE]    and FF65 - FFDC halfwidth of Katakana and Hangul
        // [IGNORE] FFF0 - FFFF   Specials
        return ((charCode >= 0x2E80 && charCode <= 0xD7AF)
            || (charCode >= 0xF900 && charCode <= 0xFAFF)
            || (charCode >= 0xFF01 && charCode <= 0xFF5E));
    }
    exports.$3d = $3d;
    /**
     * A fast function (therefore imprecise) to check if code points are emojis.
     * Generated using https://github.com/alexdima/unicode-utils/blob/main/emoji-test.js
     */
    function $4d(x) {
        return ((x >= 0x1F1E6 && x <= 0x1F1FF) || (x === 8986) || (x === 8987) || (x === 9200)
            || (x === 9203) || (x >= 9728 && x <= 10175) || (x === 11088) || (x === 11093)
            || (x >= 127744 && x <= 128591) || (x >= 128640 && x <= 128764)
            || (x >= 128992 && x <= 129008) || (x >= 129280 && x <= 129535)
            || (x >= 129648 && x <= 129782));
    }
    exports.$4d = $4d;
    /**
     * Given a string and a max length returns a shorted version. Shorting
     * happens at favorable positions - such as whitespace or punctuation characters.
     */
    function $5d(text, n) {
        if (text.length < n) {
            return text;
        }
        const re = /\b/g;
        let i = 0;
        while (re.test(text)) {
            if (text.length - re.lastIndex < n) {
                break;
            }
            i = re.lastIndex;
            re.lastIndex += 1;
        }
        return text.substring(i).replace(/^\s/, '');
    }
    exports.$5d = $5d;
    // Escape codes, compiled from https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h3-Functions-using-CSI-_-ordered-by-the-final-character_s_
    const CSI_SEQUENCE = /(:?\x1b\[|\x9B)[=?>!]?[\d;:]*["$#'* ]?[a-zA-Z@^`{}|~]/g;
    // Plus additional markers for custom `\x1b]...\x07` instructions.
    const CSI_CUSTOM_SEQUENCE = /\x1b\].*?\x07/g;
    function $6d(str) {
        if (str) {
            str = str.replace(CSI_SEQUENCE, '').replace(CSI_CUSTOM_SEQUENCE, '');
        }
        return str;
    }
    exports.$6d = $6d;
    // -- UTF-8 BOM
    exports.$7d = String.fromCharCode(65279 /* CharCode.UTF8_BOM */);
    function $8d(str) {
        return !!(str && str.length > 0 && str.charCodeAt(0) === 65279 /* CharCode.UTF8_BOM */);
    }
    exports.$8d = $8d;
    function $9d(str) {
        return $8d(str) ? str.substr(1) : str;
    }
    exports.$9d = $9d;
    /**
     * Checks if the characters of the provided query string are included in the
     * target string. The characters do not have to be contiguous within the string.
     */
    function $0d(target, query) {
        if (!target || !query) {
            return false; // return early if target or query are undefined
        }
        if (target.length < query.length) {
            return false; // impossible for query to be contained in target
        }
        const queryLen = query.length;
        const targetLower = target.toLowerCase();
        let index = 0;
        let lastIndexOf = -1;
        while (index < queryLen) {
            const indexOf = targetLower.indexOf(query[index], lastIndexOf + 1);
            if (indexOf < 0) {
                return false;
            }
            lastIndexOf = indexOf;
            index++;
        }
        return true;
    }
    exports.$0d = $0d;
    function $$d(target, ignoreEscapedChars = false) {
        if (!target) {
            return false;
        }
        if (ignoreEscapedChars) {
            target = target.replace(/\\./g, '');
        }
        return target.toLowerCase() !== target;
    }
    exports.$$d = $$d;
    function $_d(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    exports.$_d = $_d;
    function $ae(str, n = 1) {
        if (n === 0) {
            return '';
        }
        let idx = -1;
        do {
            idx = str.indexOf('\n', idx + 1);
            n--;
        } while (n > 0 && idx >= 0);
        if (idx === -1) {
            return str;
        }
        if (str[idx - 1] === '\r') {
            idx--;
        }
        return str.substr(0, idx);
    }
    exports.$ae = $ae;
    /**
     * Produces 'a'-'z', followed by 'A'-'Z'... followed by 'a'-'z', etc.
     */
    function $be(n) {
        const LETTERS_CNT = (90 /* CharCode.Z */ - 65 /* CharCode.A */ + 1);
        n = n % (2 * LETTERS_CNT);
        if (n < LETTERS_CNT) {
            return String.fromCharCode(97 /* CharCode.a */ + n);
        }
        return String.fromCharCode(65 /* CharCode.A */ + n - LETTERS_CNT);
    }
    exports.$be = $be;
    //#region Unicode Grapheme Break
    function $ce(codePoint) {
        const graphemeBreakTree = GraphemeBreakTree.getInstance();
        return graphemeBreakTree.getGraphemeBreakType(codePoint);
    }
    exports.$ce = $ce;
    function breakBetweenGraphemeBreakType(breakTypeA, breakTypeB) {
        // http://www.unicode.org/reports/tr29/#Grapheme_Cluster_Boundary_Rules
        // !!! Let's make the common case a bit faster
        if (breakTypeA === 0 /* GraphemeBreakType.Other */) {
            // see https://www.unicode.org/Public/13.0.0/ucd/auxiliary/GraphemeBreakTest-13.0.0d10.html#table
            return (breakTypeB !== 5 /* GraphemeBreakType.Extend */ && breakTypeB !== 7 /* GraphemeBreakType.SpacingMark */);
        }
        // Do not break between a CR and LF. Otherwise, break before and after controls.
        // GB3                                        CR × LF
        // GB4                       (Control | CR | LF) ÷
        // GB5                                           ÷ (Control | CR | LF)
        if (breakTypeA === 2 /* GraphemeBreakType.CR */) {
            if (breakTypeB === 3 /* GraphemeBreakType.LF */) {
                return false; // GB3
            }
        }
        if (breakTypeA === 4 /* GraphemeBreakType.Control */ || breakTypeA === 2 /* GraphemeBreakType.CR */ || breakTypeA === 3 /* GraphemeBreakType.LF */) {
            return true; // GB4
        }
        if (breakTypeB === 4 /* GraphemeBreakType.Control */ || breakTypeB === 2 /* GraphemeBreakType.CR */ || breakTypeB === 3 /* GraphemeBreakType.LF */) {
            return true; // GB5
        }
        // Do not break Hangul syllable sequences.
        // GB6                                         L × (L | V | LV | LVT)
        // GB7                                  (LV | V) × (V | T)
        // GB8                                 (LVT | T) × T
        if (breakTypeA === 8 /* GraphemeBreakType.L */) {
            if (breakTypeB === 8 /* GraphemeBreakType.L */ || breakTypeB === 9 /* GraphemeBreakType.V */ || breakTypeB === 11 /* GraphemeBreakType.LV */ || breakTypeB === 12 /* GraphemeBreakType.LVT */) {
                return false; // GB6
            }
        }
        if (breakTypeA === 11 /* GraphemeBreakType.LV */ || breakTypeA === 9 /* GraphemeBreakType.V */) {
            if (breakTypeB === 9 /* GraphemeBreakType.V */ || breakTypeB === 10 /* GraphemeBreakType.T */) {
                return false; // GB7
            }
        }
        if (breakTypeA === 12 /* GraphemeBreakType.LVT */ || breakTypeA === 10 /* GraphemeBreakType.T */) {
            if (breakTypeB === 10 /* GraphemeBreakType.T */) {
                return false; // GB8
            }
        }
        // Do not break before extending characters or ZWJ.
        // GB9                                           × (Extend | ZWJ)
        if (breakTypeB === 5 /* GraphemeBreakType.Extend */ || breakTypeB === 13 /* GraphemeBreakType.ZWJ */) {
            return false; // GB9
        }
        // The GB9a and GB9b rules only apply to extended grapheme clusters:
        // Do not break before SpacingMarks, or after Prepend characters.
        // GB9a                                          × SpacingMark
        // GB9b                                  Prepend ×
        if (breakTypeB === 7 /* GraphemeBreakType.SpacingMark */) {
            return false; // GB9a
        }
        if (breakTypeA === 1 /* GraphemeBreakType.Prepend */) {
            return false; // GB9b
        }
        // Do not break within emoji modifier sequences or emoji zwj sequences.
        // GB11    \p{Extended_Pictographic} Extend* ZWJ × \p{Extended_Pictographic}
        if (breakTypeA === 13 /* GraphemeBreakType.ZWJ */ && breakTypeB === 14 /* GraphemeBreakType.Extended_Pictographic */) {
            // Note: we are not implementing the rule entirely here to avoid introducing states
            return false; // GB11
        }
        // GB12                          sot (RI RI)* RI × RI
        // GB13                        [^RI] (RI RI)* RI × RI
        if (breakTypeA === 6 /* GraphemeBreakType.Regional_Indicator */ && breakTypeB === 6 /* GraphemeBreakType.Regional_Indicator */) {
            // Note: we are not implementing the rule entirely here to avoid introducing states
            return false; // GB12 & GB13
        }
        // GB999                                     Any ÷ Any
        return true;
    }
    var GraphemeBreakType;
    (function (GraphemeBreakType) {
        GraphemeBreakType[GraphemeBreakType["Other"] = 0] = "Other";
        GraphemeBreakType[GraphemeBreakType["Prepend"] = 1] = "Prepend";
        GraphemeBreakType[GraphemeBreakType["CR"] = 2] = "CR";
        GraphemeBreakType[GraphemeBreakType["LF"] = 3] = "LF";
        GraphemeBreakType[GraphemeBreakType["Control"] = 4] = "Control";
        GraphemeBreakType[GraphemeBreakType["Extend"] = 5] = "Extend";
        GraphemeBreakType[GraphemeBreakType["Regional_Indicator"] = 6] = "Regional_Indicator";
        GraphemeBreakType[GraphemeBreakType["SpacingMark"] = 7] = "SpacingMark";
        GraphemeBreakType[GraphemeBreakType["L"] = 8] = "L";
        GraphemeBreakType[GraphemeBreakType["V"] = 9] = "V";
        GraphemeBreakType[GraphemeBreakType["T"] = 10] = "T";
        GraphemeBreakType[GraphemeBreakType["LV"] = 11] = "LV";
        GraphemeBreakType[GraphemeBreakType["LVT"] = 12] = "LVT";
        GraphemeBreakType[GraphemeBreakType["ZWJ"] = 13] = "ZWJ";
        GraphemeBreakType[GraphemeBreakType["Extended_Pictographic"] = 14] = "Extended_Pictographic";
    })(GraphemeBreakType || (exports.GraphemeBreakType = GraphemeBreakType = {}));
    class GraphemeBreakTree {
        static { this.c = null; }
        static getInstance() {
            if (!GraphemeBreakTree.c) {
                GraphemeBreakTree.c = new GraphemeBreakTree();
            }
            return GraphemeBreakTree.c;
        }
        constructor() {
            this.d = getGraphemeBreakRawData();
        }
        getGraphemeBreakType(codePoint) {
            // !!! Let's make 7bit ASCII a bit faster: 0..31
            if (codePoint < 32) {
                if (codePoint === 10 /* CharCode.LineFeed */) {
                    return 3 /* GraphemeBreakType.LF */;
                }
                if (codePoint === 13 /* CharCode.CarriageReturn */) {
                    return 2 /* GraphemeBreakType.CR */;
                }
                return 4 /* GraphemeBreakType.Control */;
            }
            // !!! Let's make 7bit ASCII a bit faster: 32..126
            if (codePoint < 127) {
                return 0 /* GraphemeBreakType.Other */;
            }
            const data = this.d;
            const nodeCount = data.length / 3;
            let nodeIndex = 1;
            while (nodeIndex <= nodeCount) {
                if (codePoint < data[3 * nodeIndex]) {
                    // go left
                    nodeIndex = 2 * nodeIndex;
                }
                else if (codePoint > data[3 * nodeIndex + 1]) {
                    // go right
                    nodeIndex = 2 * nodeIndex + 1;
                }
                else {
                    // hit
                    return data[3 * nodeIndex + 2];
                }
            }
            return 0 /* GraphemeBreakType.Other */;
        }
    }
    function getGraphemeBreakRawData() {
        // generated using https://github.com/alexdima/unicode-utils/blob/main/grapheme-break.js
        return JSON.parse('[0,0,0,51229,51255,12,44061,44087,12,127462,127487,6,7083,7085,5,47645,47671,12,54813,54839,12,128678,128678,14,3270,3270,5,9919,9923,14,45853,45879,12,49437,49463,12,53021,53047,12,71216,71218,7,128398,128399,14,129360,129374,14,2519,2519,5,4448,4519,9,9742,9742,14,12336,12336,14,44957,44983,12,46749,46775,12,48541,48567,12,50333,50359,12,52125,52151,12,53917,53943,12,69888,69890,5,73018,73018,5,127990,127990,14,128558,128559,14,128759,128760,14,129653,129655,14,2027,2035,5,2891,2892,7,3761,3761,5,6683,6683,5,8293,8293,4,9825,9826,14,9999,9999,14,43452,43453,5,44509,44535,12,45405,45431,12,46301,46327,12,47197,47223,12,48093,48119,12,48989,49015,12,49885,49911,12,50781,50807,12,51677,51703,12,52573,52599,12,53469,53495,12,54365,54391,12,65279,65279,4,70471,70472,7,72145,72147,7,119173,119179,5,127799,127818,14,128240,128244,14,128512,128512,14,128652,128652,14,128721,128722,14,129292,129292,14,129445,129450,14,129734,129743,14,1476,1477,5,2366,2368,7,2750,2752,7,3076,3076,5,3415,3415,5,4141,4144,5,6109,6109,5,6964,6964,5,7394,7400,5,9197,9198,14,9770,9770,14,9877,9877,14,9968,9969,14,10084,10084,14,43052,43052,5,43713,43713,5,44285,44311,12,44733,44759,12,45181,45207,12,45629,45655,12,46077,46103,12,46525,46551,12,46973,46999,12,47421,47447,12,47869,47895,12,48317,48343,12,48765,48791,12,49213,49239,12,49661,49687,12,50109,50135,12,50557,50583,12,51005,51031,12,51453,51479,12,51901,51927,12,52349,52375,12,52797,52823,12,53245,53271,12,53693,53719,12,54141,54167,12,54589,54615,12,55037,55063,12,69506,69509,5,70191,70193,5,70841,70841,7,71463,71467,5,72330,72342,5,94031,94031,5,123628,123631,5,127763,127765,14,127941,127941,14,128043,128062,14,128302,128317,14,128465,128467,14,128539,128539,14,128640,128640,14,128662,128662,14,128703,128703,14,128745,128745,14,129004,129007,14,129329,129330,14,129402,129402,14,129483,129483,14,129686,129704,14,130048,131069,14,173,173,4,1757,1757,1,2200,2207,5,2434,2435,7,2631,2632,5,2817,2817,5,3008,3008,5,3201,3201,5,3387,3388,5,3542,3542,5,3902,3903,7,4190,4192,5,6002,6003,5,6439,6440,5,6765,6770,7,7019,7027,5,7154,7155,7,8205,8205,13,8505,8505,14,9654,9654,14,9757,9757,14,9792,9792,14,9852,9853,14,9890,9894,14,9937,9937,14,9981,9981,14,10035,10036,14,11035,11036,14,42654,42655,5,43346,43347,7,43587,43587,5,44006,44007,7,44173,44199,12,44397,44423,12,44621,44647,12,44845,44871,12,45069,45095,12,45293,45319,12,45517,45543,12,45741,45767,12,45965,45991,12,46189,46215,12,46413,46439,12,46637,46663,12,46861,46887,12,47085,47111,12,47309,47335,12,47533,47559,12,47757,47783,12,47981,48007,12,48205,48231,12,48429,48455,12,48653,48679,12,48877,48903,12,49101,49127,12,49325,49351,12,49549,49575,12,49773,49799,12,49997,50023,12,50221,50247,12,50445,50471,12,50669,50695,12,50893,50919,12,51117,51143,12,51341,51367,12,51565,51591,12,51789,51815,12,52013,52039,12,52237,52263,12,52461,52487,12,52685,52711,12,52909,52935,12,53133,53159,12,53357,53383,12,53581,53607,12,53805,53831,12,54029,54055,12,54253,54279,12,54477,54503,12,54701,54727,12,54925,54951,12,55149,55175,12,68101,68102,5,69762,69762,7,70067,70069,7,70371,70378,5,70720,70721,7,71087,71087,5,71341,71341,5,71995,71996,5,72249,72249,7,72850,72871,5,73109,73109,5,118576,118598,5,121505,121519,5,127245,127247,14,127568,127569,14,127777,127777,14,127872,127891,14,127956,127967,14,128015,128016,14,128110,128172,14,128259,128259,14,128367,128368,14,128424,128424,14,128488,128488,14,128530,128532,14,128550,128551,14,128566,128566,14,128647,128647,14,128656,128656,14,128667,128673,14,128691,128693,14,128715,128715,14,128728,128732,14,128752,128752,14,128765,128767,14,129096,129103,14,129311,129311,14,129344,129349,14,129394,129394,14,129413,129425,14,129466,129471,14,129511,129535,14,129664,129666,14,129719,129722,14,129760,129767,14,917536,917631,5,13,13,2,1160,1161,5,1564,1564,4,1807,1807,1,2085,2087,5,2307,2307,7,2382,2383,7,2497,2500,5,2563,2563,7,2677,2677,5,2763,2764,7,2879,2879,5,2914,2915,5,3021,3021,5,3142,3144,5,3263,3263,5,3285,3286,5,3398,3400,7,3530,3530,5,3633,3633,5,3864,3865,5,3974,3975,5,4155,4156,7,4229,4230,5,5909,5909,7,6078,6085,7,6277,6278,5,6451,6456,7,6744,6750,5,6846,6846,5,6972,6972,5,7074,7077,5,7146,7148,7,7222,7223,5,7416,7417,5,8234,8238,4,8417,8417,5,9000,9000,14,9203,9203,14,9730,9731,14,9748,9749,14,9762,9763,14,9776,9783,14,9800,9811,14,9831,9831,14,9872,9873,14,9882,9882,14,9900,9903,14,9929,9933,14,9941,9960,14,9974,9974,14,9989,9989,14,10006,10006,14,10062,10062,14,10160,10160,14,11647,11647,5,12953,12953,14,43019,43019,5,43232,43249,5,43443,43443,5,43567,43568,7,43696,43696,5,43765,43765,7,44013,44013,5,44117,44143,12,44229,44255,12,44341,44367,12,44453,44479,12,44565,44591,12,44677,44703,12,44789,44815,12,44901,44927,12,45013,45039,12,45125,45151,12,45237,45263,12,45349,45375,12,45461,45487,12,45573,45599,12,45685,45711,12,45797,45823,12,45909,45935,12,46021,46047,12,46133,46159,12,46245,46271,12,46357,46383,12,46469,46495,12,46581,46607,12,46693,46719,12,46805,46831,12,46917,46943,12,47029,47055,12,47141,47167,12,47253,47279,12,47365,47391,12,47477,47503,12,47589,47615,12,47701,47727,12,47813,47839,12,47925,47951,12,48037,48063,12,48149,48175,12,48261,48287,12,48373,48399,12,48485,48511,12,48597,48623,12,48709,48735,12,48821,48847,12,48933,48959,12,49045,49071,12,49157,49183,12,49269,49295,12,49381,49407,12,49493,49519,12,49605,49631,12,49717,49743,12,49829,49855,12,49941,49967,12,50053,50079,12,50165,50191,12,50277,50303,12,50389,50415,12,50501,50527,12,50613,50639,12,50725,50751,12,50837,50863,12,50949,50975,12,51061,51087,12,51173,51199,12,51285,51311,12,51397,51423,12,51509,51535,12,51621,51647,12,51733,51759,12,51845,51871,12,51957,51983,12,52069,52095,12,52181,52207,12,52293,52319,12,52405,52431,12,52517,52543,12,52629,52655,12,52741,52767,12,52853,52879,12,52965,52991,12,53077,53103,12,53189,53215,12,53301,53327,12,53413,53439,12,53525,53551,12,53637,53663,12,53749,53775,12,53861,53887,12,53973,53999,12,54085,54111,12,54197,54223,12,54309,54335,12,54421,54447,12,54533,54559,12,54645,54671,12,54757,54783,12,54869,54895,12,54981,55007,12,55093,55119,12,55243,55291,10,66045,66045,5,68325,68326,5,69688,69702,5,69817,69818,5,69957,69958,7,70089,70092,5,70198,70199,5,70462,70462,5,70502,70508,5,70750,70750,5,70846,70846,7,71100,71101,5,71230,71230,7,71351,71351,5,71737,71738,5,72000,72000,7,72160,72160,5,72273,72278,5,72752,72758,5,72882,72883,5,73031,73031,5,73461,73462,7,94192,94193,7,119149,119149,7,121403,121452,5,122915,122916,5,126980,126980,14,127358,127359,14,127535,127535,14,127759,127759,14,127771,127771,14,127792,127793,14,127825,127867,14,127897,127899,14,127945,127945,14,127985,127986,14,128000,128007,14,128021,128021,14,128066,128100,14,128184,128235,14,128249,128252,14,128266,128276,14,128335,128335,14,128379,128390,14,128407,128419,14,128444,128444,14,128481,128481,14,128499,128499,14,128526,128526,14,128536,128536,14,128543,128543,14,128556,128556,14,128564,128564,14,128577,128580,14,128643,128645,14,128649,128649,14,128654,128654,14,128660,128660,14,128664,128664,14,128675,128675,14,128686,128689,14,128695,128696,14,128705,128709,14,128717,128719,14,128725,128725,14,128736,128741,14,128747,128748,14,128755,128755,14,128762,128762,14,128981,128991,14,129009,129023,14,129160,129167,14,129296,129304,14,129320,129327,14,129340,129342,14,129356,129356,14,129388,129392,14,129399,129400,14,129404,129407,14,129432,129442,14,129454,129455,14,129473,129474,14,129485,129487,14,129648,129651,14,129659,129660,14,129671,129679,14,129709,129711,14,129728,129730,14,129751,129753,14,129776,129782,14,917505,917505,4,917760,917999,5,10,10,3,127,159,4,768,879,5,1471,1471,5,1536,1541,1,1648,1648,5,1767,1768,5,1840,1866,5,2070,2073,5,2137,2139,5,2274,2274,1,2363,2363,7,2377,2380,7,2402,2403,5,2494,2494,5,2507,2508,7,2558,2558,5,2622,2624,7,2641,2641,5,2691,2691,7,2759,2760,5,2786,2787,5,2876,2876,5,2881,2884,5,2901,2902,5,3006,3006,5,3014,3016,7,3072,3072,5,3134,3136,5,3157,3158,5,3260,3260,5,3266,3266,5,3274,3275,7,3328,3329,5,3391,3392,7,3405,3405,5,3457,3457,5,3536,3537,7,3551,3551,5,3636,3642,5,3764,3772,5,3895,3895,5,3967,3967,7,3993,4028,5,4146,4151,5,4182,4183,7,4226,4226,5,4253,4253,5,4957,4959,5,5940,5940,7,6070,6070,7,6087,6088,7,6158,6158,4,6432,6434,5,6448,6449,7,6679,6680,5,6742,6742,5,6754,6754,5,6783,6783,5,6912,6915,5,6966,6970,5,6978,6978,5,7042,7042,7,7080,7081,5,7143,7143,7,7150,7150,7,7212,7219,5,7380,7392,5,7412,7412,5,8203,8203,4,8232,8232,4,8265,8265,14,8400,8412,5,8421,8432,5,8617,8618,14,9167,9167,14,9200,9200,14,9410,9410,14,9723,9726,14,9733,9733,14,9745,9745,14,9752,9752,14,9760,9760,14,9766,9766,14,9774,9774,14,9786,9786,14,9794,9794,14,9823,9823,14,9828,9828,14,9833,9850,14,9855,9855,14,9875,9875,14,9880,9880,14,9885,9887,14,9896,9897,14,9906,9916,14,9926,9927,14,9935,9935,14,9939,9939,14,9962,9962,14,9972,9972,14,9978,9978,14,9986,9986,14,9997,9997,14,10002,10002,14,10017,10017,14,10055,10055,14,10071,10071,14,10133,10135,14,10548,10549,14,11093,11093,14,12330,12333,5,12441,12442,5,42608,42610,5,43010,43010,5,43045,43046,5,43188,43203,7,43302,43309,5,43392,43394,5,43446,43449,5,43493,43493,5,43571,43572,7,43597,43597,7,43703,43704,5,43756,43757,5,44003,44004,7,44009,44010,7,44033,44059,12,44089,44115,12,44145,44171,12,44201,44227,12,44257,44283,12,44313,44339,12,44369,44395,12,44425,44451,12,44481,44507,12,44537,44563,12,44593,44619,12,44649,44675,12,44705,44731,12,44761,44787,12,44817,44843,12,44873,44899,12,44929,44955,12,44985,45011,12,45041,45067,12,45097,45123,12,45153,45179,12,45209,45235,12,45265,45291,12,45321,45347,12,45377,45403,12,45433,45459,12,45489,45515,12,45545,45571,12,45601,45627,12,45657,45683,12,45713,45739,12,45769,45795,12,45825,45851,12,45881,45907,12,45937,45963,12,45993,46019,12,46049,46075,12,46105,46131,12,46161,46187,12,46217,46243,12,46273,46299,12,46329,46355,12,46385,46411,12,46441,46467,12,46497,46523,12,46553,46579,12,46609,46635,12,46665,46691,12,46721,46747,12,46777,46803,12,46833,46859,12,46889,46915,12,46945,46971,12,47001,47027,12,47057,47083,12,47113,47139,12,47169,47195,12,47225,47251,12,47281,47307,12,47337,47363,12,47393,47419,12,47449,47475,12,47505,47531,12,47561,47587,12,47617,47643,12,47673,47699,12,47729,47755,12,47785,47811,12,47841,47867,12,47897,47923,12,47953,47979,12,48009,48035,12,48065,48091,12,48121,48147,12,48177,48203,12,48233,48259,12,48289,48315,12,48345,48371,12,48401,48427,12,48457,48483,12,48513,48539,12,48569,48595,12,48625,48651,12,48681,48707,12,48737,48763,12,48793,48819,12,48849,48875,12,48905,48931,12,48961,48987,12,49017,49043,12,49073,49099,12,49129,49155,12,49185,49211,12,49241,49267,12,49297,49323,12,49353,49379,12,49409,49435,12,49465,49491,12,49521,49547,12,49577,49603,12,49633,49659,12,49689,49715,12,49745,49771,12,49801,49827,12,49857,49883,12,49913,49939,12,49969,49995,12,50025,50051,12,50081,50107,12,50137,50163,12,50193,50219,12,50249,50275,12,50305,50331,12,50361,50387,12,50417,50443,12,50473,50499,12,50529,50555,12,50585,50611,12,50641,50667,12,50697,50723,12,50753,50779,12,50809,50835,12,50865,50891,12,50921,50947,12,50977,51003,12,51033,51059,12,51089,51115,12,51145,51171,12,51201,51227,12,51257,51283,12,51313,51339,12,51369,51395,12,51425,51451,12,51481,51507,12,51537,51563,12,51593,51619,12,51649,51675,12,51705,51731,12,51761,51787,12,51817,51843,12,51873,51899,12,51929,51955,12,51985,52011,12,52041,52067,12,52097,52123,12,52153,52179,12,52209,52235,12,52265,52291,12,52321,52347,12,52377,52403,12,52433,52459,12,52489,52515,12,52545,52571,12,52601,52627,12,52657,52683,12,52713,52739,12,52769,52795,12,52825,52851,12,52881,52907,12,52937,52963,12,52993,53019,12,53049,53075,12,53105,53131,12,53161,53187,12,53217,53243,12,53273,53299,12,53329,53355,12,53385,53411,12,53441,53467,12,53497,53523,12,53553,53579,12,53609,53635,12,53665,53691,12,53721,53747,12,53777,53803,12,53833,53859,12,53889,53915,12,53945,53971,12,54001,54027,12,54057,54083,12,54113,54139,12,54169,54195,12,54225,54251,12,54281,54307,12,54337,54363,12,54393,54419,12,54449,54475,12,54505,54531,12,54561,54587,12,54617,54643,12,54673,54699,12,54729,54755,12,54785,54811,12,54841,54867,12,54897,54923,12,54953,54979,12,55009,55035,12,55065,55091,12,55121,55147,12,55177,55203,12,65024,65039,5,65520,65528,4,66422,66426,5,68152,68154,5,69291,69292,5,69633,69633,5,69747,69748,5,69811,69814,5,69826,69826,5,69932,69932,7,70016,70017,5,70079,70080,7,70095,70095,5,70196,70196,5,70367,70367,5,70402,70403,7,70464,70464,5,70487,70487,5,70709,70711,7,70725,70725,7,70833,70834,7,70843,70844,7,70849,70849,7,71090,71093,5,71103,71104,5,71227,71228,7,71339,71339,5,71344,71349,5,71458,71461,5,71727,71735,5,71985,71989,7,71998,71998,5,72002,72002,7,72154,72155,5,72193,72202,5,72251,72254,5,72281,72283,5,72344,72345,5,72766,72766,7,72874,72880,5,72885,72886,5,73023,73029,5,73104,73105,5,73111,73111,5,92912,92916,5,94095,94098,5,113824,113827,4,119142,119142,7,119155,119162,4,119362,119364,5,121476,121476,5,122888,122904,5,123184,123190,5,125252,125258,5,127183,127183,14,127340,127343,14,127377,127386,14,127491,127503,14,127548,127551,14,127744,127756,14,127761,127761,14,127769,127769,14,127773,127774,14,127780,127788,14,127796,127797,14,127820,127823,14,127869,127869,14,127894,127895,14,127902,127903,14,127943,127943,14,127947,127950,14,127972,127972,14,127988,127988,14,127992,127994,14,128009,128011,14,128019,128019,14,128023,128041,14,128064,128064,14,128102,128107,14,128174,128181,14,128238,128238,14,128246,128247,14,128254,128254,14,128264,128264,14,128278,128299,14,128329,128330,14,128348,128359,14,128371,128377,14,128392,128393,14,128401,128404,14,128421,128421,14,128433,128434,14,128450,128452,14,128476,128478,14,128483,128483,14,128495,128495,14,128506,128506,14,128519,128520,14,128528,128528,14,128534,128534,14,128538,128538,14,128540,128542,14,128544,128549,14,128552,128555,14,128557,128557,14,128560,128563,14,128565,128565,14,128567,128576,14,128581,128591,14,128641,128642,14,128646,128646,14,128648,128648,14,128650,128651,14,128653,128653,14,128655,128655,14,128657,128659,14,128661,128661,14,128663,128663,14,128665,128666,14,128674,128674,14,128676,128677,14,128679,128685,14,128690,128690,14,128694,128694,14,128697,128702,14,128704,128704,14,128710,128714,14,128716,128716,14,128720,128720,14,128723,128724,14,128726,128727,14,128733,128735,14,128742,128744,14,128746,128746,14,128749,128751,14,128753,128754,14,128756,128758,14,128761,128761,14,128763,128764,14,128884,128895,14,128992,129003,14,129008,129008,14,129036,129039,14,129114,129119,14,129198,129279,14,129293,129295,14,129305,129310,14,129312,129319,14,129328,129328,14,129331,129338,14,129343,129343,14,129351,129355,14,129357,129359,14,129375,129387,14,129393,129393,14,129395,129398,14,129401,129401,14,129403,129403,14,129408,129412,14,129426,129431,14,129443,129444,14,129451,129453,14,129456,129465,14,129472,129472,14,129475,129482,14,129484,129484,14,129488,129510,14,129536,129647,14,129652,129652,14,129656,129658,14,129661,129663,14,129667,129670,14,129680,129685,14,129705,129708,14,129712,129718,14,129723,129727,14,129731,129733,14,129744,129750,14,129754,129759,14,129768,129775,14,129783,129791,14,917504,917504,4,917506,917535,4,917632,917759,4,918000,921599,4,0,9,4,11,12,4,14,31,4,169,169,14,174,174,14,1155,1159,5,1425,1469,5,1473,1474,5,1479,1479,5,1552,1562,5,1611,1631,5,1750,1756,5,1759,1764,5,1770,1773,5,1809,1809,5,1958,1968,5,2045,2045,5,2075,2083,5,2089,2093,5,2192,2193,1,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2433,2433,5,2492,2492,5,2495,2496,7,2503,2504,7,2509,2509,5,2530,2531,5,2561,2562,5,2620,2620,5,2625,2626,5,2635,2637,5,2672,2673,5,2689,2690,5,2748,2748,5,2753,2757,5,2761,2761,7,2765,2765,5,2810,2815,5,2818,2819,7,2878,2878,5,2880,2880,7,2887,2888,7,2893,2893,5,2903,2903,5,2946,2946,5,3007,3007,7,3009,3010,7,3018,3020,7,3031,3031,5,3073,3075,7,3132,3132,5,3137,3140,7,3146,3149,5,3170,3171,5,3202,3203,7,3262,3262,7,3264,3265,7,3267,3268,7,3271,3272,7,3276,3277,5,3298,3299,5,3330,3331,7,3390,3390,5,3393,3396,5,3402,3404,7,3406,3406,1,3426,3427,5,3458,3459,7,3535,3535,5,3538,3540,5,3544,3550,7,3570,3571,7,3635,3635,7,3655,3662,5,3763,3763,7,3784,3789,5,3893,3893,5,3897,3897,5,3953,3966,5,3968,3972,5,3981,3991,5,4038,4038,5,4145,4145,7,4153,4154,5,4157,4158,5,4184,4185,5,4209,4212,5,4228,4228,7,4237,4237,5,4352,4447,8,4520,4607,10,5906,5908,5,5938,5939,5,5970,5971,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6155,6157,5,6159,6159,5,6313,6313,5,6435,6438,7,6441,6443,7,6450,6450,5,6457,6459,5,6681,6682,7,6741,6741,7,6743,6743,7,6752,6752,5,6757,6764,5,6771,6780,5,6832,6845,5,6847,6862,5,6916,6916,7,6965,6965,5,6971,6971,7,6973,6977,7,6979,6980,7,7040,7041,5,7073,7073,7,7078,7079,7,7082,7082,7,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7204,7211,7,7220,7221,7,7376,7378,5,7393,7393,7,7405,7405,5,7415,7415,7,7616,7679,5,8204,8204,5,8206,8207,4,8233,8233,4,8252,8252,14,8288,8292,4,8294,8303,4,8413,8416,5,8418,8420,5,8482,8482,14,8596,8601,14,8986,8987,14,9096,9096,14,9193,9196,14,9199,9199,14,9201,9202,14,9208,9210,14,9642,9643,14,9664,9664,14,9728,9729,14,9732,9732,14,9735,9741,14,9743,9744,14,9746,9746,14,9750,9751,14,9753,9756,14,9758,9759,14,9761,9761,14,9764,9765,14,9767,9769,14,9771,9773,14,9775,9775,14,9784,9785,14,9787,9791,14,9793,9793,14,9795,9799,14,9812,9822,14,9824,9824,14,9827,9827,14,9829,9830,14,9832,9832,14,9851,9851,14,9854,9854,14,9856,9861,14,9874,9874,14,9876,9876,14,9878,9879,14,9881,9881,14,9883,9884,14,9888,9889,14,9895,9895,14,9898,9899,14,9904,9905,14,9917,9918,14,9924,9925,14,9928,9928,14,9934,9934,14,9936,9936,14,9938,9938,14,9940,9940,14,9961,9961,14,9963,9967,14,9970,9971,14,9973,9973,14,9975,9977,14,9979,9980,14,9982,9985,14,9987,9988,14,9992,9996,14,9998,9998,14,10000,10001,14,10004,10004,14,10013,10013,14,10024,10024,14,10052,10052,14,10060,10060,14,10067,10069,14,10083,10083,14,10085,10087,14,10145,10145,14,10175,10175,14,11013,11015,14,11088,11088,14,11503,11505,5,11744,11775,5,12334,12335,5,12349,12349,14,12951,12951,14,42607,42607,5,42612,42621,5,42736,42737,5,43014,43014,5,43043,43044,7,43047,43047,7,43136,43137,7,43204,43205,5,43263,43263,5,43335,43345,5,43360,43388,8,43395,43395,7,43444,43445,7,43450,43451,7,43454,43456,7,43561,43566,5,43569,43570,5,43573,43574,5,43596,43596,5,43644,43644,5,43698,43700,5,43710,43711,5,43755,43755,7,43758,43759,7,43766,43766,5,44005,44005,5,44008,44008,5,44012,44012,7,44032,44032,11,44060,44060,11,44088,44088,11,44116,44116,11,44144,44144,11,44172,44172,11,44200,44200,11,44228,44228,11,44256,44256,11,44284,44284,11,44312,44312,11,44340,44340,11,44368,44368,11,44396,44396,11,44424,44424,11,44452,44452,11,44480,44480,11,44508,44508,11,44536,44536,11,44564,44564,11,44592,44592,11,44620,44620,11,44648,44648,11,44676,44676,11,44704,44704,11,44732,44732,11,44760,44760,11,44788,44788,11,44816,44816,11,44844,44844,11,44872,44872,11,44900,44900,11,44928,44928,11,44956,44956,11,44984,44984,11,45012,45012,11,45040,45040,11,45068,45068,11,45096,45096,11,45124,45124,11,45152,45152,11,45180,45180,11,45208,45208,11,45236,45236,11,45264,45264,11,45292,45292,11,45320,45320,11,45348,45348,11,45376,45376,11,45404,45404,11,45432,45432,11,45460,45460,11,45488,45488,11,45516,45516,11,45544,45544,11,45572,45572,11,45600,45600,11,45628,45628,11,45656,45656,11,45684,45684,11,45712,45712,11,45740,45740,11,45768,45768,11,45796,45796,11,45824,45824,11,45852,45852,11,45880,45880,11,45908,45908,11,45936,45936,11,45964,45964,11,45992,45992,11,46020,46020,11,46048,46048,11,46076,46076,11,46104,46104,11,46132,46132,11,46160,46160,11,46188,46188,11,46216,46216,11,46244,46244,11,46272,46272,11,46300,46300,11,46328,46328,11,46356,46356,11,46384,46384,11,46412,46412,11,46440,46440,11,46468,46468,11,46496,46496,11,46524,46524,11,46552,46552,11,46580,46580,11,46608,46608,11,46636,46636,11,46664,46664,11,46692,46692,11,46720,46720,11,46748,46748,11,46776,46776,11,46804,46804,11,46832,46832,11,46860,46860,11,46888,46888,11,46916,46916,11,46944,46944,11,46972,46972,11,47000,47000,11,47028,47028,11,47056,47056,11,47084,47084,11,47112,47112,11,47140,47140,11,47168,47168,11,47196,47196,11,47224,47224,11,47252,47252,11,47280,47280,11,47308,47308,11,47336,47336,11,47364,47364,11,47392,47392,11,47420,47420,11,47448,47448,11,47476,47476,11,47504,47504,11,47532,47532,11,47560,47560,11,47588,47588,11,47616,47616,11,47644,47644,11,47672,47672,11,47700,47700,11,47728,47728,11,47756,47756,11,47784,47784,11,47812,47812,11,47840,47840,11,47868,47868,11,47896,47896,11,47924,47924,11,47952,47952,11,47980,47980,11,48008,48008,11,48036,48036,11,48064,48064,11,48092,48092,11,48120,48120,11,48148,48148,11,48176,48176,11,48204,48204,11,48232,48232,11,48260,48260,11,48288,48288,11,48316,48316,11,48344,48344,11,48372,48372,11,48400,48400,11,48428,48428,11,48456,48456,11,48484,48484,11,48512,48512,11,48540,48540,11,48568,48568,11,48596,48596,11,48624,48624,11,48652,48652,11,48680,48680,11,48708,48708,11,48736,48736,11,48764,48764,11,48792,48792,11,48820,48820,11,48848,48848,11,48876,48876,11,48904,48904,11,48932,48932,11,48960,48960,11,48988,48988,11,49016,49016,11,49044,49044,11,49072,49072,11,49100,49100,11,49128,49128,11,49156,49156,11,49184,49184,11,49212,49212,11,49240,49240,11,49268,49268,11,49296,49296,11,49324,49324,11,49352,49352,11,49380,49380,11,49408,49408,11,49436,49436,11,49464,49464,11,49492,49492,11,49520,49520,11,49548,49548,11,49576,49576,11,49604,49604,11,49632,49632,11,49660,49660,11,49688,49688,11,49716,49716,11,49744,49744,11,49772,49772,11,49800,49800,11,49828,49828,11,49856,49856,11,49884,49884,11,49912,49912,11,49940,49940,11,49968,49968,11,49996,49996,11,50024,50024,11,50052,50052,11,50080,50080,11,50108,50108,11,50136,50136,11,50164,50164,11,50192,50192,11,50220,50220,11,50248,50248,11,50276,50276,11,50304,50304,11,50332,50332,11,50360,50360,11,50388,50388,11,50416,50416,11,50444,50444,11,50472,50472,11,50500,50500,11,50528,50528,11,50556,50556,11,50584,50584,11,50612,50612,11,50640,50640,11,50668,50668,11,50696,50696,11,50724,50724,11,50752,50752,11,50780,50780,11,50808,50808,11,50836,50836,11,50864,50864,11,50892,50892,11,50920,50920,11,50948,50948,11,50976,50976,11,51004,51004,11,51032,51032,11,51060,51060,11,51088,51088,11,51116,51116,11,51144,51144,11,51172,51172,11,51200,51200,11,51228,51228,11,51256,51256,11,51284,51284,11,51312,51312,11,51340,51340,11,51368,51368,11,51396,51396,11,51424,51424,11,51452,51452,11,51480,51480,11,51508,51508,11,51536,51536,11,51564,51564,11,51592,51592,11,51620,51620,11,51648,51648,11,51676,51676,11,51704,51704,11,51732,51732,11,51760,51760,11,51788,51788,11,51816,51816,11,51844,51844,11,51872,51872,11,51900,51900,11,51928,51928,11,51956,51956,11,51984,51984,11,52012,52012,11,52040,52040,11,52068,52068,11,52096,52096,11,52124,52124,11,52152,52152,11,52180,52180,11,52208,52208,11,52236,52236,11,52264,52264,11,52292,52292,11,52320,52320,11,52348,52348,11,52376,52376,11,52404,52404,11,52432,52432,11,52460,52460,11,52488,52488,11,52516,52516,11,52544,52544,11,52572,52572,11,52600,52600,11,52628,52628,11,52656,52656,11,52684,52684,11,52712,52712,11,52740,52740,11,52768,52768,11,52796,52796,11,52824,52824,11,52852,52852,11,52880,52880,11,52908,52908,11,52936,52936,11,52964,52964,11,52992,52992,11,53020,53020,11,53048,53048,11,53076,53076,11,53104,53104,11,53132,53132,11,53160,53160,11,53188,53188,11,53216,53216,11,53244,53244,11,53272,53272,11,53300,53300,11,53328,53328,11,53356,53356,11,53384,53384,11,53412,53412,11,53440,53440,11,53468,53468,11,53496,53496,11,53524,53524,11,53552,53552,11,53580,53580,11,53608,53608,11,53636,53636,11,53664,53664,11,53692,53692,11,53720,53720,11,53748,53748,11,53776,53776,11,53804,53804,11,53832,53832,11,53860,53860,11,53888,53888,11,53916,53916,11,53944,53944,11,53972,53972,11,54000,54000,11,54028,54028,11,54056,54056,11,54084,54084,11,54112,54112,11,54140,54140,11,54168,54168,11,54196,54196,11,54224,54224,11,54252,54252,11,54280,54280,11,54308,54308,11,54336,54336,11,54364,54364,11,54392,54392,11,54420,54420,11,54448,54448,11,54476,54476,11,54504,54504,11,54532,54532,11,54560,54560,11,54588,54588,11,54616,54616,11,54644,54644,11,54672,54672,11,54700,54700,11,54728,54728,11,54756,54756,11,54784,54784,11,54812,54812,11,54840,54840,11,54868,54868,11,54896,54896,11,54924,54924,11,54952,54952,11,54980,54980,11,55008,55008,11,55036,55036,11,55064,55064,11,55092,55092,11,55120,55120,11,55148,55148,11,55176,55176,11,55216,55238,9,64286,64286,5,65056,65071,5,65438,65439,5,65529,65531,4,66272,66272,5,68097,68099,5,68108,68111,5,68159,68159,5,68900,68903,5,69446,69456,5,69632,69632,7,69634,69634,7,69744,69744,5,69759,69761,5,69808,69810,7,69815,69816,7,69821,69821,1,69837,69837,1,69927,69931,5,69933,69940,5,70003,70003,5,70018,70018,7,70070,70078,5,70082,70083,1,70094,70094,7,70188,70190,7,70194,70195,7,70197,70197,7,70206,70206,5,70368,70370,7,70400,70401,5,70459,70460,5,70463,70463,7,70465,70468,7,70475,70477,7,70498,70499,7,70512,70516,5,70712,70719,5,70722,70724,5,70726,70726,5,70832,70832,5,70835,70840,5,70842,70842,5,70845,70845,5,70847,70848,5,70850,70851,5,71088,71089,7,71096,71099,7,71102,71102,7,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71340,71340,7,71342,71343,7,71350,71350,7,71453,71455,5,71462,71462,7,71724,71726,7,71736,71736,7,71984,71984,5,71991,71992,7,71997,71997,7,71999,71999,1,72001,72001,1,72003,72003,5,72148,72151,5,72156,72159,7,72164,72164,7,72243,72248,5,72250,72250,1,72263,72263,5,72279,72280,7,72324,72329,1,72343,72343,7,72751,72751,7,72760,72765,5,72767,72767,5,72873,72873,7,72881,72881,7,72884,72884,7,73009,73014,5,73020,73021,5,73030,73030,1,73098,73102,7,73107,73108,7,73110,73110,7,73459,73460,5,78896,78904,4,92976,92982,5,94033,94087,7,94180,94180,5,113821,113822,5,118528,118573,5,119141,119141,5,119143,119145,5,119150,119154,5,119163,119170,5,119210,119213,5,121344,121398,5,121461,121461,5,121499,121503,5,122880,122886,5,122907,122913,5,122918,122922,5,123566,123566,5,125136,125142,5,126976,126979,14,126981,127182,14,127184,127231,14,127279,127279,14,127344,127345,14,127374,127374,14,127405,127461,14,127489,127490,14,127514,127514,14,127538,127546,14,127561,127567,14,127570,127743,14,127757,127758,14,127760,127760,14,127762,127762,14,127766,127768,14,127770,127770,14,127772,127772,14,127775,127776,14,127778,127779,14,127789,127791,14,127794,127795,14,127798,127798,14,127819,127819,14,127824,127824,14,127868,127868,14,127870,127871,14,127892,127893,14,127896,127896,14,127900,127901,14,127904,127940,14,127942,127942,14,127944,127944,14,127946,127946,14,127951,127955,14,127968,127971,14,127973,127984,14,127987,127987,14,127989,127989,14,127991,127991,14,127995,127999,5,128008,128008,14,128012,128014,14,128017,128018,14,128020,128020,14,128022,128022,14,128042,128042,14,128063,128063,14,128065,128065,14,128101,128101,14,128108,128109,14,128173,128173,14,128182,128183,14,128236,128237,14,128239,128239,14,128245,128245,14,128248,128248,14,128253,128253,14,128255,128258,14,128260,128263,14,128265,128265,14,128277,128277,14,128300,128301,14,128326,128328,14,128331,128334,14,128336,128347,14,128360,128366,14,128369,128370,14,128378,128378,14,128391,128391,14,128394,128397,14,128400,128400,14,128405,128406,14,128420,128420,14,128422,128423,14,128425,128432,14,128435,128443,14,128445,128449,14,128453,128464,14,128468,128475,14,128479,128480,14,128482,128482,14,128484,128487,14,128489,128494,14,128496,128498,14,128500,128505,14,128507,128511,14,128513,128518,14,128521,128525,14,128527,128527,14,128529,128529,14,128533,128533,14,128535,128535,14,128537,128537,14]');
    }
    //#endregion
    /**
     * Computes the offset after performing a left delete on the given string,
     * while considering unicode grapheme/emoji rules.
    */
    function $de(offset, str) {
        if (offset === 0) {
            return 0;
        }
        // Try to delete emoji part.
        const emojiOffset = getOffsetBeforeLastEmojiComponent(offset, str);
        if (emojiOffset !== undefined) {
            return emojiOffset;
        }
        // Otherwise, just skip a single code point.
        const iterator = new $Sd(str, offset);
        iterator.prevCodePoint();
        return iterator.offset;
    }
    exports.$de = $de;
    function getOffsetBeforeLastEmojiComponent(initialOffset, str) {
        // See https://www.unicode.org/reports/tr51/tr51-14.html#EBNF_and_Regex for the
        // structure of emojis.
        const iterator = new $Sd(str, initialOffset);
        let codePoint = iterator.prevCodePoint();
        // Skip modifiers
        while ((isEmojiModifier(codePoint) || codePoint === 65039 /* CodePoint.emojiVariantSelector */ || codePoint === 8419 /* CodePoint.enclosingKeyCap */)) {
            if (iterator.offset === 0) {
                // Cannot skip modifier, no preceding emoji base.
                return undefined;
            }
            codePoint = iterator.prevCodePoint();
        }
        // Expect base emoji
        if (!$4d(codePoint)) {
            // Unexpected code point, not a valid emoji.
            return undefined;
        }
        let resultOffset = iterator.offset;
        if (resultOffset > 0) {
            // Skip optional ZWJ code points that combine multiple emojis.
            // In theory, we should check if that ZWJ actually combines multiple emojis
            // to prevent deleting ZWJs in situations we didn't account for.
            const optionalZwjCodePoint = iterator.prevCodePoint();
            if (optionalZwjCodePoint === 8205 /* CodePoint.zwj */) {
                resultOffset = iterator.offset;
            }
        }
        return resultOffset;
    }
    function isEmojiModifier(codePoint) {
        return 0x1F3FB <= codePoint && codePoint <= 0x1F3FF;
    }
    var CodePoint;
    (function (CodePoint) {
        CodePoint[CodePoint["zwj"] = 8205] = "zwj";
        /**
         * Variation Selector-16 (VS16)
        */
        CodePoint[CodePoint["emojiVariantSelector"] = 65039] = "emojiVariantSelector";
        /**
         * Combining Enclosing Keycap
         */
        CodePoint[CodePoint["enclosingKeyCap"] = 8419] = "enclosingKeyCap";
    })(CodePoint || (CodePoint = {}));
    exports.$ee = '\xa0';
    class $fe {
        static { this.c = new lazy_1.$T(() => {
            // Generated using https://github.com/hediet/vscode-unicode-data
            // Stored as key1, value1, key2, value2, ...
            return JSON.parse('{\"_common\":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,8218,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,8242,96,1370,96,1523,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71922,67,71913,67,65315,67,8557,67,8450,67,8493,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71919,87,71910,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,66293,90,71909,90,65338,90,8484,90,8488,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65297,49,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125,119846,109],\"_default\":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"cs\":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"de\":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"es\":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"fr\":[65374,126,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"it\":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"ja\":[8211,45,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65292,44,65307,59],\"ko\":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"pl\":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"pt-BR\":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"qps-ploc\":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"ru\":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"tr\":[160,32,8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],\"zh-hans\":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41],\"zh-hant\":[8211,45,65374,126,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65307,59]}');
        }); }
        static { this.d = new cache_1.$gd((locales) => {
            function arrayToMap(arr) {
                const result = new Map();
                for (let i = 0; i < arr.length; i += 2) {
                    result.set(arr[i], arr[i + 1]);
                }
                return result;
            }
            function mergeMaps(map1, map2) {
                const result = new Map(map1);
                for (const [key, value] of map2) {
                    result.set(key, value);
                }
                return result;
            }
            function intersectMaps(map1, map2) {
                if (!map1) {
                    return map2;
                }
                const result = new Map();
                for (const [key, value] of map1) {
                    if (map2.has(key)) {
                        result.set(key, value);
                    }
                }
                return result;
            }
            const data = this.c.value;
            let filteredLocales = locales.filter((l) => !l.startsWith('_') && l in data);
            if (filteredLocales.length === 0) {
                filteredLocales = ['_default'];
            }
            let languageSpecificMap = undefined;
            for (const locale of filteredLocales) {
                const map = arrayToMap(data[locale]);
                languageSpecificMap = intersectMaps(languageSpecificMap, map);
            }
            const commonMap = arrayToMap(data['_common']);
            const map = mergeMaps(commonMap, languageSpecificMap);
            return new $fe(map);
        }); }
        static getInstance(locales) {
            return $fe.d.get(Array.from(locales));
        }
        static { this.e = new lazy_1.$T(() => Object.keys($fe.c.value).filter((k) => !k.startsWith('_'))); }
        static getLocales() {
            return $fe.e.value;
        }
        constructor(f) {
            this.f = f;
        }
        isAmbiguous(codePoint) {
            return this.f.has(codePoint);
        }
        /**
         * Returns the non basic ASCII code point that the given code point can be confused,
         * or undefined if such code point does note exist.
         */
        getPrimaryConfusable(codePoint) {
            return this.f.get(codePoint);
        }
        getConfusableCodePoints() {
            return new Set(this.f.keys());
        }
    }
    exports.$fe = $fe;
    class $ge {
        static c() {
            // Generated using https://github.com/hediet/vscode-unicode-data
            return JSON.parse('[9,10,11,12,13,32,127,160,173,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8203,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12288,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999]');
        }
        static { this.d = undefined; }
        static e() {
            if (!this.d) {
                this.d = new Set($ge.c());
            }
            return this.d;
        }
        static isInvisibleCharacter(codePoint) {
            return $ge.e().has(codePoint);
        }
        static get codePoints() {
            return $ge.e();
        }
    }
    exports.$ge = $ge;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[13/*vs/base/common/types*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ye = exports.$xe = exports.$we = exports.$ve = exports.$ue = exports.$te = exports.$se = exports.$re = exports.$qe = exports.$pe = exports.$oe = exports.$ne = exports.$me = exports.$le = exports.$ke = exports.$je = exports.$ie = exports.$he = void 0;
    /**
     * @returns whether the provided parameter is a JavaScript String or not.
     */
    function $he(str) {
        return (typeof str === 'string');
    }
    exports.$he = $he;
    /**
     * @returns whether the provided parameter is a JavaScript Array and each element in the array is a string.
     */
    function $ie(value) {
        return Array.isArray(value) && value.every(elem => $he(elem));
    }
    exports.$ie = $ie;
    /**
     * @returns whether the provided parameter is of type `object` but **not**
     *	`null`, an `array`, a `regexp`, nor a `date`.
     */
    function $je(obj) {
        // The method can't do a type cast since there are type (like strings) which
        // are subclasses of any put not positvely matched by the function. Hence type
        // narrowing results in wrong results.
        return typeof obj === 'object'
            && obj !== null
            && !Array.isArray(obj)
            && !(obj instanceof RegExp)
            && !(obj instanceof Date);
    }
    exports.$je = $je;
    /**
     * @returns whether the provided parameter is of type `Buffer` or Uint8Array dervived type
     */
    function $ke(obj) {
        const TypedArray = Object.getPrototypeOf(Uint8Array);
        return typeof obj === 'object'
            && obj instanceof TypedArray;
    }
    exports.$ke = $ke;
    /**
     * In **contrast** to just checking `typeof` this will return `false` for `NaN`.
     * @returns whether the provided parameter is a JavaScript Number or not.
     */
    function $le(obj) {
        return (typeof obj === 'number' && !isNaN(obj));
    }
    exports.$le = $le;
    /**
     * @returns whether the provided parameter is an Iterable, casting to the given generic
     */
    function $me(obj) {
        return !!obj && typeof obj[Symbol.iterator] === 'function';
    }
    exports.$me = $me;
    /**
     * @returns whether the provided parameter is a JavaScript Boolean or not.
     */
    function $ne(obj) {
        return (obj === true || obj === false);
    }
    exports.$ne = $ne;
    /**
     * @returns whether the provided parameter is undefined.
     */
    function $oe(obj) {
        return (typeof obj === 'undefined');
    }
    exports.$oe = $oe;
    /**
     * @returns whether the provided parameter is defined.
     */
    function $pe(arg) {
        return !$qe(arg);
    }
    exports.$pe = $pe;
    /**
     * @returns whether the provided parameter is undefined or null.
     */
    function $qe(obj) {
        return ($oe(obj) || obj === null);
    }
    exports.$qe = $qe;
    function $re(condition, type) {
        if (!condition) {
            throw new Error(type ? `Unexpected type, expected '${type}'` : 'Unexpected type');
        }
    }
    exports.$re = $re;
    /**
     * Asserts that the argument passed in is neither undefined nor null.
     */
    function $se(arg) {
        if ($qe(arg)) {
            throw new Error('Assertion Failed: argument is undefined or null');
        }
        return arg;
    }
    exports.$se = $se;
    function $te(...args) {
        const result = [];
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if ($qe(arg)) {
                throw new Error(`Assertion Failed: argument at index ${i} is undefined or null`);
            }
            result.push(arg);
        }
        return result;
    }
    exports.$te = $te;
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    /**
     * @returns whether the provided parameter is an empty JavaScript Object or not.
     */
    function $ue(obj) {
        if (!$je(obj)) {
            return false;
        }
        for (const key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }
    exports.$ue = $ue;
    /**
     * @returns whether the provided parameter is a JavaScript Function or not.
     */
    function $ve(obj) {
        return (typeof obj === 'function');
    }
    exports.$ve = $ve;
    /**
     * @returns whether the provided parameters is are JavaScript Function or not.
     */
    function $we(...objects) {
        return objects.length > 0 && objects.every($ve);
    }
    exports.$we = $we;
    function $xe(args, constraints) {
        const len = Math.min(args.length, constraints.length);
        for (let i = 0; i < len; i++) {
            $ye(args[i], constraints[i]);
        }
    }
    exports.$xe = $xe;
    function $ye(arg, constraint) {
        if ($he(constraint)) {
            if (typeof arg !== constraint) {
                throw new Error(`argument does not match constraint: typeof ${constraint}`);
            }
        }
        else if ($ve(constraint)) {
            try {
                if (arg instanceof constraint) {
                    return;
                }
            }
            catch {
                // ignore
            }
            if (!$qe(arg) && arg.constructor === constraint) {
                return;
            }
            if (constraint.length === 1 && constraint.call(undefined, arg) === true) {
                return;
            }
            throw new Error(`argument does not match one of these constraints: arg instanceof constraint, arg.constructor === constraint, nor constraint(arg) === true`);
        }
    }
    exports.$ye = $ye;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[14/*vs/base/common/objects*/], __M([0/*require*/,1/*exports*/,13/*vs/base/common/types*/]), function (require, exports, types_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$Om = exports.$Nm = exports.$Mm = exports.$Lm = exports.$Km = exports.$Jm = exports.$Im = exports.$Hm = exports.$Gm = exports.$Fm = exports.$Em = exports.$Dm = void 0;
    function $Dm(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        if (obj instanceof RegExp) {
            return obj;
        }
        const result = Array.isArray(obj) ? [] : {};
        Object.entries(obj).forEach(([key, value]) => {
            result[key] = value && typeof value === 'object' ? $Dm(value) : value;
        });
        return result;
    }
    exports.$Dm = $Dm;
    function $Em(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        const stack = [obj];
        while (stack.length > 0) {
            const obj = stack.shift();
            Object.freeze(obj);
            for (const key in obj) {
                if (_hasOwnProperty.call(obj, key)) {
                    const prop = obj[key];
                    if (typeof prop === 'object' && !Object.isFrozen(prop) && !(0, types_1.$ke)(prop)) {
                        stack.push(prop);
                    }
                }
            }
        }
        return obj;
    }
    exports.$Em = $Em;
    const _hasOwnProperty = Object.prototype.hasOwnProperty;
    function $Fm(obj, changer) {
        return _cloneAndChange(obj, changer, new Set());
    }
    exports.$Fm = $Fm;
    function _cloneAndChange(obj, changer, seen) {
        if ((0, types_1.$qe)(obj)) {
            return obj;
        }
        const changed = changer(obj);
        if (typeof changed !== 'undefined') {
            return changed;
        }
        if (Array.isArray(obj)) {
            const r1 = [];
            for (const e of obj) {
                r1.push(_cloneAndChange(e, changer, seen));
            }
            return r1;
        }
        if ((0, types_1.$je)(obj)) {
            if (seen.has(obj)) {
                throw new Error('Cannot clone recursive data-structure');
            }
            seen.add(obj);
            const r2 = {};
            for (const i2 in obj) {
                if (_hasOwnProperty.call(obj, i2)) {
                    r2[i2] = _cloneAndChange(obj[i2], changer, seen);
                }
            }
            seen.delete(obj);
            return r2;
        }
        return obj;
    }
    /**
     * Copies all properties of source into destination. The optional parameter "overwrite" allows to control
     * if existing properties on the destination should be overwritten or not. Defaults to true (overwrite).
     */
    function $Gm(destination, source, overwrite = true) {
        if (!(0, types_1.$je)(destination)) {
            return source;
        }
        if ((0, types_1.$je)(source)) {
            Object.keys(source).forEach(key => {
                if (key in destination) {
                    if (overwrite) {
                        if ((0, types_1.$je)(destination[key]) && (0, types_1.$je)(source[key])) {
                            $Gm(destination[key], source[key], overwrite);
                        }
                        else {
                            destination[key] = source[key];
                        }
                    }
                }
                else {
                    destination[key] = source[key];
                }
            });
        }
        return destination;
    }
    exports.$Gm = $Gm;
    function $Hm(one, other) {
        if (one === other) {
            return true;
        }
        if (one === null || one === undefined || other === null || other === undefined) {
            return false;
        }
        if (typeof one !== typeof other) {
            return false;
        }
        if (typeof one !== 'object') {
            return false;
        }
        if ((Array.isArray(one)) !== (Array.isArray(other))) {
            return false;
        }
        let i;
        let key;
        if (Array.isArray(one)) {
            if (one.length !== other.length) {
                return false;
            }
            for (i = 0; i < one.length; i++) {
                if (!$Hm(one[i], other[i])) {
                    return false;
                }
            }
        }
        else {
            const oneKeys = [];
            for (key in one) {
                oneKeys.push(key);
            }
            oneKeys.sort();
            const otherKeys = [];
            for (key in other) {
                otherKeys.push(key);
            }
            otherKeys.sort();
            if (!$Hm(oneKeys, otherKeys)) {
                return false;
            }
            for (i = 0; i < oneKeys.length; i++) {
                if (!$Hm(one[oneKeys[i]], other[oneKeys[i]])) {
                    return false;
                }
            }
        }
        return true;
    }
    exports.$Hm = $Hm;
    /**
     * Calls `JSON.Stringify` with a replacer to break apart any circular references.
     * This prevents `JSON`.stringify` from throwing the exception
     *  "Uncaught TypeError: Converting circular structure to JSON"
     */
    function $Im(obj) {
        const seen = new Set();
        return JSON.stringify(obj, (key, value) => {
            if ((0, types_1.$je)(value) || Array.isArray(value)) {
                if (seen.has(value)) {
                    return '[Circular]';
                }
                else {
                    seen.add(value);
                }
            }
            return value;
        });
    }
    exports.$Im = $Im;
    /**
     * Returns an object that has keys for each value that is different in the base object. Keys
     * that do not exist in the target but in the base object are not considered.
     *
     * Note: This is not a deep-diffing method, so the values are strictly taken into the resulting
     * object if they differ.
     *
     * @param base the object to diff against
     * @param obj the object to use for diffing
     */
    function $Jm(base, target) {
        const result = Object.create(null);
        if (!base || !target) {
            return result;
        }
        const targetKeys = Object.keys(target);
        targetKeys.forEach(k => {
            const baseValue = base[k];
            const targetValue = target[k];
            if (!$Hm(baseValue, targetValue)) {
                result[k] = targetValue;
            }
        });
        return result;
    }
    exports.$Jm = $Jm;
    function $Km(target, key) {
        const lowercaseKey = key.toLowerCase();
        const equivalentKey = Object.keys(target).find(k => k.toLowerCase() === lowercaseKey);
        return equivalentKey ? target[equivalentKey] : target[key];
    }
    exports.$Km = $Km;
    function $Lm(obj, predicate) {
        const result = Object.create(null);
        for (const [key, value] of Object.entries(obj)) {
            if (predicate(key, value)) {
                result[key] = value;
            }
        }
        return result;
    }
    exports.$Lm = $Lm;
    function $Mm(obj) {
        let res = [];
        while (Object.prototype !== obj) {
            res = res.concat(Object.getOwnPropertyNames(obj));
            obj = Object.getPrototypeOf(obj);
        }
        return res;
    }
    exports.$Mm = $Mm;
    function $Nm(obj) {
        const methods = [];
        for (const prop of $Mm(obj)) {
            if (typeof obj[prop] === 'function') {
                methods.push(prop);
            }
        }
        return methods;
    }
    exports.$Nm = $Nm;
    function $Om(methodNames, invoke) {
        const createProxyMethod = (method) => {
            return function () {
                const args = Array.prototype.slice.call(arguments, 0);
                return invoke(method, args);
            };
        };
        const result = {};
        for (const methodName of methodNames) {
            result[methodName] = createProxyMethod(methodName);
        }
        return result;
    }
    exports.$Om = $Om;
});

define(__m[15/*vs/nls!vs/base/common/platform*/], __M([17/*vs/nls*/,18/*vs/nls!vs/base/common/worker/simpleWorker*/]), function(nls, data) { return nls.create("vs/base/common/platform", data); });
define(__m[16/*vs/base/common/platform*/], __M([0/*require*/,1/*exports*/,15/*vs/nls!vs/base/common/platform*/]), function (require, exports, nls) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$H = exports.$G = exports.$F = exports.$E = exports.$D = exports.$C = exports.OS = exports.OperatingSystem = exports.$A = exports.$z = exports.$y = exports.$x = exports.$w = exports.Language = exports.$v = exports.$u = exports.$t = exports.$s = exports.$r = exports.$q = exports.$p = exports.$o = exports.$n = exports.$m = exports.$l = exports.$k = exports.$j = exports.$i = exports.$h = exports.Platform = exports.$g = exports.$f = void 0;
    exports.$f = 'en';
    let _isWindows = false;
    let _isMacintosh = false;
    let _isLinux = false;
    let _isLinuxSnap = false;
    let _isNative = false;
    let _isWeb = false;
    let _isElectron = false;
    let _isIOS = false;
    let _isCI = false;
    let _isMobile = false;
    let _locale = undefined;
    let _language = exports.$f;
    let _platformLocale = exports.$f;
    let _translationsConfigFile = undefined;
    let _userAgent = undefined;
    /**
     * @deprecated use `globalThis` instead
     */
    exports.$g = (typeof self === 'object' ? self : typeof global === 'object' ? global : {});
    let nodeProcess = undefined;
    if (typeof exports.$g.vscode !== 'undefined' && typeof exports.$g.vscode.process !== 'undefined') {
        // Native environment (sandboxed)
        nodeProcess = exports.$g.vscode.process;
    }
    else if (typeof process !== 'undefined') {
        // Native environment (non-sandboxed)
        nodeProcess = process;
    }
    const isElectronProcess = typeof nodeProcess?.versions?.electron === 'string';
    const isElectronRenderer = isElectronProcess && nodeProcess?.type === 'renderer';
    // Web environment
    if (typeof navigator === 'object' && !isElectronRenderer) {
        _userAgent = navigator.userAgent;
        _isWindows = _userAgent.indexOf('Windows') >= 0;
        _isMacintosh = _userAgent.indexOf('Macintosh') >= 0;
        _isIOS = (_userAgent.indexOf('Macintosh') >= 0 || _userAgent.indexOf('iPad') >= 0 || _userAgent.indexOf('iPhone') >= 0) && !!navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
        _isLinux = _userAgent.indexOf('Linux') >= 0;
        _isMobile = _userAgent?.indexOf('Mobi') >= 0;
        _isWeb = true;
        const configuredLocale = nls.getConfiguredDefaultLocale(
        // This call _must_ be done in the file that calls `nls.getConfiguredDefaultLocale`
        // to ensure that the NLS AMD Loader plugin has been loaded and configured.
        // This is because the loader plugin decides what the default locale is based on
        // how it's able to resolve the strings.
        nls.localize(0, null));
        _locale = configuredLocale || exports.$f;
        _language = _locale;
        _platformLocale = navigator.language;
    }
    // Native environment
    else if (typeof nodeProcess === 'object') {
        _isWindows = (nodeProcess.platform === 'win32');
        _isMacintosh = (nodeProcess.platform === 'darwin');
        _isLinux = (nodeProcess.platform === 'linux');
        _isLinuxSnap = _isLinux && !!nodeProcess.env['SNAP'] && !!nodeProcess.env['SNAP_REVISION'];
        _isElectron = isElectronProcess;
        _isCI = !!nodeProcess.env['CI'] || !!nodeProcess.env['BUILD_ARTIFACTSTAGINGDIRECTORY'];
        _locale = exports.$f;
        _language = exports.$f;
        const rawNlsConfig = nodeProcess.env['VSCODE_NLS_CONFIG'];
        if (rawNlsConfig) {
            try {
                const nlsConfig = JSON.parse(rawNlsConfig);
                const resolved = nlsConfig.availableLanguages['*'];
                _locale = nlsConfig.locale;
                _platformLocale = nlsConfig.osLocale;
                // VSCode's default language is 'en'
                _language = resolved ? resolved : exports.$f;
                _translationsConfigFile = nlsConfig._translationsConfigFile;
            }
            catch (e) {
            }
        }
        _isNative = true;
    }
    // Unknown environment
    else {
        console.error('Unable to resolve platform.');
    }
    var Platform;
    (function (Platform) {
        Platform[Platform["Web"] = 0] = "Web";
        Platform[Platform["Mac"] = 1] = "Mac";
        Platform[Platform["Linux"] = 2] = "Linux";
        Platform[Platform["Windows"] = 3] = "Windows";
    })(Platform || (exports.Platform = Platform = {}));
    function $h(platform) {
        switch (platform) {
            case 0 /* Platform.Web */: return 'Web';
            case 1 /* Platform.Mac */: return 'Mac';
            case 2 /* Platform.Linux */: return 'Linux';
            case 3 /* Platform.Windows */: return 'Windows';
        }
    }
    exports.$h = $h;
    let _platform = 0 /* Platform.Web */;
    if (_isMacintosh) {
        _platform = 1 /* Platform.Mac */;
    }
    else if (_isWindows) {
        _platform = 3 /* Platform.Windows */;
    }
    else if (_isLinux) {
        _platform = 2 /* Platform.Linux */;
    }
    exports.$i = _isWindows;
    exports.$j = _isMacintosh;
    exports.$k = _isLinux;
    exports.$l = _isLinuxSnap;
    exports.$m = _isNative;
    exports.$n = _isElectron;
    exports.$o = _isWeb;
    exports.$p = (_isWeb && typeof exports.$g.importScripts === 'function');
    exports.$q = _isIOS;
    exports.$r = _isMobile;
    /**
     * Whether we run inside a CI environment, such as
     * GH actions or Azure Pipelines.
     */
    exports.$s = _isCI;
    exports.$t = _platform;
    exports.$u = _userAgent;
    /**
     * The language used for the user interface. The format of
     * the string is all lower case (e.g. zh-tw for Traditional
     * Chinese)
     */
    exports.$v = _language;
    var Language;
    (function (Language) {
        function value() {
            return exports.$v;
        }
        Language.value = value;
        function isDefaultVariant() {
            if (exports.$v.length === 2) {
                return exports.$v === 'en';
            }
            else if (exports.$v.length >= 3) {
                return exports.$v[0] === 'e' && exports.$v[1] === 'n' && exports.$v[2] === '-';
            }
            else {
                return false;
            }
        }
        Language.isDefaultVariant = isDefaultVariant;
        function isDefault() {
            return exports.$v === 'en';
        }
        Language.isDefault = isDefault;
    })(Language || (exports.Language = Language = {}));
    /**
     * The OS locale or the locale specified by --locale. The format of
     * the string is all lower case (e.g. zh-tw for Traditional
     * Chinese). The UI is not necessarily shown in the provided locale.
     */
    exports.$w = _locale;
    /**
     * This will always be set to the OS/browser's locale regardless of
     * what was specified by --locale. The format of the string is all
     * lower case (e.g. zh-tw for Traditional Chinese). The UI is not
     * necessarily shown in the provided locale.
     */
    exports.$x = _platformLocale;
    /**
     * The translations that are available through language packs.
     */
    exports.$y = _translationsConfigFile;
    exports.$z = (typeof exports.$g.postMessage === 'function' && !exports.$g.importScripts);
    /**
     * See https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#:~:text=than%204%2C%20then-,set%20timeout%20to%204,-.
     *
     * Works similarly to `setTimeout(0)` but doesn't suffer from the 4ms artificial delay
     * that browsers set when the nesting level is > 5.
     */
    exports.$A = (() => {
        if (exports.$z) {
            const pending = [];
            exports.$g.addEventListener('message', (e) => {
                if (e.data && e.data.vscodeScheduleAsyncWork) {
                    for (let i = 0, len = pending.length; i < len; i++) {
                        const candidate = pending[i];
                        if (candidate.id === e.data.vscodeScheduleAsyncWork) {
                            pending.splice(i, 1);
                            candidate.callback();
                            return;
                        }
                    }
                }
            });
            let lastId = 0;
            return (callback) => {
                const myId = ++lastId;
                pending.push({
                    id: myId,
                    callback: callback
                });
                exports.$g.postMessage({ vscodeScheduleAsyncWork: myId }, '*');
            };
        }
        return (callback) => setTimeout(callback);
    })();
    var OperatingSystem;
    (function (OperatingSystem) {
        OperatingSystem[OperatingSystem["Windows"] = 1] = "Windows";
        OperatingSystem[OperatingSystem["Macintosh"] = 2] = "Macintosh";
        OperatingSystem[OperatingSystem["Linux"] = 3] = "Linux";
    })(OperatingSystem || (exports.OperatingSystem = OperatingSystem = {}));
    exports.OS = (_isMacintosh || _isIOS ? 2 /* OperatingSystem.Macintosh */ : (_isWindows ? 1 /* OperatingSystem.Windows */ : 3 /* OperatingSystem.Linux */));
    let _isLittleEndian = true;
    let _isLittleEndianComputed = false;
    function $C() {
        if (!_isLittleEndianComputed) {
            _isLittleEndianComputed = true;
            const test = new Uint8Array(2);
            test[0] = 1;
            test[1] = 2;
            const view = new Uint16Array(test.buffer);
            _isLittleEndian = (view[0] === (2 << 8) + 1);
        }
        return _isLittleEndian;
    }
    exports.$C = $C;
    exports.$D = !!(exports.$u && exports.$u.indexOf('Chrome') >= 0);
    exports.$E = !!(exports.$u && exports.$u.indexOf('Firefox') >= 0);
    exports.$F = !!(!exports.$D && (exports.$u && exports.$u.indexOf('Safari') >= 0));
    exports.$G = !!(exports.$u && exports.$u.indexOf('Edg/') >= 0);
    exports.$H = !!(exports.$u && exports.$u.indexOf('Android') >= 0);
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[19/*vs/base/common/worker/simpleWorker*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/errors*/,5/*vs/base/common/event*/,4/*vs/base/common/lifecycle*/,14/*vs/base/common/objects*/,16/*vs/base/common/platform*/,12/*vs/base/common/strings*/]), function (require, exports, errors_1, event_1, lifecycle_1, objects_1, platform_1, strings) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.create = exports.SimpleWorkerServer = exports.SimpleWorkerClient = exports.logOnceWebWorkerWarning = void 0;
    const INITIALIZE = '$initialize';
    let webWorkerWarningLogged = false;
    function logOnceWebWorkerWarning(err) {
        if (!platform_1.$o) {
            // running tests
            return;
        }
        if (!webWorkerWarningLogged) {
            webWorkerWarningLogged = true;
            console.warn('Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/microsoft/monaco-editor#faq');
        }
        console.warn(err.message);
    }
    exports.logOnceWebWorkerWarning = logOnceWebWorkerWarning;
    var MessageType;
    (function (MessageType) {
        MessageType[MessageType["Request"] = 0] = "Request";
        MessageType[MessageType["Reply"] = 1] = "Reply";
        MessageType[MessageType["SubscribeEvent"] = 2] = "SubscribeEvent";
        MessageType[MessageType["Event"] = 3] = "Event";
        MessageType[MessageType["UnsubscribeEvent"] = 4] = "UnsubscribeEvent";
    })(MessageType || (MessageType = {}));
    class RequestMessage {
        constructor(vsWorker, req, method, args) {
            this.vsWorker = vsWorker;
            this.req = req;
            this.method = method;
            this.args = args;
            this.type = 0 /* MessageType.Request */;
        }
    }
    class ReplyMessage {
        constructor(vsWorker, seq, res, err) {
            this.vsWorker = vsWorker;
            this.seq = seq;
            this.res = res;
            this.err = err;
            this.type = 1 /* MessageType.Reply */;
        }
    }
    class SubscribeEventMessage {
        constructor(vsWorker, req, eventName, arg) {
            this.vsWorker = vsWorker;
            this.req = req;
            this.eventName = eventName;
            this.arg = arg;
            this.type = 2 /* MessageType.SubscribeEvent */;
        }
    }
    class EventMessage {
        constructor(vsWorker, req, event) {
            this.vsWorker = vsWorker;
            this.req = req;
            this.event = event;
            this.type = 3 /* MessageType.Event */;
        }
    }
    class UnsubscribeEventMessage {
        constructor(vsWorker, req) {
            this.vsWorker = vsWorker;
            this.req = req;
            this.type = 4 /* MessageType.UnsubscribeEvent */;
        }
    }
    class SimpleWorkerProtocol {
        constructor(handler) {
            this.a = -1;
            this.g = handler;
            this.b = 0;
            this.c = Object.create(null);
            this.d = new Map();
            this.f = new Map();
        }
        setWorkerId(workerId) {
            this.a = workerId;
        }
        sendMessage(method, args) {
            const req = String(++this.b);
            return new Promise((resolve, reject) => {
                this.c[req] = {
                    resolve: resolve,
                    reject: reject
                };
                this.o(new RequestMessage(this.a, req, method, args));
            });
        }
        listen(eventName, arg) {
            let req = null;
            const emitter = new event_1.$8c({
                onWillAddFirstListener: () => {
                    req = String(++this.b);
                    this.d.set(req, emitter);
                    this.o(new SubscribeEventMessage(this.a, req, eventName, arg));
                },
                onDidRemoveLastListener: () => {
                    this.d.delete(req);
                    this.o(new UnsubscribeEventMessage(this.a, req));
                    req = null;
                }
            });
            return emitter.event;
        }
        handleMessage(message) {
            if (!message || !message.vsWorker) {
                return;
            }
            if (this.a !== -1 && message.vsWorker !== this.a) {
                return;
            }
            this.h(message);
        }
        h(msg) {
            switch (msg.type) {
                case 1 /* MessageType.Reply */:
                    return this.j(msg);
                case 0 /* MessageType.Request */:
                    return this.k(msg);
                case 2 /* MessageType.SubscribeEvent */:
                    return this.l(msg);
                case 3 /* MessageType.Event */:
                    return this.m(msg);
                case 4 /* MessageType.UnsubscribeEvent */:
                    return this.n(msg);
            }
        }
        j(replyMessage) {
            if (!this.c[replyMessage.seq]) {
                console.warn('Got reply to unknown seq');
                return;
            }
            const reply = this.c[replyMessage.seq];
            delete this.c[replyMessage.seq];
            if (replyMessage.err) {
                let err = replyMessage.err;
                if (replyMessage.err.$isError) {
                    err = new Error();
                    err.name = replyMessage.err.name;
                    err.message = replyMessage.err.message;
                    err.stack = replyMessage.err.stack;
                }
                reply.reject(err);
                return;
            }
            reply.resolve(replyMessage.res);
        }
        k(requestMessage) {
            const req = requestMessage.req;
            const result = this.g.handleMessage(requestMessage.method, requestMessage.args);
            result.then((r) => {
                this.o(new ReplyMessage(this.a, req, r, undefined));
            }, (e) => {
                if (e.detail instanceof Error) {
                    // Loading errors have a detail property that points to the actual error
                    e.detail = (0, errors_1.$1)(e.detail);
                }
                this.o(new ReplyMessage(this.a, req, undefined, (0, errors_1.$1)(e)));
            });
        }
        l(msg) {
            const req = msg.req;
            const disposable = this.g.handleEvent(msg.eventName, msg.arg)((event) => {
                this.o(new EventMessage(this.a, req, event));
            });
            this.f.set(req, disposable);
        }
        m(msg) {
            if (!this.d.has(msg.req)) {
                console.warn('Got event for unknown req');
                return;
            }
            this.d.get(msg.req).fire(msg.event);
        }
        n(msg) {
            if (!this.f.has(msg.req)) {
                console.warn('Got unsubscribe for unknown req');
                return;
            }
            this.f.get(msg.req).dispose();
            this.f.delete(msg.req);
        }
        o(msg) {
            const transfer = [];
            if (msg.type === 0 /* MessageType.Request */) {
                for (let i = 0; i < msg.args.length; i++) {
                    if (msg.args[i] instanceof ArrayBuffer) {
                        transfer.push(msg.args[i]);
                    }
                }
            }
            else if (msg.type === 1 /* MessageType.Reply */) {
                if (msg.res instanceof ArrayBuffer) {
                    transfer.push(msg.res);
                }
            }
            this.g.sendMessage(msg, transfer);
        }
    }
    /**
     * Main thread side
     */
    class SimpleWorkerClient extends lifecycle_1.$lb {
        constructor(workerFactory, moduleId, host) {
            super();
            let lazyProxyReject = null;
            this.a = this.B(workerFactory.create('vs/base/common/worker/simpleWorker', (msg) => {
                this.c.handleMessage(msg);
            }, (err) => {
                // in Firefox, web workers fail lazily :(
                // we will reject the proxy
                lazyProxyReject?.(err);
            }));
            this.c = new SimpleWorkerProtocol({
                sendMessage: (msg, transfer) => {
                    this.a.postMessage(msg, transfer);
                },
                handleMessage: (method, args) => {
                    if (typeof host[method] !== 'function') {
                        return Promise.reject(new Error('Missing method ' + method + ' on main thread host.'));
                    }
                    try {
                        return Promise.resolve(host[method].apply(host, args));
                    }
                    catch (e) {
                        return Promise.reject(e);
                    }
                },
                handleEvent: (eventName, arg) => {
                    if (propertyIsDynamicEvent(eventName)) {
                        const event = host[eventName].call(host, arg);
                        if (typeof event !== 'function') {
                            throw new Error(`Missing dynamic event ${eventName} on main thread host.`);
                        }
                        return event;
                    }
                    if (propertyIsEvent(eventName)) {
                        const event = host[eventName];
                        if (typeof event !== 'function') {
                            throw new Error(`Missing event ${eventName} on main thread host.`);
                        }
                        return event;
                    }
                    throw new Error(`Malformed event name ${eventName}`);
                }
            });
            this.c.setWorkerId(this.a.getId());
            // Gather loader configuration
            let loaderConfiguration = null;
            const globalRequire = globalThis.require;
            if (typeof globalRequire !== 'undefined' && typeof globalRequire.getConfig === 'function') {
                // Get the configuration from the Monaco AMD Loader
                loaderConfiguration = globalRequire.getConfig();
            }
            else if (typeof globalThis.requirejs !== 'undefined') {
                // Get the configuration from requirejs
                loaderConfiguration = globalThis.requirejs.s.contexts._.config;
            }
            const hostMethods = (0, objects_1.$Nm)(host);
            // Send initialize message
            this.b = this.c.sendMessage(INITIALIZE, [
                this.a.getId(),
                JSON.parse(JSON.stringify(loaderConfiguration)),
                moduleId,
                hostMethods,
            ]);
            // Create proxy to loaded code
            const proxyMethodRequest = (method, args) => {
                return this.g(method, args);
            };
            const proxyListen = (eventName, arg) => {
                return this.c.listen(eventName, arg);
            };
            this.f = new Promise((resolve, reject) => {
                lazyProxyReject = reject;
                this.b.then((availableMethods) => {
                    resolve(createProxyObject(availableMethods, proxyMethodRequest, proxyListen));
                }, (e) => {
                    reject(e);
                    this.h('Worker failed to load ' + moduleId, e);
                });
            });
        }
        getProxyObject() {
            return this.f;
        }
        g(method, args) {
            return new Promise((resolve, reject) => {
                this.b.then(() => {
                    this.c.sendMessage(method, args).then(resolve, reject);
                }, reject);
            });
        }
        h(message, error) {
            console.error(message);
            console.info(error);
        }
    }
    exports.SimpleWorkerClient = SimpleWorkerClient;
    function propertyIsEvent(name) {
        // Assume a property is an event if it has a form of "onSomething"
        return name[0] === 'o' && name[1] === 'n' && strings.$Jd(name.charCodeAt(2));
    }
    function propertyIsDynamicEvent(name) {
        // Assume a property is a dynamic event (a method that returns an event) if it has a form of "onDynamicSomething"
        return /^onDynamic/.test(name) && strings.$Jd(name.charCodeAt(9));
    }
    function createProxyObject(methodNames, invoke, proxyListen) {
        const createProxyMethod = (method) => {
            return function () {
                const args = Array.prototype.slice.call(arguments, 0);
                return invoke(method, args);
            };
        };
        const createProxyDynamicEvent = (eventName) => {
            return function (arg) {
                return proxyListen(eventName, arg);
            };
        };
        const result = {};
        for (const methodName of methodNames) {
            if (propertyIsDynamicEvent(methodName)) {
                result[methodName] = createProxyDynamicEvent(methodName);
                continue;
            }
            if (propertyIsEvent(methodName)) {
                result[methodName] = proxyListen(methodName, undefined);
                continue;
            }
            result[methodName] = createProxyMethod(methodName);
        }
        return result;
    }
    /**
     * Worker side
     */
    class SimpleWorkerServer {
        constructor(postMessage, requestHandlerFactory) {
            this.a = requestHandlerFactory;
            this.b = null;
            this.c = new SimpleWorkerProtocol({
                sendMessage: (msg, transfer) => {
                    postMessage(msg, transfer);
                },
                handleMessage: (method, args) => this.d(method, args),
                handleEvent: (eventName, arg) => this.f(eventName, arg)
            });
        }
        onmessage(msg) {
            this.c.handleMessage(msg);
        }
        d(method, args) {
            if (method === INITIALIZE) {
                return this.g(args[0], args[1], args[2], args[3]);
            }
            if (!this.b || typeof this.b[method] !== 'function') {
                return Promise.reject(new Error('Missing requestHandler or method: ' + method));
            }
            try {
                return Promise.resolve(this.b[method].apply(this.b, args));
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        f(eventName, arg) {
            if (!this.b) {
                throw new Error(`Missing requestHandler`);
            }
            if (propertyIsDynamicEvent(eventName)) {
                const event = this.b[eventName].call(this.b, arg);
                if (typeof event !== 'function') {
                    throw new Error(`Missing dynamic event ${eventName} on request handler.`);
                }
                return event;
            }
            if (propertyIsEvent(eventName)) {
                const event = this.b[eventName];
                if (typeof event !== 'function') {
                    throw new Error(`Missing event ${eventName} on request handler.`);
                }
                return event;
            }
            throw new Error(`Malformed event name ${eventName}`);
        }
        g(workerId, loaderConfig, moduleId, hostMethods) {
            this.c.setWorkerId(workerId);
            const proxyMethodRequest = (method, args) => {
                return this.c.sendMessage(method, args);
            };
            const proxyListen = (eventName, arg) => {
                return this.c.listen(eventName, arg);
            };
            const hostProxy = createProxyObject(hostMethods, proxyMethodRequest, proxyListen);
            if (this.a) {
                // static request handler
                this.b = this.a(hostProxy);
                return Promise.resolve((0, objects_1.$Nm)(this.b));
            }
            if (loaderConfig) {
                // Remove 'baseUrl', handling it is beyond scope for now
                if (typeof loaderConfig.baseUrl !== 'undefined') {
                    delete loaderConfig['baseUrl'];
                }
                if (typeof loaderConfig.paths !== 'undefined') {
                    if (typeof loaderConfig.paths.vs !== 'undefined') {
                        delete loaderConfig.paths['vs'];
                    }
                }
                if (typeof loaderConfig.trustedTypesPolicy !== undefined) {
                    // don't use, it has been destroyed during serialize
                    delete loaderConfig['trustedTypesPolicy'];
                }
                // Since this is in a web worker, enable catching errors
                loaderConfig.catchError = true;
                globalThis.require.config(loaderConfig);
            }
            return new Promise((resolve, reject) => {
                // Use the global require to be sure to get the global config
                // ESM-comment-begin
                const req = (globalThis.require || require);
                // ESM-comment-end
                // ESM-uncomment-begin
                // const req = globalThis.require;
                // ESM-uncomment-end
                req([moduleId], (module) => {
                    this.b = module.create(hostProxy);
                    if (!this.b) {
                        reject(new Error(`No RequestHandler!`));
                        return;
                    }
                    resolve((0, objects_1.$Nm)(this.b));
                }, reject);
            });
        }
    }
    exports.SimpleWorkerServer = SimpleWorkerServer;
    /**
     * Called on the worker side
     * @skipMangle
     */
    function create(postMessage) {
        return new SimpleWorkerServer(postMessage, null);
    }
    exports.create = create;
});

}).call(this);
//# sourceMappingURL=simpleWorker.js.map
