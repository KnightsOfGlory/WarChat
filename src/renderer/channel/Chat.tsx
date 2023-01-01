import {Chip, Divider, Link, ListItem, Stack, Tooltip} from '@mui/material'
import React, {useEffect, useState} from 'react'
import List from '@mui/material/List'
import Send from "./Send"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemText from "@mui/material/ListItemText"
import {Timestamps} from "../utilities/Timestamps"
import Box from "@mui/material/Box"
import {AvatarHelper} from "../utilities/AvatarHelper";
import {Chat as ChatMessage} from "@knightsofglory/warlibrary/lib/state/ChatManager";
import {References} from "@knightsofglory/warlibrary/lib/References";
import {User} from "@knightsofglory/warlibrary/lib/state/UserManager";
import {FriendsHelper} from "@knightsofglory/warlibrary/lib/utilities/FriendsHelper";
import {ChatHelper} from "@knightsofglory/warlibrary/lib/utilities/ChatHelper";

export default function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([])

    useEffect(() => {
        References.chatManager.subscribe("chats", (newMessages: any) => {
            setMessages([...newMessages]) // force state change
        })
        References.connectionManager.subscribe("connected", (isConnected) => {
            References.chatManager.add(ChatHelper.makeBotChat(isConnected ? "Connected!" : "Disconnected!"))
        })
    }, [])

    const grouped = () => {
        let groups: ChatMessage[][] = []
        let group: ChatMessage[] = []
        let user: User | null = null

        messages.forEach((message) => {
            if (message.event == "whisper") return

            if (FriendsHelper.isFriendsMessage(message.message ?? "")) {
                return
            }

            if (message.event == "channel") {
                if (!message.channel) return
                groups.push(group)
                groups.push([message])
                group = []
                return
            }

            if ((References.settingsManager.getSettings().ignoreEmotes && message.event == "emote") ||
                (References.settingsManager.getSettings().ignoreBots && message.user.bot) ||
                (References.settingsManager.getSettings().ignoreBans && ChatHelper.isBanMessage(message.message ?? "")) ||
                (References.settingsManager.getSettings().ignoreAntiIdles && ChatHelper.isAntiIdle(message.message ?? ""))) {
                return
            }

            if (message.user != null && user != null && message.user.name != user.name) {
                groups.push(group)
                group = []
            }

            group.push(message)
            user = message.user
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
                                        if (message == null) return null

                                        let style: {} = {fontFamily: "Roboto"}
                                        if ((message.startsWith("Listing ") && message.endsWith(" channels:")) ||
                                            ((message.match(/\| /g) || []).length == 3)) {
                                            style = {
                                                fontFamily: "Roboto Mono",
                                                fontSize: "0.8rem",
                                                whiteSpace: "pre-wrap"
                                            }
                                        }

                                        return (
                                            <Box sx={style}>
                                                {message}<br/>
                                            </Box>
                                        )
                                    })
                                }
                            </React.Fragment>)

                        let color = ""
                        if (group[0].user && References.userManager.getConnectedUser() &&
                            group[0].user.name == References.userManager.getConnectedUser().name) {
                            color = "success.main"
                        }

                        let primary = (<span style={{fontSize: "0.875rem"}}>
                            <Link href={"#"} underline={"hover"}>
                                <Box component="div" sx={{display: 'inline', color: color}}>
                                    {group[0].user.name}
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
                                    {AvatarHelper.getAvatar(group[0].user)}
                                </ListItemAvatar>
                                <ListItemText primary={primary} secondary={secondary} sx={{overflow: "hidden"}} disableTypography />
                            </ListItem>
                        )
                    })
                }
            </List>
            <Send/>
        </Stack>
    )
}
