import axios from "axios";
import {References} from "@knightsofglory/warlibrary/lib/References";

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
        axios.post('https://google-analytics.com/collect', payload);
    }
}
