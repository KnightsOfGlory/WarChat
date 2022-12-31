import {Badge, ListItem, ListItemButton, ListItemIcon} from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import Box from "@mui/material/Box";

type Properties = {
    username: string,
    selected: string,
    setSelected: (username: string) => void,
    count: number
}

export default function UserItem(properties: Properties) {
    return (
        <ListItem key={properties.username} disablePadding>
            <ListItemButton
                onClick={() => properties.setSelected(properties.username)}
                selected={properties.username.toLowerCase() === properties.selected.toLowerCase()}
            >
                <ListItemIcon>
                    <AlternateEmailIcon/>
                </ListItemIcon>
                <ListItemText primary={<Badge badgeContent={properties.count} color={"error"}>
                                           <Box sx={{paddingRight: "8px"}}>{properties.username}</Box>
                                       </Badge>}
                              sx={{marginLeft: "-24px"}}
                />
            </ListItemButton>
        </ListItem>
    )
}
