import { createRoot } from 'react-dom/client';
import App from './App';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

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
