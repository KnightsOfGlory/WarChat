import {TextField} from "@mui/material";
import React from "react";
import {ChatManager} from "../state/ChatManager";
import {UserManager} from "../state/UserManager";

export default class Send extends React.Component {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {message: ""};
    }

    render() {
        return (
            <TextField
                variant="outlined"
                // @ts-ignore
                value={this.state.message}
                // @ts-ignore
                onInput={(event) => this.setState({message: event.target.value})}
                onKeyDown={(event) => {
                    if (event.code == "Enter") {
                        // @ts-ignore
                        const message = this.state.message
                        window.electron.ipcRenderer.sendMessage("chat", message);
                        let chat = {
                            timestamp: Date.now(),
                            user: UserManager.getSelf(),
                            message: message
                        }
                        ChatManager.add(chat)
                        this.setState({message: ""})
                    }
                }}
                sx={{width: "auto", margin: "16px"}} />
        );
    }
}