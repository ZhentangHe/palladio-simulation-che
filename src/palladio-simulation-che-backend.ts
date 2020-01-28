
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {

    const palladioSimulationStartCommand = {
        id: 'palladio.start',
        label: "Palladio: Start Simulation"
    };

    const PalladioSimOpenModelsOptions: theia.OpenDialogOptions = {
        canSelectMany: false,
        canSelectFiles: true,
        openLabel: 'Simulate',
        filters: {
            'Experiments Files': ['experiments']
        }
    }

    context.subscriptions.push(
        theia.commands.registerCommand(palladioSimulationStartCommand, (...args: any[]) => {

            theia.commands.executeCommand("extension.vsMinikubeStart");
            theia.commands.executeCommand("extension.vsMinikubeStatus");
            
            theia.window.showOpenDialog(PalladioSimOpenModelsOptions).then(fileUri => {
                if(fileUri) {
                    fileUri.forEach(element => {
                        theia.window.showInformationMessage('selected file: ' + element.fsPath);               
                    })
                }
                else {
                    
                }

                theia.commands.executeCommand('terminal-in-specific-container:new' ,'golang');
                
                theia.window.onDidOpenTerminal(async (openedTerminal: theia.Terminal) => {
                    //temp.
                    //await new Promise(resolve => setTimeout(resolve, 10000));

                    const openedTerminalId = (await openedTerminal.processId).toString();
                    //alt.
                    // openedTerminal.processId.then((processId) => {
                    //     theia.window.showInformationMessage(`Terminal.processId: ${processId}`);
                    // });
                    const generatedFileStr = 'test' + openedTerminalId + '.csv';
                    theia.window.showInformationMessage(`onDidOpenTerminal,
                     id: ${openedTerminalId},
                     name: ${openedTerminal.name}`);

                    openedTerminal.sendText('clear && echo Palladio Simulation started.\n');
                    openedTerminal.sendText('touch '+ generatedFileStr +' && echo ' + generatedFileStr +' generated.\n');
                    openedTerminal.sendText('cp '+ generatedFileStr +' ../projects/palladio-simulation/data/'+ generatedFileStr);
                    //should be like this instead
                    // theia.commands.executeCommand('file.copyDownloadLink').then(downloadLink =>{
                    //     console.log(downloadLink);
                    // });
                })
            })
        })
    );

}

export function stop() {

}
