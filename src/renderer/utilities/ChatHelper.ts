import {UserManager} from "../state/UserManager"

export namespace ChatHelper {

    export function parseQuoted(message: string) {
        const index = message.indexOf("\"")
        const length = message.length

        return message.substring(index + 1, length - 1)
    }

    export function makeSelfChat(message: string) {
        return {
            timestamp: Date.now(),
            user: UserManager.getConnectedUser(),
            message: message
        }
    }

    export function makeBotChat(message: string) {
        return {
            timestamp: Date.now(),
            user: UserManager.getWarChatUser(),
            message: message
        }
    }
}