
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
                    });                    
                }
                theia.window.showInformationMessage('palladio simulation started');
                //select which container to run
                theia.commands.executeCommand('terminal-in-specific-container:new');
                //dummy, not encapsulated impl.
                theia.window.onDidOpenTerminal(async (openedTerminal: theia.Terminal) => {
                    const openedTerminalId = await openedTerminal.processId;
                    openedTerminal.sendText('clear && echo Palladio Simulation started.\n');
                    openedTerminal.sendText('touch test.csv && ls');               
                })
            })
        })
    );

}

export function stop() {

}
