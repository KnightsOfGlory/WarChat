import {Interprocess} from "../../common/Interprocess";
import {ipcRenderer} from "../utilities/IpcRenderer";

export type Settings = {
    autoReconnect: boolean
}

export namespace SettingsManager {

    let settings: Settings

    listen()

    export function getSettings() {
        return settings
    }

    export function setSettings(newSettings: Settings) {
        settings = newSettings
        ipcRenderer.sendMessage(
            Interprocess.Channels.SETTINGS,
            Interprocess.Commands.Settings.SAVE,
            settings
        )
    }

    function listen() {
        ipcRenderer.on(Interprocess.Channels.SETTINGS, (command, data) => {
            switch (command) {
                case Interprocess.Commands.Settings.READ:
                    settings = data as Settings
                    break
            }
        })
        ipcRenderer.sendMessage(
            Interprocess.Channels.SETTINGS,
            Interprocess.Commands.Settings.READ
        )
    }
}