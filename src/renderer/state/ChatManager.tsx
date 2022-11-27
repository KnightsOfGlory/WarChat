import {User, UserManager, UserSubscription} from "./UserManager";

export type Talk = {
    user: User,
    message: string | null
}

export type Emote = {
    user: User,
    message: string | null
}

export type Info = {
    message: string
}

export type Error = {
    message: string,
    isError: boolean
}

export type Chat = Talk | Emote | Info | Error
export type TalkSubscription = (talks: Chat[]) => void

export namespace ChatManager {
    let chats: Chat[] = []
    let subscriptions: TalkSubscription[] = []

    listen()

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
                    case "1005": // talk
                    case "1023": // emote
                        chats.push({
                            user: UserManager.getByUsername(fields[2]),
                            message: message.split("\"")[1].slice(0, -1)
                        })
                        dispatch()
                        break;
                    case "1018": // info
                    case "1019": // error
                        innerMessage = message.split("\"")[1].trim()
                        chats.push({
                            message: innerMessage,
                            isError: true
                        })
                        break;
                }
            })
        })
    }
}