import React from "react";
import Box from "@mui/material/Box";
import {TreeItem, TreeView} from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {Collapse, ListItem, ListItemButton, ListItemIcon, ListSubheader} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import {ExpandLess, ExpandMore, StarBorder} from "@mui/icons-material";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import TagIcon from '@mui/icons-material/Tag';

function SendIcon() {
    return null;
}

export default class ChannelTree extends React.Component {
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
}