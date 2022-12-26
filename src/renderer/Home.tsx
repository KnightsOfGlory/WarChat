import Bar from "./navigation/Bar"
import {Divider, Stack} from "@mui/material"
import React, {useState} from "react"
import Profiles from "./navigation/Profiles"
import Pages from "./navigation/Pages"
import AutoUpdate from "./general/AutoUpdate"
import Alerts from "./general/Alerts"
import Channel from "./channel/Channel";
import Friends from "./friends/Friends";

export default function Home() {
    const [page, setPage] = useState(0)

    return (
        <div style={{height: "100%"}}>
            <Bar/>
            <Stack direction="row" sx={{height: "100%"}}>
                <Profiles />
                <Divider orientation="vertical" flexItem/>
                <Pages setPage={setPage} />
                <Divider orientation="vertical" flexItem/>
                {/* content */}
                <Channel hidden={page != 0} />
                <Friends hidden={page != 1} />
            </Stack>
            <AutoUpdate/>
            <Alerts/>
        </div>
    )
}
