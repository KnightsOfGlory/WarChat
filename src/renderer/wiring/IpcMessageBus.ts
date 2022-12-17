import {MessageBus, MessageSubscription} from "@knightsofglory/warlibrary/lib/MessageBus";

export class IpcMessageBus implements MessageBus {
    on(channel: string, callback: MessageSubscription): void {
        window.electron.ipcRenderer.on(channel, callback)
    }

    send(channel: string, ...args: unknown[]): void {
        window.electron.ipcRenderer.sendMessage(channel, ...args)
    }
}
