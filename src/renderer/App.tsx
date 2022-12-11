import {MemoryRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './Home'
import {useEffect} from "react";
import {AppManager} from "./state/AppManager";
import {ipcRenderer} from "./utilities/IpcRenderer";
import {Interprocess} from "../common/Interprocess";
import {AnalyticsHelper} from "./utilities/AnalyticsHelper";

export default function App() {
    useEffect(() => {
        AppManager.initialize()
        ipcRenderer.sendMessage(
            Interprocess.Channels.APP,
            Interprocess.Commands.App.START
        )
        setInterval(() => AnalyticsHelper.event("App", "Live"), 1000*60*5)
    }, [])

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </Router>
    )
}
