import {ListItem, ListItemButton, Stack} from "@mui/material";
import React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import chat from "../../../assets/images/chat.png";
import d2dv from "../../../assets/images/d2dv.png";
import jstr from "../../../assets/images/jstr.png";

export default class Users extends React.Component {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {users: []};
        this.hook();
    }

    hook() {
        window.electron.ipcRenderer.on('messages', (arg) => {
            // @ts-ignore
            let string = new TextDecoder().decode(arg);
            let tokens = string.split("\n")
            let users: { name: string; client: string; }[] = []

            tokens.forEach((token) => {
                let fields = token.split(" ");
                let code = fields[0]
                let name = fields[2]
                let client = fields[4]

                if (code != "1001") return;

                let user = {
                    "name": name,
                    "client": client
                };

                users.push(user)
            });

            // @ts-ignore
            this.setState({users: [...this.state.users, ...users]})
        });
    }

    render() {
        // let icons = {
        //     "[CHAT]": chat,
        //     "[D2DV]": d2dv,
        //     "[JSTR]": jstr
        // }
        let icons = new Map([
            ["[CHAT]", chat],
            ["[D2DV]", d2dv],
            ["[JSTR]", jstr],
        ])

        return (
            <div>
                <List sx={{ width: '100%', maxWidth: 300, overlflowY: "auto" }}>
                    {
                        // @ts-ignore
                        this.state.users.map((user) => {
                            // @ts-ignore
                            let icon = icons.get(user.client.trim())

                            return (
                                <ListItem
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar
                                                src={icon}
                                                variant="rounded"
                                            />
                                        </ListItemAvatar>
                                        <ListItemText primary={user.name} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })
                    }

                    {/*{[0, 1, 2, 3].map((value) => {*/}
                    {/*    const labelId = `checkbox-list-secondary-label-${value}`;*/}
                    {/*    return (*/}
                    {/*        <ListItem*/}
                    {/*            key={value}*/}
                    {/*            disablePadding*/}
                    {/*        >*/}
                    {/*            <ListItemButton>*/}
                    {/*                <ListItemAvatar>*/}
                    {/*                    <Avatar*/}
                    {/*                        alt={`Avatar n°${value + 1}`}*/}
                    {/*                        src={d2dv}*/}
                    {/*                        variant="rounded"*/}
                    {/*                    />*/}
                    {/*                </ListItemAvatar>*/}
                    {/*                <ListItemText id={labelId} primary={`Line item ${value + 1}`} />*/}
                    {/*            </ListItemButton>*/}
                    {/*        </ListItem>*/}
                    {/*    );*/}
                    {/*})}*/}
                </List>
            </div>
        );
    }
}