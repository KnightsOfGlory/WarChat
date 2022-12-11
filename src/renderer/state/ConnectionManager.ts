import {Interprocess} from "../../common/Interprocess";
import {ipcRenderer} from "../utilities/IpcRenderer";
import {SettingsManager} from "./SettingsManager";
import {ChatManager} from "./ChatManager";
import {ChatHelper} from "../utilities/ChatHelper";

export type Subscription = (isConnected: boolean) => void

export namespace ConnectionManager {
    let isConnected: boolean = false
    let subscriptions: Subscription[] = []

    listen()
    autoreconnect()

    export function connect() {
        ChatManager.add(ChatHelper.makeBotChat("Connecting..."))
        ipcRenderer.sendMessage(
            Interprocess.Channels.SOCKET,
            Interprocess.Commands.Socket.CONNECT
        )
    }

    export function disconnect() {
        disconnected = false
        ChatManager.add(ChatHelper.makeBotChat("Disconnecting..."))
        ipcRenderer.sendMessage(
            Interprocess.Channels.SOCKET,
            Interprocess.Commands.Socket.DISCONNECT
        )
    }

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
                        disconnected = false
                        dispatch()
                    }
                    break
                case Interprocess.Commands.Socket.DISCONNECTED:
                    if (isConnected) {
                        isConnected = false
                        disconnected = true
                        dispatch()
                    }
                    break
                // case Interprocess.Commands.Socket.TIMEOUT:
                //     isConnected = false
                //     disconnected = true
                //     ChatManager.add(ChatHelper.makeBotChat("Connection timed out!"))
                //     dispatch()
            }
        })
    }

    let reconnector: NodeJS.Timer
    let disconnected = false
    function autoreconnect() {
        reconnector = setInterval(() => {
            if (!disconnected || isConnected || !SettingsManager.getSettings().autoReconnect) return

            connect()
        }, 1000)
    }
}