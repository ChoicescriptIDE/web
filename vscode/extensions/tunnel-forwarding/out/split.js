"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamSplitter = exports.splitNewLines = void 0;
const stream_1 = require("stream");
const splitNewLines = () => new StreamSplitter('\n'.charCodeAt(0));
exports.splitNewLines = splitNewLines;
/**
 * Copied and simplified from src\vs\base\node\nodeStreams.ts
 */
class StreamSplitter extends stream_1.Transform {
    constructor(splitter) {
        super();
        this.splitter = splitter;
    }
    _transform(chunk, _encoding, callback) {
        if (!this.buffer) {
            this.buffer = chunk;
        }
        else {
            this.buffer = Buffer.concat([this.buffer, chunk]);
        }
        let offset = 0;
        while (offset < this.buffer.length) {
            const index = this.buffer.indexOf(this.splitter, offset);
            if (index === -1) {
                break;
            }
            this.push(this.buffer.subarray(offset, index + 1));
            offset = index + 1;
        }
        this.buffer = offset === this.buffer.length ? undefined : this.buffer.subarray(offset);
        callback();
    }
    _flush(callback) {
        if (this.buffer) {
            this.push(this.buffer);
        }
        callback();
    }
}
exports.StreamSplitter = StreamSplitter;
//# sourceMappingURL=split.js.map