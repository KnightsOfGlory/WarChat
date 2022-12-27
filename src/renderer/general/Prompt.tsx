import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React, {useState} from "react";
import TextField from "@mui/material/TextField";

type Properties = {
    open: boolean,
    title: string,
    description: string,
    label: string,
    setter: (value: string) => void,
    yes: () => void,
    no: () => void
}

export default function Prompt(properties: Properties) {
    const [value, setValue] = useState("")

    return (
        <Dialog open={properties.open}>
            <DialogTitle>
                {properties.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {properties.description}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Username"
                    fullWidth
                    variant="standard"
                    value={value}
                    onChange={(e) => {let v = e.target.value; {setValue(v); properties.setter(v)}}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {properties.no; setValue("")}}>CANCEL</Button>
                <Button onClick={() => {properties.yes(); setValue("")}} autoFocus>
                    {properties.label}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
