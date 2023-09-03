/// <reference types="node" />
import { MessagePort, Worker } from 'worker_threads';
import { BaseServiceConnection, BaseClientConnection, Message, RequestType } from '../common/connection';
export declare class ClientConnection<Requests extends RequestType | undefined = undefined> extends BaseClientConnection<Requests> {
    private readonly port;
    constructor(port: MessagePort | Worker);
    protected postMessage(sharedArrayBuffer: SharedArrayBuffer): void;
}
export declare class ServiceConnection<RequestHandlers extends RequestType | undefined = undefined> extends BaseServiceConnection<RequestHandlers> {
    private readonly port;
    constructor(port: MessagePort | Worker);
    protected postMessage(message: Message): void;
}
