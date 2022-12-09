import {ipcMain} from "electron";
import {mainWindow} from "../main";

export namespace AppManager {

    export function initialize() {
        listen()
    }

    function listen() {
        ipcMain.on('app', async (event, arg) => {
            if (arg == "quit") {
                mainWindow?.close()
                process.exit()
            }
        });
    }
}