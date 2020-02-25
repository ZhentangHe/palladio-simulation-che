
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';
const {performance} = require('perf_hooks');
export function start(context: theia.PluginContext) {

    const palladioSimulationStartCommand = {
        id: 'palladio.start',
        label: "Palladio: Start Simulation"
    };

    const PalladioSimImpFileOp: theia.OpenDialogOptions = {
        canSelectMany: false,
        canSelectFiles: true,
        openLabel: 'Simulate',
        filters: {
            'Experiments Files': ['experiments']
        }
    }

    context.subscriptions.push(
        theia.commands.registerCommand(palladioSimulationStartCommand, (...args: any[]) => {

            if(args.length == 1) {
                try {
                    let inputExpDir = args[0].toString();
                    runSimulation(inputExpDir);
                } catch (error) {
                    console.log(error);
                    theia.window.showWarningMessage(error);
                } finally {
                    return;
                }             
            } else if(args.length == 0) {
                theia.window.showOpenDialog(PalladioSimImpFileOp).then(fileUri => {
                    if(fileUri) {
                        theia.window.showInformationMessage('selected file: ' + fileUri[0].fsPath);
                        runSimulation(fileUri[0].fsPath);
                    }
                    else {
                        theia.window.showErrorMessage("specified file not found.")
                        console.log("no such file.");
                        return;
                    }                 
                })
            } else {
                theia.window.showErrorMessage("wrong argument counter. It should be 0 or 1.");
                console.log("wrong argument counter.")
                return;
            }

        })
    );

}

export function stop() {

}

function runSimulation(inputExpDir: string) {

    let index = inputExpDir.lastIndexOf('/');
    let dirPath = inputExpDir.substring(0, index + 1);
    let filename = inputExpDir.substring(index + 1);
    let outputExpDir = dirPath + filename.replace(/([^.]+).*/ig,"$1") + ".gen.experiments";

    theia.commands.executeCommand('terminal-in-specific-container:new' ,'palladio-test');
    theia.window.onDidOpenTerminal(async (openedTerminal: theia.Terminal) => {
        //temp.
        //await new Promise(resolve => setTimeout(resolve, 10000));

        const openedTerminalId = (await openedTerminal.processId).toString();
        //alt.
        // openedTerminal.processId.then((processId) => {
        //     theia.window.showInformationMessage(`Terminal.processId: ${processId}`);
        // });
        theia.window.showInformationMessage(
            `Palladio Simulation started in terminal ${openedTerminalId}, name: ${openedTerminal.name}`
        );

        let t0 = performance.now();
        openedTerminal.sendText('clear && echo Palladio Simulation started.\n');
        //openedTerminal.sendText(`/usr/RunExperimentAutomation.sh ${inputExpDir} ${outputExpDir}`);
        //when the last task in terminal is done, capture it and report to user
        //QUESTION: when will the container terminate itself?
        openedTerminal.sendText('echo Palladio Simulation ended');            
        let t1 = performance.now();
        let simTime = timeConversion(t1 - t0);
        // stored by unix timestamp
        let exportExpDir = "output/" + Date.parse(new Date().toString());
        openedTerminal.sendText(`cd projects && mkdir -p ${exportExpDir}`)
        exportExpDir += '/'+ filename.replace(/([^.]+).*/ig,"$1") + ".gen.experiments";
        openedTerminal.sendText(`cp ../${outputExpDir} ${exportExpDir}`);
        theia.window.showInformationMessage(
            `Palladio Simulation done in ${simTime}, the file is saved in ${exportExpDir}.`
        );
    })
}

function timeConversion(millisec: number) {

    let seconds = (millisec / 1000).toFixed(1);
    let minutes = (millisec / (1000 * 60)).toFixed(1);
    let hours = (millisec / (1000 * 60 * 60)).toFixed(1);
    let days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

    if (+seconds < 1) {
        return millisec + " Ms";
    } else if (+seconds < 60) {
        return seconds + " Sec";
    } else if (+minutes < 60) {
        return minutes + " Min";
    } else if (+hours < 24) {
        return hours + " Hrs";
    } else {
        return days + " Days";
    }
}