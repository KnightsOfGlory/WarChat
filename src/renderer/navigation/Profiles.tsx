import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { lighten } from 'polished';
import Box from "@mui/material/Box";

export default function Profiles() {
    return (
        <Box sx={{height: "calc(100vh - 64px)", backgroundColor: "#272727"}}>
            <List sx={{height: "100%", backgroundColor: "#272727"}}>
                <ListItem>
                    <ListItemAvatar sx={{minWidth: 0}}>
                        <Avatar>
                            <ViewInArIcon />
                        </Avatar>
                    </ListItemAvatar>
                </ListItem>
            </List>
        </Box>
    );
}