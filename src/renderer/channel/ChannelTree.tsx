import React, {useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import {ListItem, ListItemButton, ListItemIcon, ListSubheader} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import TagIcon from '@mui/icons-material/Tag';
import {Channel, ChannelManager} from "../state/ChannelManager";

export default function ChannelTree() {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        window.electron.ipcRenderer.on('messages', (arg) => {
            // @ts-ignore
            let string = new TextDecoder().decode(arg);
            let tokens = string.split("\n")

            // @ts-ignore
            this.setState({messages: [...this.state.messages, ...tokens]})
        });
    },[])

    return (
        <Box sx={{width: "150px"}}>
            <List
                sx={{ width: '150px', bgcolor: 'background.paper' }}
                component="nav"
                subheader={<li />}
                aria-labelledby="nested-list-subheader"
            >
                <ListSubheader component="div" sx={{fontSize: "0.875rem"}}>
                    SERVER
                </ListSubheader>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <TagIcon />
                        </ListItemIcon>
                        <ListItemText primary="DaRK" sx={{marginLeft:"-24px"}} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <TagIcon />
                        </ListItemIcon>
                        <ListItemText primary="Fatal-Error" sx={{marginLeft:"-24px"}} />
                    </ListItemButton>
                </ListItem>
                <ListSubheader component="div" sx={{fontSize: "0.875rem"}}>
                    FAVORITES
                </ListSubheader>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <TagIcon />
                        </ListItemIcon>
                        <ListItemText primary="KoG" sx={{marginLeft:"-24px"}} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
}
