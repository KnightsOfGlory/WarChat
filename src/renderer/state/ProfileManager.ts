import {Interprocess} from "../../common/Interprocess";
import {ipcRenderer} from "../utilities/IpcRenderer";

export type Profile = {
    server: string,
    username: string,
    password: string,
    home: string,
    init6: boolean
}

export namespace ProfileManager {

    let profile: Profile = {
        server: "",
        username: "",
        password: "",
        home: "",
        init6: false
    }

    listen()

    export function getProfile() {
        return profile
    }

    export function setProfile(newProfile: Profile) {
        profile = newProfile
        ipcRenderer.sendMessage(
            Interprocess.Channels.PROFILE,
            Interprocess.Commands.Profile.SAVE,
            profile
        )
    }

    function listen() {
        ipcRenderer.on(Interprocess.Channels.PROFILE, (command, data) => {
            switch (command) {
                case Interprocess.Commands.Profile.READ:
                    profile = data as Profile
                    break
            }
        })
        ipcRenderer.sendMessage(
            Interprocess.Channels.PROFILE,
            Interprocess.Commands.Profile.READ
        )
    }
}