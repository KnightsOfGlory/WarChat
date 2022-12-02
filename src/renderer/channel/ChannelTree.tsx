import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { ListItem, ListItemButton, ListItemIcon, ListSubheader } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import TagIcon from '@mui/icons-material/Tag';
import { Channel, ChannelManager } from "../state/ChannelManager";

export default function ChannelTree() {
    const [currentChannel, setCurrentChannel] = useState<Channel>();
    const [channels, setChannels] = useState<Channel[]>([]);

    useEffect(() => {
        ChannelManager.subscribeCurrent((newChannel: Channel) => setCurrentChannel(newChannel));
        ChannelManager.subscribeList((newChannels: Channel[]) => {
            setChannels(newChannels);
        });
    }, []);

    return (
        <Box sx={{ width: "225px" }}>
            <List
                sx={{ width: '225px', bgcolor: 'background.paper', maxHeight: '90%'}}
                component="nav"
                subheader={<li />}
                aria-labelledby="nested-list-subheader"
            >
                <ListSubheader component="div" sx={{ fontSize: "0.875rem" }}>
                    CHANNELS
                </ListSubheader>
                {
                    channels.map((channel: Channel) => {
                        return (<ListItem key={channel.name} disablePadding>
                            <ListItemButton selected={currentChannel != null && channel.name == currentChannel.name}>
                                <ListItemIcon>
                                    <TagIcon />
                                </ListItemIcon>
                                <ListItemText primary={channel.name + " – " + channel.users} sx={{ marginLeft: "-24px" }} />
                            </ListItemButton>
                        </ListItem>);
                    })
                }
                <ListSubheader component="div" sx={{ fontSize: "0.875rem" }}>
                    FAVORITES
                </ListSubheader>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <TagIcon />
                        </ListItemIcon>
                        <ListItemText primary="KoG" sx={{ marginLeft: "-24px" }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
}
