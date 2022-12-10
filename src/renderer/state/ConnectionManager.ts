import {ipcRenderer} from "../utilities/IpcRenderer"
import {Interprocess} from "../../common/Interprocess";

export type Subscription = (isConnected: boolean) => void

export namespace ConnectionManager {
    let isConnected: boolean = false
    let subscriptions: Subscription[] = []

    listen()

    export function subscribe(callback: Subscription) {
        subscriptions.push(callback)
    }

    function dispatch() {
        subscriptions.forEach((s) => s(isConnected))
    }

    function listen() {
        ipcRenderer.on(Interprocess.Channels.SOCKET, (arg) => {
            switch (arg) {
                case Interprocess.Commands.Socket.CONNECTED:
                    if (!isConnected) {
                        isConnected = true
                        dispatch()
                    }
                    break
                case Interprocess.Commands.Socket.DISCONNECTED:
                    if (isConnected) {
                        isConnected = false
                        dispatch()
                    }
                    break
            }
        })
    }
}