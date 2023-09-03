import { Disposable } from './disposable';
export declare type u8 = number;
export declare type u16 = number;
export declare type u32 = number;
export declare type u64 = number;
export declare type size = u32;
export declare type Message = {
    method: string;
    params?: Params;
};
export declare type TypedArray = Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array | BigUint64Array | BigInt64Array;
export declare type Params = {
    [key: string]: null | undefined | number | boolean | string | object | Uint8Array;
    binary?: Uint8Array;
};
export declare type Request = {
    id: number;
} & Message;
export declare namespace Request {
    function is(value: any): value is Request;
}
export declare type Notification = Message;
export declare namespace Notification {
    function is(value: any): value is Notification;
}
export declare type MessageType = {
    method: string;
    params?: null | object;
};
export declare type RequestType = MessageType & ({
    result?: TypedArray | object | null;
});
declare class NoResult {
    static readonly kind: 0;
    constructor();
    get kind(): 0;
    get byteLength(): number;
    get length(): number;
    getPadding(offset: number): number;
    createResultArray(sharedArrayBuffer: SharedArrayBuffer, offset: number): Uint8Array;
}
export declare class Uint8Result {
    #private;
    static readonly kind: 1;
    static fromLength(length: number): Uint8Result;
    static fromByteLength(byteLength: number): Uint8Result;
    private constructor();
    get kind(): 1;
    get byteLength(): number;
    get length(): number;
    getPadding(offset: number): number;
    createResultArray(sharedArrayBuffer: SharedArrayBuffer, offset: number): Uint8Array;
    is(value: any): value is Uint8Array;
}
export declare class Int8Result {
    #private;
    static readonly kind: 2;
    static fromLength(length: number): Int8Result;
    static fromByteLength(byteLength: number): Int8Result;
    private constructor();
    get kind(): 2;
    get byteLength(): number;
    get length(): number;
    getPadding(offset: number): number;
    createResultArray(sharedArrayBuffer: SharedArrayBuffer, offset: number): Int8Array;
    is(value: any): value is Int8Array;
}
export declare class Uint16Result {
    #private;
    static readonly kind: 3;
    static fromLength(length: number): Uint16Result;
    static fromByteLength(byteLength: number): Uint16Result;
    private constructor();
    get kind(): 3;
    get byteLength(): number;
    get length(): number;
    getPadding(offset: number): number;
    createResultArray(sharedArrayBuffer: SharedArrayBuffer, offset: number): Uint16Array;
    is(value: any): value is Uint16Array;
}
export declare class Int16Result {
    #private;
    static readonly kind: 4;
    static fromLength(length: number): Int16Result;
    static fromByteLength(byteLength: number): Int16Result;
    private constructor();
    get kind(): 4;
    get byteLength(): number;
    get length(): number;
    getPadding(offset: number): number;
    createResultArray(sharedArrayBuffer: SharedArrayBuffer, offset: number): Int16Array;
    is(value: any): value is Int16Array;
}
export declare class Uint32Result {
    #private;
    static readonly kind: 5;
    static fromLength(length: number): Uint32Result;
    static fromByteLength(byteLength: number): Uint32Result;
    private constructor();
    get kind(): 5;
    get byteLength(): number;
    get length(): number;
    getPadding(offset: number): number;
    createResultArray(sharedArrayBuffer: SharedArrayBuffer, offset: number): Uint32Array;
    is(value: any): value is Uint32Array;
}
export declare class Int32Result {
    #private;
    static readonly kind: 6;
    static fromLength(length: number): Int32Result;
    static fromByteLength(byteLength: number): Int32Result;
    private constructor();
    get kind(): 6;
    get byteLength(): number;
    get length(): number;
    getPadding(offset: number): number;
    createResultArray(sharedArrayBuffer: SharedArrayBuffer, offset: number): Int32Array;
    is(value: any): value is Int32Array;
}
export declare class Uint64Result {
    #private;
    static readonly kind: 7;
    static fromLength(length: number): Uint64Result;
    static fromByteLength(byteLength: number): Uint64Result;
    private constructor();
    get kind(): 7;
    get byteLength(): number;
    get length(): number;
    getPadding(offset: number): number;
    createResultArray(sharedArrayBuffer: SharedArrayBuffer, offset: number): BigUint64Array;
    is(value: any): value is BigUint64Array;
}
export declare class Int64Result {
    #private;
    static readonly kind: 8;
    static fromLength(length: number): Int64Result;
    static fromByteLength(byteLength: number): Int64Result;
    private constructor();
    get kind(): 8;
    get byteLength(): number;
    get length(): number;
    getPadding(offset: number): number;
    createResultArray(sharedArrayBuffer: SharedArrayBuffer, offset: number): BigInt64Array;
    is(value: any): value is BigInt64Array;
}
export declare class VariableResult<_T = undefined> {
    #private;
    static readonly kind: 9;
    constructor(mode: 'binary' | 'json');
    get kind(): 9;
    get mode(): "binary" | "json";
    get byteLength(): number;
    get length(): number;
    getPadding(_offset: number): number;
}
export declare type TypedArrayResult = Uint8Result | Int8Result | Uint16Result | Int16Result | Uint32Result | Int32Result | Uint64Result | Int64Result;
export declare type ResultType = NoResult | TypedArrayResult | VariableResult<object | TypedArray>;
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
declare type MethodKeys<Messages extends MessageType> = {
    [M in Messages as M['method']]: M['method'];
};
declare type LengthType<T extends TypedArray> = T extends Uint8Array ? Uint8Result : T extends Int8Array ? Int8Result : T extends Uint16Array ? Uint16Result : T extends Int16Array ? Int16Result : T extends Uint32Array ? Uint32Result : T extends Int32Array ? Int32Result : T extends BigUint64Array ? Uint64Result : T extends BigInt64Array ? Int64Result : never;
declare type _SendRequestSignatures<Requests extends RequestType> = UnionToIntersection<{
    [R in Requests as R['method']]: R['params'] extends null | undefined ? R['result'] extends null | undefined ? (method: R['method'], timeout?: number) => {
        errno: RPCErrno;
    } : R['result'] extends TypedArray ? (method: R['method'], resultKind: LengthType<R['result']>, timeout?: number) => {
        errno: 0;
        data: R['result'];
    } | {
        errno: RPCErrno;
    } : R['result'] extends VariableResult<infer T> ? (method: R['method'], resultKind: VariableResult<T>, timeout?: number) => {
        errno: 0;
        data: T;
    } | {
        errno: RPCErrno;
    } : never : R['result'] extends null | undefined ? (method: R['method'], params: R['params'], timeout?: number) => {
        errno: RPCErrno;
    } : R['result'] extends TypedArray ? (method: R['method'], params: R['params'], resultKind: LengthType<R['result']>, timeout?: number) => {
        errno: 0;
        data: R['result'];
    } | {
        errno: RPCErrno;
    } : R['result'] extends VariableResult<infer T> ? (method: R['method'], params: R['params'], resultKind: VariableResult<T>, timeout?: number) => {
        errno: 0;
        data: T;
    } | {
        errno: RPCErrno;
    } : never;
}[keyof MethodKeys<Requests>]>;
declare type SendRequestSignatures<Requests extends RequestType | undefined> = [Requests] extends [RequestType] ? _SendRequestSignatures<Requests> : undefined;
/**
 * Errno numbers specific to the sync RPC calls. We start at 16384 to not collide
 * with POSIX error numbers.
 */
