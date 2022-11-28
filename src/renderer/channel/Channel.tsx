import {ListItem, Stack} from '@mui/material';
import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import {Chat, ChatManager} from '../state/ChatManager';
import {User} from "../state/UserManager";
import Send from "./Send";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import chat from "../../../assets/images/chat.png";
import d2dv from "../../../assets/images/d2dv.png";
import d2xp from "../../../assets/images/d2xp.png";
import drtl from "../../../assets/images/drtl.png";
import jstr from "../../../assets/images/jstr.png";
import sexp from "../../../assets/images/sexp.png";
import star from "../../../assets/images/star.png";
import w2bn from "../../../assets/images/w2bn.png";
import w3xp from "../../../assets/images/w3xp.png";
import war3 from "../../../assets/images/war3.png";
import serv from "../../../assets/images/serv.png";

export default function Channel() {
    const [messages, setMessages] = useState<Chat[]>([]);

    useEffect(() => {
        ChatManager.subscribe((newMessage: any) => {
            setMessages(newMessage);
        });
    });

    const grouped = () => {
        let groups: Chat[][] = [];
        let group: Chat[] = [];
        let user: User | null = null

        messages.forEach((message) => {
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

    let icons = new Map([
        ["[CHAT]", chat],
        ["[SERV]", serv],
        ["[D2DV]", d2dv],
        ["[D2XP]", d2xp],
        ["[DRTL]", drtl],
        ["[JSTR]", jstr],
        ["[SEXP]", sexp],
        ["[STAR]", star],
        ["[W2BN]", w2bn],
        ["[W3XP]", w3xp],
        ["[WAR3]", war3],
    ])

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
                    grouped().reverse().map((group) => {
                        // @ts-ignore
                        let icon = icons.get(group[0].user.client.trim())
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

                        return (
                            <ListItem alignItems={"flex-start"}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={icon}
                                        variant="rounded"
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={group[0].user.name} secondary={saying} />
                            </ListItem>
                        )
                    })
                }
            </List>
            <Send />
        </Stack>
    );
}
