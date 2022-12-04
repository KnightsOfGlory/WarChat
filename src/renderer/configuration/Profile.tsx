import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {ListItem, ListItemButton} from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import BadgeIcon from "@mui/icons-material/Badge";
import ListItemText from "@mui/material/ListItemText";
import {useState} from "react";
import {ProfileManager} from "../state/ProfileManager";

export default function Profile() {
    const [open, setOpen] = useState(false);
    const [server, setServer] = useState(ProfileManager.getProfile().server)
    const [username, setUsername] = useState(ProfileManager.getProfile().username)
    const [password, setPassword] = useState(ProfileManager.getProfile().password)
    const [home, setHome] = useState(ProfileManager.getProfile().home)

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleSave = () => {
        ProfileManager.setProfile({
            server: server,
            username: username,
            password: password,
            home: home
        })
        setOpen(false);
    };

    return (
        <React.Fragment>
            <ListItem key={"Profile"} disablePadding>
                <ListItemButton onClick={handleClickOpen}>
                    <ListItemIcon>
                        <BadgeIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Profile"} />
                </ListItemButton>
            </ListItem>
            <Dialog open={open} onClose={handleClose} maxWidth={"xs"}>
                <DialogTitle>Profile</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill out the fields below to set your bot profile connection parameters.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="server"
                        label="Server"
                        fullWidth
                        variant="standard"
                        value={server}
                        onChange={(e) => setServer(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="username"
                        label="Username"
                        fullWidth
                        variant="standard"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        fullWidth
                        type={"password"}
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="home"
                        label="Home"
                        fullWidth
                        variant="standard"
                        value={home}
                        onChange={(e) => setHome(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} autoFocus={true}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}