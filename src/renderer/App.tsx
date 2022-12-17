import {MemoryRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './Home'
import {useEffect} from "react";
import {AnalyticsHelper} from "./utilities/AnalyticsHelper";
import {References} from "@knightsofglory/warlibrary/lib/References";
import {Messages} from "@knightsofglory/warlibrary/lib/common/Messages";

export default function App() {
    useEffect(() => {
        References.appManager.initialize()
        References.messageBus.send(
            Messages.Channels.APP,
            Messages.Commands.App.START
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
