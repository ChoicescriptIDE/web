/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/base/common/platform","vs/base/common/path","vs/base/common/strings","vs/base/common/extpath","vs/base/common/uri","vs/base/common/resources","vs/base/common/async","vs/base/common/glob","vs/base/common/map","vs/base/common/symbols","vs/base/common/network","vs/base/common/errors","vs/base/common/cancellation","vs/workbench/services/search/common/getFileResults","vs/workbench/services/search/common/ignoreFile","vs/base/common/types","vs/base/common/event","vs/base/common/lifecycle","vs/base/common/arrays","vs/editor/common/core/range","vs/workbench/services/search/worker/localFileSearch"];
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
define(__m[10/*vs/base/common/map*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    var _a, _b, _c;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ni = exports.$mi = exports.$li = exports.Touch = exports.$ki = exports.$ji = exports.$ii = exports.$hi = exports.$gi = void 0;
    function $gi(map, key, value) {
        let result = map.get(key);
        if (result === undefined) {
            result = value;
            map.set(key, result);
        }
        return result;
    }
    exports.$gi = $gi;
    function $hi(map) {
        const entries = [];
        map.forEach((value, key) => {
            entries.push(`${key} => ${value}`);
        });
        return `Map(${map.size}) {${entries.join(', ')}}`;
    }
    exports.$hi = $hi;
    function $ii(set) {
        const entries = [];
        set.forEach(value => {
            entries.push(value);
        });
        return `Set(${set.size}) {${entries.join(', ')}}`;
    }
    exports.$ii = $ii;
    class ResourceMapEntry {
        constructor(uri, value) {
            this.uri = uri;
            this.value = value;
        }
    }
    class $ji {
        static { this.a = (resource) => resource.toString(); }
        constructor(mapOrKeyFn, toKey) {
            this[_a] = 'ResourceMap';
            if (mapOrKeyFn instanceof $ji) {
                this.b = new Map(mapOrKeyFn.b);
                this.c = toKey ?? $ji.a;
            }
            else {
                this.b = new Map();
                this.c = mapOrKeyFn ?? $ji.a;
            }
        }
        set(resource, value) {
            this.b.set(this.c(resource), new ResourceMapEntry(resource, value));
            return this;
        }
        get(resource) {
            return this.b.get(this.c(resource))?.value;
        }
        has(resource) {
            return this.b.has(this.c(resource));
        }
        get size() {
            return this.b.size;
        }
        clear() {
            this.b.clear();
        }
        delete(resource) {
            return this.b.delete(this.c(resource));
        }
        forEach(clb, thisArg) {
            if (typeof thisArg !== 'undefined') {
                clb = clb.bind(thisArg);
            }
            for (const [_, entry] of this.b) {
                clb(entry.value, entry.uri, this);
            }
        }
        *values() {
            for (const entry of this.b.values()) {
                yield entry.value;
            }
        }
        *keys() {
            for (const entry of this.b.values()) {
                yield entry.uri;
            }
        }
        *entries() {
            for (const entry of this.b.values()) {
                yield [entry.uri, entry.value];
            }
        }
        *[(_a = Symbol.toStringTag, Symbol.iterator)]() {
            for (const [, entry] of this.b) {
                yield [entry.uri, entry.value];
            }
        }
    }
    exports.$ji = $ji;
    class $ki {
        constructor(entriesOrKey, toKey) {
            this[_b] = 'ResourceSet';
            if (!entriesOrKey || typeof entriesOrKey === 'function') {
                this.a = new $ji(entriesOrKey);
            }
            else {
                this.a = new $ji(toKey);
                entriesOrKey.forEach(this.add, this);
            }
        }
        get size() {
            return this.a.size;
        }
        add(value) {
            this.a.set(value, value);
            return this;
        }
        clear() {
            this.a.clear();
        }
        delete(value) {
            return this.a.delete(value);
        }
        forEach(callbackfn, thisArg) {
            this.a.forEach((_value, key) => callbackfn.call(thisArg, key, key, this));
        }
        has(value) {
            return this.a.has(value);
        }
        entries() {
            return this.a.entries();
        }
        keys() {
            return this.a.keys();
        }
        values() {
            return this.a.keys();
        }
        [(_b = Symbol.toStringTag, Symbol.iterator)]() {
            return this.keys();
        }
    }
    exports.$ki = $ki;
    var Touch;
    (function (Touch) {
        Touch[Touch["None"] = 0] = "None";
        Touch[Touch["AsOld"] = 1] = "AsOld";
        Touch[Touch["AsNew"] = 2] = "AsNew";
    })(Touch || (exports.Touch = Touch = {}));
    class $li {
        constructor() {
            this[_c] = 'LinkedMap';
            this.a = new Map();
            this.b = undefined;
            this.c = undefined;
            this.d = 0;
            this.e = 0;
        }
        clear() {
            this.a.clear();
            this.b = undefined;
            this.c = undefined;
            this.d = 0;
            this.e++;
        }
        isEmpty() {
            return !this.b && !this.c;
        }
        get size() {
            return this.d;
        }
        get first() {
            return this.b?.value;
        }
        get last() {
            return this.c?.value;
        }
        has(key) {
            return this.a.has(key);
        }
        get(key, touch = 0 /* Touch.None */) {
            const item = this.a.get(key);
            if (!item) {
                return undefined;
            }
            if (touch !== 0 /* Touch.None */) {
                this.j(item, touch);
            }
            return item.value;
        }
        set(key, value, touch = 0 /* Touch.None */) {
            let item = this.a.get(key);
            if (item) {
                item.value = value;
                if (touch !== 0 /* Touch.None */) {
                    this.j(item, touch);
                }
            }
            else {
                item = { key, value, next: undefined, previous: undefined };
                switch (touch) {
                    case 0 /* Touch.None */:
                        this.h(item);
                        break;
                    case 1 /* Touch.AsOld */:
                        this.g(item);
                        break;
                    case 2 /* Touch.AsNew */:
                        this.h(item);
                        break;
                    default:
                        this.h(item);
                        break;
                }
                this.a.set(key, item);
                this.d++;
            }
            return this;
        }
        delete(key) {
            return !!this.remove(key);
        }
        remove(key) {
            const item = this.a.get(key);
            if (!item) {
                return undefined;
            }
            this.a.delete(key);
            this.i(item);
            this.d--;
            return item.value;
        }
        shift() {
            if (!this.b && !this.c) {
                return undefined;
            }
            if (!this.b || !this.c) {
                throw new Error('Invalid list');
            }
            const item = this.b;
            this.a.delete(item.key);
            this.i(item);
            this.d--;
            return item.value;
        }
        forEach(callbackfn, thisArg) {
            const state = this.e;
            let current = this.b;
            while (current) {
                if (thisArg) {
                    callbackfn.bind(thisArg)(current.value, current.key, this);
                }
                else {
                    callbackfn(current.value, current.key, this);
                }
                if (this.e !== state) {
                    throw new Error(`LinkedMap got modified during iteration.`);
                }
                current = current.next;
            }
        }
        keys() {
            const map = this;
            const state = this.e;
            let current = this.b;
            const iterator = {
                [Symbol.iterator]() {
                    return iterator;
                },
                next() {
                    if (map.e !== state) {
                        throw new Error(`LinkedMap got modified during iteration.`);
                    }
                    if (current) {
                        const result = { value: current.key, done: false };
                        current = current.next;
                        return result;
                    }
                    else {
                        return { value: undefined, done: true };
                    }
                }
            };
            return iterator;
        }
        values() {
            const map = this;
            const state = this.e;
            let current = this.b;
            const iterator = {
                [Symbol.iterator]() {
                    return iterator;
                },
                next() {
                    if (map.e !== state) {
                        throw new Error(`LinkedMap got modified during iteration.`);
                    }
                    if (current) {
                        const result = { value: current.value, done: false };
                        current = current.next;
                        return result;
                    }
                    else {
                        return { value: undefined, done: true };
                    }
                }
            };
            return iterator;
        }
        entries() {
            const map = this;
            const state = this.e;
            let current = this.b;
            const iterator = {
                [Symbol.iterator]() {
                    return iterator;
                },
                next() {
                    if (map.e !== state) {
                        throw new Error(`LinkedMap got modified during iteration.`);
                    }
                    if (current) {
                        const result = { value: [current.key, current.value], done: false };
                        current = current.next;
                        return result;
                    }
                    else {
                        return { value: undefined, done: true };
                    }
                }
            };
            return iterator;
        }
        [(_c = Symbol.toStringTag, Symbol.iterator)]() {
            return this.entries();
        }
        f(newSize) {
            if (newSize >= this.size) {
                return;
            }
            if (newSize === 0) {
                this.clear();
                return;
            }
            let current = this.b;
            let currentSize = this.size;
            while (current && currentSize > newSize) {
                this.a.delete(current.key);
                current = current.next;
                currentSize--;
            }
            this.b = current;
            this.d = currentSize;
            if (current) {
                current.previous = undefined;
            }
            this.e++;
        }
        g(item) {
            // First time Insert
            if (!this.b && !this.c) {
                this.c = item;
            }
            else if (!this.b) {
                throw new Error('Invalid list');
            }
            else {
                item.next = this.b;
                this.b.previous = item;
            }
            this.b = item;
            this.e++;
        }
        h(item) {
            // First time Insert
            if (!this.b && !this.c) {
                this.b = item;
            }
            else if (!this.c) {
                throw new Error('Invalid list');
            }
            else {
                item.previous = this.c;
                this.c.next = item;
            }
            this.c = item;
            this.e++;
        }
        i(item) {
            if (item === this.b && item === this.c) {
                this.b = undefined;
                this.c = undefined;
            }
            else if (item === this.b) {
                // This can only happen if size === 1 which is handled
                // by the case above.
                if (!item.next) {
                    throw new Error('Invalid list');
                }
                item.next.previous = undefined;
                this.b = item.next;
            }
            else if (item === this.c) {
                // This can only happen if size === 1 which is handled
                // by the case above.
                if (!item.previous) {
                    throw new Error('Invalid list');
                }
                item.previous.next = undefined;
                this.c = item.previous;
            }
            else {
                const next = item.next;
                const previous = item.previous;
                if (!next || !previous) {
                    throw new Error('Invalid list');
                }
                next.previous = previous;
                previous.next = next;
            }
            item.next = undefined;
            item.previous = undefined;
            this.e++;
        }
        j(item, touch) {
            if (!this.b || !this.c) {
                throw new Error('Invalid list');
            }
            if ((touch !== 1 /* Touch.AsOld */ && touch !== 2 /* Touch.AsNew */)) {
                return;
            }
            if (touch === 1 /* Touch.AsOld */) {
                if (item === this.b) {
                    return;
                }
                const next = item.next;
                const previous = item.previous;
                // Unlink the item
                if (item === this.c) {
                    // previous must be defined since item was not head but is tail
                    // So there are more than on item in the map
                    previous.next = undefined;
                    this.c = previous;
                }
                else {
                    // Both next and previous are not undefined since item was neither head nor tail.
                    next.previous = previous;
                    previous.next = next;
                }
                // Insert the node at head
                item.previous = undefined;
                item.next = this.b;
                this.b.previous = item;
                this.b = item;
                this.e++;
            }
            else if (touch === 2 /* Touch.AsNew */) {
                if (item === this.c) {
                    return;
                }
                const next = item.next;
                const previous = item.previous;
                // Unlink the item.
                if (item === this.b) {
                    // next must be defined since item was not tail but is head
                    // So there are more than on item in the map
                    next.previous = undefined;
                    this.b = next;
                }
                else {
                    // Both next and previous are not undefined since item was neither head nor tail.
                    next.previous = previous;
                    previous.next = next;
                }
                item.next = undefined;
                item.previous = this.c;
                this.c.next = item;
                this.c = item;
                this.e++;
            }
        }
        toJSON() {
            const data = [];
            this.forEach((value, key) => {
                data.push([key, value]);
            });
            return data;
        }
        fromJSON(data) {
            this.clear();
            for (const [key, value] of data) {
                this.set(key, value);
            }
        }
    }
    exports.$li = $li;
    class $mi extends $li {
        constructor(limit, ratio = 1) {
            super();
            this.k = limit;
            this.l = Math.min(Math.max(0, ratio), 1);
        }
        get limit() {
            return this.k;
        }
        set limit(limit) {
            this.k = limit;
            this.m();
        }
        get ratio() {
            return this.l;
        }
        set ratio(ratio) {
            this.l = Math.min(Math.max(0, ratio), 1);
            this.m();
        }
        get(key, touch = 2 /* Touch.AsNew */) {
            return super.get(key, touch);
        }
        peek(key) {
            return super.get(key, 0 /* Touch.None */);
        }
        set(key, value) {
            super.set(key, value, 2 /* Touch.AsNew */);
            this.m();
            return this;
        }
        m() {
            if (this.size > this.k) {
                this.f(Math.round(this.k * this.l));
            }
        }
    }
    exports.$mi = $mi;
    class $ni {
        constructor() {
            this.a = new Map();
        }
        add(value) {
            this.a.set(value, (this.a.get(value) || 0) + 1);
            return this;
        }
        delete(value) {
            let counter = this.a.get(value) || 0;
            if (counter === 0) {
                return false;
            }
            counter--;
            if (counter === 0) {
                this.a.delete(value);
            }
            else {
                this.a.set(value, counter);
            }
            return true;
        }
        has(value) {
            return this.a.has(value);
        }
    }
    exports.$ni = $ni;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[11/*vs/base/common/symbols*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
define(__m[5/*vs/base/common/extpath*/], __M([0/*require*/,1/*exports*/,3/*vs/base/common/path*/,2/*vs/base/common/platform*/,4/*vs/base/common/strings*/,17/*vs/base/common/types*/]), function (require, exports, path_1, platform_1, strings_1, types_1) {
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
define(__m[12/*vs/base/common/network*/], __M([0/*require*/,1/*exports*/,13/*vs/base/common/errors*/,2/*vs/base/common/platform*/,6/*vs/base/common/uri*/]), function (require, exports, errors, platform, uri_1) {
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
define(__m[7/*vs/base/common/resources*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/extpath*/,12/*vs/base/common/network*/,3/*vs/base/common/path*/,2/*vs/base/common/platform*/,4/*vs/base/common/strings*/,6/*vs/base/common/uri*/]), function (require, exports, extpath, network_1, paths, platform_1, strings_1, uri_1) {
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
define(__m[8/*vs/base/common/async*/], __M([0/*require*/,1/*exports*/,14/*vs/base/common/cancellation*/,13/*vs/base/common/errors*/,18/*vs/base/common/event*/,19/*vs/base/common/lifecycle*/,7/*vs/base/common/resources*/,2/*vs/base/common/platform*/,11/*vs/base/common/symbols*/]), function (require, exports, cancellation_1, errors_1, event_1, lifecycle_1, resources_1, platform_1, symbols_1) {
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
define(__m[9/*vs/base/common/glob*/], __M([0/*require*/,1/*exports*/,20/*vs/base/common/arrays*/,8/*vs/base/common/async*/,5/*vs/base/common/extpath*/,10/*vs/base/common/map*/,3/*vs/base/common/path*/,2/*vs/base/common/platform*/,4/*vs/base/common/strings*/]), function (require, exports, arrays_1, async_1, extpath_1, map_1, path_1, platform_1, strings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ej = exports.$dj = exports.$cj = exports.$bj = exports.$aj = exports.$_i = exports.$$i = exports.$0i = exports.$9i = exports.$8i = void 0;
    function $8i() {
        return Object.create(null);
    }
    exports.$8i = $8i;
    exports.$9i = '**';
    exports.$0i = '/';
    const PATH_REGEX = '[/\\\\]'; // any slash or backslash
    const NO_PATH_REGEX = '[^/\\\\]'; // any non-slash and non-backslash
    const ALL_FORWARD_SLASHES = /\//g;
    function starsToRegExp(starCount, isLastPattern) {
        switch (starCount) {
            case 0:
                return '';
            case 1:
                return `${NO_PATH_REGEX}*?`; // 1 star matches any number of characters except path separator (/ and \) - non greedy (?)
            default:
                // Matches:  (Path Sep OR Path Val followed by Path Sep) 0-many times except when it's the last pattern
                //           in which case also matches (Path Sep followed by Path Val)
                // Group is non capturing because we don't need to capture at all (?:...)
                // Overall we use non-greedy matching because it could be that we match too much
                return `(?:${PATH_REGEX}|${NO_PATH_REGEX}+${PATH_REGEX}${isLastPattern ? `|${PATH_REGEX}${NO_PATH_REGEX}+` : ''})*?`;
        }
    }
    function $$i(pattern, splitChar) {
        if (!pattern) {
            return [];
        }
        const segments = [];
        let inBraces = false;
        let inBrackets = false;
        let curVal = '';
        for (const char of pattern) {
            switch (char) {
                case splitChar:
                    if (!inBraces && !inBrackets) {
                        segments.push(curVal);
                        curVal = '';
                        continue;
                    }
                    break;
                case '{':
                    inBraces = true;
                    break;
                case '}':
                    inBraces = false;
                    break;
                case '[':
                    inBrackets = true;
                    break;
                case ']':
                    inBrackets = false;
                    break;
            }
            curVal += char;
        }
        // Tail
        if (curVal) {
            segments.push(curVal);
        }
        return segments;
    }
    exports.$$i = $$i;
    function parseRegExp(pattern) {
        if (!pattern) {
            return '';
        }
        let regEx = '';
        // Split up into segments for each slash found
        const segments = $$i(pattern, exports.$0i);
        // Special case where we only have globstars
        if (segments.every(segment => segment === exports.$9i)) {
            regEx = '.*';
        }
        // Build regex over segments
        else {
            let previousSegmentWasGlobStar = false;
            segments.forEach((segment, index) => {
                // Treat globstar specially
                if (segment === exports.$9i) {
                    // if we have more than one globstar after another, just ignore it
                    if (previousSegmentWasGlobStar) {
                        return;
                    }
                    regEx += starsToRegExp(2, index === segments.length - 1);
                }
                // Anything else, not globstar
                else {
                    // States
                    let inBraces = false;
                    let braceVal = '';
                    let inBrackets = false;
                    let bracketVal = '';
                    for (const char of segment) {
                        // Support brace expansion
                        if (char !== '}' && inBraces) {
                            braceVal += char;
                            continue;
                        }
                        // Support brackets
                        if (inBrackets && (char !== ']' || !bracketVal) /* ] is literally only allowed as first character in brackets to match it */) {
                            let res;
                            // range operator
                            if (char === '-') {
                                res = char;
                            }
                            // negation operator (only valid on first index in bracket)
                            else if ((char === '^' || char === '!') && !bracketVal) {
                                res = '^';
                            }
                            // glob split matching is not allowed within character ranges
                            // see http://man7.org/linux/man-pages/man7/glob.7.html
                            else if (char === exports.$0i) {
                                res = '';
                            }
                            // anything else gets escaped
                            else {
                                res = (0, strings_1.$od)(char);
                            }
                            bracketVal += res;
                            continue;
                        }
                        switch (char) {
                            case '{':
                                inBraces = true;
                                continue;
                            case '[':
                                inBrackets = true;
                                continue;
                            case '}': {
                                const choices = $$i(braceVal, ',');
                                // Converts {foo,bar} => [foo|bar]
                                const braceRegExp = `(?:${choices.map(choice => parseRegExp(choice)).join('|')})`;
                                regEx += braceRegExp;
                                inBraces = false;
                                braceVal = '';
                                break;
                            }
                            case ']': {
                                regEx += ('[' + bracketVal + ']');
                                inBrackets = false;
                                bracketVal = '';
                                break;
                            }
                            case '?':
                                regEx += NO_PATH_REGEX; // 1 ? matches any single character except path separator (/ and \)
                                continue;
                            case '*':
                                regEx += starsToRegExp(1);
                                continue;
                            default:
                                regEx += (0, strings_1.$od)(char);
                        }
                    }
                    // Tail: Add the slash we had split on if there is more to
                    // come and the remaining pattern is not a globstar
                    // For example if pattern: some/**/*.js we want the "/" after
                    // some to be included in the RegEx to prevent a folder called
                    // "something" to match as well.
                    if (index < segments.length - 1 && // more segments to come after this
                        (segments[index + 1] !== exports.$9i || // next segment is not **, or...
                            index + 2 < segments.length // ...next segment is ** but there is more segments after that
                        )) {
                        regEx += PATH_REGEX;
                    }
                }
                // update globstar state
                previousSegmentWasGlobStar = (segment === exports.$9i);
            });
        }
        return regEx;
    }
    // regexes to check for trivial glob patterns that just check for String#endsWith
    const T1 = /^\*\*\/\*\.[\w\.-]+$/; // **/*.something
    const T2 = /^\*\*\/([\w\.-]+)\/?$/; // **/something
    const T3 = /^{\*\*\/\*?[\w\.-]+\/?(,\*\*\/\*?[\w\.-]+\/?)*}$/; // {**/*.something,**/*.else} or {**/package.json,**/project.json}
    const T3_2 = /^{\*\*\/\*?[\w\.-]+(\/(\*\*)?)?(,\*\*\/\*?[\w\.-]+(\/(\*\*)?)?)*}$/; // Like T3, with optional trailing /**
    const T4 = /^\*\*((\/[\w\.-]+)+)\/?$/; // **/something/else
    const T5 = /^([\w\.-]+(\/[\w\.-]+)*)\/?$/; // something/else
    const CACHE = new map_1.$mi(10000); // bounded to 10000 elements
    const FALSE = function () {
        return false;
    };
    const NULL = function () {
        return null;
    };
    function parsePattern(arg1, options) {
        if (!arg1) {
            return NULL;
        }
        // Handle relative patterns
        let pattern;
        if (typeof arg1 !== 'string') {
            pattern = arg1.pattern;
        }
        else {
            pattern = arg1;
        }
        // Whitespace trimming
        pattern = pattern.trim();
        // Check cache
        const patternKey = `${pattern}_${!!options.trimForExclusions}`;
        let parsedPattern = CACHE.get(patternKey);
        if (parsedPattern) {
            return wrapRelativePattern(parsedPattern, arg1);
        }
        // Check for Trivials
        let match;
        if (T1.test(pattern)) {
            parsedPattern = trivia1(pattern.substr(4), pattern); // common pattern: **/*.txt just need endsWith check
        }
        else if (match = T2.exec(trimForExclusions(pattern, options))) { // common pattern: **/some.txt just need basename check
            parsedPattern = trivia2(match[1], pattern);
        }
        else if ((options.trimForExclusions ? T3_2 : T3).test(pattern)) { // repetition of common patterns (see above) {**/*.txt,**/*.png}
            parsedPattern = trivia3(pattern, options);
        }
        else if (match = T4.exec(trimForExclusions(pattern, options))) { // common pattern: **/something/else just need endsWith check
            parsedPattern = trivia4and5(match[1].substr(1), pattern, true);
        }
        else if (match = T5.exec(trimForExclusions(pattern, options))) { // common pattern: something/else just need equals check
            parsedPattern = trivia4and5(match[1], pattern, false);
        }
        // Otherwise convert to pattern
        else {
            parsedPattern = toRegExp(pattern);
        }
        // Cache
        CACHE.set(patternKey, parsedPattern);
        return wrapRelativePattern(parsedPattern, arg1);
    }
    function wrapRelativePattern(parsedPattern, arg2) {
        if (typeof arg2 === 'string') {
            return parsedPattern;
        }
        const wrappedPattern = function (path, basename) {
            if (!(0, extpath_1.$Ge)(path, arg2.base, !platform_1.$k)) {
                // skip glob matching if `base` is not a parent of `path`
                return null;
            }
            // Given we have checked `base` being a parent of `path`,
            // we can now remove the `base` portion of the `path`
            // and only match on the remaining path components
            // For that we try to extract the portion of the `path`
            // that comes after the `base` portion. We have to account
            // for the fact that `base` might end in a path separator
            // (https://github.com/microsoft/vscode/issues/162498)
            return parsedPattern((0, strings_1.$sd)(path.substr(arg2.base.length), path_1.sep), basename);
        };
        // Make sure to preserve associated metadata
        wrappedPattern.allBasenames = parsedPattern.allBasenames;
        wrappedPattern.allPaths = parsedPattern.allPaths;
        wrappedPattern.basenames = parsedPattern.basenames;
        wrappedPattern.patterns = parsedPattern.patterns;
        return wrappedPattern;
    }
    function trimForExclusions(pattern, options) {
        return options.trimForExclusions && pattern.endsWith('/**') ? pattern.substr(0, pattern.length - 2) : pattern; // dropping **, tailing / is dropped later
    }
    // common pattern: **/*.txt just need endsWith check
    function trivia1(base, pattern) {
        return function (path, basename) {
            return typeof path === 'string' && path.endsWith(base) ? pattern : null;
        };
    }
    // common pattern: **/some.txt just need basename check
    function trivia2(base, pattern) {
        const slashBase = `/${base}`;
        const backslashBase = `\\${base}`;
        const parsedPattern = function (path, basename) {
            if (typeof path !== 'string') {
                return null;
            }
            if (basename) {
                return basename === base ? pattern : null;
            }
            return path === base || path.endsWith(slashBase) || path.endsWith(backslashBase) ? pattern : null;
        };
        const basenames = [base];
        parsedPattern.basenames = basenames;
        parsedPattern.patterns = [pattern];
        parsedPattern.allBasenames = basenames;
        return parsedPattern;
    }
    // repetition of common patterns (see above) {**/*.txt,**/*.png}
    function trivia3(pattern, options) {
        const parsedPatterns = aggregateBasenameMatches(pattern.slice(1, -1)
            .split(',')
            .map(pattern => parsePattern(pattern, options))
            .filter(pattern => pattern !== NULL), pattern);
        const patternsLength = parsedPatterns.length;
        if (!patternsLength) {
            return NULL;
        }
        if (patternsLength === 1) {
            return parsedPatterns[0];
        }
        const parsedPattern = function (path, basename) {
            for (let i = 0, n = parsedPatterns.length; i < n; i++) {
                if (parsedPatterns[i](path, basename)) {
                    return pattern;
                }
            }
            return null;
        };
        const withBasenames = parsedPatterns.find(pattern => !!pattern.allBasenames);
        if (withBasenames) {
            parsedPattern.allBasenames = withBasenames.allBasenames;
        }
        const allPaths = parsedPatterns.reduce((all, current) => current.allPaths ? all.concat(current.allPaths) : all, []);
        if (allPaths.length) {
            parsedPattern.allPaths = allPaths;
        }
        return parsedPattern;
    }
    // common patterns: **/something/else just need endsWith check, something/else just needs and equals check
    function trivia4and5(targetPath, pattern, matchPathEnds) {
        const usingPosixSep = path_1.sep === path_1.$0b.sep;
        const nativePath = usingPosixSep ? targetPath : targetPath.replace(ALL_FORWARD_SLASHES, path_1.sep);
        const nativePathEnd = path_1.sep + nativePath;
        const targetPathEnd = path_1.$0b.sep + targetPath;
        let parsedPattern;
        if (matchPathEnds) {
            parsedPattern = function (path, basename) {
                return typeof path === 'string' && ((path === nativePath || path.endsWith(nativePathEnd)) || !usingPosixSep && (path === targetPath || path.endsWith(targetPathEnd))) ? pattern : null;
            };
        }
        else {
            parsedPattern = function (path, basename) {
                return typeof path === 'string' && (path === nativePath || (!usingPosixSep && path === targetPath)) ? pattern : null;
            };
        }
        parsedPattern.allPaths = [(matchPathEnds ? '*/' : './') + targetPath];
        return parsedPattern;
    }
    function toRegExp(pattern) {
        try {
            const regExp = new RegExp(`^${parseRegExp(pattern)}$`);
            return function (path) {
                regExp.lastIndex = 0; // reset RegExp to its initial state to reuse it!
                return typeof path === 'string' && regExp.test(path) ? pattern : null;
            };
        }
        catch (error) {
            return NULL;
        }
    }
    function $_i(arg1, path, hasSibling) {
        if (!arg1 || typeof path !== 'string') {
            return false;
        }
        return $aj(arg1)(path, undefined, hasSibling);
    }
    exports.$_i = $_i;
    function $aj(arg1, options = {}) {
        if (!arg1) {
            return FALSE;
        }
        // Glob with String
        if (typeof arg1 === 'string' || $bj(arg1)) {
            const parsedPattern = parsePattern(arg1, options);
            if (parsedPattern === NULL) {
                return FALSE;
            }
            const resultPattern = function (path, basename) {
                return !!parsedPattern(path, basename);
            };
            if (parsedPattern.allBasenames) {
                resultPattern.allBasenames = parsedPattern.allBasenames;
            }
            if (parsedPattern.allPaths) {
                resultPattern.allPaths = parsedPattern.allPaths;
            }
            return resultPattern;
        }
        // Glob with Expression
        return parsedExpression(arg1, options);
    }
    exports.$aj = $aj;
    function $bj(obj) {
        const rp = obj;
        if (!rp) {
            return false;
        }
        return typeof rp.base === 'string' && typeof rp.pattern === 'string';
    }
    exports.$bj = $bj;
    function $cj(patternOrExpression) {
        return patternOrExpression.allBasenames || [];
    }
    exports.$cj = $cj;
    function $dj(patternOrExpression) {
        return patternOrExpression.allPaths || [];
    }
    exports.$dj = $dj;
    function parsedExpression(expression, options) {
        const parsedPatterns = aggregateBasenameMatches(Object.getOwnPropertyNames(expression)
            .map(pattern => parseExpressionPattern(pattern, expression[pattern], options))
            .filter(pattern => pattern !== NULL));
        const patternsLength = parsedPatterns.length;
        if (!patternsLength) {
            return NULL;
        }
        if (!parsedPatterns.some(parsedPattern => !!parsedPattern.requiresSiblings)) {
            if (patternsLength === 1) {
                return parsedPatterns[0];
            }
            const resultExpression = function (path, basename) {
                let resultPromises = undefined;
                for (let i = 0, n = parsedPatterns.length; i < n; i++) {
                    const result = parsedPatterns[i](path, basename);
                    if (typeof result === 'string') {
                        return result; // immediately return as soon as the first expression matches
                    }
                    // If the result is a promise, we have to keep it for
                    // later processing and await the result properly.
                    if ((0, async_1.$eg)(result)) {
                        if (!resultPromises) {
                            resultPromises = [];
                        }
                        resultPromises.push(result);
                    }
                }
                // With result promises, we have to loop over each and
                // await the result before we can return any result.
                if (resultPromises) {
                    return (async () => {
                        for (const resultPromise of resultPromises) {
                            const result = await resultPromise;
                            if (typeof result === 'string') {
                                return result;
                            }
                        }
                        return null;
                    })();
                }
                return null;
            };
            const withBasenames = parsedPatterns.find(pattern => !!pattern.allBasenames);
            if (withBasenames) {
                resultExpression.allBasenames = withBasenames.allBasenames;
            }
            const allPaths = parsedPatterns.reduce((all, current) => current.allPaths ? all.concat(current.allPaths) : all, []);
            if (allPaths.length) {
                resultExpression.allPaths = allPaths;
            }
            return resultExpression;
        }
        const resultExpression = function (path, base, hasSibling) {
            let name = undefined;
            let resultPromises = undefined;
            for (let i = 0, n = parsedPatterns.length; i < n; i++) {
                // Pattern matches path
                const parsedPattern = parsedPatterns[i];
                if (parsedPattern.requiresSiblings && hasSibling) {
                    if (!base) {
                        base = (0, path_1.$ec)(path);
                    }
                    if (!name) {
                        name = base.substr(0, base.length - (0, path_1.$fc)(path).length);
                    }
                }
                const result = parsedPattern(path, base, name, hasSibling);
                if (typeof result === 'string') {
                    return result; // immediately return as soon as the first expression matches
                }
                // If the result is a promise, we have to keep it for
                // later processing and await the result properly.
                if ((0, async_1.$eg)(result)) {
                    if (!resultPromises) {
                        resultPromises = [];
                    }
                    resultPromises.push(result);
                }
            }
            // With result promises, we have to loop over each and
            // await the result before we can return any result.
            if (resultPromises) {
                return (async () => {
                    for (const resultPromise of resultPromises) {
                        const result = await resultPromise;
                        if (typeof result === 'string') {
                            return result;
                        }
                    }
                    return null;
                })();
            }
            return null;
        };
        const withBasenames = parsedPatterns.find(pattern => !!pattern.allBasenames);
        if (withBasenames) {
            resultExpression.allBasenames = withBasenames.allBasenames;
        }
        const allPaths = parsedPatterns.reduce((all, current) => current.allPaths ? all.concat(current.allPaths) : all, []);
        if (allPaths.length) {
            resultExpression.allPaths = allPaths;
        }
        return resultExpression;
    }
    function parseExpressionPattern(pattern, value, options) {
        if (value === false) {
            return NULL; // pattern is disabled
        }
        const parsedPattern = parsePattern(pattern, options);
        if (parsedPattern === NULL) {
            return NULL;
        }
        // Expression Pattern is <boolean>
        if (typeof value === 'boolean') {
            return parsedPattern;
        }
        // Expression Pattern is <SiblingClause>
        if (value) {
            const when = value.when;
            if (typeof when === 'string') {
                const result = (path, basename, name, hasSibling) => {
                    if (!hasSibling || !parsedPattern(path, basename)) {
                        return null;
                    }
                    const clausePattern = when.replace('$(basename)', () => name);
                    const matched = hasSibling(clausePattern);
                    return (0, async_1.$eg)(matched) ?
                        matched.then(match => match ? pattern : null) :
                        matched ? pattern : null;
                };
                result.requiresSiblings = true;
                return result;
            }
        }
        // Expression is anything
        return parsedPattern;
    }
    function aggregateBasenameMatches(parsedPatterns, result) {
        const basenamePatterns = parsedPatterns.filter(parsedPattern => !!parsedPattern.basenames);
        if (basenamePatterns.length < 2) {
            return parsedPatterns;
        }
        const basenames = basenamePatterns.reduce((all, current) => {
            const basenames = current.basenames;
            return basenames ? all.concat(basenames) : all;
        }, []);
        let patterns;
        if (result) {
            patterns = [];
            for (let i = 0, n = basenames.length; i < n; i++) {
                patterns.push(result);
            }
        }
        else {
            patterns = basenamePatterns.reduce((all, current) => {
                const patterns = current.patterns;
                return patterns ? all.concat(patterns) : all;
            }, []);
        }
        const aggregate = function (path, basename) {
            if (typeof path !== 'string') {
                return null;
            }
            if (!basename) {
                let i;
                for (i = path.length; i > 0; i--) {
                    const ch = path.charCodeAt(i - 1);
                    if (ch === 47 /* CharCode.Slash */ || ch === 92 /* CharCode.Backslash */) {
                        break;
                    }
                }
                basename = path.substr(i);
            }
            const index = basenames.indexOf(basename);
            return index !== -1 ? patterns[index] : null;
        };
        aggregate.basenames = basenames;
        aggregate.patterns = patterns;
        aggregate.allBasenames = basenames;
        const aggregatedPatterns = parsedPatterns.filter(parsedPattern => !parsedPattern.basenames);
        aggregatedPatterns.push(aggregate);
        return aggregatedPatterns;
    }
    function $ej(patternsA, patternsB) {
        return (0, arrays_1.$0e)(patternsA, patternsB, (a, b) => {
            if (typeof a === 'string' && typeof b === 'string') {
                return a === b;
            }
            if (typeof a !== 'string' && typeof b !== 'string') {
                return a.base === b.base && a.pattern === b.pattern;
            }
            return false;
        });
    }
    exports.$ej = $ej;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[15/*vs/workbench/services/search/common/getFileResults*/], __M([0/*require*/,1/*exports*/,21/*vs/editor/common/core/range*/]), function (require, exports, range_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$pec = void 0;
    const $pec = (bytes, pattern, options) => {
        let text;
        if (bytes[0] === 0xff && bytes[1] === 0xfe) {
            text = new TextDecoder('utf-16le').decode(bytes);
        }
        else if (bytes[0] === 0xfe && bytes[1] === 0xff) {
            text = new TextDecoder('utf-16be').decode(bytes);
        }
        else {
            text = new TextDecoder('utf8').decode(bytes);
            if (text.slice(0, 1000).includes('\uFFFD') && bytes.includes(0)) {
                return [];
            }
        }
        const results = [];
        const patternIndecies = [];
        let patternMatch = null;
        let remainingResultQuota = options.remainingResultQuota;
        while (remainingResultQuota >= 0 && (patternMatch = pattern.exec(text))) {
            patternIndecies.push({ matchStartIndex: patternMatch.index, matchedText: patternMatch[0] });
            remainingResultQuota--;
        }
        if (patternIndecies.length) {
            const contextLinesNeeded = new Set();
            const resultLines = new Set();
            const lineRanges = [];
            const readLine = (lineNumber) => text.slice(lineRanges[lineNumber].start, lineRanges[lineNumber].end);
            let prevLineEnd = 0;
            let lineEndingMatch = null;
            const lineEndRegex = /\r?\n/g;
            while ((lineEndingMatch = lineEndRegex.exec(text))) {
                lineRanges.push({ start: prevLineEnd, end: lineEndingMatch.index });
                prevLineEnd = lineEndingMatch.index + lineEndingMatch[0].length;
            }
            if (prevLineEnd < text.length) {
                lineRanges.push({ start: prevLineEnd, end: text.length });
            }
            let startLine = 0;
            for (const { matchStartIndex, matchedText } of patternIndecies) {
                if (remainingResultQuota < 0) {
                    break;
                }
                while (Boolean(lineRanges[startLine + 1]) && matchStartIndex > lineRanges[startLine].end) {
                    startLine++;
                }
                let endLine = startLine;
                while (Boolean(lineRanges[endLine + 1]) && matchStartIndex + matchedText.length > lineRanges[endLine].end) {
                    endLine++;
                }
                if (options.beforeContext) {
                    for (let contextLine = Math.max(0, startLine - options.beforeContext); contextLine < startLine; contextLine++) {
                        contextLinesNeeded.add(contextLine);
                    }
                }
                let previewText = '';
                let offset = 0;
                for (let matchLine = startLine; matchLine <= endLine; matchLine++) {
                    let previewLine = readLine(matchLine);
                    if (options.previewOptions?.charsPerLine && previewLine.length > options.previewOptions.charsPerLine) {
                        offset = Math.max(matchStartIndex - lineRanges[startLine].start - 20, 0);
                        previewLine = previewLine.substr(offset, options.previewOptions.charsPerLine);
                    }
                    previewText += `${previewLine}\n`;
                    resultLines.add(matchLine);
                }
                const fileRange = new range_1.$Mr(startLine, matchStartIndex - lineRanges[startLine].start, endLine, matchStartIndex + matchedText.length - lineRanges[endLine].start);
                const previewRange = new range_1.$Mr(0, matchStartIndex - lineRanges[startLine].start - offset, endLine - startLine, matchStartIndex + matchedText.length - lineRanges[endLine].start - (endLine === startLine ? offset : 0));
                const match = {
                    ranges: fileRange,
                    preview: { text: previewText, matches: previewRange },
                };
                results.push(match);
                if (options.afterContext) {
                    for (let contextLine = endLine + 1; contextLine <= Math.min(endLine + options.afterContext, lineRanges.length - 1); contextLine++) {
                        contextLinesNeeded.add(contextLine);
                    }
                }
            }
            for (const contextLine of contextLinesNeeded) {
                if (!resultLines.has(contextLine)) {
                    results.push({
                        text: readLine(contextLine),
                        lineNumber: contextLine + 1,
                    });
                }
            }
        }
        return results;
    };
    exports.$pec = $pec;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[16/*vs/workbench/services/search/common/ignoreFile*/], __M([0/*require*/,1/*exports*/,9/*vs/base/common/glob*/]), function (require, exports, glob) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$HGb = void 0;
    class $HGb {
        constructor(contents, b, c) {
            this.b = b;
            this.c = c;
            if (b[b.length - 1] === '\\') {
                throw Error('Unexpected path format, do not use trailing backslashes');
            }
            if (b[b.length - 1] !== '/') {
                b += '/';
            }
            this.a = this.e(contents, this.b, this.c);
        }
        /**
         * Updates the contents of the ignorefile. Preservering the location and parent
         * @param contents The new contents of the gitignore file
         */
        updateContents(contents) {
            this.a = this.e(contents, this.b, this.c);
        }
        /**
         * Returns true if a path in a traversable directory has not been ignored.
         *
         * Note: For performance reasons this does not check if the parent directories have been ignored,
         * so it should always be used in tandem with `shouldTraverseDir` when walking a directory.
         *
         * In cases where a path must be tested in isolation, `isArbitraryPathIncluded` should be used.
         */
        isPathIncludedInTraversal(path, isDir) {
            if (path[0] !== '/' || path[path.length - 1] === '/') {
                throw Error('Unexpected path format, expectred to begin with slash and end without. got:' + path);
            }
            const ignored = this.a(path, isDir);
            return !ignored;
        }
        /**
         * Returns true if an arbitrary path has not been ignored.
         * This is an expensive operation and should only be used ouside of traversals.
         */
        isArbitraryPathIgnored(path, isDir) {
            if (path[0] !== '/' || path[path.length - 1] === '/') {
                throw Error('Unexpected path format, expectred to begin with slash and end without. got:' + path);
            }
            const segments = path.split('/').filter(x => x);
            let ignored = false;
            let walkingPath = '';
            for (let i = 0; i < segments.length; i++) {
                const isLast = i === segments.length - 1;
                const segment = segments[i];
                walkingPath = walkingPath + '/' + segment;
                if (!this.isPathIncludedInTraversal(walkingPath, isLast ? isDir : true)) {
                    ignored = true;
                    break;
                }
            }
            return ignored;
        }
        d(lines, dirPath, trimForExclusions) {
            const includeLines = lines.map(line => this.f(line, dirPath));
            const includeExpression = Object.create(null);
            for (const line of includeLines) {
                includeExpression[line] = true;
            }
            return glob.$aj(includeExpression, { trimForExclusions });
        }
        e(ignoreContents, dirPath, parent) {
            const contentLines = ignoreContents
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && line[0] !== '#');
            // Pull out all the lines that end with `/`, those only apply to directories
            const fileLines = contentLines.filter(line => !line.endsWith('/'));
            const fileIgnoreLines = fileLines.filter(line => !line.includes('!'));
            const isFileIgnored = this.d(fileIgnoreLines, dirPath, true);
            // TODO: Slight hack... this naieve approach may reintroduce too many files in cases of weirdly complex .gitignores
            const fileIncludeLines = fileLines.filter(line => line.includes('!')).map(line => line.replace(/!/g, ''));
            const isFileIncluded = this.d(fileIncludeLines, dirPath, false);
            // When checking if a dir is ignored we can use all lines
            const dirIgnoreLines = contentLines.filter(line => !line.includes('!'));
            const isDirIgnored = this.d(dirIgnoreLines, dirPath, true);
            // Same hack.
            const dirIncludeLines = contentLines.filter(line => line.includes('!')).map(line => line.replace(/!/g, ''));
            const isDirIncluded = this.d(dirIncludeLines, dirPath, false);
            const isPathIgnored = (path, isDir) => {
                if (!path.startsWith(dirPath)) {
                    return false;
                }
                if (isDir && isDirIgnored(path) && !isDirIncluded(path)) {
                    return true;
                }
                if (isFileIgnored(path) && !isFileIncluded(path)) {
                    return true;
                }
                if (parent) {
                    return parent.a(path, isDir);
                }
                return false;
            };
            return isPathIgnored;
        }
        f(line, dirPath) {
            const firstSep = line.indexOf('/');
            if (firstSep === -1 || firstSep === line.length - 1) {
                line = '**/' + line;
            }
            else {
                if (firstSep === 0) {
                    if (dirPath.slice(-1) === '/') {
                        line = line.slice(1);
                    }
                }
                else {
                    if (dirPath.slice(-1) !== '/') {
                        line = '/' + line;
                    }
                }
                line = dirPath + line;
            }
            return line;
        }
    }
    exports.$HGb = $HGb;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[22/*vs/workbench/services/search/worker/localFileSearch*/], __M([0/*require*/,1/*exports*/,9/*vs/base/common/glob*/,6/*vs/base/common/uri*/,3/*vs/base/common/path*/,14/*vs/base/common/cancellation*/,15/*vs/workbench/services/search/common/getFileResults*/,16/*vs/workbench/services/search/common/ignoreFile*/,4/*vs/base/common/strings*/,8/*vs/base/common/async*/,7/*vs/base/common/resources*/]), function (require, exports, glob, uri_1, paths, cancellation_1, getFileResults_1, ignoreFile_1, strings_1, async_1, resources_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LocalFileSearchSimpleWorker = exports.create = void 0;
    const PERF = false;
    const globalStart = +new Date();
    const itrcount = {};
    const time = async (name, task) => {
        if (!PERF) {
            return task();
        }
        const start = Date.now();
        const itr = (itrcount[name] ?? 0) + 1;
        console.info(name, itr, 'starting', Math.round((start - globalStart) * 10) / 10000);
        itrcount[name] = itr;
        const r = await task();
        const end = Date.now();
        console.info(name, itr, 'took', end - start);
        return r;
    };
    /**
     * Called on the worker side
     * @internal
     */
    function create(host) {
        return new LocalFileSearchSimpleWorker(host);
    }
    exports.create = create;
    class LocalFileSearchSimpleWorker {
        constructor(d) {
            this.d = d;
            this.cancellationTokens = new Map();
        }
        cancelQuery(queryId) {
            this.cancellationTokens.get(queryId)?.cancel();
        }
        g(queryId) {
            const source = new cancellation_1.$ed();
            this.cancellationTokens.set(queryId, source);
            return source;
        }
        async listDirectory(handle, query, folderQuery, ignorePathCasing, queryId) {
            const revivedFolderQuery = reviveFolderQuery(folderQuery);
            const extUri = new resources_1.$Uf(() => ignorePathCasing);
            const token = this.g(queryId);
            const entries = [];
            let limitHit = false;
            let count = 0;
            const max = query.maxResults || 512;
            const filePatternMatcher = query.filePattern
                ? (name) => query.filePattern.split('').every(c => name.includes(c))
                : (name) => true;
            await time('listDirectory', () => this.h(handle, reviveQueryProps(query), revivedFolderQuery, extUri, file => {
                if (!filePatternMatcher(file.name)) {
                    return;
                }
                count++;
                if (max && count > max) {
                    limitHit = true;
                    token.cancel();
                }
                return entries.push(file.path);
            }, token.token));
            return {
                results: entries,
                limitHit
            };
        }
        async searchDirectory(handle, query, folderQuery, ignorePathCasing, queryId) {
            const revivedQuery = reviveFolderQuery(folderQuery);
            const extUri = new resources_1.$Uf(() => ignorePathCasing);
            return time('searchInFiles', async () => {
                const token = this.g(queryId);
                const results = [];
                const pattern = createSearchRegExp(query.contentPattern);
                const onGoingProcesses = [];
                let fileCount = 0;
                let resultCount = 0;
                const limitHit = false;
                const processFile = async (file) => {
                    if (token.token.isCancellationRequested) {
                        return;
                    }
                    fileCount++;
                    const contents = await file.resolve();
                    if (token.token.isCancellationRequested) {
                        return;
                    }
                    const bytes = new Uint8Array(contents);
                    const fileResults = (0, getFileResults_1.$pec)(bytes, pattern, {
                        afterContext: query.afterContext ?? 0,
                        beforeContext: query.beforeContext ?? 0,
                        previewOptions: query.previewOptions,
                        remainingResultQuota: query.maxResults ? (query.maxResults - resultCount) : 10000,
                    });
                    if (fileResults.length) {
                        resultCount += fileResults.length;
                        if (query.maxResults && resultCount > query.maxResults) {
                            token.cancel();
                        }
                        const match = {
                            resource: uri_1.URI.joinPath(revivedQuery.folder, file.path),
                            results: fileResults,
                        };
                        this.d.sendTextSearchMatch(match, queryId);
                        results.push(match);
                    }
                };
                await time('walkFolderToResolve', () => this.h(handle, reviveQueryProps(query), revivedQuery, extUri, async (file) => onGoingProcesses.push(processFile(file)), token.token));
                await time('resolveOngoingProcesses', () => Promise.all(onGoingProcesses));
                if (PERF) {
                    console.log('Searched in', fileCount, 'files');
                }
                return {
                    results,
                    limitHit,
                };
            });
        }
        async h(handle, queryProps, folderQuery, extUri, onFile, token) {
            const folderExcludes = glob.$aj(folderQuery.excludePattern ?? {}, { trimForExclusions: true });
            // For folders, only check if the folder is explicitly excluded so walking continues.
            const isFolderExcluded = (path, basename, hasSibling) => {
                path = path.slice(1);
                if (folderExcludes(path, basename, hasSibling)) {
                    return true;
                }
                if (pathExcludedInQuery(queryProps, path)) {
                    return true;
                }
                return false;
            };
            // For files ensure the full check takes place.
            const isFileIncluded = (path, basename, hasSibling) => {
                path = path.slice(1);
                if (folderExcludes(path, basename, hasSibling)) {
                    return false;
                }
                if (!pathIncludedInQuery(queryProps, path, extUri)) {
                    return false;
                }
                return true;
            };
            const processFile = (file, prior) => {
                const resolved = {
                    type: 'file',
                    name: file.name,
                    path: prior,
                    resolve: () => file.getFile().then(r => r.arrayBuffer())
                };
                return resolved;
            };
            const isFileSystemDirectoryHandle = (handle) => {
                return handle.kind === 'directory';
            };
            const isFileSystemFileHandle = (handle) => {
                return handle.kind === 'file';
            };
            const processDirectory = async (directory, prior, ignoreFile) => {
                if (!folderQuery.disregardIgnoreFiles) {
                    const ignoreFiles = await Promise.all([
                        directory.getFileHandle('.gitignore').catch(e => undefined),
                        directory.getFileHandle('.ignore').catch(e => undefined),
                    ]);
                    await Promise.all(ignoreFiles.map(async (file) => {
                        if (!file) {
                            return;
                        }
                        const ignoreContents = new TextDecoder('utf8').decode(new Uint8Array(await (await file.getFile()).arrayBuffer()));
                        ignoreFile = new ignoreFile_1.$HGb(ignoreContents, prior, ignoreFile);
                    }));
                }
                const entries = async_1.Promises.withAsyncBody(async (c) => {
                    const files = [];
                    const dirs = [];
                    const entries = [];
                    const sibilings = new Set();
                    for await (const entry of directory.entries()) {
                        entries.push(entry);
                        sibilings.add(entry[0]);
                    }
                    for (const [basename, handle] of entries) {
                        if (token.isCancellationRequested) {
                            break;
                        }
                        const path = prior + basename;
                        if (ignoreFile && !ignoreFile.isPathIncludedInTraversal(path, handle.kind === 'directory')) {
                            continue;
                        }
                        const hasSibling = (query) => sibilings.has(query);
                        if (isFileSystemDirectoryHandle(handle) && !isFolderExcluded(path, basename, hasSibling)) {
                            dirs.push(processDirectory(handle, path + '/', ignoreFile));
                        }
                        else if (isFileSystemFileHandle(handle) && isFileIncluded(path, basename, hasSibling)) {
                            files.push(processFile(handle, path));
                        }
                    }
                    c([...await Promise.all(dirs), ...files]);
                });
                return {
                    type: 'dir',
                    name: directory.name,
                    entries
                };
            };
            const resolveDirectory = async (directory, onFile) => {
                if (token.isCancellationRequested) {
                    return;
                }
                await Promise.all((await directory.entries)
                    .sort((a, b) => -(a.type === 'dir' ? 0 : 1) + (b.type === 'dir' ? 0 : 1))
                    .map(async (entry) => {
                    if (entry.type === 'dir') {
                        return resolveDirectory(entry, onFile);
                    }
                    else {
                        return onFile(entry);
                    }
                }));
            };
            const processed = await time('process', () => processDirectory(handle, '/'));
            await time('resolve', () => resolveDirectory(processed, onFile));
        }
    }
    exports.LocalFileSearchSimpleWorker = LocalFileSearchSimpleWorker;
    function createSearchRegExp(options) {
        return (0, strings_1.$wd)(options.pattern, !!options.isRegExp, {
            wholeWord: options.isWordMatch,
            global: true,
            matchCase: options.isCaseSensitive,
            multiline: true,
            unicode: true,
        });
    }
    function reviveFolderQuery(folderQuery) {
        return {
            ...folderQuery,
            folder: uri_1.URI.revive(folderQuery.folder),
        };
    }
    function reviveQueryProps(queryProps) {
        return {
            ...queryProps,
            extraFileResources: queryProps.extraFileResources?.map(r => uri_1.URI.revive(r)),
            folderQueries: queryProps.folderQueries.map(fq => reviveFolderQuery(fq)),
        };
    }
    function pathExcludedInQuery(queryProps, fsPath) {
        if (queryProps.excludePattern && glob.$_i(queryProps.excludePattern, fsPath)) {
            return true;
        }
        return false;
    }
    function pathIncludedInQuery(queryProps, path, extUri) {
        if (queryProps.excludePattern && glob.$_i(queryProps.excludePattern, path)) {
            return false;
        }
        if (queryProps.includePattern || queryProps.usingSearchPaths) {
            if (queryProps.includePattern && glob.$_i(queryProps.includePattern, path)) {
                return true;
            }
            // If searchPaths are being used, the extra file must be in a subfolder and match the pattern, if present
            if (queryProps.usingSearchPaths) {
                return !!queryProps.folderQueries && queryProps.folderQueries.some(fq => {
                    const searchPath = fq.folder;
                    const uri = uri_1.URI.file(path);
                    if (extUri.isEqualOrParent(uri, searchPath)) {
                        const relPath = paths.$cc(searchPath.path, uri.path);
                        return !fq.includePattern || !!glob.$_i(fq.includePattern, relPath);
                    }
                    else {
                        return false;
                    }
                });
            }
            return false;
        }
        return true;
    }
});

}).call(this);
//# sourceMappingURL=localFileSearch.js.map
