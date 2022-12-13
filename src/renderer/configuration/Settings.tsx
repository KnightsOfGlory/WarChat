import * as React from 'react'
import {useState} from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import {Checkbox, FormControlLabel, FormGroup, ListItem, ListItemButton} from "@mui/material"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import {AnalyticsHelper} from "../utilities/AnalyticsHelper";
import {SettingsManager} from "../state/SettingsManager";
import SettingsIcon from "@mui/icons-material/Settings";
import {ChatManager} from "../state/ChatManager";
import {UserManager} from "../state/UserManager";

export default function Settings() {
    const [open, setOpen] = useState(false)
    const [autoReconnect, setAutoReconnect] = useState(SettingsManager.getSettings().autoReconnect)
    const [ignoreEmotes, setIgnoreEmotes] = useState(SettingsManager.getSettings().ignoreEmotes)
    const [separateBots, setSeparateBots] = useState(SettingsManager.getSettings().separateBots)

    const handleClickOpen = () => {
        setOpen(true)
        AnalyticsHelper.event("Menu", "Settings")
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleSave = () => {
        SettingsManager.setSettings({
            autoReconnect: autoReconnect,
            ignoreEmotes: ignoreEmotes,
            separateBots: separateBots
        })
        setOpen(false)
        ChatManager.forceUpdate()
        UserManager.forceUpdate()
    }

    return (
        <React.Fragment>
            <ListItem key={"Settings"} disablePadding>
                <ListItemButton onClick={handleClickOpen}>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary={"Settings"}/>
                </ListItemButton>
            </ListItem>
            <Dialog open={open} onClose={handleClose} maxWidth={"xs"}>
                <DialogTitle>Settings</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        These are global settings that set the bot's behavior.
                    </DialogContentText>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox onChange={(e) => setAutoReconnect(e.target.checked)} />}
                            label="Automatically Reconnect"
                            checked={autoReconnect}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={(e) => setIgnoreEmotes(e.target.checked)} />}
                            label="Ignore Emotes"
                            checked={ignoreEmotes}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={(e) => setSeparateBots(e.target.checked)} />}
                            label="Separate Bots"
                            checked={separateBots}
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