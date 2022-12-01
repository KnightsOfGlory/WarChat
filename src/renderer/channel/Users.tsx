import { ListItem, ListItemButton, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { User, UserManager } from "../state/UserManager";

import Box from "@mui/material/Box";
import { Channel, ChannelManager } from "../state/ChannelManager";
import {ProductIcons} from "../utilities/ProductIcons";

export default function Users() {
    const [channel, setChannel] = useState<Channel>();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        ChannelManager.subscribeCurrent((newChannel: Channel) => setChannel(newChannel));
        UserManager.subscribe((newUsers) => setUsers(newUsers));
    }, []);

    return (
        <Box sx={{ minWidth: "300px", height: "100%", paddingBottom: "0px" }}>
            <Paper sx={{ textAlign: "center", textSize: "1rem", margin: "8px", backgroundColor: "#272727" }}>
                {
                    (channel == null ? "Disconnected" : channel.name) + ` (${users.length})`
                }
            </Paper>
            <List sx={{ paddingTop: "0px", overflowY: "overlay", height: 'calc(100vh - 64px - 58px)' }}>
                {
                    users.map((user) => {
                        // @ts-ignore
                        let icon = ProductIcons.getByClient(user.client.trim())

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
                                    <ListItemText primary={user.name} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })
                }
            </List>
        </Box>);
}