export type User = {
    name: string,
    client: string | null,
    flags: string | null
}

export type Subscription = (users: User[]) => void

export namespace UserManager {
    let users: User[] = []
    hook()
    let subscriptions: Subscription[] = []

    export function subscribe(callback: Subscription) {
        console.log('[DEBUG] Subscribe')
        subscriptions.push(callback)
    }

    function dispatch(){
        console.log('[DEBUG] Dispatch')
        subscriptions.forEach((s) => s(users))
    }

    function hook() {
        window.electron.ipcRenderer.on('messages', (arg) => {
            // @ts-ignore
            let string = new TextDecoder().decode(arg);
            let messages = string.split("\r\n")
            let newUsers: User[] = []

            messages.forEach((message) => {
                let fields = message.split(" ");
                let code = fields[0]
                let name = null
                let flags = null
                let client = null
                let user = null

                switch (code) {
                    case "1001": // user already there
                        name = fields[2]
                        flags = fields[3]
                        client = fields[4]
                        user = {
                            "name": name,
                            "flags": flags,
                            "client": client
                            };
                        users.push(user)
                        console.log('[DEBUG] 1001 Dispatch')
                        dispatch()
                        break;
                    case "1002": // user joined
                        name = fields[2]
                        flags = fields[3]
                        client = fields[4]
                        user = {
                            "name": name,
                            "flags": flags,
                            "client": client
                        };
                        users.push(user)
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
                        name = fields[2]
                        flags = fields[3]
                        client = fields[4]
                        dispatch()
                        break;
                    default:
                        break;
                }

            });
        });
    }
}