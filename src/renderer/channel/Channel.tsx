import { Divider, ListItem, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Chat from './Chat';
import { ChatManager } from '../state/ChatManager';

export default function Channel() {
    const [messages, setMessages] = useState<Chat[]>([]);

    useEffect(() => {
        ChatManager.subscribe((newMessage: any) => {
            setMessages(newMessage);
        });
    });

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
                    // @ts-ignore
                    messages.reverse().map((message: any) => {
                        return (
                            <ListItem>
                                <ListItemText key={message.message}>{message.message}</ListItemText>
                            </ListItem>
                        );
                    })
                }
            </List>
            <Chat />
        </Stack>
    );
}
