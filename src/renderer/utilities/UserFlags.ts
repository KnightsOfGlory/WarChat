    export namespace UserFlags {

    export const isAdministrator = (flags: string) => {
        if (flags == "") flags = "0000";

        return flags[3] == "1"
    }

    export const isOperator = (flags: string) => {
        if (flags == "") flags = "0000";

        return flags[3] == "2"
    }
}