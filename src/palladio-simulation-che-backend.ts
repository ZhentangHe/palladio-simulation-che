
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {

    const palladioArchSimStartCmd = {
        id: 'palladio.start',
        label: "Palladio: Start Simulation"
    };

    //somehow the filter won't work by default
    //it works only after clicking on it and selecting 'Experiments Files'
    //should be some bug related to theia
    const PalladioArchSimImpFileOp: theia.OpenDialogOptions = {
        canSelectMany: false,
        canSelectFiles: true,
        openLabel: 'Simulate',
        filters: {
            'Experiments Files': ['experiments']
        }
    }

    //TODO
    //it should be passed from the devfile environment variable
    //${env:CONTAINER_NAME}? ${config:CONTAINER_NAME}? or sth. like this
    const containerName = "palladio-ea";

    context.subscriptions.push(
        theia.commands.registerCommand(palladioArchSimStartCmd, (...args: any[]) => {

            //TODO
            //refactor
            //invoke by command
            if(args.length == 1) {
                try {
                    let experimentsPath = args[0].toString();
                    runSimulation(experimentsPath, containerName);
                } catch (error) {
                    console.log(error);
                    theia.window.showWarningMessage(error);
                } finally {
                    return;
                }     
            //invoke by command palette      
            } else if(args.length == 0) {
                theia.window.showOpenDialog(PalladioArchSimImpFileOp).then(fileUri => {
                    if(fileUri) {
                        theia.window.showInformationMessage('selected file: ' + fileUri[0].fsPath);
                        runSimulation(fileUri[0].fsPath, containerName);
                    }
                    else throw Error("theia.Uri[] undefined.");            
                }, reason => console.log(reason))
            } else {
                theia.window.showErrorMessage("wrong argument counter. It should be 0 or 1.");
                console.log("wrong argument counter.")
            }

        })
    );

}

export function stop() {

}

/**
* // TODO: refactor & parallel execution not tested.
* @description This function runs the palladio architecture simulation in given container.
* @param experimentsPath specifies the path to to be simulated .experiments file.
* @param containerName specifies in which container the simulation is run.
*/
function runSimulation(experimentsPath: string, containerName: string) {

    let idx = experimentsPath.lastIndexOf('/');
    let directory = experimentsPath.substring(0, idx + 1);
    let filename = experimentsPath.substring(idx + 1);
    let fileBaseName = filename.replace(/([^.]+).*/ig,"$1");
    let genExperimentsPath = directory + fileBaseName + ".gen.experiments";

    //the command was found using theia.commands.getcommands()
    theia.commands.executeCommand('terminal-in-specific-container:new', containerName);

    theia.window.onDidOpenTerminal((openedTerminal: theia.Terminal) => {
        openedTerminal.processId.then((processId) => {
            theia.window.showInformationMessage(
                `Palladio Simulation started in terminal ${processId}, name: ${openedTerminal.name}`
                );
            //using runsim.sh is just a temporary workaround
            //could be refactored
            //'/projects' should also be environment variable
            openedTerminal.sendText(`bash /projects/PalladioSimulation/src/runsim.sh \
                ${experimentsPath} \
                ${genExperimentsPath} \
                ${Date.parse(new Date().toString())} \
                ${fileBaseName}`);

        }); 
    })
}
