import {ListItem, ListItemButton, ListSubheader, Paper} from "@mui/material"
import React, {useEffect, useState} from "react"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import {User, UserManager} from "../state/UserManager"
import Box from "@mui/material/Box"
import {Channel, ChannelManager} from "../state/ChannelManager"
import {ProductIcons} from "../utilities/ProductIcons"
import {UserFlags} from "../utilities/UserFlags"
import {ConnectionManager} from "../state/ConnectionManager"
import {ProfileManager} from "../state/ProfileManager";
import {HumanBotSplit} from "../utilities/HumanBotSplit";
import {SettingsManager} from "../state/SettingsManager";

const draw = (label: string, users: User[]) => {
    if (users.length == 0) return

    return (
        <React.Fragment>
            <ListSubheader component="div" sx={{ fontSize: "0.875rem" }}>
                {label}
            </ListSubheader>
            {
                users.map((user) => {
                    let icon = ProductIcons.getByClient(user.client.trim(), user.flags as string)

                    return (
                        <ListItem
                            key={user.name}
                            disablePadding

                        >
                            <ListItemButton sx={{paddingTop: "4px", paddingBottom: "4px"}}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={icon}
                                        variant="rounded"
                                    />
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
        ChannelManager.subscribeCurrent((newChannel: Channel) => setChannel(newChannel))
        UserManager.subscribe((newUsers) => setUsers([...newUsers]))
        ConnectionManager.subscribeConnected((isConnected) => {
            if (!isConnected) setChannel(null)
        })
    }, [])

    const grouped = () => {
        const isAdministrator = ProfileManager.getProfile().init6 ? UserFlags.Init6.isAdministrator : UserFlags.isAdministrator
        const isOperator = ProfileManager.getProfile().init6 ? UserFlags.Init6.isOperator : UserFlags.isOperator

        HumanBotSplit.update(users.filter((u) => u && u.name))
        let separateBots = SettingsManager.getSettings().separateBots

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
            <Paper sx={{ textAlign: "center", textSize: "1.5rem", margin: "8px", paddingTop: "4px", paddingBottom: "4px", backgroundColor: "#272727" }}>
                {
                    (channel == null ? "Disconnected" : channel.name + ` – ${users.length}`)
                }
            </Paper>
            <List sx={{ paddingTop: "0px", overflowY: "overlay", height: 'calc(100vh - 64px - 58px)' }}>
                {drawn}
            </List>
        </Box>)
}