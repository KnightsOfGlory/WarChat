import {useEffect, useState} from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import {AlertsManager} from "../state/AlertsManager"
import {Interprocess} from "../../common/Interprocess";
import {ipcRenderer} from "../utilities/IpcRenderer";

let silentUpdate = false

export default function AutoUpdate() {
    const [open, setOpen] = useState(false)
    const [done, setDone] = useState(false)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        listen(setOpen, setDone)
        ipcRenderer.sendMessage("updater", "initialize")
        setInterval(() => {
            silentUpdate = true
            ipcRenderer.sendMessage("updater", "check")
        }, 60 * 60 * 1000)
    }, [])

    const handleYes = () => {
        setUpdating(true)
        ipcRenderer.sendMessage("updater", "download")
    }

    const prompt = (<Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
            {"Update to the latest version?"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                A new version of WarChat is available. We strongly recommend you keep the version up to date.
                Would you like to update to the new version now?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpen(false)}>Skip</Button>
            <Button onClick={handleYes} autoFocus>
                Update
            </Button>
        </DialogActions>
    </Dialog>)

    const updater = (<Dialog open={open}>
        <DialogTitle>
            {"Updating to the latest version"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Downloading the latest version of WarChat...{done ? "finished!" : ""}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button disabled={!done}
                    onClick={() => ipcRenderer.sendMessage("updater", "install")}>Done</Button>
        </DialogActions>
    </Dialog>)

    if (updating) {
        return updater
    } else {
        return prompt
    }
}

type SetBoolean = (value: (((prevState: boolean) => boolean) | boolean)) => void

function listen(setOpen: SetBoolean, setDone: SetBoolean) {
    ipcRenderer.on(Interprocess.Channels.UPDATER, (event, data) => {
        switch (event) {
            case Interprocess.Commands.Updater.UPDATE_AVAILABLE:
                setOpen(true)
                silentUpdate = false
                break
            case Interprocess.Commands.Updater.UPDATE_NOT_AVAILABLE:
                if (!silentUpdate) {
                    AlertsManager.add({
                        severity: "info",
                        message: "Already up to date"
                    })
                    silentUpdate = false
                }
                break
            case Interprocess.Commands.Updater.UPDATE_DOWNLOADED:
                setDone(true)
                break
            case Interprocess.Commands.Updater.ERROR:
                let error = data as Error
                AlertsManager.add({
                    severity: "error",
                    message: error.message
                })
                break
        }
    })
}