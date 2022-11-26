export type Channel = {
    name: string,
    topic: string,
    users: number | null
}

export type ChannelListSubscription  = (channels: Channel[]) => void

export namespace ChannelManager {
    let currentChannel: string | null = null
    let channels: Channel[] = []
    let subscriptions: ChannelListSubscription[] = []

    listen()

    export function subscribeList(callback: ChannelListSubscription) {
        subscriptions.push(callback)
    }

    function dispatchList(){
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
                        innerMessage = message.split("\"")[1].trim()
                        currentChannel = innerMessage
                        break;
                    case "1018": // info
                        innerMessage = message.split("\"")[1].trim()
                        console.log(innerMessage)
                        if (innerMessage.startsWith("Listing ") && innerMessage.endsWith(" channels:")) {
                            counter = Number(innerMessage.slice(8, 9))
                        } else if (counter > 0) {
                            let tokens = innerMessage.split("|")
                            console.log("COUNTER")
                            console.log(tokens)
                            channels.push({
                                name: tokens[0].trim(),
                                topic: tokens[3].trim(),
                                users: Number(tokens[1].trim())
                            })
                            dispatchList()
                            counter--
                        }
                        //dispatch()
                        break;
                }
            })
        })
    }
}