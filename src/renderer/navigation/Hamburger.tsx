import * as React from 'react'
import {ReactNode, useState} from 'react'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import {Drawer, ListItem, ListItemButton} from "@mui/material"
import Box from "@mui/material/Box"
import List from "@mui/material/List"
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import UpgradeIcon from '@mui/icons-material/Upgrade'
import SettingsIcon from '@mui/icons-material/Settings'
import {ChatManager} from "../state/ChatManager"
import Profile from "../configuration/Profile"
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import {ipcRenderer} from "../utilities/IpcRenderer"
import {ChatHelper} from "../utilities/ChatHelper"

export default function Hamburger() {
    const [open, setOpen] = useState(false)

    const handleConnect = () => {
        ChatManager.add(ChatHelper.makeBotChat("Connecting..."))
        ipcRenderer.sendMessage('socket', "connect")
        setOpen(false)
    }
    const handleDisconnect = () => {
        ChatManager.add(ChatHelper.makeBotChat("Disconnecting..."))
        ipcRenderer.sendMessage('socket', "disconnect")
        setOpen(false)
    }

    function HamburgerListItem(label: string, icon: ReactNode, handler: React.MouseEventHandler<HTMLDivElement>) {
        return (<ListItem key={label} disablePadding>
            <ListItemButton onClick={handler}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={label}/>
            </ListItemButton>
        </ListItem>)
    }

    return (
        <React.Fragment>
            <IconButton size="large" edge="start" color="inherit" sx={{mr: 2}} onClick={() => setOpen(true)}>
                <MenuIcon/>
            </IconButton>
            <Drawer anchor={"left"} open={open} onClose={() => setOpen(false)}>
                <Box role="presentation">
                    <List sx={{width: "225px"}}>
                        {HamburgerListItem("Connect", <RadioButtonCheckedIcon/>, handleConnect)}
                        {HamburgerListItem("Disconnect", <RadioButtonUncheckedIcon/>, handleDisconnect)}
                        <Divider/>
                        <Profile/>
                        {HamburgerListItem("Settings", <SettingsIcon/>, () => {})}
                        {HamburgerListItem("Update", <UpgradeIcon/>, () => ipcRenderer.sendMessage("updater", "check"))}
                        <Divider/>
                        {HamburgerListItem("Quit", <NotInterestedIcon/>, () => ipcRenderer.sendMessage('app', "quit"))}
                    </List>
                </Box>
            </Drawer>
        </React.Fragment>
    )
}