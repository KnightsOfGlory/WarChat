import {Card, CardActions, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React, {useState} from "react";
import {Friend} from "@knightsofglory/warlibrary/lib/state/FriendsManager";
import {AvatarHelper} from "../utilities/AvatarHelper";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import DeleteIcon from "@mui/icons-material/Delete";
import {ProductHelper} from "../utilities/ProductHelper";
import Confirm from "../general/Confirm";
import {References} from "@knightsofglory/warlibrary/lib/References";
import Prompt from "../general/Prompt";

type Properties = {
    friend: Friend,
    setPage: (page: number) => void
}

export default function FriendCard(properties: Properties) {
    const friend = properties.friend

    const [open, setOpen] = useState(false)
    const [whisper, setWhisper] = useState(false)
    const [message, setMessage] = useState("")

    return (
        <React.Fragment>
            <Prompt
                open={whisper}
                title={"Whisper " + properties.friend.name}
                field={"Message"}
                description={"Enter the message to whisper"}
                label={"SEND"}
                setter={(u: string) => setMessage(u)}
                yes={() => {
                    References.messageBus.send("chat", `/w ${properties.friend.name} ${message}`)
                    properties.setPage(2)
                    References.messageBus.sendLocal("friend", properties.friend.name)

                    setMessage("")
                    setWhisper(false)
                }}
                no={() => {setWhisper(false); setMessage("")}}
            />
            <Card sx={{ minWidth: 275, margin: "16px", marginBottom: "0px" }}>
                <CardContent sx={{paddingBottom: "0px"}}>
                    <Typography sx={{ fontSize: 14 }} color={friend.online ? "#66bb6a" : "error"} gutterBottom>
                        {friend.online ? "Online" : "Offline"}
                    </Typography>
                    <Typography variant="h5" component="div" sx={{fontFamily: "Roboto", whiteSpace: "nowrap"}}>
                        {AvatarHelper.getAvatar({bot: false, client: friend.client ?? "[CHAT]", flags: "0000", name: friend.name}, true)} {friend.name}
                    </Typography>
                    {
                        friend.online
                            ? <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Using <span style={{fontWeight: "500"}}>{ProductHelper.getName(friend.client ?? "[CHAT]")}</span>&nbsp;in&nbsp;<span style={{fontWeight: "500"}}>{friend.online ? "#" + friend.channel : ""}</span>
                            </Typography>
                            : null
                    }
                </CardContent>
                <CardActions sx={{margin: "6px"}}>
                    <Button startIcon={<ChatBubbleIcon />} size="small" onClick={() => setWhisper(true)}>Whisper</Button>
                    <Button startIcon={<DeleteIcon />} size="small" onClick={() => setOpen(true)}>Remove</Button>
                </CardActions>
            </Card>
            <Confirm
                open={open}
                title={"Remove friend?"}
                description={`Are you sure you want to remove ${friend.name}?`}
                yes={() => {References.friendsManager.removeFriend(friend.name); setOpen(false)}}
                no={() => {setOpen(false)}}
            />
        </React.Fragment>
    )
}
