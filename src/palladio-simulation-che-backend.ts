
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {
    console.log(theia.window.state);
    //Start Palladio Simulation Command
    const palladioSimulationStartCommand = {
        id: 'palladio.start',
        label: "Palladio: Start Simulation"
    };
    const PalladioSimOpenModelsOptions: theia.OpenDialogOptions = {
        canSelectMany: true,
        canSelectFiles: true,
        openLabel: 'Simulate',
        filters: {
            'Model files': ['model']
        }
    }
    context.subscriptions.push(
        theia.commands.registerCommand(palladioSimulationStartCommand, (...args: any[]) => {
            theia.window.showOpenDialog(PalladioSimOpenModelsOptions).then(fileUri => {
                if(fileUri) {
                    fileUri.forEach(element => {
                        theia.window.showInformationMessage('selected file: ' + element.fsPath);
                        //TODO: simulate each model according to fileUri's given path
                    })
                }
                // async() => {
                //     theia.window.showInformationMessage('models are selected');
                //     await new Promise( resolve => setTimeout(resolve, 500) );
                //     theia.window.showInformationMessage('palladio simulation started');
                // }

                //select which container to run
                theia.commands.executeCommand('terminal-in-specific-container:new');

                theia.window.onDidOpenTerminal(async (openedTerminal: theia.Terminal) => {
                    const openedTerminalId = await openedTerminal.processId;
                    openedTerminal.sendText('clear && echo Palladio Simulation started.\n');
                    openedTerminal.sendText('touch test.csv && echo test.csv generated.\n');
                    openedTerminal.sendText('cp test.csv ../projects/palladio-simulation/data/test.csv');
                    // theia.commands.executeCommand('file.copyDownloadLink').then(downloadLink =>{
                    //     console.log(downloadLink);
                    // });
                    const csvPattern = '**/data/*.{csv}';
                    let watchers : theia.FileSystemWatcher[] = [];
                    const csvWatcher = theia.workspace.createFileSystemWatcher(csvPattern);
                    csvWatcher.onDidCreate(uri => console.log('csv file created:', uri.toString()));
                })
            })
        })
    );

}

export function stop() {

}
