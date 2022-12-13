import React, {useEffect, useState} from "react"
import Box from "@mui/material/Box"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListSubheader
} from "@mui/material"
import ListItemText from "@mui/material/ListItemText"
import List from "@mui/material/List"
import TagIcon from '@mui/icons-material/Tag'
import {Channel, ChannelManager} from "../state/ChannelManager"
import {ipcRenderer} from "../utilities/IpcRenderer";

export default function ChannelTree() {
    const [wait, setWait] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [joining, setJoining] = useState("")
    const [currentChannel, setCurrentChannel] = useState<Channel>()

    const [channels, setChannels] = useState<Channel[]>([])

    useEffect(() => {
        ChannelManager.subscribeCurrent((newChannel: Channel) => setCurrentChannel(newChannel))
        ChannelManager.subscribeList((newChannels: Channel[]) => setChannels([...newChannels]))
    }, [])

    const joinChannel = (channel: string) => {
        if (wait) return

        setConfirmOpen(true)
        setJoining(channel)
    }
    const joinYes = () => {
        setWait(true)
        setTimeout(() => setWait(false), 2000)
        ipcRenderer.sendMessage("chat", "/join " + joining)
        setConfirmOpen(false)
    }
    const joinNo = () => {
        setConfirmOpen(false)
    }

    return (
        <Box sx={{width: "225px"}}>
            <List
                sx={{width: '225px', bgcolor: 'background.paper', maxHeight: '90%'}}
                component="nav"
                subheader={<li/>}
                aria-labelledby="nested-list-subheader"
            >
                <ListSubheader component="div" sx={{fontSize: "0.875rem"}}>
                    CHANNELS
                </ListSubheader>
                {
                    channels.map((channel: Channel) => {
                        let name = (
                            <div>
                                <div style={{
                                    display: "inline-block",
                                    maxWidth: "125px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    paddingTop: "8px"}}>{channel.name}</div>
                                <div style={{
                                    display: "inline-block",
                                    maxWidth: "50px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    paddingTop: "8px"}}>&nbsp;– {channel.users}</div>
                            </div>
                        )

                        return (<ListItem key={channel.name} onClick={() => joinChannel(channel.name)} disablePadding>
                            <ListItemButton selected={currentChannel != null && channel.name == currentChannel.name}>
                                <ListItemIcon>
                                    <TagIcon/>
                                </ListItemIcon>
                                <ListItemText primary={name}
                                              sx={{marginLeft: "-24px"}}/>
                            </ListItemButton>
                        </ListItem>)
                    })
                }
                <ListSubheader component="div" sx={{fontSize: "0.875rem"}}>
                    FAVORITES
                </ListSubheader>
                <ListItem onClick={() => joinChannel("KoG")} disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <TagIcon/>
                        </ListItemIcon>
                        <ListItemText primary="KoG" sx={{marginLeft: "-24px"}}/>
                    </ListItemButton>
                </ListItem>
            </List>
            <Dialog open={confirmOpen}>
                <DialogTitle>
                    {"Join channel?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to leave your current channel and join {joining}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={joinNo}>No</Button>
                    <Button onClick={joinYes} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
