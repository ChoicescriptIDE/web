"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DTOs = void 0;
const connection_1 = require("./connection");
var DTOs;
(function (DTOs) {
    let FileSystemError;
    (function (FileSystemError) {
        /**
         * Create an error to signal that a file or folder wasn't found.
         */
        FileSystemError.FileNotFound = connection_1.RPCErrno.$Custom;
        /**
         * Create an error to signal that a file or folder already exists, e.g. when
         * creating but not overwriting a file.
         */
        FileSystemError.FileExists = FileSystemError.FileNotFound + 1;
        /**
         * Create an error to signal that a file is not a folder.
         */
        FileSystemError.FileNotADirectory = FileSystemError.FileExists + 1;
        /**
         * Create an error to signal that a file is a folder.
         */
        FileSystemError.FileIsADirectory = FileSystemError.FileNotADirectory + 1;
        /**
         * Create an error to signal that an operation lacks required permissions.
         */
        FileSystemError.NoPermissions = FileSystemError.FileIsADirectory + 1;
        /**
         * Create an error to signal that the file system is unavailable or too busy to
         * complete a request.
         */
        FileSystemError.Unavailable = FileSystemError.NoPermissions + 1;
    })(FileSystemError = DTOs.FileSystemError || (DTOs.FileSystemError = {}));
    let FileType;
    (function (FileType) {
        /**
        * The file type is unknown.
        */
        FileType[FileType["Unknown"] = 0] = "Unknown";
        /**
        * A regular file.
        */
        FileType[FileType["File"] = 1] = "File";
        /**
        * A directory.
        */
        FileType[FileType["Directory"] = 2] = "Directory";
        /**
        * A symbolic link to a file.
        */
        FileType[FileType["SymbolicLink"] = 64] = "SymbolicLink";
    })(FileType = DTOs.FileType || (DTOs.FileType = {}));
    let FilePermission;
    (function (FilePermission) {
        /**
         * The file is readonly.
         */
        FilePermission[FilePermission["Readonly"] = 1] = "Readonly";
    })(FilePermission = DTOs.FilePermission || (DTOs.FilePermission = {}));
    let Stat;
    (function (Stat) {
        Stat.typedResult = connection_1.Uint32Result.fromLength(5);
        function create(memory) {
            return {
                get type() {
                    return memory[0];
                },
                set type(value) {
                    memory[0] = value;
                },
                get ctime() {
                    return memory[1];
                },
                set ctime(value) {
                    memory[1] = value;
                },
                get mtime() {
                    return memory[2];
                },
                set mtime(value) {
                    memory[2] = value;
                },
                get size() {
                    return memory[3];
                },
                set size(value) {
                    memory[3] = value;
                },
                get permission() {
                    return memory[4];
                },
                set permission(value) {
                    memory[4] = value;
                }
            };
        }
        Stat.create = create;
    })(Stat = DTOs.Stat || (DTOs.Stat = {}));
})(DTOs = exports.DTOs || (exports.DTOs = {}));
//# sourceMappingURL=protocol.js.map