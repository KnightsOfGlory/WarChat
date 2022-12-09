import {AlertColor} from "@mui/material";

export type WarChatAlert = {
    severity: AlertColor,
    message: string
}

export type Subscription = (alerts: WarChatAlert[]) => void

export namespace AlertsManager {
    let alerts: WarChatAlert[] = []
    let subscriptions: Subscription[] = []

    export function subscribe(callback: Subscription) {
        subscriptions.push(callback)
    }

    function dispatch() {
        subscriptions.forEach((s) => s(alerts))
    }

    export function add(alert: WarChatAlert) {
        alerts.push(alert)
        dispatch()
    }

    export function remove(alert: WarChatAlert) {
        let index = alerts.indexOf(alert)
        if (index > -1) {
            alerts.splice(index, 1);
            dispatch()
        }
    }
}