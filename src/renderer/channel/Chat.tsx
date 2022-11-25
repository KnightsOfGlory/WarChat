import {TextField} from "@mui/material";
import React from "react";

export default class Chat extends React.Component {
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
                        window.electron.ipcRenderer.sendMessage("chat", this.state.message);
                        this.setState({message: ""})
                    }
                }}
                sx={{width: "auto", margin: "16px"}} />
        );
    }
}