import React from "react"
import ChannelTree from "./ChannelTree";
import {Divider} from "@mui/material";
import Chat from "./Chat";
import Users from "./Users";
import Box from "@mui/material/Box";

type Properties = {
    hidden: boolean
}

export default function Channel(properties: Properties) {
    const display = properties.hidden ? "none" : "flex"

    return (
        <Box sx={{display: display, width: "100%"}}>
            <ChannelTree />
            <Divider orientation="vertical" flexItem/>
            <Chat />
            <Divider orientation="vertical" flexItem/>
            <Users />
        </Box>
    )
}
