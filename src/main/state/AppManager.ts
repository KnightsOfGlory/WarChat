import {ipcMain} from "electron";
import {mainWindow} from "../main";
import {Interprocess} from "../../common/Interprocess";
import os from "os";
import path from "path";
import fs from "fs";
import {uuid} from "uuidv4";

export namespace AppManager {

    let identifier: string

    export function initialize() {
        listen()
        ensureIdentifier()
    }

    function listen() {
        ipcMain.on(Interprocess.Channels.APP, async (event, arg) => {
            switch (arg) {
                case Interprocess.Commands.App.START:
                    event.reply(
                        Interprocess.Channels.APP,
                        Interprocess.Commands.App.IDENTIFIER,
                        identifier
                    )
                    break
                case Interprocess.Commands.App.QUIT:
                    mainWindow?.close()
                    process.exit()
                    break
            }
        });
    }

    function ensureIdentifier() {
        let user = os.homedir()
        let directory = path.join(user, ".warchat")
        let file = path.join(user, ".warchat", "identifier")
        if (!fs.existsSync(file)) {
            fs.mkdirSync(directory, { recursive: true });
            fs.writeFileSync(file, uuid())
        }
        let raw = fs.readFileSync(file)
        identifier = raw.toString()
    }
}