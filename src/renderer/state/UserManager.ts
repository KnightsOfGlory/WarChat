import {ConnectionManager} from "./ConnectionManager";
import {Interprocess} from "../../common/Interprocess";
import {MessageEvents} from "../../common/MessageEvents";
import {ipcRenderer} from "../utilities/IpcRenderer";
import {ProfileManager} from "./ProfileManager";

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
        return {name: "Server", client: "[SERV]", flags: ""}
    }

    export function getWarChatUser(): User {
        return {name: "WarChat", client: "[WCHT]", flags: ""}
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
        ConnectionManager.subscribeConnected(() => {
            users = []
            dispatch()
        })

        ipcRenderer.on(Interprocess.Channels.MESSAGES, (arg) => {
            let string = arg as string
            let messages = string.split("\r\n")

            messages.forEach((message) => {
                if (message.trim().length == 0) return

                let fields = message.split(" ")
                let code = fields[0]

                let name = () => fields[2]
                let flags = () => fields[3]
                let client = () => fields[4]

                // classic telnet
                switch (code) {
                    case MessageEvents.Classic.USER:
                        users.push({
                            "name": name(),
                            "flags": flags(),
                            "client": client()
                        })
                        dispatch()
                        break
                    case MessageEvents.Classic.JOIN:
                        users.push({
                            "name": name(),
                            "flags": flags(),
                            "client": client()
                        })
                        dispatch()
                        break
                    case MessageEvents.Classic.LEAVE:
                        users = users.filter((u) => u.name != name())
                        dispatch()
                        break
                    case MessageEvents.Classic.CHANNEL:
                        users = []
                        dispatch()
                        break
                    case MessageEvents.Classic.UPDATE:
                        let user = getByUsername(name())
                        user.flags = flags()
                        user.client = client()
                        break
                    case MessageEvents.Classic.NAME:
                        self = name()
                        break
                    default:
                        break
                }

                // init 6 proprietary
                const event = () => fields[1]
                name = () => fields[6]
                flags = () => fields[4]
                client = () => "[" + fields[7].split('').reverse().join('').toUpperCase() + "]"

                switch (code) {
                    case MessageEvents.Init6.Commands.USER:
                        switch (event()) {
                            case MessageEvents.Init6.Events.IN:
                                users.push({
                                    "name": name(),
                                    "flags": flags(),
                                    "client": client()
                                })
                                dispatch()
                                break
                            case MessageEvents.Init6.Events.JOIN:
                                users.push({
                                    "name": name(),
                                    "flags": flags(),
                                    "client": client()
                                })
                                dispatch()
                                break
                            case MessageEvents.Init6.Events.LEAVE:
                                users = users.filter((u) => u.name != name())
                                dispatch()
                                break
                            case MessageEvents.Init6.Events.UPDATE:
                                let user = getByUsername(fields[6])
                                user.flags = flags()
                                user.client = client()
                                break
                        }
                        break
                    case MessageEvents.Init6.Commands.CHANNEL:
                        switch (event()) {
                            case MessageEvents.Init6.Events.JOIN:
                                self = ProfileManager.getProfile().username
                                users = []
                                dispatch()
                        }
                        break
                }
            });
        });
    }
}