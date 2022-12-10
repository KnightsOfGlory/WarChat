import {User, UserManager} from "./UserManager"
import {ChatHelper} from "../utilities/ChatHelper"
import {Interprocess} from "../../common/Interprocess";
import {MessageEvents} from "../../common/MessageEvents";
import {ipcRenderer} from "../utilities/IpcRenderer";

export type Talk = {
    timestamp: number,
    user: User,
    message: string
}

export type Emote = {
    timestamp: number,
    user: User,
    isEmote: boolean,
    message: string
}

export type Info = {
    timestamp: number,
    user: User,
    message: string
}

export type Error = {
    timestamp: number,
    user: User,
    message: string,
    isError: boolean
}

export type Enter = {
    timestamp: number,
    user: User,
    channel: string,
    message: string
}

export type Chat = Talk | Emote | Info | Error | Enter
export type TalkSubscription = (talks: Chat[]) => void

export namespace ChatManager {
    let chats: Chat[] = []
    let subscriptions: TalkSubscription[] = []

    listen()

    export let ignoreInfo = false

    export function add(chat: Chat) {
        chats.push(chat)
        dispatch()
    }

    export function subscribe(callback: TalkSubscription) {
        subscriptions.push(callback)
    }

    function dispatch() {
        subscriptions.forEach((s) => s(chats))
    }

    function listen() {
        ipcRenderer.on(Interprocess.Channels.MESSAGES, (arg) => {
            // @ts-ignore
            let string = new TextDecoder().decode(arg)
            let messages = string.split("\r\n")
            let innerMessage: string

            messages.forEach((message) => {
                let fields = message.split(" ")
                let code = fields[0]

                const name = () => fields[2]

                switch (code) {
                    case MessageEvents.WHISPER_IN:
                        innerMessage = ChatHelper.parseQuoted(message)
                        chats.push({
                            timestamp: Date.now(),
                            user: {name: name(), client: "[NONE]", flags: "0000"},
                            message: "(whisper) " + innerMessage
                        })
                        dispatch()
                        break
                    case MessageEvents.TALK:
                        innerMessage = ChatHelper.parseQuoted(message)
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getByUsername(name()),
                            message: innerMessage
                        })
                        dispatch()
                        break
                    case MessageEvents.BROADCAST:
                        innerMessage = ChatHelper.parseQuoted(message)
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getServerUser(),
                            message: innerMessage
                        })
                        dispatch()
                        break
                    case MessageEvents.CHANNEL:
                        innerMessage = ChatHelper.parseQuoted(message)
                        if (innerMessage != "Chat") {
                            chats.push({
                                timestamp: Date.now(),
                                user: UserManager.getWarChatUser(),
                                channel: innerMessage,
                                message: ""
                            })
                            dispatch()
                        }
                        break
                    case MessageEvents.WHISPER_OUT:
                        innerMessage = ChatHelper.parseQuoted(message)
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getConnectedUser(),
                            message: "(to " + name() + ") " + innerMessage
                        })
                        dispatch()
                        break
                    case MessageEvents.INFO:
                        if (!ignoreInfo) {
                            innerMessage = ChatHelper.parseQuoted(message)
                            chats.push({
                                timestamp: Date.now(),
                                user: UserManager.getServerUser(),
                                message: innerMessage,
                            })
                            dispatch()
                        }
                        break
                    case MessageEvents.ERROR:
                        innerMessage = ChatHelper.parseQuoted(message)
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getServerUser(),
                            message: innerMessage,
                            isError: true
                        })
                        dispatch()
                        break
                    case MessageEvents.EMOTE:
                        innerMessage = ChatHelper.parseQuoted(message)
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getByUsername(name()),
                            isEmote: true,
                            message: innerMessage
                        })
                        dispatch()
                        break
                }
            })
        })
    }
}