import {User, UserManager} from "./UserManager"
import {ChatHelper} from "../utilities/ChatHelper"
import {Interprocess} from "../../common/Interprocess";
import {MessageEvents} from "../../common/MessageEvents";
import {ipcRenderer} from "../utilities/IpcRenderer";
import {ProfileManager} from "./ProfileManager";

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
            let string = arg as string
            let messages = string.split("\r\n")
            let innerMessage: string

            messages.forEach((message) => {
                if (message.trim().length == 0) return

                let fields = message.split(" ")
                let code = fields[0]

                let name = () => fields[2]

                // classic telnet
                switch (code) {
                    case MessageEvents.Classic.WHISPER_IN:
                        innerMessage = ChatHelper.parseQuoted(message)
                        chats.push({
                            timestamp: Date.now(),
                            user: {name: name(), client: "[NONE]", flags: ""},
                            message: "(whisper) " + innerMessage
                        })
                        dispatch()
                        break
                    case MessageEvents.Classic.TALK:
                        innerMessage = ChatHelper.parseQuoted(message)
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getByUsername(name()),
                            message: innerMessage
                        })
                        dispatch()
                        break
                    case MessageEvents.Classic.BROADCAST:
                        innerMessage = ChatHelper.parseQuoted(message)
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getServerUser(),
                            message: innerMessage
                        })
                        dispatch()
                        break
                    case MessageEvents.Classic.CHANNEL:
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
                    case MessageEvents.Classic.WHISPER_OUT:
                        innerMessage = ChatHelper.parseQuoted(message)
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getConnectedUser(),
                            message: "(to " + name() + ") " + innerMessage
                        })
                        dispatch()
                        break
                    case MessageEvents.Classic.INFO:
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
                    case MessageEvents.Classic.ERROR:
                        innerMessage = ChatHelper.parseQuoted(message)
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getServerUser(),
                            message: innerMessage,
                            isError: true
                        })
                        dispatch()
                        break
                    case MessageEvents.Classic.EMOTE:
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

                // init 6 proprietary
                const event = () => fields[1]
                const direction = () => fields[2]
                const flags = () => fields[4]
                name = () => fields[6]

                switch (code) {
                    case MessageEvents.Init6.Commands.USER:
                        switch (event()) {
                            case MessageEvents.Init6.Events.WHISPER:
                                switch (direction()) {
                                    case MessageEvents.Init6.Directions.FROM:
                                        innerMessage = ChatHelper.parseInit6(message, 8)
                                        chats.push({
                                            timestamp: Date.now(),
                                            user: {name: name(), client: "[NONE]", flags: ""},
                                            message: "(whisper) " + innerMessage
                                        })
                                        dispatch()
                                        break
                                    case MessageEvents.Init6.Directions.TO:
                                        innerMessage = ChatHelper.parseInit6(message, 8)
                                        chats.push({
                                            timestamp: Date.now(),
                                            user: UserManager.getConnectedUser(),
                                            message: "(to " + name() + ") " + innerMessage
                                        })
                                        dispatch()
                                        break
                                }
                                break
                            case MessageEvents.Init6.Events.TALK:
                                innerMessage = ChatHelper.parseInit6(message, 8)
                                chats.push({
                                    timestamp: Date.now(),
                                    user: UserManager.getByUsername(name()),
                                    message: innerMessage
                                })
                                dispatch()
                                break
                            case MessageEvents.Init6.Events.EMOTE:
                                innerMessage = ChatHelper.parseInit6(message, 8)
                                chats.push({
                                    timestamp: Date.now(),
                                    user: UserManager.getByUsername(name()),
                                    isEmote: true,
                                    message: innerMessage
                                })
                                dispatch()
                                break
                        }
                        break
                    case MessageEvents.Init6.Commands.CHANNEL:
                        switch (event()) {
                            case MessageEvents.Init6.Events.JOIN:
                                innerMessage = ChatHelper.parseInit6(message, 6)
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
                        }
                        break
                    case MessageEvents.Init6.Commands.SERVER:
                        switch (event()) {
                            case MessageEvents.Init6.Events.INFO:
                            case MessageEvents.Init6.Events.TOPIC:
                                if (!ignoreInfo) {
                                    innerMessage = ChatHelper.parseInit6(message, 6)
                                    chats.push({
                                        timestamp: Date.now(),
                                        user: UserManager.getServerUser(),
                                        message: innerMessage,
                                    })
                                    dispatch()
                                }
                                break
                            case MessageEvents.Init6.Events.ERROR:
                                innerMessage = ChatHelper.parseInit6(message, 6)
                                chats.push({
                                    timestamp: Date.now(),
                                    user: UserManager.getServerUser(),
                                    message: innerMessage,
                                    isError: true
                                })
                                dispatch()
                                break
                            case MessageEvents.Init6.Events.BROADCAST:
                                innerMessage = ChatHelper.parseInit6(message, 6)
                                chats.push({
                                    timestamp: Date.now(),
                                    user: UserManager.getServerUser(),
                                    message: innerMessage
                                })
                                dispatch()
                                break
                        }
                        break
                }
            })
        })
    }
}