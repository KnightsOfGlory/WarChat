import {User, UserManager} from "./UserManager";

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

    function dispatch(){
        subscriptions.forEach((s) => s(chats))
    }

    function listen() {
        window.electron.ipcRenderer.on('messages', (arg) => {
            // @ts-ignore
            let string = new TextDecoder().decode(arg);
            let messages = string.split("\r\n")
            let innerMessage: string

            messages.forEach((message) => {
                let fields = message.split(" ");
                let code = fields[0]

                switch (code) {
                    case "1004": // whisper in
                        innerMessage = message.split("\"")[1].trim()
                        chats.push({
                            timestamp: Date.now(),
                            // user: UserManager.getByUsername(fields[2]),
                            user: {name: fields[2], client: "[NONE]", flags: "0000"},
                            message: "(whisper) " + innerMessage
                        })
                        dispatch()
                        break;
                    case "1005": // talk
                        innerMessage = message.split("\"")[1].trim()
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getByUsername(fields[2]),
                            message: innerMessage
                        })
                        dispatch()
                        break;
                    case "1006": // broadcast
                        innerMessage = message.split("\"")[1].trim()
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getServerUser(),
                            message: innerMessage
                        })
                        dispatch()
                        break;
                    case "1007": // joined channel
                        innerMessage = message.split("\"")[1].trim()
                        if (innerMessage != "Chat") {
                            chats.push({
                                timestamp: Date.now(),
                                user: UserManager.getWarChatUser(),
                                channel: innerMessage,
                                message: ""
                            })
                            dispatch()
                        }
                        break;
                    case "1010": // whisper out
                        innerMessage = message.split("\"")[1].trim()
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getConnectedUser(),
                            message: "(to " + fields[2] + ") " + innerMessage
                        })
                        dispatch()
                        break;
                    case "1018": // info
                        if (!ignoreInfo) {
                            innerMessage = message.split("\"")[1].trim()
                            chats.push({
                                timestamp: Date.now(),
                                user: UserManager.getServerUser(),
                                message: innerMessage,
                            })
                            dispatch()
                        }
                        break;
                    case "1019": // error
                        innerMessage = message.split("\"")[1].trim()
                        chats.push({
                            timestamp: Date.now(),
                            user: { name: "Server", client: "[SERV]", flags: "" },
                            message: innerMessage,
                            isError: true
                        })
                        dispatch()
                        break;
                    case "1023": // emote
                        innerMessage = message.split("\"")[1].trim()
                        chats.push({
                            timestamp: Date.now(),
                            user: UserManager.getByUsername(fields[2]),
                            isEmote: true,
                            message: innerMessage
                        })
                        dispatch()
                        break;
                }
            })
        })
    }
}