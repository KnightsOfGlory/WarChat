import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import GroupsIcon from '@mui/icons-material/Groups'
import ForumIcon from '@mui/icons-material/Forum'
import BarChartIcon from '@mui/icons-material/BarChart'
import Box from "@mui/material/Box"
import {Divider} from "@mui/material"

type Properties = {
    setPage: React.Dispatch<React.SetStateAction<number>>
}

export default function Pages(properties: Properties) {
    const [value, setValue] = React.useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
        properties.setPage(newValue)
    }

    const padding = {
        paddingTop: "16px",
        paddingBottom: "16px"
    }

    return (
        <Box sx={{width: "150px", fontFamily: "Roboto"}}>
            <Tabs
                value={value}
                orientation="vertical"
                onChange={handleChange}
                sx={{width: "150px"}}
            >
                <Tab icon={<ChatBubbleIcon/>} label="CHANNEL" sx={padding}/>
                <Tab icon={<GroupsIcon/>} label="FRIENDS" sx={padding}/>
                <Tab disabled icon={<ForumIcon/>} label="WHISPERS" sx={padding}/>
                <Divider/>
                <Tab disabled icon={<BarChartIcon/>} label="STATISTICS" sx={padding}/>
            </Tabs>
        </Box>
    )
}
