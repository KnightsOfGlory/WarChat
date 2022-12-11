import {UserManager} from "../state/UserManager"

export namespace ChatHelper {

    export function parseQuoted(message: string) {
        const index = message.indexOf("\"")
        const length = message.length

        return message.substring(index + 1, length - 1)
    }

    export function parseInit6(message: string, columns: number) {
        const length = message.length
        const tokens = message.split(" ")
        const index = tokens.slice(0, columns - 1)
                            .map((t) => t.length)
                            .reduce((t, a) => t + a + 1, 0)

        return message.substring(index, length)
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