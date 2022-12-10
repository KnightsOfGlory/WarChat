import {ipcMain} from "electron";
import {mainWindow} from "../main";
import {Interprocess} from "../../common/Interprocess";

export namespace AppManager {

    export function initialize() {
        listen()
    }

    function listen() {
        ipcMain.on(Interprocess.Channels.APP, async (event, arg) => {
            if (arg == Interprocess.Commands.App.QUIT) {
                mainWindow?.close()
                process.exit()
            }
        });
    }
}