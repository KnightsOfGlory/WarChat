import {ipcMain, shell} from "electron";
import {mainWindow} from "../main";
import os from "os";
import path from "path";
import fs from "fs";
import uuidv4 from "../../renderer/utilities/Uuid";
import {Messages} from "@knightsofglory/warlibrary/lib/common/Messages";

export namespace AppManager {

    let identifier: string

    export function initialize() {
        listen()
        ensureIdentifier()
    }

    function listen() {
        ipcMain.on(Messages.Channels.APP, async (event, arg, data) => {
            switch (arg) {
                case Messages.Commands.App.START:
                    event.reply(
                        Messages.Channels.APP,
                        Messages.Commands.App.IDENTIFIER,
                        identifier
                    )
                    break
                case Messages.Commands.App.OPEN:
                    await shell.openExternal(data)
                    break
                case Messages.Commands.App.QUIT:
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
            fs.writeFileSync(file, uuidv4())
        }
        let raw = fs.readFileSync(file)
        identifier = raw.toString()
    }
}
