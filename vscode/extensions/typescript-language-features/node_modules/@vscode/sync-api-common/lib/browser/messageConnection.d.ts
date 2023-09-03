import { BaseMessageConnection } from '../common/messageConnection';
export declare class MessageConnection<Requests extends BaseMessageConnection.RequestType | undefined, Notifications extends BaseMessageConnection.NotificationType | undefined, RequestHandlers extends BaseMessageConnection.RequestType | undefined = undefined, NotificationHandlers extends BaseMessageConnection.NotificationType | undefined = undefined> extends BaseMessageConnection<Requests, Notifications, RequestHandlers, NotificationHandlers, Transferable> {
    private readonly port;
    constructor(port: MessagePort | Worker | DedicatedWorkerGlobalScope);
    protected postMessage(message: BaseMessageConnection.Message, transfer?: Transferable[]): void;
    listen(): void;
}
