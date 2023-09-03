/// <reference types="node" />
import { MessagePort, Worker, TransferListItem } from 'worker_threads';
import { BaseMessageConnection } from '../common/messageConnection';
export declare class MessageConnection<Requests extends BaseMessageConnection.RequestType | undefined, Notifications extends BaseMessageConnection.NotificationType | undefined, RequestHandlers extends BaseMessageConnection.RequestType | undefined = undefined, NotificationHandlers extends BaseMessageConnection.NotificationType | undefined = undefined> extends BaseMessageConnection<Requests, Notifications, RequestHandlers, NotificationHandlers, TransferListItem> {
    private readonly port;
    constructor(port: MessagePort | Worker);
    protected postMessage(message: BaseMessageConnection.Message, transferList?: TransferListItem[]): void;
    listen(): void;
}
