export namespace Timestamps {

    export function toReadable(timestamp: number) {
        let stamp = new Date(timestamp)
        let now = Date.now()

        let timeDifference = Math.abs(now - timestamp)
        let dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

        let relative: string = ""

        if (dayDifference == 1) relative = "Today"
        if (dayDifference == 2) relative = "Yesterday"
        if (dayDifference >= 3) relative = dayDifference + " days ago"

        let hours = stamp.getHours() % 12
        let minutes = String(stamp.getMinutes()).padStart(2, "0")
        let meridian = stamp.getHours() >= 12 ? "PM" : "AM"

        if (hours == 0) hours = 12

        return `${relative} at ${hours}:${minutes} ${meridian}`
    }
}