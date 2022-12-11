import * as React from 'react'
import {useEffect} from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import Avatar from "@mui/material/Avatar"
import HelmetTail from "../../../assets/logos/helmet-tail.png"
import {ChatManager} from "../state/ChatManager"
import {ConnectionManager} from "../state/ConnectionManager"
import Hamburger from "./Hamburger"
import {ChatHelper} from "../utilities/ChatHelper"
import {ipcRenderer} from "../utilities/IpcRenderer";
import {AnalyticsHelper} from "../utilities/AnalyticsHelper";

export default function Bar() {
    const [connected, setConnected] = React.useState(false)

    useEffect(() => {
        ConnectionManager.subscribe((isConnected) => setConnected(isConnected))
    }, [])

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar color="default" position="static">
                <Toolbar>
                    <Hamburger/>
                    <Box sx={{flexGrow: 1}}/>
                    <Box sx={{alignItems: "right"}}>
                        <Avatar
                            src={HelmetTail}
                            variant="rounded"
                            sx={{marginRight: "8px", alignItems: "right"}}
                        />
                    </Box>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        WarChat
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        onClick={() => {
                            AnalyticsHelper.event("Menu", connected ? "Disconnect" : "Connect")
                            connected ? ConnectionManager.disconnect() : ConnectionManager.connect()
                        }}
                        color="inherit"
                    >
                        {connected ? <RadioButtonCheckedIcon/> : <RadioButtonUncheckedIcon/>}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    )
}