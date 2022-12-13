import {User} from "../state/UserManager";
import {distance} from "fastest-levenshtein";

export namespace HumanBotSplit {

    const window_size = 16

    export function update(users: User[]) {
        let sorted = [...users].sort(compare)

        for (let i = 0; i < sorted.length; i++) {

            let user = sorted[i]
            let lower = Math.max(0, i - window_size)
            let upper = Math.min(sorted.length - 1, i + window_size)

            if (user.client != "[CHAT]") {
                user.bot = false
                continue
            }

            let found = 0
            for (let j = lower; j <= upper; j++) {
                let other = sorted[j]
                let levenshtein = distance(user.name.toLowerCase(), other.name.toLowerCase())

                if (levenshtein == 1) found++
                if (found >= 2) {
                    user.bot = true
                    break
                }
            }
        }
    }

    function compare(left: User, right: User) {
        if (left.name < right.name) {
            return -1
        }
        if (left.name > right.name) {
            return 1
        }
        return 0
    }
}