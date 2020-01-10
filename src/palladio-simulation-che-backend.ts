
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';

//import fs = require('fs');

export function start(context: theia.PluginContext) {
    //console.log(theia.window.state);

    //temporary url
    const experimentUrl = "https://github.com/PalladioSimulator/Palladio-Addons-ExperimentAutomation/blob/master/bundles/org.palladiosimulator.experimentautomation.examples.espresso/model/Experiments/Capacity.experiments";

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
            //console.log(args);
            theia.window.showOpenDialog(PalladioSimOpenModelsOptions).then(fileUri => {
                if(fileUri) {
                    fileUri.forEach(element => {
                        theia.window.showInformationMessage('selected file: ' + element.fsPath);
                        //TODO: simulate each model according to fileUri's given path
                        var XMLHttpRequest = require("xhr2");
                        var xhr = new XMLHttpRequest();
                        xhr.responseType = 'document';
                        xhr.overrideMimeType('text/xml');
                        xhr.onreadystatechange = function(){
                            if(xhr.readyState == 4) {
                                if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                                    theia.window.showInformationMessage(xhr.responseText);
                                } else {
                                    theia.window.showInformationMessage("Request was unsuccessful:" + xhr.status);
                                }
                            }
                        };
                        xhr.open("get", experimentUrl, true);
                        xhr.send(null);
                        
                    })
                }

                //select which container to run
                theia.commands.executeCommand('terminal-in-specific-container:new' ,'golang');
                //might need to be called on demand
                
                theia.window.onDidOpenTerminal(async (openedTerminal: theia.Terminal) => {
                    //temp.
                    //await new Promise(resolve => setTimeout(resolve, 10000));

                    const openedTerminalId = (await openedTerminal.processId).toString();
                    //beide's geht
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
                    // temp.
                    // const csvPattern = '**/data/*.{csv}';
                    // let watchers : theia.FileSystemWatcher[] = [];
                    // const csvWatcher = theia.workspace.createFileSystemWatcher(csvPattern);
                    // csvWatcher.onDidCreate(uri => console.log('csv file created:', uri.toString()));
                    //.then(openedTerminal.dispose(););
                })
            })
        })
    );

}

export function stop() {

}
