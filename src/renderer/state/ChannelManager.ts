import {ConnectionManager} from "./ConnectionManager"
import {ChatManager} from "./ChatManager"
import {UserManager} from "./UserManager"
import {ChatHelper} from "../utilities/ChatHelper"
import {Interprocess} from "../../common/Interprocess";
import {MessageEvents} from "../../common/MessageEvents";
import {ipcRenderer} from "../utilities/IpcRenderer";
import {ProfileManager} from "./ProfileManager";

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
        ConnectionManager.subscribeConnected(() => { channels = []; dispatchList() })
        UserManager.subscribe((users) => {
            if (currentChannel != undefined && channels.length > 0 && users.length > 0) {
                currentChannel.users = users.length
                let channel = channels.filter((c) => c.name == currentChannel.name)[0]
                if (channel) {
                    channel.users = users.length
                    dispatchCurrent()
                    dispatchList()
                }
            }
        })

        setInterval(() => {
            ChatManager.ignoreInfo = true
            ipcRenderer.sendMessage("chat", "/channels")
        }, 60*1000)

        ipcRenderer.on(Interprocess.Channels.MESSAGES, (arg) => {
            let string = arg as string
            let messages = string.split("\r\n")

            messages.forEach((message) => {
                if (message.trim().length == 0) return

                let fields = message.split(" ")
                let code = fields[0]
                let innerMessage: string = ""

                // classic telnet
                switch (code) {
                    case MessageEvents.Classic.CHANNEL:
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
                    case MessageEvents.Classic.INFO:
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

                // init 6 proprietary
                const event = () => fields[1]
                const name = () => fields[5]

                switch (code) {
                    case MessageEvents.Init6.Commands.CHANNEL:
                        switch (event()) {
                            case MessageEvents.Init6.Events.JOIN:
                                innerMessage = ChatHelper.parseInit6(message, 6)
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
                        }
                        break
                    case MessageEvents.Init6.Commands.SERVER:
                        switch (event()) {
                            case MessageEvents.Init6.Events.INFO:
                                innerMessage = ChatHelper.parseInit6(message, 6)
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
                        break
                }
            })
        })
    }
}