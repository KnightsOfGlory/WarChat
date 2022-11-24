import Bar from "./navigation/Bar";
import {Stack} from "@mui/material";
import React from "react";

export default class Home extends React.Component {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        console.log("constructor")

        this.state = {messages: []};
        this.hook();
    }

    hook() {
        console.log("hook")
        window.electron.ipcRenderer.on('messages', (arg) => {
            // @ts-ignore
            var string = new TextDecoder().decode(arg);
            let tokens = string.split("\n")

            // @ts-ignore
            this.setState({messages: [...this.state.messages, ...tokens]})
            // @ts-ignore
            console.log(this.state.messages)
        });
    }

    render() {
        return (
            <div>
                <Bar/>
                <Stack>
                    <div>
                        {
                            // @ts-ignore
                            this.state.messages.map((message: string) => {
                                return (<div>
                                    {message}<br/>
                                </div>);
                            })
                        }
                    </div>
                </Stack>
            </div>
        );
    }
}