import {Divider, ListItem, Stack, TextField} from "@mui/material";
import React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Chat from "./Chat";

export default class Channel extends React.Component {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {messages: []};
        this.hook();
    }

    hook() {
        window.electron.ipcRenderer.on('messages', (arg) => {
            // @ts-ignore
            let string = new TextDecoder().decode(arg);
            let tokens = string.split("\n")

            // @ts-ignore
            this.setState({messages: [...this.state.messages, ...tokens]})
        });
    }

    render() {
        return (
            <Stack sx={{width: "100%"}}>
                <List sx={{width: "100%", height: "calc(100vh - 64px - 89px)", overflowY: "overlay", overflowAnchor: "none"}}>
                    {
                        // @ts-ignore
                        this.state.messages.map((message: string) => {
                            return (
                                <ListItem>
                                    <ListItemText>
                                        {message}
                                    </ListItemText>
                                </ListItem>);
                        })
                    }
                </List>
                <Chat/>
            </Stack>
        );
    }
}