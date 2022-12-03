import {Chip, Divider, Link, ListItem, Stack} from '@mui/material';
import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import {Chat, ChatManager} from '../state/ChatManager';
import {User, UserManager} from "../state/UserManager";
import Send from "./Send";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import {ProductIcons} from "../utilities/ProductIcons";
import {ConnectionManager} from "../state/ConnectionManager";

export default function Channel() {
    const [connected, setConnected] = useState(false)
    const [messages, setMessages] = useState<Chat[]>([]);

    useEffect(() => {
        ChatManager.subscribe((newMessage: any) => {
            setMessages([...newMessage]); // force state change
        });
        console.log("SUBSCRIBING")
        ConnectionManager.subscribe((isConnected) => {
            setConnected(isConnected)
            ChatManager.add({
                timestamp: Date.now(),
                user: UserManager.getWarChatUser(),
                message: isConnected ? "Connected!" : "Disconnected!"
            })
        })
    }, []);

    const grouped = () => {
        let groups: Chat[][] = [];
        let group: Chat[] = [];
        let user: User | null = null

        messages.forEach((message) => {
            if (message.hasOwnProperty("channel")) {
                groups.push(group)
                groups.push([message])
                group = []
                return
            }

            if (user != null && message.user.name != user.name) {
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
        <Stack sx={{ width: '100%' }}>
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

                        if (group[0].hasOwnProperty("channel")) {
                            return (
                                <Divider sx={{"&::before, &::after": {
                                        top: "0%",
                                    },}}>
                                    <Chip label={
                                        // @ts-ignore*
                                        "Channel: " + group[0].channel
                                    }/>
                                </Divider>
                            )
                        }

                        // @ts-ignore
                        let icon = ProductIcons.getByClient(group[0].user.client.trim(), group[0].user.flags)
                        let said = group.map((g) => g.message)

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

                        let primary = (<span style={{fontSize: "0.875rem"}}>
                            <Link href={"#"} underline={"hover"}>{group[0].user.name}</Link>
                        </span>)

                        let secondary = (<span style={{fontSize: "1rem", color: "#ffffff"}}>
                            {saying}
                        </span>)

                        return (
                            <ListItem alignItems={"flex-start"}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={icon}
                                        variant="rounded"
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={primary} secondary={secondary} />
                            </ListItem>
                        )
                    })
                }
            </List>
            <Send />
        </Stack>
    );
}
