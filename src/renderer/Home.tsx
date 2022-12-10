import Bar from "./navigation/Bar"
import {Divider, Stack} from "@mui/material"
import React from "react"
import Profiles from "./navigation/Profiles"
import Pages from "./navigation/Pages"
import Users from "./channel/Users"
import Channel from "./channel/Channel"
import ChannelTree from "./channel/ChannelTree"
import AutoUpdate from "./general/AutoUpdate"
import Alerts from "./general/Alerts"
import {ipcRenderer} from "./utilities/IpcRenderer"
import {Interprocess} from "../common/Interprocess";

export default class Home extends React.Component {
    constructor(props: {} | Readonly<{}>) {
        super(props)

        this.state = {messages: []}
        this.hook()
    }

    hook() {
        ipcRenderer.on(Interprocess.Channels.MESSAGES, (arg) => {
            let string = new TextDecoder().decode(arg as Uint8Array)
            let tokens = string.split("\n")

            // @ts-ignore
            this.setState({messages: [...this.state.messages, ...tokens]})
        })
    }

    render() {
        return (
            <div style={{height: "100%"}}>
                <Bar/>
                <Stack direction="row" sx={{height: "100%"}}>
                    <Profiles/>
                    <Divider orientation="vertical" flexItem/>
                    <Pages/>
                    <Divider orientation="vertical" flexItem/>
                    <ChannelTree/>
                    <Divider orientation="vertical" flexItem/>
                    <Channel/>
                    <Divider orientation="vertical" flexItem/>
                    <Users/>
                </Stack>
                <AutoUpdate/>
                <Alerts/>
            </div>
        )
    }
}