"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMessageConnection = void 0;
var _Request;
(function (_Request) {
    function is(value) {
        const candidate = value;
        return candidate !== undefined && candidate !== null && typeof candidate.id === 'number' && typeof candidate.method === 'string';
    }
    _Request.is = is;
})(_Request || (_Request = {}));
var _Notification;
(function (_Notification) {
    function is(value) {
        const candidate = value;
        return candidate !== undefined && candidate !== null && typeof candidate.method === 'string' && candidate.id === undefined;
    }
    _Notification.is = is;
})(_Notification || (_Notification = {}));
var _Response;
(function (_Response) {
    function is(value) {
        const candidate = value;
        return candidate !== undefined && candidate !== null && typeof candidate.id === 'number' && (candidate.error !== undefined || candidate.result !== undefined);
    }
    _Response.is = is;
})(_Response || (_Response = {}));
class BaseMessageConnection {
    constructor() {
        this.sendRequest = this._sendRequest;
        this.onRequest = this._onRequest;
        this.sendNotification = this._sendNotification;
        this.onNotification = this._onNotification;
        this.id = 1;
        this.responsePromises = new Map();
        this.requestHandlers = new Map();
        this.notificationHandlers = new Map();
    }
    _sendRequest(method, params, transferList) {
        if (method === undefined) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const id = this.id++;
            const request = { id, method };
            if (params !== undefined) {
                request.params = params;
            }
            this.responsePromises.set(id, { resolve, reject, method: request.method });
            this.postMessage(request, transferList);
        });
    }
    _onRequest(method, handler) {
        if (method === undefined || handler === undefined) {
            return;
        }
        this.requestHandlers.set(method, handler);
    }
    _sendNotification(method, params, transferList) {
        if (method === undefined) {
            return;
        }
        const notification = { method };
        if (params !== undefined) {
            notification.params = params;
        }
        this.postMessage(notification, transferList);
    }
    _onNotification(method, handler) {
        if (method === undefined || handler === undefined) {
            return;
        }
        this.notificationHandlers.set(method, handler);
    }
    async handleMessage(message) {
        if (_Request.is(message)) {
            const id = message.id;
            const handler = this.requestHandlers.get(message.method);
            if (handler !== undefined) {
                try {
                    const result = await handler(message.params);
                    this.sendResultResponse(id, result);
                }
                catch (error) {
                    this.sendErrorResponse(id, error);
                }
            }
        }
        else if (_Notification.is(message)) {
            const handler = this.notificationHandlers.get(message.method);
            if (handler !== undefined) {
                handler(message.params);
            }
        }
        else if (_Response.is(message)) {
            const id = message.id;
            const promise = this.responsePromises.get(id);
            if (promise !== undefined) {
                this.responsePromises.delete(id);
                if (message.result !== undefined) {
                    promise.resolve(message.result);
                }
                else if (message.error !== undefined) {
                    promise.reject(typeof message.error === 'string' ? new Error(message.error) : message.error);
                }
                else {
                    promise.reject(new Error('Response has neither a result nor an error value'));
                }
            }
        }
    }
    sendResultResponse(id, result) {
        const response = { id, result: result === undefined ? null : result };
        this.postMessage(response);
    }
    sendErrorResponse(id, error) {
        const response = { id, error: error === undefined ? 'Unknown error' : error instanceof Error ? error.message : error };
        this.postMessage(response);
    }
}
exports.BaseMessageConnection = BaseMessageConnection;
(function (BaseMessageConnection) {
    BaseMessageConnection.Request = _Request;
    BaseMessageConnection.Notification = _Notification;
    BaseMessageConnection.Response = _Response;
})(BaseMessageConnection = exports.BaseMessageConnection || (exports.BaseMessageConnection = {}));
//# sourceMappingURL=messageConnection.js.map