import Bar from "./navigation/Bar"
import {Divider, Stack} from "@mui/material"
import React, {useEffect, useState} from "react"
import Profiles from "./navigation/Profiles"
import Pages from "./navigation/Pages"
import AutoUpdate from "./general/AutoUpdate"
import Alerts from "./general/Alerts"
import Channel from "./channel/Channel";
import Friends from "./friends/Friends";
import Whispers from "./whispers/Whispers";
import Motd from "./motd/Motd";
import Data from "./data/Data";
import Notice from "./general/Notice";
import {References} from "@knightsofglory/warlibrary/lib/References";
import {Messages} from "@knightsofglory/warlibrary/lib/common/Messages";

export default function Home() {
    const [page, setPage] = useState(0)
    const [notice, setNotice] = useState("")

    useEffect(() => {
        References.messageBus.on(Messages.Channels.APP, (c, n) => {
            if (c == Messages.Commands.App.NOTICE) {
                setNotice(n as string)
            }
        })
    }, [])

    return (
        <div style={{height: "100%"}}>
            <Bar/>
            <Stack direction="row" sx={{height: "100%"}}>
                <Profiles />
                <Divider orientation="vertical" flexItem/>
                <Pages page={page} setPage={setPage} />
                <Divider orientation="vertical" flexItem/>
                {/* content */}
                <Channel  hidden={page != 0} />
                <Friends  hidden={page != 1} setPage={setPage} />
                <Whispers hidden={page != 2} />
                <Motd     hidden={page != 4} />
                <Data     hidden={page != 5} />
            </Stack>
            {
                notice.length > 0 ?
                <Notice setter={setNotice} notice={notice} /> :
                null
            }
            <AutoUpdate/>
            <Alerts/>
        </div>
    )
}
