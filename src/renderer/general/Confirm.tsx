import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React from "react";

type Properties = {
    open: boolean,
    title: string,
    description: string,
    yes: () => void,
    no: () => void
}

export default function Confirm(properties: Properties) {
    return (
        <Dialog open={properties.open}>
            <DialogTitle>
                {properties.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {properties.description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={properties.no}>NO</Button>
                <Button onClick={properties.yes} autoFocus>
                    YES
                </Button>
            </DialogActions>
        </Dialog>
    )
}
