import { createRoot } from 'react-dom/client'
import App from './App'
import {createTheme, CssBaseline, darkScrollbar, PaletteMode, ThemeProvider} from "@mui/material"
import {grey} from "@mui/material/colors"
import {Configuration} from "./wiring/Configuration";
import * as Sentry from "@sentry/electron";
import {References} from "@knightsofglory/warlibrary/lib/References";

export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    ...darkScrollbar(
                        mode === "dark"
                            ? {
                                track: grey[200],
                                thumb: grey[400],
                                active: grey[400]
                            }
                            : undefined
                    ),
                    //scrollbarWidth for Firefox
                    scrollbarWidth: "thin"
                }
            }
        }
    }
})

const mode = "light"

// @ts-ignore
const theme = createTheme(getDesignTokens(mode))

const Root = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <App/>
        </ThemeProvider>
    )
}

Configuration.inject()

Sentry.init({
    dsn: "https://fe2a46d485b04e8691f0bf496cc44646@o4504454868369408.ingest.sentry.io/4504454870728704"
});
Sentry.setUser({
    id: References.appManager.getIdentifier(),
    username: References.profileManager.getProfile().username
})

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<Root />)
