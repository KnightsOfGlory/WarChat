import React from "react";
import Box from "@mui/material/Box";
import {ListItem, ListItemButton, ListItemIcon, ListSubheader} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import TagIcon from '@mui/icons-material/Tag';
import {Channel, ChannelManager} from "../state/ChannelManager";

export default class ChannelTree extends React.Component {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {channels: []};

        ChannelManager.subscribeList((channels) => this.setState({channels: channels}))
    }

    render() {
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
                    {
                        // @ts-ignore
                        this.state.channels.forEach((channel: Channel) => {
                            return (<ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <TagIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={channel.name} sx={{marginLeft:"-24px"}} />
                                </ListItemButton>
                            </ListItem>);
                        })
                    }
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
}