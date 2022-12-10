import {TextField} from "@mui/material"
import React, {useEffect} from "react"
import {ChatManager} from "../state/ChatManager"
import {ConnectionManager} from "../state/ConnectionManager"
import {ipcRenderer} from "../utilities/IpcRenderer"
import {ChatHelper} from "../utilities/ChatHelper"

export default function Send() {
    const [message, setMessage] = React.useState("")
    const [connected, setConnected] = React.useState(false)

    useEffect(() => {
        ConnectionManager.subscribe((isConnected: boolean) => setConnected(isConnected))
    }, [])

    return (
        <TextField
            variant="outlined"
            value={message}
            onInput={(event) =>
                // @ts-ignore
                setMessage(event.target.value)
            }
            onKeyDown={(event) => {
                if (event.code == "Enter" && connected) {
                    ipcRenderer.sendMessage("chat", message)
                    if (!message.startsWith("/")) {
                        ChatManager.add(ChatHelper.makeSelfChat(message))
                    }
                    setMessage("")
                }
            }}
            disabled={!connected}
            sx={{width: "auto", margin: "16px"}}/>
    )
}