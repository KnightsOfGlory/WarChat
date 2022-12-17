import fs from "fs";
import os from "os";
import path from "path";
import {ipcMain} from "electron";
import {Messages} from "@knightsofglory/warlibrary/lib/common/Messages";

export namespace SettingsManager {

    let settings = {}

    export function initialize() {
        load()
        listen()
    }

    export function getSettings() {
        return settings
    }

    function load() {
        let user = os.homedir()
        let directory = path.join(user, ".warchat")
        let file = path.join(user, ".warchat", "settings")
        if (!fs.existsSync(file)) {
            saveEmpty(directory, file)
        }
        let raw = fs.readFileSync(file)
        settings = JSON.parse(raw.toString())
    }

    function saveEmpty(directory: string, file: string) {
        let empty = {}
        let data = JSON.stringify(empty)
        fs.mkdirSync(directory, { recursive: true });
        fs.writeFileSync(file, data)
    }

    function save() {
        let user = os.homedir()
        let file = path.join(user, ".warchat", "settings")
        let data = JSON.stringify(settings)

        fs.writeFileSync(file, data)
    }

    function listen() {
        ipcMain.on(Messages.Channels.SETTINGS, async (event, command, data) => {
            switch (command) {
                case Messages.Commands.Settings.READ:
                    event.reply(
                        Messages.Channels.SETTINGS,
                        Messages.Commands.Settings.READ,
                        settings
                    )
                    break
                case Messages.Commands.Settings.SAVE:
                    settings = data
                    save()
                    break
            }
        })
    }
}
