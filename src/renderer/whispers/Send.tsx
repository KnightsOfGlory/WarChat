import React, {useEffect, useState} from "react"
import {References} from "@knightsofglory/warlibrary/lib/References";
import {TextField} from "@mui/material";

type Properties = {
    username: string
}

export default function Send(properties: Properties) {
    const [message, setMessage] = useState("")

    const connected = References.connectionManager.isConnected()

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
                    References.messageBus.send("chat", `/w ${properties.username} ${message}`)
                    setMessage("")
                }
            }}
            disabled={!connected}
            sx={{width: "auto", margin: "16px"}}
        />
    )
}
