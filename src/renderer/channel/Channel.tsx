import React from "react"
import ChannelTree from "./ChannelTree";
import {Divider} from "@mui/material";
import Users from "./Users";
import Box from "@mui/material/Box";
import Chat from "./Chat";

type Properties = {
    hidden: boolean
}

export default function Channel(properties: Properties) {
    const display = properties.hidden ? "none" : "flex"

    return (
        <Box sx={{display: display, width: "100%", overflow: "hidden"}}>
            <ChannelTree />
            <Divider orientation="vertical" flexItem/>
            <Chat />
            <Divider orientation="vertical" flexItem/>
            <Users />
        </Box>
    )
}
