import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import GroupsIcon from '@mui/icons-material/Groups'
import ForumIcon from '@mui/icons-material/Forum'
import BarChartIcon from '@mui/icons-material/BarChart'
import Box from "@mui/material/Box"
import {Badge, Divider} from "@mui/material"
import {useEffect, useState} from "react";
import {References} from "@knightsofglory/warlibrary/lib/References";
import TodayIcon from '@mui/icons-material/Today';
import LeakAddIcon from '@mui/icons-material/LeakAdd';
import {Settings} from "@knightsofglory/warlibrary/lib/state/SettingsManager";
import {Messages} from "@knightsofglory/warlibrary/lib/common/Messages";

type Properties = {
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>
}

export default function Pages(properties: Properties) {

    const [unread, setUnread] = useState(0)
    const [whisperTab, setWhisperTab] = useState(References.settingsManager.getSettings().whisperTab)

    useEffect(() => {
        References.messageBus.onLocal(
            "unread",
            (count) => {
                setUnread(count as number)
            }
        )
        References.settingsManager.subscribe(
            "settings",
            (settings: Settings) => {
                console.log(settings.whisperTab)
                setWhisperTab(settings.whisperTab)
            }
        )
        References.messageBus.send(
            Messages.Channels.SETTINGS,
            Messages.Commands.Settings.READ
        )
    }, [])

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        properties.setPage(newValue)
    }

    const padding = {
        paddingTop: "16px",
        paddingBottom: "16px"
    }

    return (
        <Box sx={{width: "150px", fontFamily: "Roboto"}}>
            <Tabs
                value={properties.page}
                orientation="vertical"
                onChange={handleChange}
                sx={{width: "150px"}}
            >
                <Tab icon={<ChatBubbleIcon/>} label="CHANNEL" sx={padding}/>
                <Tab icon={<GroupsIcon/>} label="FRIENDS" sx={padding}/>
                {
                    whisperTab ?
                    <Tab icon={<Badge badgeContent={unread} color={"error"}><ForumIcon/></Badge>} label="WHISPERS" sx={padding}/> :
                    null
                }
                <Divider/>
                <Tab icon={<TodayIcon/>} label="MOTD" sx={padding}/>
                <Tab icon={<LeakAddIcon/>} label="DATA" sx={padding}/>
                <Divider/>
                <Tab disabled icon={<BarChartIcon/>} label="STATISTICS" sx={padding}/>
            </Tabs>
        </Box>
    )
}
