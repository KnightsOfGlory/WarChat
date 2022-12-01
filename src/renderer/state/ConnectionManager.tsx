export type Subscription = (isConnected: boolean) => void

export namespace ConnectionManager {
    let isConnected: boolean = false
    let subscriptions: Subscription[] = []

    listen()

    export function subscribe(callback: Subscription) {
        subscriptions.push(callback)
    }

    function dispatch() {
        subscriptions.forEach((s) => s(isConnected))
    }

    function listen() {
        window.electron.ipcRenderer.on("socket", (arg) => {
            switch (arg) {
                case "connected":
                    isConnected = true
                    dispatch()
                    break
                case "disconnected":
                    isConnected = false
                    dispatch()
                    break
            }
        })
    }
}