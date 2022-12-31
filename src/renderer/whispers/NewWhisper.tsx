import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React, {useState} from "react";
import TextField from "@mui/material/TextField";

type Properties = {
    open: boolean,
    title: string,
    description: string,
    label: string,
    setUsername: (value: string) => void,
    setMessage: (value: string) => void,
    yes: () => void,
    no: () => void
}

export default function NewWhisper(properties: Properties) {
    const [username, setUsername] = useState("")
    const [message, setMessage] = useState("")

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
                    value={username}
                    onChange={(e) => {let v = e.target.value; {setUsername(v); properties.setUsername(v)}}}
                />
                <TextField
                    margin="dense"
                    label="Message"
                    fullWidth
                    variant="standard"
                    value={message}
                    onChange={(e) => {let v = e.target.value; {setMessage(v); properties.setMessage(v)}}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {properties.no(); setUsername(""); setMessage("")}}>CANCEL</Button>
                <Button onClick={() => {properties.yes(); setUsername(""); setMessage("")}}>
                    {properties.label}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
