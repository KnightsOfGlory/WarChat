import React, {useEffect, useState} from "react"
import Box from "@mui/material/Box";
import {Fab, ListSubheader} from "@mui/material";
import List from "@mui/material/List";
import {Chat, WhisperUpdate} from "@knightsofglory/warlibrary/lib/state/ChatManager";
import {References} from "@knightsofglory/warlibrary/lib/References";
import UserItem from "./UserItem";
import NewWhisper from "./NewWhisper";
import AddIcon from "@mui/icons-material/Add";

function onlyUnique<A>(value: A, index: number, self: A[]) {
    return self.indexOf(value) === index;
}

type Properties = {
    selected: string,
    setSelected: (username: string) => void,
    unread: {[key: string]: number}
}

export default function UserTree(properties: Properties) {
    const [open, setOpen] = useState(false)
    const [whispers, setWhispers] = useState<Chat[]>([])

    const [username, setUsername] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        References.chatManager.subscribe(
            "whispers",
            (wu: WhisperUpdate) => setWhispers([...wu.all])
        )
    }, [])

    const users = whispers.map((u) => u.user.name).filter(onlyUnique)

    return (
        <Box>
            <NewWhisper
                open={open}
                title={"Start a whisper"}
                description={"Enter the username and message of your whisper"}
                label={"SEND"}
                setUsername={setUsername}
                setMessage={setMessage}
                yes={() => {
                    References.messageBus.send("chat", `/w ${username} ${message}`)
                    setOpen(false)
                    setTimeout(() => properties.setSelected(username), 100)
                }}
                no={() => setOpen(false)}
            />
            <List
                sx={{width: '225px', bgcolor: 'background.paper', overflowY: "overlay", height: 'calc(100vh - 64px)'}}
                component="nav"
                subheader={<li/>}
                aria-labelledby="nested-list-subheader"
            >
                <ListSubheader component="div" sx={{fontSize: "0.875rem"}}>
                    FRIENDS
                </ListSubheader>
                <UserItem username={"All Friends"} selected={properties.selected} setSelected={properties.setSelected} count={0} />
                {
                    users.filter((u) => References.friendsManager.hasFriend(u)).map((u) => {
                        const count = properties.unread[u] || 0
                        return <UserItem username={u}
                                         selected={properties.selected}
                                         setSelected={properties.setSelected}
                                         count={count}
                        />
                    })
                }
                <ListSubheader component="div" sx={{fontSize: "0.875rem"}}>
                    OTHERS
                </ListSubheader>
                {
                    users.filter((u) => !References.friendsManager.hasFriend(u)).map((u) => {
                        const count = properties.unread[u] || 0
                        return <UserItem username={u}
                                         selected={properties.selected}
                                         setSelected={properties.setSelected}
                                         count={count}
                               />
                    })
                }
            </List>
            <Fab color="primary" sx={{position: "relative", bottom: "80px", left: "86px"}} onClick={() => setOpen(true)}>
                <AddIcon />
            </Fab>
        </Box>
    )
}
