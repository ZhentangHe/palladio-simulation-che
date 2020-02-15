"use strict";
/**
 * Generated using theia-plugin-generator
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const theia = require("@theia/plugin");
function start(context) {
    const palladioSimulationStartCommand = {
        id: 'palladio.start',
        label: "Palladio: Start Simulation"
    };
    const PalladioSimImpFileOp = {
        canSelectMany: false,
        canSelectFiles: true,
        openLabel: 'Simulate',
        filters: {
            'Experiments Files': ['experiments']
        }
    };
    const PalladioSimExpFileOp = {
        placeHolder: "testPlaceHolder"
    };
    context.subscriptions.push(theia.commands.registerCommand(palladioSimulationStartCommand, (...args) => {
        // superfluous 
        theia.window.showWorkspaceFolderPick(PalladioSimExpFileOp).then(folder => {
            if (typeof (folder) === 'undefined')
                return;
            else {
                theia.window.showInformationMessage(folder.uri.toString());
            }
        });
        //the path to the original experiments file
        let experimentsDir = "/projects/RunExperimentData/RunExperimentData/ExperimentData/model/Experiments/Capacity.experiments";
        //the path where to store the generated file
        let outputCsvDir = "/projects/RunExperimentData/RunExperimentData/ExperimentData/model/Experiments/Capacity.gen.experiments";
        if (args.length == 2) {
            try {
                experimentsDir = args[0].toString();
                outputCsvDir = args[1].toString();
                runSimulation(experimentsDir, outputCsvDir);
            }
            catch (error) {
                console.log(error);
                theia.window.showWarningMessage(error);
            }
            finally {
                return;
            }
        }
        else if (args.length == 0) {
            theia.window.showOpenDialog(PalladioSimImpFileOp).then(fileUri => {
                if (fileUri) {
                    fileUri.forEach(element => {
                        theia.window.showInformationMessage('selected file: ' + element.fsPath);
                    });
                    runSimulation(experimentsDir, outputCsvDir);
                }
                else {
                    return;
                }
            });
        }
        else {
            return;
        }
    }));
}
exports.start = start;
function stop() {
}
exports.stop = stop;
function runSimulation(experimentsDir, outputCsvDir) {
    theia.commands.executeCommand('terminal-in-specific-container:new', 'palladio-test');
    theia.window.onDidOpenTerminal((openedTerminal) => __awaiter(this, void 0, void 0, function* () {
        //temp.
        //await new Promise(resolve => setTimeout(resolve, 10000));
        const openedTerminalId = (yield openedTerminal.processId).toString();
        //alt.
        // openedTerminal.processId.then((processId) => {
        //     theia.window.showInformationMessage(`Terminal.processId: ${processId}`);
        // });
        theia.window.showInformationMessage(`Palladio Simulation started in terminal ${openedTerminalId}, name: ${openedTerminal.name}`);
        // let t0 = performance.now();
        openedTerminal.sendText('clear && echo Palladio Simulation started.\n');
        openedTerminal.sendText(`usr/RunExperimentAutomation.sh ${experimentsDir} ${outputCsvDir}`);
        //when the last task in terminal is done, capture it and report to user
        openedTerminal.sendText('echo Palladio Simulation ended');
        // let t1 = performance.now();
        // let simTime = timeConversion(t1 - t0);
        let exportCsvDir = "/output/" + outputCsvDir.replace(/(.*\/)*([^.]+).*/ig, "$2")
            + '-' + Date.parse(new Date().toString()) + '.csv';
        openedTerminal.sendText(`cp ${outputCsvDir} ../projects/output/${exportCsvDir}`);
        // theia.window.showInformationMessage(
        //     `Palladio Simulation done in ${simTime}, the file is saved in output/${exportCsvDir}.`
        // );
        //could also be like this instead
        // theia.commands.executeCommand('file.copyDownloadLink').then(downloadLink =>{
        //     console.log(downloadLink);
        // });
    }));
}
function timeConversion(millisec) {
    let seconds = (millisec / 1000).toFixed(1);
    let minutes = (millisec / (1000 * 60)).toFixed(1);
    let hours = (millisec / (1000 * 60 * 60)).toFixed(1);
    let days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    if (+seconds < 60) {
        return seconds + " Sec";
    }
    else if (+minutes < 60) {
        return minutes + " Min";
    }
    else if (+hours < 24) {
        return hours + " Hrs";
    }
    else {
        return days + " Days";
    }
}
//# sourceMappingURL=palladio-simulation-che-backend.js.map