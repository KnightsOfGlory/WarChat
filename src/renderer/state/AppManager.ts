import {ipcRenderer} from "../utilities/IpcRenderer";
import {Interprocess} from "../../common/Interprocess";

export namespace AppManager {

    let identifier: string

    export function getIdentifier() {
        return identifier
    }

    export function initialize() {
        listen()
    }

    function listen() {
        ipcRenderer.on(
            Interprocess.Channels.APP,
            (command, newIdentifier) => {
                switch (command) {
                    case Interprocess.Commands.App.IDENTIFIER:
                        identifier = newIdentifier as string
                        break
                }
            }
        )
    }
}