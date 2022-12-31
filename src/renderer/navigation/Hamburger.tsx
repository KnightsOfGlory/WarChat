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
import Profile from "../configuration/Profile"
import NotInterestedIcon from "@mui/icons-material/NotInterested"
import {AnalyticsHelper} from "../utilities/AnalyticsHelper";
import Settings from "../configuration/Settings";
import {References} from "@knightsofglory/warlibrary/lib/References";
import {ChatHelper} from "@knightsofglory/warlibrary/lib/utilities/ChatHelper";
import SupportIcon from '@mui/icons-material/Support';

export default function Hamburger() {
    const [open, setOpen] = useState(false)

    const handleConnect = () => {
        References.chatManager.add(ChatHelper.makeBotChat("Connecting..."))
        References.connectionManager.connect()
        AnalyticsHelper.event("Menu", "Connect")
        setOpen(false)
    }
    const handleDisconnect = () => {
        References.chatManager.add(ChatHelper.makeBotChat("Disconnecting..."))
        References.connectionManager.disconnect()
        AnalyticsHelper.event("Menu", "Disconnect")
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
                        <Settings/>
                        {HamburgerListItem("Update", <UpgradeIcon/>, () => {
                            References.messageBus.send("updater", "check")
                            AnalyticsHelper.event("Menu", "Update")
                        })}
                        <Divider/>
                        {HamburgerListItem("Help", <SupportIcon/>, () => {
                            AnalyticsHelper.event("Menu", "Help")
                            References.messageBus.send('app', "open", "https://github.com/KnightsOfGlory/WarChat/wiki/Guide")
                        })}
                        {HamburgerListItem("Quit", <NotInterestedIcon/>, () => {
                            AnalyticsHelper.event("Menu", "Quit")
                            References.messageBus.send('app', "quit")
                        })}
                    </List>
                </Box>
            </Drawer>
        </React.Fragment>
    )
}
