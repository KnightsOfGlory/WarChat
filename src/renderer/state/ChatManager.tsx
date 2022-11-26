import {User, UserManager, UserSubscription} from "./UserManager";

export type Talk = {
    user: User,
    isEmote: boolean,
    message: string | null
}

export type TalkSubscription = (talks: Talk[]) => void

export namespace ChatManager {
    let talks: Talk[] = []
    let subscriptions: TalkSubscription[] = []

    listen()

    export function subscribe(callback: TalkSubscription) {
        console.log('[DEBUG] Subscribe')
        subscriptions.push(callback)
    }

    function dispatch(){
        console.log('[DEBUG] Dispatch')
        subscriptions.forEach((s) => s(talks))
    }

    function listen() {
        window.electron.ipcRenderer.on('messages', (arg) => {
            // @ts-ignore
            let string = new TextDecoder().decode(arg);
            let messages = string.split("\r\n")

            messages.forEach((message) => {
                let fields = message.split(" ");
                let code = fields[0]

                switch (code) {
                    case "1005": // talk
                    case "1023": // emote
                        talks.push({
                            user: UserManager.getByUsername(fields[2]),
                            isEmote: code == "1023",
                            message: message.split("\"")[1].slice(0, -1)
                        })
                        dispatch()
                        break;
                }
            })
        })
    }
}