import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import GroupsIcon from '@mui/icons-material/Groups';
import ForumIcon from '@mui/icons-material/Forum';
import EqualizerIcon from '@mui/icons-material/Equalizer';

export default function Pages() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Tabs
            value={value}
            orientation="vertical"
            onChange={handleChange}
            sx={{width:"300px"}}
        >
            <Tab icon={<ChatBubbleIcon />} label="CHANNEL" style={{paddingTop:"16px", paddingBottom:"16px"}} />
            <Tab icon={<GroupsIcon />} label="FRIENDS" style={{paddingTop:"16px", paddingBottom:"16px"}} />
            <Tab icon={<ForumIcon />} label="WHISPERS" style={{paddingTop:"16px", paddingBottom:"16px"}} />
            <Tab icon={<EqualizerIcon />} label="STATISTICS" style={{paddingTop:"16px", paddingBottom:"16px"}} />
        </Tabs>
    );
}