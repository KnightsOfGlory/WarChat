import React, {useEffect, useState} from "react"
import Box from "@mui/material/Box";
import {References} from "@knightsofglory/warlibrary/lib/References";
import "@fontsource/roboto-mono"
import {Messages} from "@knightsofglory/warlibrary/lib/common/Messages";

type Properties = {
    hidden: boolean
}

const dataGlobal: string[] = []

export default function Data(properties: Properties) {
    const display = properties.hidden ? "none" : "flex"
    const [data, setData] = useState<string[]>([])

    useEffect(() => {
        References.messageBus.on(Messages.Channels.MESSAGES, (arg) => {
            let string = arg as string
            let messages = string.split("\r\n")
            messages.filter((m) => m.length > 0).forEach((m) => {
                if (m.length == 0) return
                dataGlobal.push(m)
                setData([...dataGlobal])
            })
        })
    }, [])

    return (
        <Box sx={{display: display,
                  width: "100%",
                  height: "calc(100vh - 64px)",
                  overflow: "hidden",
                  padding: "16px",
                  fontFamily: "Roboto Mono",
                  fontWeight: "100",
                  overflowY: "scroll",
                  flexDirection: 'column-reverse'}}
        >
            {
                data.map((l) => {
                    return (
                        <React.Fragment>
                            {l}<br/>
                        </React.Fragment>
                    )
                })
            }
        </Box>
    )
}
