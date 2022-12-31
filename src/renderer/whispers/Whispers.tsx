import React, {useEffect, useState} from "react"
import Box from "@mui/material/Box";
import {Divider} from "@mui/material";
import Chat from "./Chat";
import UserTree from "./UserTree";
import {Chat as ChatMessage, WhisperUpdate} from "@knightsofglory/warlibrary/lib/state/ChatManager";
import {References} from "@knightsofglory/warlibrary/lib/References";

type Properties = {
    hidden: boolean
}

type Unread = {[key: string]: number}

const unreadGlobal: Unread = {}

export default function Whispers(properties: Properties) {
    const display = properties.hidden ? "none" : "flex"
    const [selected, setSelected] = useState("All Friends")
    const [messages, setMessages] = useState<ChatMessage[]>(
        References.chatManager.whispersFor(selected)
    )

    const [unread, setUnread] = useState<Unread>({})

    function read(username: string) {
        unreadGlobal[username] = 0
        References.messageBus.sendLocal("unread", total({...unreadGlobal}))
        setUnread({...unreadGlobal})
    }
    function increment(username: string) {
        if (properties.hidden || username != selected) {
            unreadGlobal[username] = (unreadGlobal[username] || 0) + 1
            References.messageBus.sendLocal("unread", total({...unreadGlobal}))
            setUnread({...unreadGlobal})
        }
    }
    function total(replacement: Unread): number {
        return Object.values(replacement).reduce((acc, val) => acc + val, 0)
    }

    function chooseSelected(username: string) {
        read(username)
        setSelected(username)
    }

    if (!properties.hidden && (unreadGlobal[selected] || 0) > 0) {
        read(selected)
    }

    useEffect(() => {
        References.chatManager.subscribe(
            "whispers",
            (wu: WhisperUpdate) => {
                // const all = wu.all
                const delta = wu.new
                setMessages(References.chatManager.whispersFor(selected))
                if (delta.direction == "from") {
                    increment(delta.user.name)
                }
            }
        )
        References.messageBus.onLocal(
            "friend",
            (u) => chooseSelected(u as string)
        )
    }, [])

    return (
        <Box sx={{display: display, width: "100%", overflow: "hidden"}}>
            <UserTree selected={selected} setSelected={chooseSelected} unread={unread} />
            <Divider orientation="vertical" flexItem/>
            <Chat username={selected} messages={messages} />
        </Box>
    )
}
