import fs from "fs";
import os from "os";
import path from "path";
import {ipcMain} from "electron";
import {Messages} from "@knightsofglory/warlibrary/lib/common/Messages";

export type Profile = {
    server: string,
    username: string,
    password: string,
    home: string,
    init6: boolean
}

export namespace ProfileManager {

    let profile: Profile

    export function initialize() {
        load()
        listen()
    }

    export function getProfile() {
        return profile
    }

    function load() {
        let user = os.homedir()
        let directory = path.join(user, ".warchat", "profiles")
        let file = path.join(user, ".warchat", "profiles", "default")
        if (!fs.existsSync(file)) {
            saveEmpty(directory, file)
        }
        let raw = fs.readFileSync(file)
        profile = JSON.parse(raw.toString())
    }

    function saveEmpty(directory: string, file: string) {
        let empty = {
            server: "",
            username: "",
            password: "",
            home: "",
            init6: false
        }
        let data = JSON.stringify(empty)
        fs.mkdirSync(directory, { recursive: true });
        fs.writeFileSync(file, data)
    }

    function save() {
        let user = os.homedir()
        let file = path.join(user, ".warchat", "profiles", "default")
        let data = JSON.stringify(profile)

        fs.writeFileSync(file, data)
    }

    function listen() {
        ipcMain.on(Messages.Channels.PROFILE, async (event, command, data) => {
            switch (command) {
                case Messages.Commands.Profile.READ:
                    event.reply(
                        Messages.Channels.PROFILE,
                        Messages.Commands.Profile.READ,
                        profile
                    )
                    break
                case Messages.Commands.Profile.SAVE:
                    profile = data as Profile
                    save()
                    break
            }
        })
    }
}
