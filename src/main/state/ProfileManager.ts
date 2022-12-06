import fs from "fs";
import os from "os";
import path from "path";
import {ipcMain} from "electron";

export type Profile = {
    server: string,
    username: string,
    password: string,
    home: string
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
            home: ""
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
        ipcMain.on("profile.read", async (event, arg) => {
            event.reply("profile.read", profile)
        })
        ipcMain.on("profile.save", async (event, arg) => {
            profile = arg as Profile
            save()
        })
    }
}