
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {
    console.log(theia.window.state);
    //Start Palladio Simulation Command
    const informationMessageTestCommand = {
        id: 'palladio-simulation-start',
        label: "Palladio: Start Simulation"
    };
    context.subscriptions.push(
        theia.commands.registerCommand(informationMessageTestCommand, (...args: any[]) => {
            theia.window.showInformationMessage('Simulation Started! So wait!');
        })
    );
}

export function stop() {

}