export declare namespace RPCErrno {
    /**
     * No error occurred. RPC  call completed successfully.
     */
    const Success = 0;
    /**
     * The sync RPC called timed out.
     */
    const TimedOut = 1;
    /**
     * A unknown error has occurred.
     */
    const UnknownError = 16384;
    /**
     * Fetching the lazy result from the service failed.
     */
    const LazyResultFailed: number;
    /**
     * No handler on the service side found.
     */
    const NoHandlerFound: number;
    /**
     * Invalid message format.
     */
    const InvalidMessageFormat: number;
    /**
     * Start of the custom error number range.
     */
    const $Custom = 32768;
}
export declare type RPCErrno = u32;
export declare class RPCError extends Error {
    readonly errno: RPCErrno;
    constructor(errno: RPCErrno, message?: string);
}
export interface ClientConnection<Requests extends RequestType | undefined = undefined> {
    readonly sendRequest: SendRequestSignatures<Requests>;
    serviceReady(): Promise<void>;
}
export declare abstract class BaseClientConnection<Requests extends RequestType | undefined = undefined> implements ClientConnection<Requests> {
    private id;
    private readonly textEncoder;
    private readonly textDecoder;
    private readonly readyPromise;
    private readyCallbacks;
    constructor();
    serviceReady(): Promise<void>;
    readonly sendRequest: SendRequestSignatures<Requests>;
    private _sendRequest;
    protected abstract postMessage(sharedArrayBuffer: SharedArrayBuffer): any;
    protected handleMessage(message: Message): void;
}
declare type _HandleRequestSignatures<Requests extends RequestType> = UnionToIntersection<{
    [R in Requests as R['method']]: R['params'] extends null | undefined ? R['result'] extends null | undefined ? (method: R['method'], handler: () => {
        errno: RPCErrno;
    } | Promise<{
        errno: RPCErrno;
    }>) => Disposable : R['result'] extends TypedArray ? (method: R['method'], handler: (resultBuffer: R['result']) => {
        errno: RPCErrno;
    } | Promise<{
        errno: RPCErrno;
    }>) => Disposable : R['result'] extends VariableResult<infer T> ? (method: R['method'], handler: () => {
        errno: RPCErrno;
    } | {
        errno: 0;
        data: T;
    } | Promise<{
        errno: RPCErrno;
    } | {
        errno: 0;
        data: T;
    }>) => Disposable : never : R['result'] extends null | undefined ? (method: R['method'], handler: (params: R['params']) => {
        errno: RPCErrno;
    } | Promise<{
        errno: RPCErrno;
    }>) => Disposable : R['result'] extends TypedArray ? (method: R['method'], handler: (params: R['params'], resultBuffer: R['result']) => {
        errno: RPCErrno;
    } | Promise<{
        errno: RPCErrno;
    }>) => Disposable : R['result'] extends VariableResult<infer T> ? (method: R['method'], handler: (params: R['params']) => {
        errno: RPCErrno;
    } | {
        errno: 0;
        data: T;
    } | Promise<{
        errno: RPCErrno;
    } | {
        errno: 0;
        data: T;
    }>) => Disposable : never;
}[keyof MethodKeys<Requests>]>;
declare type HandleRequestSignatures<Requests extends RequestType | undefined> = [Requests] extends [RequestType] ? _HandleRequestSignatures<Requests> : undefined;
export declare namespace RequestResult {
    function hasData<T>(value: {
        errno: RPCErrno;
    } | {
        errno: 0;
        data: T;
    }): value is {
        errno: 0;
        data: T;
    };
}
export interface ServiceConnection<RequestHandlers extends RequestType | undefined = undefined> {
    readonly onRequest: HandleRequestSignatures<RequestHandlers>;
    signalReady(): void;
}
export declare abstract class BaseServiceConnection<RequestHandlers extends RequestType | undefined = undefined> implements ServiceConnection<RequestHandlers> {
    private readonly textDecoder;
    private readonly textEncoder;
    private readonly requestHandlers;
    private readonly requestResults;
    constructor();
    readonly onRequest: HandleRequestSignatures<RequestHandlers>;
    private _onRequest;
    protected handleMessage(sharedArrayBuffer: SharedArrayBuffer): Promise<void>;
    signalReady(): void;
    protected abstract postMessage(message: Message): void;
}
export {};
