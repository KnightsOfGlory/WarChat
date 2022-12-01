import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {useEffect} from "react";
import {ConnectionManager} from "../state/ConnectionManager";
import Avatar from "@mui/material/Avatar";
import HelmetTail from "../../../assets/logos/helmet-tail.png";
import {ChatManager} from "../state/ChatManager";

export default function Bar() {
    const [connected, setConnected] = React.useState(false);

    useEffect(() => {
        ConnectionManager.subscribe((isConnected: boolean) => setConnected(isConnected));
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar color="default" position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Avatar
                        src={HelmetTail}
                        variant="rounded"
                        sx={{marginRight: "8px"}}
                    />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        WarChat
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        onClick={() => {
                            let message = connected ? "Disconnecting..." : "Connecting..."

                            ChatManager.add({
                                timestamp: Date.now(),
                                user: {
                                    name: "WarChat",
                                    client: "[WCHT]",
                                    flags: ""
                                },
                                message: message
                            })

                            window.electron.ipcRenderer.sendMessage('socket', connected ? "disconnect" : "connect");
                        }}
                        color="inherit"
                    >
                        {
                            connected
                            ? <RadioButtonCheckedIcon />
                            : <RadioButtonUncheckedIcon />
                        }
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}