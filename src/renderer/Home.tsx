import Bar from "./navigation/Bar";
import {Divider, ListItem, ListItemButton, Stack} from "@mui/material";
import React from "react";
import Profiles from "./navigation/Profiles";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Pages from "./navigation/Pages";
import Users from "./channel/Users";
import Channel from "./channel/Channel";
import ChannelTree from "./channel/ChannelTree";

export default class Home extends React.Component {
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
            <div style={{height: "100%"}}>
                <Bar/>
                <Stack direction="row" sx={{height: "100%"}}>
                    <Profiles/>
                    <Divider orientation="vertical" flexItem />
                    <Pages/>
                    <Divider orientation="vertical" flexItem />
                    <ChannelTree/>
                    <Divider orientation="vertical" flexItem />
                    <Channel/>
                    <Divider orientation="vertical" flexItem />
                    <Users/>
                </Stack>
            </div>
        );
    }
}