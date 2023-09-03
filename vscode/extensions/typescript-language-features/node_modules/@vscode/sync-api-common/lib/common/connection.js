"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Uint8Result_length, _Int8Result_length, _Uint16Result_length, _Int16Result_length, _Uint32Result_length, _Int32Result_length, _Uint64Result_length, _Int64Result_length, _VariableResult_mode;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseServiceConnection = exports.RequestResult = exports.BaseClientConnection = exports.RPCError = exports.RPCErrno = exports.VariableResult = exports.Int64Result = exports.Uint64Result = exports.Int32Result = exports.Uint32Result = exports.Int16Result = exports.Uint16Result = exports.Int8Result = exports.Uint8Result = exports.Notification = exports.Request = void 0;
const ral_1 = __importDefault(require("./ral"));
var TypedArray;
(function (TypedArray) {
    function is(value) {
        return value instanceof Uint8Array || value instanceof Int8Array || value instanceof Uint16Array || value instanceof Int16Array ||
            value instanceof Uint32Array || value instanceof Int32Array || value instanceof BigUint64Array || value instanceof BigInt64Array;
    }
    TypedArray.is = is;
    function set(sharedArrayBuffer, offset, data) {
        if (data instanceof Uint8Array) {
            new Uint8Array(sharedArrayBuffer, offset, data.length).set(data);
        }
        else if (data instanceof Int8Array) {
            new Int8Array(sharedArrayBuffer, offset, data.length).set(data);
        }
        else if (data instanceof Uint16Array) {
            new Uint16Array(sharedArrayBuffer, offset, data.length).set(data);
        }
        else if (data instanceof Int16Array) {
            new Int16Array(sharedArrayBuffer, offset, data.length).set(data);
        }
        else if (data instanceof Uint32Array) {
            new Uint32Array(sharedArrayBuffer, offset, data.length).set(data);
        }
        else if (data instanceof Int32Array) {
            new Int32Array(sharedArrayBuffer, offset, data.length).set(data);
        }
        else if (data instanceof BigUint64Array) {
            new BigUint64Array(sharedArrayBuffer, offset, data.length).set(data);
        }
        else if (data instanceof BigInt64Array) {
            new BigInt64Array(sharedArrayBuffer, offset, data.length).set(data);
        }
        else {
            throw new Error(`Unknown type array type`);
        }
    }
    TypedArray.set = set;
})(TypedArray || (TypedArray = {}));
var Request;
(function (Request) {
    function is(value) {
        const candidate = value;
        return candidate !== undefined && candidate !== null && typeof candidate.method === 'string';
    }
    Request.is = is;
})(Request = exports.Request || (exports.Request = {}));
var Notification;
(function (Notification) {
    function is(value) {
        const candidate = value;
        return candidate !== undefined && candidate !== null && typeof candidate.method === 'string' && typeof candidate.id === 'undefined';
    }
    Notification.is = is;
})(Notification = exports.Notification || (exports.Notification = {}));
class NoResult {
    constructor() {
    }
    get kind() {
        return NoResult.kind;
    }
    get byteLength() {
        return 0;
    }
    get length() {
        return 0;
    }
    getPadding(offset) {
        return 0;
    }
    createResultArray(sharedArrayBuffer, offset) {
        return new Uint8Array(sharedArrayBuffer, offset, 0);
    }
}
NoResult.kind = 0;
class Uint8Result {
    constructor(value) {
        _Uint8Result_length.set(this, void 0);
        __classPrivateFieldSet(this, _Uint8Result_length, value, "f");
    }
    static fromLength(length) {
        return new Uint8Result(length);
    }
    static fromByteLength(byteLength) {
        return new Uint8Result(byteLength);
    }
    get kind() {
        return Uint8Result.kind;
    }
    get byteLength() {
        return __classPrivateFieldGet(this, _Uint8Result_length, "f") * Uint8Array.BYTES_PER_ELEMENT;
    }
    get length() {
        return __classPrivateFieldGet(this, _Uint8Result_length, "f");
    }
    getPadding(offset) {
        return TypedArrayResult.getPadding(offset);
    }
    createResultArray(sharedArrayBuffer, offset) {
        return new Uint8Array(sharedArrayBuffer, offset, this.length);
    }
    is(value) {
        return value instanceof Uint8Array;
    }
}
exports.Uint8Result = Uint8Result;
_Uint8Result_length = new WeakMap();
Uint8Result.kind = 1;
class Int8Result {
    constructor(value) {
        _Int8Result_length.set(this, void 0);
        __classPrivateFieldSet(this, _Int8Result_length, value, "f");
    }
    static fromLength(length) {
        return new Int8Result(length);
    }
    static fromByteLength(byteLength) {
        return new Int8Result(byteLength);
    }
    get kind() {
        return Int8Result.kind;
    }
    get byteLength() {
        return __classPrivateFieldGet(this, _Int8Result_length, "f") * Int8Array.BYTES_PER_ELEMENT;
    }
    get length() {
        return __classPrivateFieldGet(this, _Int8Result_length, "f");
    }
    getPadding(offset) {
        return TypedArrayResult.getPadding(offset);
    }
    createResultArray(sharedArrayBuffer, offset) {
        return new Int8Array(sharedArrayBuffer, offset, this.length);
    }
    is(value) {
        return value instanceof Int8Array;
    }
}
exports.Int8Result = Int8Result;
_Int8Result_length = new WeakMap();
Int8Result.kind = 2;
class Uint16Result {
    constructor(value) {
        _Uint16Result_length.set(this, void 0);
        __classPrivateFieldSet(this, _Uint16Result_length, value, "f");
    }
    static fromLength(length) {
        return new Uint16Result(length);
    }
    static fromByteLength(byteLength) {
        if (byteLength % Uint16Array.BYTES_PER_ELEMENT !== 0) {
            throw new Error(`Byte length must be a multiple of ${Uint16Array.BYTES_PER_ELEMENT} but was ${byteLength}`);
        }
        return new Uint16Result(byteLength / Uint16Array.BYTES_PER_ELEMENT);
    }
    get kind() {
        return Uint16Result.kind;
    }
    get byteLength() {
        return __classPrivateFieldGet(this, _Uint16Result_length, "f") * Uint16Array.BYTES_PER_ELEMENT;
    }
    get length() {
        return __classPrivateFieldGet(this, _Uint16Result_length, "f");
    }
    getPadding(offset) {
        return TypedArrayResult.getPadding(offset);
    }
    createResultArray(sharedArrayBuffer, offset) {
        return new Uint16Array(sharedArrayBuffer, offset, this.length);
    }
    is(value) {
        return value instanceof Uint16Array;
    }
}
exports.Uint16Result = Uint16Result;
_Uint16Result_length = new WeakMap();
Uint16Result.kind = 3;
class Int16Result {
    constructor(value) {
        _Int16Result_length.set(this, void 0);
        __classPrivateFieldSet(this, _Int16Result_length, value, "f");
    }
    static fromLength(length) {
        return new Int16Result(length);
    }
    static fromByteLength(byteLength) {
        if (byteLength % Int16Array.BYTES_PER_ELEMENT !== 0) {
            throw new Error(`Byte length must be a multiple of ${Int16Array.BYTES_PER_ELEMENT} but was ${byteLength}`);
        }
        return new Int16Result(byteLength / Int16Array.BYTES_PER_ELEMENT);
    }
    get kind() {
        return Int16Result.kind;
    }
    get byteLength() {
        return __classPrivateFieldGet(this, _Int16Result_length, "f") * Int16Array.BYTES_PER_ELEMENT;
    }
    get length() {
        return __classPrivateFieldGet(this, _Int16Result_length, "f");
    }
    getPadding(offset) {
        return TypedArrayResult.getPadding(offset);
    }
    createResultArray(sharedArrayBuffer, offset) {
        return new Int16Array(sharedArrayBuffer, offset, this.length);
    }
    is(value) {
        return value instanceof Int16Array;
    }
}
exports.Int16Result = Int16Result;
_Int16Result_length = new WeakMap();
Int16Result.kind = 4;
class Uint32Result {
    constructor(value) {
        _Uint32Result_length.set(this, void 0);
        __classPrivateFieldSet(this, _Uint32Result_length, value, "f");
    }
    static fromLength(length) {
        return new Uint32Result(length);
    }
    static fromByteLength(byteLength) {
        if (byteLength % Uint32Array.BYTES_PER_ELEMENT !== 0) {
            throw new Error(`Byte length must be a multiple of ${Uint32Array.BYTES_PER_ELEMENT} but was ${byteLength}`);
        }
        return new Uint32Result(byteLength / Uint32Array.BYTES_PER_ELEMENT);
    }
    get kind() {
        return Uint32Result.kind;
    }
    get byteLength() {
        return __classPrivateFieldGet(this, _Uint32Result_length, "f") * Uint32Array.BYTES_PER_ELEMENT;
    }
    get length() {
        return __classPrivateFieldGet(this, _Uint32Result_length, "f");
    }
    getPadding(offset) {
        return TypedArrayResult.getPadding(offset);
    }
    createResultArray(sharedArrayBuffer, offset) {
        return new Uint32Array(sharedArrayBuffer, offset, this.length);
    }
    is(value) {
        return value instanceof Uint32Array;
    }
}
exports.Uint32Result = Uint32Result;
_Uint32Result_length = new WeakMap();
Uint32Result.kind = 5;
class Int32Result {
    constructor(value) {
        _Int32Result_length.set(this, void 0);
        __classPrivateFieldSet(this, _Int32Result_length, value, "f");
    }
    static fromLength(length) {
        return new Int32Result(length);
    }
    static fromByteLength(byteLength) {
        if (byteLength % Int32Array.BYTES_PER_ELEMENT !== 0) {
            throw new Error(`Byte length must be a multiple of ${Int32Array.BYTES_PER_ELEMENT} but was ${byteLength}`);
        }
        return new Int32Result(byteLength / Int32Array.BYTES_PER_ELEMENT);
    }
    get kind() {
        return Int32Result.kind;
    }
    get byteLength() {
        return __classPrivateFieldGet(this, _Int32Result_length, "f") * Int32Array.BYTES_PER_ELEMENT;
    }
    get length() {
        return __classPrivateFieldGet(this, _Int32Result_length, "f");
    }
    getPadding(offset) {
        return TypedArrayResult.getPadding(offset);
    }
    createResultArray(sharedArrayBuffer, offset) {
        return new Int32Array(sharedArrayBuffer, offset, this.length);
    }
    is(value) {
        return value instanceof Int32Array;
    }
}
exports.Int32Result = Int32Result;
_Int32Result_length = new WeakMap();
Int32Result.kind = 6;
class Uint64Result {
    constructor(value) {
        _Uint64Result_length.set(this, void 0);
        __classPrivateFieldSet(this, _Uint64Result_length, value, "f");
    }
    static fromLength(length) {
        return new Uint64Result(length);
    }
    static fromByteLength(byteLength) {
        if (byteLength % BigUint64Array.BYTES_PER_ELEMENT !== 0) {
            throw new Error(`Byte length must be a multiple of ${BigUint64Array.BYTES_PER_ELEMENT} but was ${byteLength}`);
        }
        return new Uint64Result(byteLength / BigUint64Array.BYTES_PER_ELEMENT);
    }
    get kind() {
        return Uint64Result.kind;
    }
    get byteLength() {
        return __classPrivateFieldGet(this, _Uint64Result_length, "f") * BigUint64Array.BYTES_PER_ELEMENT;
    }
    get length() {
        return __classPrivateFieldGet(this, _Uint64Result_length, "f");
    }
    getPadding(offset) {
        return BigUint64Array.BYTES_PER_ELEMENT - (offset % BigUint64Array.BYTES_PER_ELEMENT);
    }
    createResultArray(sharedArrayBuffer, offset) {
        return new BigUint64Array(sharedArrayBuffer, offset, this.length);
    }
    is(value) {
        return value instanceof BigUint64Array;
    }
}
exports.Uint64Result = Uint64Result;
_Uint64Result_length = new WeakMap();
Uint64Result.kind = 7;
class Int64Result {
    constructor(value) {
        _Int64Result_length.set(this, void 0);
        __classPrivateFieldSet(this, _Int64Result_length, value, "f");
    }
    static fromLength(length) {
        return new Int64Result(length);
    }
    static fromByteLength(byteLength) {
        if (byteLength % BigInt64Array.BYTES_PER_ELEMENT !== 0) {
            throw new Error(`Byte length must be a multiple of ${BigInt64Array.BYTES_PER_ELEMENT} but was ${byteLength}`);
        }
        return new Int64Result(byteLength / BigInt64Array.BYTES_PER_ELEMENT);
    }
    get kind() {
        return Int64Result.kind;
    }
    get byteLength() {
        return __classPrivateFieldGet(this, _Int64Result_length, "f") * BigInt64Array.BYTES_PER_ELEMENT;
    }
    get length() {
        return __classPrivateFieldGet(this, _Int64Result_length, "f");
    }
    getPadding(offset) {
        return BigInt64Array.BYTES_PER_ELEMENT - (offset % BigInt64Array.BYTES_PER_ELEMENT);
    }
    createResultArray(sharedArrayBuffer, offset) {
        return new BigInt64Array(sharedArrayBuffer, offset, this.length);
    }
    is(value) {
        return value instanceof BigInt64Array;
    }
}
exports.Int64Result = Int64Result;
_Int64Result_length = new WeakMap();
Int64Result.kind = 8;
class VariableResult {
    constructor(mode) {
        _VariableResult_mode.set(this, void 0);
        __classPrivateFieldSet(this, _VariableResult_mode, mode, "f");
    }
    get kind() {
        return VariableResult.kind;
    }
    get mode() {
        return __classPrivateFieldGet(this, _VariableResult_mode, "f");
    }
    get byteLength() {
        return 0;
    }
    get length() {
        return 0;
    }
    getPadding(_offset) {
        return 0;
    }
}
exports.VariableResult = VariableResult;
_VariableResult_mode = new WeakMap();
VariableResult.kind = 9;
var TypedArrayResult;
(function (TypedArrayResult) {
    function fromByteLength(kind, byteLength) {
        switch (kind) {
            case Uint8Result.kind:
                return Uint8Result.fromByteLength(byteLength);
            case Int8Result.kind:
                return Int8Result.fromByteLength(byteLength);
            case Uint16Result.kind:
                return Uint16Result.fromByteLength(byteLength);
            case Int16Result.kind:
                return Int16Result.fromByteLength(byteLength);
            case Uint32Result.kind:
                return Uint32Result.fromByteLength(byteLength);
            case Int32Result.kind:
                return Int32Result.fromByteLength(byteLength);
            case Uint64Result.kind:
                return Uint64Result.fromByteLength(byteLength);
            case Int64Result.kind:
                return Int64Result.fromByteLength(byteLength);
            case VariableResult.kind:
                // send another request to get the result.
                throw new Error(`No result array for variable results result type.`);
            default:
                throw new Error(`Unknown result kind ${kind}`);
        }
    }
    TypedArrayResult.fromByteLength = fromByteLength;
    /**
     * For now we align everything on a 4 byte boundary
     */
    function getPadding(offset) {
        return 4 - (offset % 4);
    }
    TypedArrayResult.getPadding = getPadding;
})(TypedArrayResult || (TypedArrayResult = {}));
var ResultType;
(function (ResultType) {
    function is(value) {
        return value instanceof Uint8Result || value instanceof Int8Result || value instanceof Uint16Result || value instanceof Int16Result ||
            value instanceof Uint32Result || value instanceof Int32Result || value instanceof Uint64Result || value instanceof Int64Result ||
            value instanceof VariableResult || value instanceof NoResult;
    }
    ResultType.is = is;
})(ResultType || (ResultType = {}));
/**
 * Errno numbers specific to the sync RPC calls. We start at 16384 to not collide
 * with POSIX error numbers.
 */
