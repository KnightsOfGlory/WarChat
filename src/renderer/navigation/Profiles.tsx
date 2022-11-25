import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

export default function Profiles() {
    return (
        <List sx={{height: "100%"}}>
            <ListItem>
                <ListItemAvatar sx={{minWidth: 0}}>
                    <Avatar>
                        <ViewInArIcon />
                    </Avatar>
                </ListItemAvatar>
            </ListItem>
        </List>
    );
}