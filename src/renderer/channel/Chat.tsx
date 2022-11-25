import {Divider, ListItem, Stack, TextField} from "@mui/material";
import React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

export default class Chat extends React.Component {
    constructor(props: {} | Readonly<{}>) {
        super(props);
    }

    render() {
        return (
            <TextField id="outlined-basic" variant="outlined" sx={{width: "auto", margin: "16px"}} />
        );
    }
}