import {Alert} from "@mui/material";

type Properties = {
    notice: string,
    setter: (notice: string) => void
}

export default function Notice(properties: Properties) {

    return (
        <Alert severity="info"
               sx={{
                    backgroundColor: "#90caf9",
                    color: "#616161",
                    position: "absolute",
                    zIndex: 10,
                    opacity: "1",
                    bottom: "0",
                    right: "0",
                    margin: "16px"
               }}
               onClose={() => properties.setter("")}
        >
            {properties.notice}
        </Alert>
    )
}
