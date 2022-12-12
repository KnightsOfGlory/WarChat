export namespace MessageEvents {

    export namespace Classic {
        export const NAME           = "2010"
        export const CHANNEL        = "1007"

        export const INFO           = "1018"
        export const ERROR          = "1019"
        export const BROADCAST      = "1006"

        export const USER           = "1001"
        export const JOIN           = "1002"
        export const LEAVE          = "1003"
        export const UPDATE         = "1009"

        export const WHISPER_IN     = "1004"
        export const WHISPER_OUT    = "1010"

        export const TALK           = "1005"
        export const EMOTE          = "1023"
    }

    export namespace Init6 {
        export namespace Commands {
            export const CHANNEL    = "CHANNEL"
            export const SERVER     = "SERVER"
            export const USER       = "USER"
        }

        export namespace Events {
            export const BROADCAST  = "BROADCAST"
            export const EMOTE      = "EMOTE"
            export const ERROR      = "ERROR"
            export const IN         = "IN"
            export const INFO       = "INFO"
            export const JOIN       = "JOIN"
            export const LEAVE      = "LEAVE"
            export const TALK       = "TALK"
            export const TOPIC      = "TOPIC"
            export const UPDATE     = "UPDATE"
            export const WHISPER    = "WHISPER"
        }

        export namespace Directions {
            export const TO         = "TO"
            export const FROM       = "FROM"
        }
    }
}