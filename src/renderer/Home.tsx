import Bar from "./navigation/Bar";
import {ListItem, ListItemButton, Stack} from "@mui/material";
import React from "react";
import Profiles from "./navigation/Profiles";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Pages from "./navigation/Pages";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import d2dv from "../../assets/images/d2dv.png";
import Users from "./channel/Users";

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
            <div>
                <Bar/>
                <Stack direction="row" sx={{height: "100%"}}>
                    <Profiles/>
                    <Pages/>
                    <List sx={{width: "100%", height: "calc(100vh - 100px)", overflowY: "auto"}}>
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
                    <Users/>
                </Stack>
            </div>
        );
    }
}