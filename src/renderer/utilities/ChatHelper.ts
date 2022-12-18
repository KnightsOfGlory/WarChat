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

    export function isBanMessage(message: string) {
        if (message.includes(" was banned by ")) return true
        if (message.includes(" was unbanned by ")) return true
        if (message.includes(" was kicked out of the channel by ")) return true
    }

    const antiIdles = [
        "Apathy3 - Unstable and damn near unusable",
        "Its Hammer Time :) - DC v1.2.",
        ":+:~EwR 4 LyFe~:+: - Ghost 3.02"
    ]
    export function isAntiIdle(message: string) {
        return antiIdles.includes(message)
    }
}
