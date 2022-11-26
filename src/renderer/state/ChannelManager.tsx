export type Channel = {
    name: string,
    topic: string,
    users: number | null
}

export type ChannelSubscription  = (talks: Channel[]) => void

export namespace ChannelManager {
    let currentChannel: string | null = null
    let channels: Channel[] = []
    let subscriptions: ChannelSubscription[] = []

    listen()

    export function subscribe(callback: ChannelSubscription) {
        console.log('[DEBUG] Subscribe')
        subscriptions.push(callback)
    }

    function dispatch(){
        console.log('[DEBUG] Dispatch')
        subscriptions.forEach((s) => s(channels))
    }

    let counter = 0
    function listen() {
        window.electron.ipcRenderer.on('messages', (arg) => {
            // @ts-ignore
            let string = new TextDecoder().decode(arg);
            let messages = string.split("\r\n")

            messages.forEach((message) => {
                let fields = message.split(" ");
                let code = fields[0]
                let innerMessage: string = ""

                switch (code) {
                    case "1007": // info
                        innerMessage = message.split("\"")[1].slice(0, -1)
                        this.currentChannel = innerMessage
                        break;
                    case "1018": // info
                        innerMessage = message.split("\"")[1].slice(0, -1)
                        if (innerMessage.startsWith("Listing ") && innerMessage.endsWith(" channels:")) {
                            counter = Number(innerMessage.slice(7, 8))
                        } else if (counter > 0) {
                            let tokens = innerMessage.split("|")
                            channels.push({
                                name: tokens[0],
                                topic: tokens[3],
                                users: Number(tokens[1])
                            })
                            counter--
                        }
                        //dispatch()
                        break;
                }
            })
        })
    }
}