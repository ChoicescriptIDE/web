"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports._RALType = void 0;
var _RALType;
(function (_RALType) {
    _RALType[_RALType["Browser"] = 1] = "Browser";
    _RALType[_RALType["Node"] = 2] = "Node";
})(_RALType = exports._RALType || (exports._RALType = {}));
let _ral;
function RAL() {
    if (_ral === undefined) {
        throw new Error(`No runtime abstraction layer installed`);
    }
    return _ral;
}
(function (RAL) {
    RAL.Type = _RALType;
    function install(ral) {
        if (ral === undefined) {
            throw new Error(`No runtime abstraction layer provided`);
        }
        _ral = ral;
    }
    RAL.install = install;
})(RAL || (RAL = {}));
exports.default = RAL;
//# sourceMappingURL=ral.js.map