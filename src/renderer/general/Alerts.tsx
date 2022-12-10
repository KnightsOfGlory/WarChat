import {useEffect, useState} from "react"
import {AlertsManager, WarChatAlert} from "../state/AlertsManager"
import {Alert, Snackbar} from "@mui/material"

export default function Alerts() {
    const [alerts, setAlerts] = useState<WarChatAlert[]>([])

    useEffect(() => {
        AlertsManager.subscribe((newAlerts) => {
            setAlerts([...newAlerts]) // force state change
        })
    })

    return (
        <div>
            {
                alerts.map((alert) => {
                    return (
                        <Snackbar open={true} autoHideDuration={5000} onClose={() => AlertsManager.remove(alert)}>
                            <Alert onClose={() => AlertsManager.remove(alert)} severity={alert.severity}
                                   sx={{width: '100%'}}>
                                {alert.message}
                            </Alert>
                        </Snackbar>
                    )
                })
            }
        </div>
    )
}