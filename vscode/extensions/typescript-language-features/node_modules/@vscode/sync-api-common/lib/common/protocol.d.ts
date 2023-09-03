import { Uint32Result, VariableResult, u32 } from './connection';
export declare namespace DTOs {
    type UriComponents = {
        scheme: string;
        authority: string;
        path: string;
        query: string;
        fragment: string;
    };
    type FileSystemError = u32;
    namespace FileSystemError {
        /**
         * Create an error to signal that a file or folder wasn't found.
         */
        const FileNotFound = 32768;
        /**
         * Create an error to signal that a file or folder already exists, e.g. when
         * creating but not overwriting a file.
         */
        const FileExists: number;
        /**
         * Create an error to signal that a file is not a folder.
         */
        const FileNotADirectory: number;
        /**
         * Create an error to signal that a file is a folder.
         */
        const FileIsADirectory: number;
        /**
         * Create an error to signal that an operation lacks required permissions.
         */
        const NoPermissions: number;
        /**
         * Create an error to signal that the file system is unavailable or too busy to
         * complete a request.
         */
        const Unavailable: number;
    }
    type fileType = u32;
    enum FileType {
        /**
        * The file type is unknown.
        */
        Unknown = 0,
        /**
        * A regular file.
        */
        File = 1,
        /**
        * A directory.
        */
        Directory = 2,
        /**
        * A symbolic link to a file.
        */
        SymbolicLink = 64
    }
    type filePermission = u32;
    enum FilePermission {
        /**
         * The file is readonly.
         */
        Readonly = 1
    }
    type Stat = {
        type: fileType;
        ctime: u32;
        mtime: u32;
        size: u32;
        permission: filePermission;
    };
    namespace Stat {
        const typedResult: Uint32Result;
        function create(memory: Uint32Array): Stat;
    }
    type DirectoryEntries = [string, DTOs.FileType][];
    interface WorkspaceFolder {
        readonly uri: UriComponents;
        readonly name: string;
        readonly index: number;
    }
    interface TextDocument {
        uri: UriComponents;
    }
}
export declare type Requests = {
    /**
     * The WebAssembly execution has existed.
     */
    method: 'process/proc_exit';
    params: {
        rval: number;
    };
    result: null;
} | {
    /**
     * Sleep for the amount of ms.
     */
    method: 'timer/sleep';
    params: {
        ms: number;
    };
    result: null;
} | {
    /**
     * Retrieve the activeTextDocument
     */
    method: 'window/activeTextDocument';
    params: null;
    result: VariableResult<DTOs.TextDocument | null>;
} | {
    /**
     * Retrieve the set of workspace folders
     */
    method: 'workspace/workspaceFolders';
    params: null;
    result: VariableResult<DTOs.WorkspaceFolder[]>;
} | {
    /**
     * Write a string encoded using UTF8 to the terminal
     */
    method: 'terminal/write';
    params: {
        binary: Uint8Array;
    };
    result: null;
} | {
    /**
     * Reads a line from the terminal
     */
    method: 'terminal/read';
    params: null;
    result: VariableResult<Uint8Array>;
} | {
    /**
     * Stat a file / directory
     */
    method: 'fileSystem/stat';
    params: {
        uri: DTOs.UriComponents;
    };
    result: Uint32Array;
} | {
    /**
     * Read a file
     */
    method: 'fileSystem/readFile';
    params: {
        uri: DTOs.UriComponents;
    };
    result: VariableResult<Uint8Array>;
} | {
    /**
     * Write a file
     */
    method: 'fileSystem/writeFile';
    params: {
        uri: DTOs.UriComponents;
        binary: Uint8Array;
    };
    result: null;
} | {
    /**
     * Read a directory
     */
    method: 'fileSystem/readDirectory';
    params: {
        uri: DTOs.UriComponents;
    };
    result: VariableResult<DTOs.DirectoryEntries>;
} | {
    method: 'fileSystem/createDirectory';
    params: {
        uri: DTOs.UriComponents;
    };
    result: null;
} | {
    method: 'fileSystem/delete';
    params: {
        uri: DTOs.UriComponents;
        options?: {
            recursive?: boolean;
            useTrash?: boolean;
        };
    };
    result: null;
} | {
    method: 'fileSystem/rename';
    params: {
        source: DTOs.UriComponents;
        target: DTOs.UriComponents;
        options?: {
            overwrite?: boolean;
        };
    };
    result: null;
};
