import React, {useEffect, useState} from "react"
import Box from "@mui/material/Box";
import {References} from "@knightsofglory/warlibrary/lib/References";
import "@fontsource/roboto-mono"

type Properties = {
    hidden: boolean
}

export default function Motd(properties: Properties) {
    const display = properties.hidden ? "none" : "flex"
    const [motd, setMotd] = useState<string[]>([])

    useEffect(() => {
        References.motdManager.subscribe("motd", setMotd)
    }, [])

    function thinned(): string[] {
        const length = motd.length
        return motd.filter((line, index) => {
            return (line.length > 0) || (index > 0 && index < length - 1)
        })
    }

    return (
        <Box sx={{display: display,
                  width: "100%",
                  overflow: "hidden",
                  padding: "16px",
                  fontFamily: "Roboto Mono",
                  fontWeight: "100",
                  overflowY: "scroll"}}
        >
            {
                thinned().map((l) => {
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