var RPCErrno;
(function (RPCErrno) {
    /**
     * No error occurred. RPC  call completed successfully.
     */
    RPCErrno.Success = 0;
    /**
     * The sync RPC called timed out.
     */
    RPCErrno.TimedOut = 1;
    /**
     * A unknown error has occurred.
     */
    RPCErrno.UnknownError = 16384;
    /**
     * Fetching the lazy result from the service failed.
     */
    RPCErrno.LazyResultFailed = RPCErrno.UnknownError + 1;
    /**
     * No handler on the service side found.
     */
    RPCErrno.NoHandlerFound = RPCErrno.LazyResultFailed + 1;
    /**
     * Invalid message format.
     */
    RPCErrno.InvalidMessageFormat = RPCErrno.NoHandlerFound + 1;
    /**
     * Start of the custom error number range.
     */
    RPCErrno.$Custom = 32768;
})(RPCErrno = exports.RPCErrno || (exports.RPCErrno = {}));
class RPCError extends Error {
    constructor(errno, message) {
        super(message);
        this.errno = errno;
    }
}
exports.RPCError = RPCError;
class BaseClientConnection {
    constructor() {
        this.sendRequest = this._sendRequest;
        this.id = 1;
        this.textEncoder = (0, ral_1.default)().TextEncoder.create();
        this.textDecoder = (0, ral_1.default)().TextDecoder.create();
        this.readyPromise = new Promise((resolve, reject) => {
            this.readyCallbacks = { resolve, reject };
        });
    }
    serviceReady() {
        return this.readyPromise;
    }
    _sendRequest(method, arg1, arg2, arg3) {
        const id = this.id++;
        const request = { id: id, method };
        let params = undefined;
        let resultType = new NoResult();
        let timeout = undefined;
        if (ResultType.is(arg1)) {
            resultType = arg1;
        }
        else if (typeof arg1 === 'number') {
            timeout = arg1;
        }
        else if (arg1 !== undefined || arg1 !== null) {
            params = arg1;
        }
        if (typeof arg2 === 'number') {
            timeout = arg2;
        }
        else if (arg2 !== undefined) {
            resultType = arg2;
        }
        if (typeof arg3 === 'number') {
            timeout = arg3;
        }
        if (params !== undefined) {
            request.params = {};
            for (const property of Object.keys(params)) {
                if (property !== 'binary') {
                    request.params[property] = params[property];
                }
                else {
                    request.params['binary'] = null;
                }
            }
        }
        const requestData = this.textEncoder.encode(JSON.stringify(request, undefined, 0));
        const binaryData = params?.binary;
        const binaryDataLength = binaryData !== undefined ? binaryData.byteLength : 0;
        const requestOffset = 4 /* SyncSize.total */ + 32 /* HeaderSize.total */;
        const binaryOffset = requestOffset + requestData.byteLength;
        const resultByteLength = resultType.byteLength;
        const resultPadding = resultType.getPadding(binaryOffset + binaryDataLength);
        const resultOffset = (binaryOffset + binaryDataLength) + resultPadding;
        const sharedArrayBufferLength = 4 /* SyncSize.total */ + 32 /* HeaderSize.total */ + requestData.byteLength + binaryDataLength + resultPadding + resultByteLength;
        const sharedArrayBuffer = new SharedArrayBuffer(sharedArrayBufferLength);
        const header = new Uint32Array(sharedArrayBuffer, 4 /* SyncSize.total */, 32 /* HeaderSize.total */ / 4);
        header[0 /* HeaderIndex.messageOffset */] = requestOffset;
        header[1 /* HeaderIndex.messageByteLength */] = requestData.byteLength;
        header[2 /* HeaderIndex.binaryParamOffset */] = binaryOffset;
        header[3 /* HeaderIndex.binaryParamByteLength */] = binaryDataLength;
        header[4 /* HeaderIndex.errno */] = RPCErrno.Success;
        header[5 /* HeaderIndex.resultKind */] = resultType.kind;
        header[6 /* HeaderIndex.resultOffset */] = resultOffset;
        header[7 /* HeaderIndex.resultByteLength */] = resultByteLength;
        const raw = new Uint8Array(sharedArrayBuffer);
        raw.set(requestData, requestOffset);
        if (binaryData !== undefined) {
            raw.set(binaryData, binaryOffset);
        }
        // Send the shard array buffer to the other worker
        const sync = new Int32Array(sharedArrayBuffer, 0, 1);
        Atomics.store(sync, 0, 0);
        // Send the shared array buffer to the extension host worker
        this.postMessage(sharedArrayBuffer);
        // Wait for the answer
        const result = Atomics.wait(sync, 0, 0, timeout);
        switch (result) {
            case 'timed-out':
                return { errno: RPCErrno.TimedOut };
            case 'not-equal':
                const value = Atomics.load(sync, 0);
                // If the value === 1 the service has already
                // provided the result. Otherwise we actually
                // don't know what happened :-(.
                if (value !== 1) {
                    return { errno: RPCErrno.UnknownError };
                }
        }
        const errno = header[4 /* HeaderIndex.errno */];
        if (errno !== 0) {
            return { errno };
        }
        else {
            switch (resultType.kind) {
                case NoResult.kind:
                    return { errno: 0 };
                case VariableResult.kind:
                    const lazyResultLength = header[7 /* HeaderIndex.resultByteLength */];
                    if (lazyResultLength === 0) {
                        return { errno: 0, data: resultType.mode === 'binary' ? new Uint8Array(0) : '' };
                    }
                    const lazyResult = this._sendRequest('$/fetchResult', { resultId: id }, Uint8Result.fromLength(lazyResultLength), timeout);
                    if (lazyResult.errno !== 0) {
                        return { errno: lazyResult.errno };
                    }
                    if (RequestResult.hasData(lazyResult)) {
                        try {
                            // We need to slice the Uint8Array we received since it is a view onto a
                            // shared array buffer and in the browser the text decoder throws when
                            // reading from a Uint8Array. Since this seems to be the correct behavior
                            // anyways (the array could otherwise change underneath) we do the same
                            // for NodeJS
                            const data = resultType.mode === 'binary'
                                ? lazyResult.data
                                : JSON.parse(this.textDecoder.decode(lazyResult.data.slice()));
                            return { errno: 0, data };
                        }
                        catch (error) {
                            (0, ral_1.default)().console.error(error);
                            return { errno: RPCErrno.LazyResultFailed };
                        }
                    }
                    else {
                        return { errno: RPCErrno.LazyResultFailed };
                    }
                default:
                    return { errno: 0, data: resultType.createResultArray(sharedArrayBuffer, resultOffset) };
            }
        }
    }
    handleMessage(message) {
        if (message.method === '$/ready') {
            this.readyCallbacks.resolve(message.params);
        }
    }
}
exports.BaseClientConnection = BaseClientConnection;
var RequestResult;
(function (RequestResult) {
    function hasData(value) {
        const candidate = value;
        return candidate.errno === 0 && candidate.data !== undefined;
    }
    RequestResult.hasData = hasData;
})(RequestResult = exports.RequestResult || (exports.RequestResult = {}));
class BaseServiceConnection {
    constructor() {
        this.onRequest = this._onRequest;
        this.textDecoder = (0, ral_1.default)().TextDecoder.create();
        this.textEncoder = (0, ral_1.default)().TextEncoder.create();
        this.requestHandlers = new Map();
        this.requestResults = new Map();
    }
    _onRequest(method, handler) {
        this.requestHandlers.set(method, handler);
        return {
            dispose: () => this.requestHandlers.delete(method)
        };
    }
    async handleMessage(sharedArrayBuffer) {
        const header = new Uint32Array(sharedArrayBuffer, 4 /* SyncSize.total */, 32 /* HeaderSize.total */ / 4);
        const requestOffset = header[0 /* HeaderIndex.messageOffset */];
        const requestLength = header[1 /* HeaderIndex.messageByteLength */];
        try {
            // See above why we need to slice the Uint8Array.
            const message = JSON.parse(this.textDecoder.decode(new Uint8Array(sharedArrayBuffer, requestOffset, requestLength).slice()));
            if (Request.is(message)) {
                if (message.method === '$/fetchResult') {
                    const resultId = message.params.resultId;
                    const result = this.requestResults.get(resultId);
                    this.requestResults.delete(resultId);
                    const resultOffset = header[6 /* HeaderIndex.resultOffset */];
                    const resultByteLength = header[7 /* HeaderIndex.resultByteLength */];
                    if (result !== undefined && result.byteLength === resultByteLength) {
                        TypedArray.set(sharedArrayBuffer, resultOffset, result);
                        header[4 /* HeaderIndex.errno */] = RPCErrno.Success;
                    }
                    else {
                        header[4 /* HeaderIndex.errno */] = RPCErrno.LazyResultFailed;
                    }
                }
                else {
                    if (message.params?.binary === null) {
                        const binaryParamsLength = header[3 /* HeaderIndex.binaryParamByteLength */];
                        const binaryParamsOffset = header[2 /* HeaderIndex.binaryParamOffset */];
                        const binary = new Uint8Array(sharedArrayBuffer, binaryParamsOffset, binaryParamsLength);
                        message.params = message.params ?? {};
                        message.params.binary = binary;
                    }
                    const handler = this.requestHandlers.get(message.method);
                    if (handler !== undefined) {
                        const resultKind = header[5 /* HeaderIndex.resultKind */];
                        const resultOffset = header[6 /* HeaderIndex.resultOffset */];
                        const resultByteLength = header[7 /* HeaderIndex.resultByteLength */];
                        let handlerResult;
                        let requestResult;
                        switch (resultKind) {
                            case NoResult.kind:
                                handlerResult = message.params !== undefined ? handler(message.params) : handler();
                                requestResult = handlerResult instanceof Promise ? await handlerResult : handlerResult;
                                header[4 /* HeaderIndex.errno */] = requestResult.errno;
                                break;
                            case VariableResult.kind:
                                handlerResult = message.params !== undefined ? handler(message.params) : handler();
                                requestResult = handlerResult instanceof Promise ? await handlerResult : handlerResult;
                                header[4 /* HeaderIndex.errno */] = requestResult.errno;
                                if (requestResult.errno === 0) {
                                    if (RequestResult.hasData(requestResult)) {
                                        const data = requestResult.data;
                                        const buffer = TypedArray.is(data)
                                            ? data
                                            : this.textEncoder.encode(JSON.stringify(data, undefined, 0));
                                        header[7 /* HeaderIndex.resultByteLength */] = buffer.byteLength;
                                        // We only need to keep a result which is greater than zero.
                                        // If it is zero we can create an empty array on the other side.
                                        if (buffer.byteLength > 0) {
                                            this.requestResults.set(message.id, buffer);
                                        }
                                    }
                                }
                                break;
                            default:
                                const typedResult = TypedArrayResult.fromByteLength(resultKind, resultByteLength);
                                const resultBuffer = typedResult.createResultArray(sharedArrayBuffer, resultOffset);
                                handlerResult = message.params !== undefined ? handler(message.params, resultBuffer) : handler(resultBuffer);
                                requestResult = handlerResult instanceof Promise ? await handlerResult : handlerResult;
                                header[4 /* HeaderIndex.errno */] = requestResult.errno;
                        }
                    }
                    else {
                        header[4 /* HeaderIndex.errno */] = RPCErrno.NoHandlerFound;
                    }
                }
            }
            else {
                header[4 /* HeaderIndex.errno */] = RPCErrno.InvalidMessageFormat;
            }
        }
        catch (error) {
            (0, ral_1.default)().console.error(error);
            header[4 /* HeaderIndex.errno */] = RPCErrno.UnknownError;
        }
        const sync = new Int32Array(sharedArrayBuffer, 0, 1);
        Atomics.store(sync, 0, 1);
        Atomics.notify(sync, 0);
    }
    signalReady() {
        const notification = { method: '$/ready' };
        this.postMessage(notification);
    }
}
exports.BaseServiceConnection = BaseServiceConnection;
//# sourceMappingURL=connection.js.map