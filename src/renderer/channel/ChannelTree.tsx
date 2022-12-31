import React, {useEffect, useState} from "react"
import Box from "@mui/material/Box"
import {
    Button,
    Collapse,
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
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {Channel} from "@knightsofglory/warlibrary/lib/state/ChannelManager";
import {References} from "@knightsofglory/warlibrary/lib/References";

export default function ChannelTree() {
    const [open, setOpen] = useState(true)
    const [wait, setWait] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [joining, setJoining] = useState("")
    const [currentChannel, setCurrentChannel] = useState<Channel>()

    const [channels, setChannels] = useState<Channel[]>([])

    useEffect(() => {
        References.channelManager.subscribe("current", (newChannel: Channel) => setCurrentChannel(newChannel))
        References.channelManager.subscribe("list", (newChannels: Channel[]) => setChannels([...newChannels]))
    }, [])

    const joinChannel = (channel: string) => {
        if (wait) return

        setConfirmOpen(true)
        setJoining(channel)
    }
    const joinYes = () => {
        setWait(true)
        setTimeout(() => setWait(false), 2000)
        References.messageBus.send("chat", "/join " + joining)
        setConfirmOpen(false)
    }
    const joinNo = () => {
        setConfirmOpen(false)
    }

    return (
        <Box sx={{width: open ? "225px" : "32px"}}>
            <IconButton sx={{
                            width: "32px",
                            height: "32px",
                            position: "relative",
                            left: open ? "209px" : "17px",
                            top: "calc(50vh - 64px)",
                            zIndex: "2"
                        }}
                        onClick={() => setOpen(!open)}>
                { open ? <ChevronLeftIcon /> : <ChevronRightIcon/> }
            </IconButton>
            <Collapse orientation="horizontal"
                      in={open}
                      sx={{
                          minWidth: open ? "225px" : "0px",
                          height: 'calc(100vh - 64px)',
                          position: "relative",
                          top: "-32px",
                          zIndex: "1"
                      }}
                      timeout={0}
            >
                <List
                    sx={{width: '225px', bgcolor: 'background.paper', overflowY: "overlay", height: 'calc(100vh - 64px)'}}
                    component="nav"
                    subheader={<li/>}
                    aria-labelledby="nested-list-subheader"
                >
                    <ListSubheader component="div" sx={{fontSize: "0.875rem"}}>
                        CHANNELS
                    </ListSubheader>
                    {
                        channels
                            .sort((a, b) => (b.users || 0) - (a.users || 0))
                            .map((channel: Channel) => {
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
            </Collapse>
        </Box>
    )
}
