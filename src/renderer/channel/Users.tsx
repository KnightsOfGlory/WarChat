import {ListItem, ListItemButton, Paper, Stack} from "@mui/material";
import React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { UserManager } from "../state/UserManager";

import chat from "../../../assets/images/chat.png";
import d2dv from "../../../assets/images/d2dv.png";
import d2xp from "../../../assets/images/d2xp.png";
import drtl from "../../../assets/images/drtl.png";
import jstr from "../../../assets/images/jstr.png";
import sexp from "../../../assets/images/sexp.png";
import star from "../../../assets/images/star.png";
import w2bn from "../../../assets/images/w2bn.png";
import w3xp from "../../../assets/images/w3xp.png";
import war3 from "../../../assets/images/war3.png";
import Box from "@mui/material/Box";
import {Channel, ChannelManager} from "../state/ChannelManager";

export default class Users extends React.Component {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {users: [], current: null};
        ChannelManager.subscribeCurrent((current: Channel) => this.setState({channel: current}))
        UserManager.subscribe((users) => this.setState({users: users}))
    }

    render() {
        let icons = new Map([
            ["[CHAT]", chat],
            ["[D2DV]", d2dv],
            ["[D2XP]", d2xp],
            ["[DRTL]", drtl],
            ["[JSTR]", jstr],
            ["[SEXP]", sexp],
            ["[STAR]", star],
            ["[W2BN]", w2bn],
            ["[W3XP]", w3xp],
            ["[WAR3]", war3],
        ])

        return (
            <Box sx={{ minWidth: "300px", overlflowY: "auto" }}>
                <Paper>
                    {
                        // @ts-ignore
                        this.state.current == null
                            ? "Disconnected"
                            // @ts-ignore
                            : this.state.current.name

                    }
                </Paper>
                <List sx={{ paddingTop: "0px" }}>
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
                </List>
            </Box>
        );
    }
}