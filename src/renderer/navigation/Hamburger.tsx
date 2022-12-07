import * as React from 'react';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {Drawer, ListItem, ListItemButton, Menu} from "@mui/material";
import {useState} from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SettingsIcon from '@mui/icons-material/Settings';
import BadgeIcon from '@mui/icons-material/Badge';
import {ChatManager} from "../state/ChatManager";
import {UserManager} from "../state/UserManager";
import Profile from "../configuration/Profile";
import NotInterestedIcon from '@mui/icons-material/NotInterested';

export default function Hamburger() {
    const [open, setOpen] = useState(false)

    const handleConnect = () => {
        ChatManager.add({
            timestamp: Date.now(),
            user: UserManager.getWarChatUser(),
            message: "Connecting..."
        })
        window.electron.ipcRenderer.sendMessage('socket', "connect")
        setOpen(false)
    }
    const handleDisconnect = () => {
        ChatManager.add({
            timestamp: Date.now(),
            user: UserManager.getWarChatUser(),
            message: "Disconnecting..."
        })
        window.electron.ipcRenderer.sendMessage('socket', "disconnect")
        setOpen(false)
    }

    return (
        <React.Fragment>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => setOpen(true)}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor={"left"}
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box
                    // sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
                    role="presentation"
                    // onClick={toggleDrawer(anchor, false)}
                    // onKeyDown={toggleDrawer(anchor, false)}
                >
                    <List sx={{width: "225px"}}>
                        <ListItem key={"Connect"} disablePadding>
                            <ListItemButton onClick={handleConnect}>
                                <ListItemIcon>
                                    <RadioButtonCheckedIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Connect"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={"Disconnect"} disablePadding>
                            <ListItemButton onClick={handleDisconnect}>
                                <ListItemIcon>
                                    <RadioButtonUncheckedIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Disconnect"} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <Profile/>
                        <ListItem key={"Settings"} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Settings"} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <ListItem key={"Quit"} disablePadding>
                        <ListItemButton onClick={() => window.electron.ipcRenderer.sendMessage('app', "quit")}>
                            <ListItemIcon>
                                <NotInterestedIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Quit"} />
                        </ListItemButton>
                    </ListItem>
                </Box>
            </Drawer>
        </React.Fragment>
    );
}