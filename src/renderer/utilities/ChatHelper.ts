import {References} from "@knightsofglory/warlibrary/lib/References";

export namespace ChatHelper {

    export function makeSelfChat(message: string) {
        return {
            timestamp: Date.now(),
            user: References.userManager.getConnectedUser(),
            message: message
        }
    }

    export function makeBotChat(message: string) {
        return {
            timestamp: Date.now(),
            user: References.userManager.getWarChatUser(),
            message: message
        }
    }
}
