import Bar from "./navigation/Bar"
import {Divider, Stack} from "@mui/material"
import React from "react"
import Profiles from "./navigation/Profiles"
import Pages from "./navigation/Pages"
import Users from "./channel/Users"
import Channel from "./channel/Channel"
import ChannelTree from "./channel/ChannelTree"
import AutoUpdate from "./general/AutoUpdate"
import Alerts from "./general/Alerts"

export default function Home() {
    return (
        <div style={{height: "100%"}}>
            <Bar/>
            <Stack direction="row" sx={{height: "100%"}}>
                <Profiles/>
                <Divider orientation="vertical" flexItem/>
                <Pages/>
                <Divider orientation="vertical" flexItem/>
                <ChannelTree/>
                <Divider orientation="vertical" flexItem/>
                <Channel/>
                <Divider orientation="vertical" flexItem/>
                <Users/>
            </Stack>
            <AutoUpdate/>
            <Alerts/>
        </div>
    )
}