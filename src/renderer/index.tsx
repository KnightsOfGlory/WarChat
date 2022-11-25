import { createRoot } from 'react-dom/client';
import App from './App';
import {createTheme, CssBaseline, darkScrollbar, PaletteMode, ThemeProvider} from "@mui/material";
import {grey} from "@mui/material/colors";

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
});

const mode = "light"

// @ts-ignore
const theme = createTheme(getDesignTokens(mode));

const Root = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <App/>
        </ThemeProvider>
    );
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<Root />);
