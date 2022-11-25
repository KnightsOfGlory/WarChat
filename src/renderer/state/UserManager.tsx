export type User = {
    name: string,
    client: string | null,
    flags: string | null
}

export namespace UserManager {
    let users: User[] = []
    hook()

    function parse(fields: string[]) {
        let code = fields[0]

        switch (code) {
            case "1001": // user already there
            case "1002": // user joined
                let name = fields[2]
                let flags = fields[3]
                let client = fields[4]
                let user = {
                    "name": name,
                    "flags": flags,
                    "client": client
                };
                break;
            case "1003": // user left
                break;
        }

        let name = fields[2]
        let flags = fields[3]
        let client = fields[4]
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

                switch (code) {
                    case "1001": // user already there
                        let name = fields[2]
                        let flags = fields[3]
                        let client = fields[4]
                        let user = {
                            "name": name,
                            "flags": flags,
                            "client": client
                        };
                        break;
                    case "1002": // user joined
                        break;
                    case "1003": // user left
                        break;
                    case "1007": // joined channel
                        break;
                    default:
                        break;
                }
            });

            // @ts-ignore
            this.setState({users: [...this.state.users, ...users]})
        });
    }
}