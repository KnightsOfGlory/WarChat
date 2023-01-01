import React, {useEffect, useState} from "react"
import {Chip, Divider, Link, ListItem, Stack, Tooltip} from "@mui/material";
import List from "@mui/material/List";
import {Chat as ChatMessage} from "@knightsofglory/warlibrary/lib/state/ChatManager";
import {References} from "@knightsofglory/warlibrary/lib/References";
import {User} from "@knightsofglory/warlibrary/lib/state/UserManager";
import {FriendsHelper} from "@knightsofglory/warlibrary/lib/utilities/FriendsHelper";
import Box from "@mui/material/Box";
import {Timestamps} from "../utilities/Timestamps";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import {AvatarHelper} from "../utilities/AvatarHelper";
import ListItemText from "@mui/material/ListItemText";
import Send from "./Send";

type Properties = {
    username: string,
    messages: ChatMessage[]
}

export default function Chat(properties: Properties) {

    const grouped = () => {
        let groups: ChatMessage[][] = []
        let group: ChatMessage[] = []
        let lastUser: User | null = null

        References.chatManager.whispersFor(properties.username).forEach((message) => {
            if (FriendsHelper.isFriendsMessage(message.message ?? "")) {
                return
            }

            if (References.settingsManager.getSettings().ignoreBots && message.user.bot) {
                return
            }

            let thisUser = message.user
            if (message.direction === "to") {
                thisUser = References.userManager.getConnectedUser()
            }

            if (message.user != null && lastUser != null && thisUser.name != lastUser.name) {
                groups.push(group)
                group = []
            }

            group.push(message)
            lastUser = thisUser
        })

        if (group.length > 0) {
            groups.push(group)
        }

        return groups
    }

    return (
        <Stack sx={{width: '100%', overflow: "hidden"}}>
            <List
                sx={{
                    width: '100%',
                    height: 'calc(100vh - 64px - 89px)',
                    overflowY: 'overlay',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >
                {
                    grouped().reverse().filter((g) => g.length > 0).map((group) => {
                        if (group[0].user == undefined) return
                        if (group[0].user.client == undefined) return

                        let thisUser = group[0].user
                        if (group[0].direction === "to") {
                            thisUser = References.userManager.getConnectedUser()
                        }

                        if (!thisUser || !thisUser.name) return

                        if (group[0].event == "channel") {
                            return (
                                <Divider sx={{
                                    "&::before, &::after": {
                                        top: "0%",
                                    }, marginBottom: "4px", marginTop: "4px"
                                }}>
                                    <Chip label={
                                        // @ts-ignore
                                        "Channel: " + group[0].channel
                                    }/>
                                </Divider>
                            )
                        }

                        let said = group.map((c) => c.message)

                        if (said.length == 0) return

                        let saying = (
                            <React.Fragment>
                                {
                                    said.map((message) => {
                                        return (
                                            <React.Fragment>
                                                {message}<br/>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </React.Fragment>)

                        let color = ""
                        if (thisUser && References.userManager.getConnectedUser() &&
                            thisUser.name == References.userManager.getConnectedUser().name) {
                            color = "success.main"
                        }

                        let primary = (<span style={{fontSize: "0.875rem"}}>
                            <Link href={"#"} underline={"hover"}>
                                <Box component="div" sx={{display: 'inline', color: color}}>
                                    {thisUser.name}
                                </Box>
                            </Link>
                            <Tooltip
                                placement={"top"}
                                title={(new Date(group[0].timestamp)).toString().split(" (")[0]}
                                sx={{maxWidth: "none"}}>
                                <Box component="div"
                                     sx={{display: 'inline', paddingLeft: "4px", color: 'text.secondary'}}>
                                    {Timestamps.toReadable(group[0].timestamp)}
                                </Box>
                            </Tooltip>
                        </span>)

                        let secondary = (
                            <div style={{overflow: "hidden", textOverflow: "ellipsis", wordBreak: "break-all", fontSize: "1rem", color: "#ffffff"}}>
                                {saying}
                            </div>
                        )

                        return (
                            <ListItem alignItems={"flex-start"} sx={{paddingTop: "0px", paddingBottom: "0px"}}>
                                <ListItemAvatar>
                                    {AvatarHelper.getAvatar(thisUser)}
                                </ListItemAvatar>
                                <ListItemText primary={primary} secondary={secondary} sx={{overflow: "hidden"}} disableTypography />
                            </ListItem>
                        )
                    })
                }
            </List>
            <Send username={properties.username} />
        </Stack>
    )
}
