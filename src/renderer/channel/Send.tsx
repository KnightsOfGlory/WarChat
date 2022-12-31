import {TextField} from "@mui/material"
import React, {useEffect} from "react"
import {ChatHelper} from "../../../../warlibrary/src/utilities/ChatHelper"
import {References} from "@knightsofglory/warlibrary/lib/References";

export default function Send() {
    const [message, setMessage] = React.useState("")
    const [connected, setConnected] = React.useState(false)

    useEffect(() => {
        References.connectionManager.subscribe("connected", (isConnected: boolean) => setConnected(isConnected))
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
                    References.messageBus.send("chat", message)
                    if (!message.startsWith("/") && !References.profileManager.getProfile().init6) {
                        References.chatManager.add({
                            timestamp: Date.now(),
                            event: "talk",
                            user: References.userManager.getConnectedUser(),
                            direction: "from",
                            message: message,
                            channel: null
                        })
                    }
                    setMessage("")
                }
            }}
            disabled={!connected}
            sx={{width: "auto", margin: "16px"}}
        />
    )
}
