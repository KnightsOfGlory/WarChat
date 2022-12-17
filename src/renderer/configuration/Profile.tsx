import * as React from 'react'
import {useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import {Checkbox, FormControlLabel, FormGroup, ListItem, ListItemButton} from "@mui/material"
import ListItemIcon from "@mui/material/ListItemIcon"
import BadgeIcon from "@mui/icons-material/Badge"
import ListItemText from "@mui/material/ListItemText"
import {AnalyticsHelper} from "../utilities/AnalyticsHelper";
import {References} from "@knightsofglory/warlibrary/lib/References";

export default function Profile() {
    const [open, setOpen] = useState(false)
    const [server, setServer] = useState(References.profileManager.getProfile().server)
    const [username, setUsername] = useState(References.profileManager.getProfile().username)
    const [password, setPassword] = useState(References.profileManager.getProfile().password)
    const [home, setHome] = useState(References.profileManager.getProfile().home)
    const [init6, setInit6] = useState(References.profileManager.getProfile().init6)

    const handleClickOpen = () => {
        setOpen(true)
        AnalyticsHelper.event("Menu", "Profile")
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleSave = () => {
        References.profileManager.setProfile({
            server: server,
            username: username,
            password: password,
            home: home,
            init6: init6
        })
        setOpen(false)
    }

    return (
        <React.Fragment>
            <ListItem key={"Profile"} disablePadding>
                <ListItemButton onClick={handleClickOpen}>
                    <ListItemIcon>
                        <BadgeIcon/>
                    </ListItemIcon>
                    <ListItemText primary={"Profile"}/>
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
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox onChange={(e) => setInit6(e.target.checked)} />}
                            label="Use init 6 custom protocol"
                            checked={init6}
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} autoFocus={true}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
