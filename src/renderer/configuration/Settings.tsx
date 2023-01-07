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
import SettingsIcon from "@mui/icons-material/Settings";
import {References} from "@knightsofglory/warlibrary/lib/References";

export default function Settings() {
    const [open, setOpen] = useState(false)
    const [autoReconnect, setAutoReconnect] = useState(References.settingsManager.getSettings().autoReconnect)
    const [whisperTab, setWhisperTab] = useState(References.settingsManager.getSettings().whisperTab)
    const [separateBots, setSeparateBots] = useState(References.settingsManager.getSettings().separateBots)
    const [ignoreEmotes, setIgnoreEmotes] = useState(References.settingsManager.getSettings().ignoreEmotes)
    const [ignoreAntiIdles, setIgnoreAntiIdles] = useState(References.settingsManager.getSettings().ignoreAntiIdles)
    const [ignoreBots, setIgnoreBots] = useState(References.settingsManager.getSettings().ignoreBots)
    const [ignoreBans, setIgnoreBans] = useState(References.settingsManager.getSettings().ignoreBans)

    const handleClickOpen = () => {
        setOpen(true)
        AnalyticsHelper.event("Menu", "Settings")
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleSave = () => {
        References.settingsManager.setSettings({
            autoReconnect: autoReconnect,
            whisperTab: whisperTab,
            separateBots: separateBots,
            ignoreEmotes: ignoreEmotes,
            ignoreAntiIdles: ignoreAntiIdles,
            ignoreBots: ignoreBots,
            ignoreBans: ignoreBans
        })
        setOpen(false)
        References.chatManager.forceUpdate()
        References.userManager.forceUpdate()
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
                        These are global settings that change the bot's behavior.
                    </DialogContentText>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox onChange={(e) => setAutoReconnect(e.target.checked)} />}
                            label="Automatically Reconnect"
                            checked={autoReconnect}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={(e) => setWhisperTab(e.target.checked)} />}
                            label="Whisper Tab"
                            checked={whisperTab}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={(e) => setSeparateBots(e.target.checked)} />}
                            label="Separate Bots"
                            checked={separateBots}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={(e) => setIgnoreBots(e.target.checked)} />}
                            label="Ignore Bots"
                            checked={ignoreBots}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={(e) => setIgnoreEmotes(e.target.checked)} />}
                            label="Ignore Emotes"
                            checked={ignoreEmotes}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={(e) => setIgnoreAntiIdles(e.target.checked)} />}
                            label="Ignore Anti-Idles"
                            checked={ignoreAntiIdles}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={(e) => setIgnoreBans(e.target.checked)} />}
                            label="Ignore Ban/Kick"
                            checked={ignoreBans}
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
