export type User = {
    name: string,
    client: string | undefined,
    flags: string | undefined
}

export type UserSubscription = (users: User[]) => void

export namespace UserManager {
    let self: string
    let users: User[] = []
    let subscriptions: UserSubscription[] = []

    listen()

    export function getSelf(): User {
        return getByUsername(self)
    }

    export function getByUsername(username: string): User {
        let results = users.filter((u) => u.name.toLowerCase() == username.toLowerCase())
        //TODO handle missing

        return results[0]
    }

    export function subscribe(callback: UserSubscription) {
        subscriptions.push(callback)
    }

    function dispatch(){
        subscriptions.forEach((s) => s(users))
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
                    case "1001": // user already there
                        users.push({
                            "name": fields[2],
                            "flags": fields[3],
                            "client": fields[4]
                        })
                        console.log('[DEBUG] 1001 Dispatch')
                        dispatch()
                        break;
                    case "1002": // user joined
                        users.push({
                            "name": fields[2],
                            "flags": fields[3],
                            "client": fields[4]
                        })
                        console.log('[DEBUG] 1002 Dispatch')
                        dispatch()
                        break;
                    case "1003": // user left -- using HOF to make up for bad protocol
                        users = users.filter((u) => fields[2] != u.name)
                        dispatch()
                        break;
                    case "1007":
                        users = []
                        dispatch()
                        break;
                    case "1009":
                        // name = fields[2]
                        // flags = fields[3]
                        // client = fields[4]
                        // dispatch()
                        break;
                    case "2010":
                        self = fields[2]
                        break;
                    default:
                        break;
                }

            });
        });
    }
}