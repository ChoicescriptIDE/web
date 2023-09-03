declare type _MessageType = {
    method: string;
    params?: null | object;
};
declare type _RequestType = _MessageType & {
    result: null | undefined | void | any;
    error?: undefined;
};
declare type _NotificationType = _MessageType;
interface AbstractMessage {
    method: string;
    params?: null | undefined | object;
}
interface _Request extends AbstractMessage {
    id: number;
}
declare namespace _Request {
    function is(value: any): value is _Request;
}
interface _Notification extends AbstractMessage {
}
declare namespace _Notification {
    function is(value: any): value is _NotificationType;
}
interface _Response {
    id: number;
    result?: any;
    error?: any;
}
declare namespace _Response {
    function is(value: any): value is _Response;
}
declare type _Message = _Request | _Notification | _Response;
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
declare type MethodKeys<Messages extends _MessageType> = {
    [M in Messages as M['method']]: M['method'];
};
declare type _SendRequestSignatures<Requests extends _RequestType, TLI> = UnionToIntersection<{
    [R in Requests as R['method']]: R['params'] extends null | undefined | void ? (method: R['method']) => Promise<R['result'] extends null | undefined ? void : R['result']> : (method: R['method'], params: R['params'], transferList?: ReadonlyArray<TLI>) => Promise<R['result'] extends null | undefined ? void : R['result']>;
}[keyof MethodKeys<Requests>]>;
declare type SendRequestSignatures<Requests extends _RequestType | undefined, TLI> = [Requests] extends [_RequestType] ? _SendRequestSignatures<Requests, TLI> : undefined;
declare type _HandleRequestSignatures<Requests extends _RequestType> = UnionToIntersection<{
    [R in Requests as R['method']]: R['params'] extends null | undefined | void ? (method: R['method'], handler: () => Promise<R['result'] extends null | undefined ? void : R['result']>) => void : (method: R['method'], handler: (params: R['params']) => Promise<R['result'] extends null | undefined ? void : R['result']>) => void;
}[keyof MethodKeys<Requests>]>;
declare type HandleRequestSignatures<Requests extends _RequestType | undefined> = [Requests] extends [_RequestType] ? _HandleRequestSignatures<Requests> : undefined;
declare type _SendNotificationSignatures<Notifications extends _NotificationType, TLI> = UnionToIntersection<{
    [N in Notifications as N['method']]: N['params'] extends null | undefined | void ? (method: N['method']) => void : (method: N['method'], params: N['params'], transferList?: ReadonlyArray<TLI>) => void;
}[keyof MethodKeys<Notifications>]>;
declare type SendNotificationSignatures<Notifications extends _NotificationType | undefined, TLI> = [Notifications] extends [_NotificationType] ? _SendNotificationSignatures<Notifications, TLI> : undefined;
declare type _HandleNotificationSignatures<Notifications extends _NotificationType> = UnionToIntersection<{
    [N in Notifications as N['method']]: N['params'] extends null | undefined | void ? (method: N['method'], handler: () => void) => void : (method: N['method'], handler: (params: N['params']) => void) => void;
}[keyof MethodKeys<Notifications>]>;
declare type HandleNotificationSignatures<Notifications extends _NotificationType | undefined> = [Notifications] extends [_NotificationType] ? _HandleNotificationSignatures<Notifications> : undefined;
export declare abstract class BaseMessageConnection<Requests extends _RequestType | undefined, Notifications extends _NotificationType | undefined, RequestHandlers extends _RequestType | undefined = undefined, NotificationHandlers extends _NotificationType | undefined = undefined, TLI = unknown> {
    private id;
    private readonly responsePromises;
    private readonly requestHandlers;
    private readonly notificationHandlers;
    constructor();
    readonly sendRequest: SendRequestSignatures<Requests, TLI>;
    private _sendRequest;
    readonly onRequest: HandleRequestSignatures<RequestHandlers>;
    private _onRequest;
    readonly sendNotification: SendNotificationSignatures<Notifications, TLI>;
    private _sendNotification;
    readonly onNotification: HandleNotificationSignatures<NotificationHandlers>;
    private _onNotification;
    abstract listen(): void;
    protected abstract postMessage(message: _Message | _Response, transferList?: ReadonlyArray<TLI>): void;
    protected handleMessage(message: _Message): Promise<void>;
    private sendResultResponse;
    private sendErrorResponse;
}
export declare namespace BaseMessageConnection {
    type MessageType = _MessageType;
    type RequestType = _RequestType;
    type NotificationType = _NotificationType;
    type Request = _Request;
    const Request: typeof _Request;
    type Notification = _Notification;
    const Notification: typeof _Notification;
    type Response = _Response;
    const Response: typeof _Response;
    type Message = _Message;
}
export {};
