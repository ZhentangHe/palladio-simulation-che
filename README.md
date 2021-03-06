# Palladio Architecture Simulation Extension for Eclipse Che
This is a Palladio Architecture Simulation Extension for Eclipse Che.

## Usage
### Import into workspace
Include this project in an Eclipse Che devfile:
```
projects:
  - name: PalladioArchSimExt
    source:
      type: git
      branch: master
      location: "https://github.com/ZhentangHe/palladio-simulation-che.git"
```
Notice that in this devfile a docker image is also needed:
```
components:
  - type: dockerimage
    image: palladiosimulator/palladio-experimentautomation
    alias: palladio-ea
    memoryLimit: 800Mi
    mountSources: true
    command: ['sleep','infinity']
    volumes:
      - name: result
        containerPath: /result
```
A devfile template is provided [here](https://github.com/ZhentangHe/PalladioArchSimWkspTemplate/blob/master/devfile.yaml).

Import this devfile while creating a new workspace.

You can also further integrate this extension in your own devfile/plugin registry.


### Run the plugin in Hosted Che
To see your plug-in in action in the IDE, use the Hosted mode to start a new IDE instance and to install the plug-in in it. You now have two IDEs running: one for developing your plug-in and one for testing it.

a. In the command palette, run: Hosted Plugin: Start Instance command (press `Ctrl + Shift + P` or `F1`, and type the command).

b. Select the path `PalladioArchSimExt` to the root directory of the plug-in in your workspace.
 
### Start Simulation
In the Hosted Che, open the command palette and type the command `Palladio: Start Simulation`.

Then select the .experiments file like shown in the picture:

![Palladio Simulation Select File](https://raw.githubusercontent.com/ZhentangHe/palladio-simulation-che/master/img/PalladioSimulationSelectFile.png)

Click on `Simulate` and let the simulation begin.

![Palladio Simulation Processing](https://raw.githubusercontent.com/ZhentangHe/palladio-simulation-che/master/img/PalladioSimulationProcessing.png)


### Output
The output files generated by each simulation will be saved under `output` to the root repository in different unix timestamped folders.


## Further Work
+ Refactor
+ Parallel execution not tested
+ .sh script to be replaced