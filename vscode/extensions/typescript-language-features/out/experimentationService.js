"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTasExperimentationService = exports.ExperimentationService = void 0;
const vscode = require("vscode");
const tas = require("vscode-tas-client");
class ExperimentationService {
    constructor(telemetryReporter, id, version, globalState) {
        this._telemetryReporter = telemetryReporter;
        this._experimentationServicePromise = createTasExperimentationService(this._telemetryReporter, id, version, globalState);
    }
    async getTreatmentVariable(name, defaultValue) {
        const experimentationService = await this._experimentationServicePromise;
        try {
            const treatmentVariable = experimentationService.getTreatmentVariableAsync('vscode', name, /*checkCache*/ true);
            return treatmentVariable;
        }
        catch {
            return defaultValue;
        }
    }
}
exports.ExperimentationService = ExperimentationService;
async function createTasExperimentationService(reporter, id, version, globalState) {
    let targetPopulation;
    switch (vscode.env.uriScheme) {
        case 'vscode':
            targetPopulation = tas.TargetPopulation.Public;
            break;
        case 'vscode-insiders':
            targetPopulation = tas.TargetPopulation.Insiders;
            break;
        case 'vscode-exploration':
            targetPopulation = tas.TargetPopulation.Internal;
            break;
        case 'code-oss':
            targetPopulation = tas.TargetPopulation.Team;
            break;
        default:
            targetPopulation = tas.TargetPopulation.Public;
            break;
    }
    const experimentationService = tas.getExperimentationService(id, version, targetPopulation, reporter, globalState);
    await experimentationService.initialFetch;
    return experimentationService;
}
exports.createTasExperimentationService = createTasExperimentationService;
//# sourceMappingURL=experimentationService.js.map