import axios from "axios";
import {AppManager} from "../state/AppManager";

export namespace AnalyticsHelper {

    export function event(category: string, action: string) {
        console.log(AppManager.getIdentifier())
        const payload = new URLSearchParams({
            v: "1",
            cid: AppManager.getIdentifier(),
            tid: 'UA-20901685-2',
            t: 'event',
            ec: category,
            ea: action
        }).toString();
        axios.post('https://google-analytics.com/collect', payload);
    }
}