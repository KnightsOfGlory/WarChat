import React, {useEffect, useState} from 'react'
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {References} from "@knightsofglory/warlibrary/lib/References";
import {Friend, Result} from "@knightsofglory/warlibrary/lib/state/FriendsManager";
import FriendCard from "./FriendCard";
import {Fab} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Prompt from "../general/Prompt";
import {AlertsManager} from "../state/AlertsManager";
import Typography from "@mui/material/Typography";

type Properties = {
    hidden: boolean
}

export default function Friends(properties: Properties) {
    const [tab, setTab] = useState(0)
    const [friends, setFriends] = useState<Friend[]>(References.friendsManager.getFriends())

    const [open, setOpen] = useState(false)
    const [username, setUsername] = useState("")

    useEffect(() => {
        References.friendsManager.subscribe(
            "list",
            (fs: Friend[]) => {
                setFriends([...fs])
            }
        )
        References.friendsManager.subscribe(
            "result",
            (r: Result) => {
                switch (r.success) {
                    case true:
                        switch (r.action) {
                            case "add":
                                AlertsManager.add({
                                    severity: "success",
                                    message: "Friend successfully added!"
                                })
                                break
                            case "remove":
                                AlertsManager.add({
                                    severity: "success",
                                    message: "Friend successfully removed!"
                                })
                                break
                        }
                        break
                    case false:
                        let message

                        switch (r.error) {
                            case "maximum":
                                message = "Your friends list is full!"
                                break
                            case "empty":
                                setFriends([])
                                return // don't show an error
                            case "username":
                                message = "You must enter a valid username!"
                                break
                            case "yourself":
                                message = "You cannot add yourself!"
                                break
                            case "exists":
                                message = "You already have that friend!"
                                break
                        }

                        AlertsManager.add({
                            severity: "error",
                            message: message ?? "An unknown error occurred!"
                        })
                        break
                }
            }
        )
    }, [])

    return (
        <Box sx={{position: "relative", overflowY: "scroll", height: "calc(100vh - 64px)", width: "100%", ...(properties.hidden ? {display: "none"} : {})}}>
            <Prompt
                open={open}
                title={'Add a friend'}
                description={'Enter the username of the friend you want to add'}
                label={"ADD"}
                setter={(u: string) => setUsername(u)}
                yes={() => {References.friendsManager.addFriend(username); setUsername(""); setOpen(false)}}
                no={() => {setUsername(""); setOpen(false)}}
            />
            <Fab color="primary" sx={{position: "absolute", bottom: "32px", right: "32px"}} onClick={() => setOpen(true)}>
                <AddIcon />
            </Fab>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                    <Tab label="All" />
                    <Tab label="Online" />
                    <Tab label="Offline" />
                </Tabs>
            </Box>
            <Box style={{paddingBottom: "16px"}}>
                {
                    friends.length === 0 ? (
                        <Typography style={{textAlign: "center", paddingTop: "64px"}}>
                            Your friends list is currently empty!
                        </Typography>
                    ) :
                    friends.map(f => {
                        return <React.Fragment>
                            <FriendCard friend={f} />
                        </React.Fragment>
                    })
                }
            </Box>
        </Box>
    )
}
