import {ListItem, ListItemButton, ListSubheader, Paper} from "@mui/material"
import React, {useEffect, useState} from "react"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Box from "@mui/material/Box"
import {UserFlags} from "../utilities/UserFlags"
import {AvatarHelper} from "../utilities/AvatarHelper"
import {HumanBotSplit} from "../utilities/HumanBotSplit";
import {User} from "@knightsofglory/warlibrary/lib/state/UserManager";
import {Channel} from "@knightsofglory/warlibrary/lib/state/ChannelManager";
import {References} from "@knightsofglory/warlibrary/lib/References";

const draw = (label: string, users: User[]) => {
    if (users.length == 0) return

    return (
        <React.Fragment>
            <ListSubheader component="div" sx={{ fontSize: "0.875rem" }}>
                {label}
            </ListSubheader>
            {
                users.map((user) => {
                    return (
                        <ListItem key={user.name} disablePadding>
                            <ListItemButton sx={{paddingTop: "4px", paddingBottom: "4px"}}>
                                <ListItemAvatar>
                                    {AvatarHelper.getAvatar(user)}
                                </ListItemAvatar>
                                <ListItemText primary={user.name} />
                            </ListItemButton>
                        </ListItem>
                    )
                })
            }
        </React.Fragment>)
}

export default function Users() {
    const [channel, setChannel] = useState<Channel | null>()
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        References.channelManager.subscribe("current", (newChannel: Channel) => setChannel(newChannel))
        References.userManager.subscribe((newUsers) => setUsers([...newUsers]))
        References.connectionManager.subscribe("connected", (isConnected) => {
            if (!isConnected) setChannel(null)
        })
    }, [])

    const grouped = () => {
        const isAdministrator = References.profileManager.getProfile().init6 ? UserFlags.Init6.isAdministrator : UserFlags.isAdministrator
        const isOperator = References.profileManager.getProfile().init6 ? UserFlags.Init6.isOperator : UserFlags.isOperator

        HumanBotSplit.update(users.filter((u) => u && u.name))
        let separateBots = References.settingsManager.getSettings().separateBots

        const admins = users.filter((u) => isAdministrator(u.flags))
        const ops = users.filter((u) => isOperator(u.flags) && !isAdministrator(u.flags))
        const members = users.filter((u) => !isOperator(u.flags) && !isAdministrator(u.flags) && (!u.bot || !separateBots))
        const bots = users.filter((u) => !isOperator(u.flags) && !isAdministrator(u.flags) && (u.bot && separateBots))

        return {
            admins: admins,
            ops: ops,
            members: members,
            bots: bots
        }
    }

    const groups = grouped()
    const drawn = [
        draw("ADMINISTRATORS", groups.admins),
        draw("OPERATORS", groups.ops),
        draw("MEMBERS", groups.members),
        draw("BOTS", groups.bots),
    ]

    return (
        <Box sx={{ minWidth: "250px", height: "100%", paddingBottom: "0px" }}>
            <Paper sx={{ fontWeight: "500", textAlign: "center", textSize: "1.5rem", margin: "8px", paddingTop: "4px", paddingBottom: "4px", backgroundColor: "#272727" }}>
                {
                    (channel == null ? "DISCONNECTED" : "#" + channel.name + ` – ${users.length}`)
                }
            </Paper>
            <List sx={{ paddingTop: "0px", overflowY: "overlay", height: 'calc(100vh - 64px - 58px)' }}>
                {drawn}
            </List>
        </Box>)
}
