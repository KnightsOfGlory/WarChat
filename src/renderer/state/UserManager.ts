import {ConnectionManager} from "./ConnectionManager";
import {ipcRenderer} from "../utilities/IpcRenderer";
import {Interprocess} from "../../common/Interprocess";
import {MessageEvents} from "../../common/MessageEvents";

export type User = {
    name: string,
    client: string,
    flags: string | undefined
}

export type UserSubscription = (users: User[]) => void

export namespace UserManager {
    let self: string
    let users: User[] = []
    let subscriptions: UserSubscription[] = []

    listen()

    export function getConnectedUser(): User {
        return getByUsername(self)
    }

    export function getServerUser(): User {
        return {name: "Server", client: "[SERV]", flags: "0000"}
    }

    export function getWarChatUser(): User {
        return {name: "WarChat", client: "[WCHT]", flags: "0000"}
    }

    export function getByUsername(username: string): User {
        let results = users.filter((u) => u.name.toLowerCase() == username.toLowerCase())
        return results[0]
    }

    export function subscribe(callback: UserSubscription) {
        subscriptions.push(callback)
    }

    function dispatch() {
        subscriptions.forEach((s) => s(users))
    }

    function listen() {
        ConnectionManager.subscribe(() => {
            users = []
            dispatch()
        })

        ipcRenderer.on(Interprocess.Channels.MESSAGES, (arg) => {
            let string = new TextDecoder().decode(arg as Uint8Array)
            let messages = string.split("\r\n")

            messages.forEach((message) => {
                let fields = message.split(" ")
                let code = fields[0]

                const name = () => fields[2]
                const flags = () => fields[3]
                const client = () => fields[4]

                switch (code) {
                    case MessageEvents.USER:
                        users.push({
                            "name": name(),
                            "flags": flags(),
                            "client": client()
                        })
                        dispatch()
                        break
                    case MessageEvents.JOIN:
                        users.push({
                            "name": name(),
                            "flags": flags(),
                            "client": client()
                        })
                        dispatch()
                        break
                    case MessageEvents.LEAVE:
                        users = users.filter((u) => u.name != name())
                        dispatch()
                        break
                    case MessageEvents.CHANNEL:
                        users = []
                        dispatch()
                        break
                    case MessageEvents.UPDATE:
                        let user = getByUsername(name())
                        user.flags = flags()
                        user.client = client()
                        break
                    case MessageEvents.NAME:
                        self = name()
                        break
                    default:
                        break
                }
            });
        });
    }
}