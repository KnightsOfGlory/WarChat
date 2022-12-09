import {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {AlertsManager} from "../state/AlertsManager";

let silentUpdate = false

export default function AutoUpdate() {
    const [open, setOpen] = useState(false);
    const [done, setDone] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        listen(setOpen, setDone)
        window.electron.ipcRenderer.sendMessage("updater", "initialize")
        setInterval(() => {
            silentUpdate = true
            window.electron.ipcRenderer.sendMessage("updater", "check")
        }, 60*60*1000)
    }, []);

    const handleYes = () => {
        setUpdating(true)
        window.electron.ipcRenderer.sendMessage("updater", "download")
    };

    const prompt = (<Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
            {"Update to the latest version?"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                A new version of WarChat is available.  We strongly recommend you keep the version up to date.
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
            <Button disabled={!done} onClick={() => window.electron.ipcRenderer.sendMessage("updater", "install")}>Done</Button>
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
    window.electron.ipcRenderer.on("updater", (event, data) => {
        switch (event) {
            case "update.available":
                setOpen(true)
                silentUpdate = false
                break;
            case "update.not.available":
                if (!silentUpdate) {
                    AlertsManager.add({
                        severity: "info",
                        message: "Already up to date"
                    })
                    silentUpdate = false
                }
                break;
            case "update.downloaded":
                setDone(true)
                break;
            case "error":
                let error = data as Error
                AlertsManager.add({
                    severity: "error",
                    message: error.message
                })
                break;
        }
    })
}