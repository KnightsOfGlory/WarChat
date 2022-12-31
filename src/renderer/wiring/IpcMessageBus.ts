import {MessageBus, MessageSubscription} from "@knightsofglory/warlibrary/lib/MessageBus";

export class IpcMessageBus implements MessageBus {
    on(channel: string, callback: MessageSubscription): void {
        window.electron.ipcRenderer.on(channel, callback)
    }

    send(channel: string, ...args: unknown[]): void {
        window.electron.ipcRenderer.sendMessage(channel, ...args)
    }

    private subscribers: { [key: string]: MessageSubscription[] } = {}

    private ensureChannelExists(channel: string) {
        channel = channel.toLowerCase()

        if (!(channel in this.subscribers)) {
            this.subscribers[channel] = []
        }
    }

    onLocal(channel: string, callback: MessageSubscription): void {
        channel = channel.toLowerCase()
        this.ensureChannelExists(channel)

        this.subscribers[channel].push(callback)
    }

    sendLocal(channel: string, ...args: unknown[]): void {
        channel = channel.toLowerCase()
        this.ensureChannelExists(channel)

        this.subscribers[channel].forEach(callback => callback(...args))
    }
}
