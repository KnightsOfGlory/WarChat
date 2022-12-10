export namespace UserFlags {

    export const isAdministrator = (flags: string | undefined) => {
        if (flags == undefined) flags = "0000"
        if (flags == "") flags = "0000"

        return flags[3] == "1"
    }

    export const isOperator = (flags: string | undefined) => {
        if (flags == undefined) flags = "0000"
        if (flags == "") flags = "0000"

        return flags[3] == "2"
    }
}