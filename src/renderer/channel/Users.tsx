import {ListItem, ListItemButton, Paper, Stack} from "@mui/material";
import React, {useEffect, useState} from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import {User, UserManager} from "../state/UserManager";

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

export default function Users() {
    const [channel, setChannel] = useState<Channel>()
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        ChannelManager.subscribeCurrent((newChannel: Channel) => setChannel(newChannel))
        UserManager.subscribe((newUsers) => setUsers(newUsers))
    },[])

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
            <Paper sx={{textAlign: "center", textSize: "1rem", margin: "8px", backgroundColor: "#272727"}}>
                {
                    (channel == null ? "Disconnected" : channel.name) + ` (${users.length})`
                }
            </Paper>
            <List sx={{ paddingTop: "0px"}}>
                {
                    // @ts-ignore
                    users.map((user) => {
                        // @ts-ignore
                        let icon = icons.get(user.client.trim())

                        return (
                            <ListItem
                              key={user.name}
                                disablePadding
                            >
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={icon}
                                            variant="rounded"
                                        />
                                    </ListItemAvatar>
                                    <ListItemText  primary={user.name} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })
                }
            </List>
        </Box>);
}