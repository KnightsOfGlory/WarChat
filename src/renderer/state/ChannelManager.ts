import {ConnectionManager} from "./ConnectionManager"
import {ChatManager} from "./ChatManager"
import {UserManager} from "./UserManager"
import {ipcRenderer} from "../utilities/IpcRenderer"
import {ChatHelper} from "../utilities/ChatHelper"
import {Interprocess} from "../../common/Interprocess";
import {MessageEvents} from "../../common/MessageEvents";

export type Channel = {
    name: string,
    topic: string | null,
    users: number | null
}

export type CurrentChannelSubscription = (channel: Channel) => void
export type ChannelListSubscription = (channels: Channel[]) => void

export namespace ChannelManager {
    let currentChannel: Channel
    let channels: Channel[] = []

    let currentChannelSubscriptions: CurrentChannelSubscription[] = []
    let channelListSubscriptions: ChannelListSubscription[] = []

    listen()

    export function subscribeCurrent(callback: CurrentChannelSubscription) {
        currentChannelSubscriptions.push(callback)
    }
    export function subscribeList(callback: ChannelListSubscription) {
        channelListSubscriptions.push(callback)
    }

    function dispatchCurrent(){
        if (currentChannel == undefined) return
        currentChannelSubscriptions.forEach((s) => s(currentChannel))
    }
    function dispatchList(){
        channelListSubscriptions.forEach((s) => s(channels))
    }

    let counter = 0
    function listen() {
        ConnectionManager.subscribe(() => { channels = []; dispatchList() })
        UserManager.subscribe((users) => {
            if (currentChannel != undefined && channels.length > 0 && users.length > 0) {
                currentChannel.users = users.length
                channels.filter((c) => c.name == currentChannel.name)[0].users = users.length
                dispatchCurrent()
                dispatchList()
            }
        })

        setInterval(() => {
            ChatManager.ignoreInfo = true
            ipcRenderer.sendMessage("chat", "/channels")
        }, 60*1000)

        ipcRenderer.on(Interprocess.Channels.MESSAGES, (arg) => {
            let string = new TextDecoder().decode(arg as Uint8Array)
            let messages = string.split("\r\n")

            messages.forEach((message) => {
                let fields = message.split(" ")
                let code = fields[0]
                let innerMessage: string = ""

                switch (code) {
                    case MessageEvents.CHANNEL:
                        innerMessage = ChatHelper.parseQuoted(message)
                        currentChannel = {
                            name: innerMessage,
                            topic: "",
                            users: 0
                        }
                        dispatchCurrent()
                        if (currentChannel.name == "Chat") {
                            ChatManager.ignoreInfo = true
                            ipcRenderer.sendMessage("chat", "/channels")
                        }
                        break
                    case MessageEvents.INFO:
                        innerMessage = ChatHelper.parseQuoted(message)
                        if (innerMessage.startsWith("Listing ") && innerMessage.endsWith(" channels:")) {
                            counter = Number(innerMessage.split(" ")[1])
                            channels = []
                        } else if (counter > 0) {
                            let tokens = innerMessage.split("|")
                            channels.push({
                                name: tokens[0].trim(),
                                topic: tokens[3].trim(),
                                users: Number(tokens[1].trim())
                            })
                            dispatchList()
                            counter--

                            if (counter == 0) {
                                ChatManager.ignoreInfo = false
                            }
                        }
                        break
                }
            })
        })
    }
}