import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import GroupsIcon from '@mui/icons-material/Groups';
import ForumIcon from '@mui/icons-material/Forum';
import BarChartIcon from '@mui/icons-material/BarChart';
import Box from "@mui/material/Box";
import {Divider} from "@mui/material";

export default function Pages() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: "150px", fontFamily: "Roboto"}}>
            <Tabs
                value={value}
                orientation="vertical"
                onChange={handleChange}
                sx={{width:"150px"}}
            >
                <Tab icon={<ChatBubbleIcon />} label="CHANNEL" style={{width:"150px", paddingTop:"16px", paddingBottom:"16px"}} />
                <Tab icon={<GroupsIcon />} label="FRIENDS" style={{width:"150px", paddingTop:"16px", paddingBottom:"16px"}} />
                <Tab icon={<ForumIcon />} label="WHISPERS" style={{width:"150px", paddingTop:"16px", paddingBottom:"16px"}} />
                <Divider/>
                <Tab icon={<BarChartIcon />} label="STATISTICS" style={{width:"150px", paddingTop:"16px", paddingBottom:"16px"}} />
            </Tabs>
        </Box>
    );
}