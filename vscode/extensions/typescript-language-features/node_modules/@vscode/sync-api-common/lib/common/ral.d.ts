import { Disposable } from './disposable';
import type { RequestType, ClientConnection, ServiceConnection } from './connection';
interface _TextEncoder {
    encode(input?: string): Uint8Array;
}
interface _TextDecoder {
    decode(input?: Uint8Array): string;
}
interface _TestServiceConnection<RequestHandlers extends RequestType | undefined = undefined> extends ServiceConnection<RequestHandlers> {
    terminate(): Promise<number>;
}
export declare enum _RALType {
    Browser = 1,
    Node = 2
}
interface RAL {
    readonly type: _RALType;
    readonly TextEncoder: {
        create(encoding?: string): _TextEncoder;
    };
    readonly TextDecoder: {
        create(encoding?: string): _TextDecoder;
    };
    readonly console: {
        info(message?: any, ...optionalParams: any[]): void;
        log(message?: any, ...optionalParams: any[]): void;
        warn(message?: any, ...optionalParams: any[]): void;
        error(message?: any, ...optionalParams: any[]): void;
    };
    readonly timer: {
        setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable;
        setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable;
        setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable;
    };
    readonly $testing: {
        readonly ClientConnection: {
            create<Requests extends RequestType | undefined = undefined>(): ClientConnection<Requests>;
        };
        readonly ServiceConnection: {
            create<RequestHandlers extends RequestType | undefined = undefined>(script: string, testCase?: string): _TestServiceConnection<RequestHandlers>;
        };
        readonly testCase: string;
    };
}
declare function RAL(): RAL;
declare namespace RAL {
    const Type: typeof _RALType;
    type TextEncoder = _TextEncoder;
    type TextDecoder = _TextDecoder;
    function install(ral: RAL): void;
}
export default RAL;
