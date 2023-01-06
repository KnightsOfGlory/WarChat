import axios, {AxiosError} from "axios";
import {References} from "@knightsofglory/warlibrary/lib/References";
import {AlertsManager, WarChatAlert} from "../state/AlertsManager";

export namespace AnalyticsHelper {

    export function event(category: string, action: string) {
        const payload = new URLSearchParams({
            v: "1",
            cid: References.appManager.getIdentifier(),
            tid: 'UA-20901685-2',
            t: 'event',
            ec: category,
            ea: action
        }).toString();

        try {
            axios.post('https://google-analytics.com/collect', payload)
                 .catch((e) => {
                     AlertsManager.add({
                         severity: "error",
                         message: e.message
                     } as WarChatAlert)
                 })
        } catch (e: unknown) {
            if (typeof e === "string") {
                AlertsManager.add({
                    severity: "error",
                    message: e
                } as WarChatAlert)
            } else if (e instanceof Error) {
                AlertsManager.add({
                    severity: "error",
                    message: e.message
                } as WarChatAlert)
            } else if (e instanceof AxiosError) {
                AlertsManager.add({
                    severity: "error",
                    message: e.message
                } as WarChatAlert)
            }
        }
    }
}
