import {Interprocess} from "../../common/Interprocess";
import {ipcRenderer} from "../utilities/IpcRenderer";
import {SettingsManager} from "./SettingsManager";
import {ChatManager} from "./ChatManager";
import {ChatHelper} from "../utilities/ChatHelper";

export type ConnectedSubscription = (connected: boolean) => void
export type BusySubscription = (busy: boolean) => void

export namespace ConnectionManager {

    export let busy = false
    let busySubscriptions: BusySubscription[] = []

    let connected: boolean = false
    let connectedSubscriptions: ConnectedSubscription[] = []

    listen()
    autoreconnect()

    export function connect() {
        console.log("CONNECTING")
        busy = true
        ipcRenderer.sendMessage(
            Interprocess.Channels.SOCKET,
            Interprocess.Commands.Socket.CONNECT
        )
        setTimeout(() => { busy = false; dispatchBusy() }, 5 * 1000)
    }
    export function disconnect() {
        busy = true
        dontReconnect = true
        ipcRenderer.sendMessage(
            Interprocess.Channels.SOCKET,
            Interprocess.Commands.Socket.DISCONNECT
        )
    }

    export function subscribeBusy(callback: BusySubscription) {
        busySubscriptions.push(callback)
    }
    export function subscribeConnected(callback: ConnectedSubscription) {
        connectedSubscriptions.push(callback)
    }

    function dispatchBusy() {
        busySubscriptions.forEach((s) => s(busy))
    }
    function dispatchConnected() {
        connectedSubscriptions.forEach((s) => s(connected))
    }

    function listen() {
        ipcRenderer.on(Interprocess.Channels.SOCKET, (arg) => {
            busy = false

            switch (arg) {
                case Interprocess.Commands.Socket.CONNECTED:
                    if (!connected) {
                        connected = true
                        disconnected = false
                        dontReconnect = false
                        dispatchConnected()
                    }
                    break
                case Interprocess.Commands.Socket.DISCONNECTED:
                    if (connected) {
                        connected = false
                        disconnected = true
                        dispatchConnected()
                    }
                    break
                case Interprocess.Commands.Socket.TIMEOUT:
                    connected = false
                    disconnected = true
                    ChatManager.add(ChatHelper.makeBotChat("Connection timed out!"))
                    dispatchConnected()
                    break
            }

            dispatchBusy()
        })
    }

    let reconnector: NodeJS.Timer
    let disconnected = false
    let dontReconnect = true
    function autoreconnect() {
        setTimeout(() => {
            reconnector = setInterval(() => {
                if (dontReconnect || busy || !disconnected || connected || !SettingsManager.getSettings().autoReconnect) return
                ChatManager.add(ChatHelper.makeBotChat("Connecting..."))
                connect()
            }, 1000)
        }, 0)
    }
}