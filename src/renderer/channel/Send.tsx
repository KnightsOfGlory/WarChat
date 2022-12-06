import {TextField} from "@mui/material";
import React, {useEffect} from "react";
import {ChatManager} from "../state/ChatManager";
import {UserManager} from "../state/UserManager";
import {ConnectionManager} from "../state/ConnectionManager";

export default function Send() {
    const [message, setMessage] = React.useState("");
    const [connected, setConnected] = React.useState(false);

    useEffect(() => {
        ConnectionManager.subscribe((isConnected: boolean) => setConnected(isConnected));
    }, []);

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
                    window.electron.ipcRenderer.sendMessage("chat", message);
                    if (!message.startsWith("/")) {
                        ChatManager.add({
                            timestamp: Date.now(),
                            user: UserManager.getConnectedUser(),
                            message: message
                        })
                    }
                    setMessage("")
                }
            }}
            disabled={!connected}
            sx={{width: "auto", margin: "16px"}} />
    );
}