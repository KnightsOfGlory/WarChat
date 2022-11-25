import React from "react";
import Box from "@mui/material/Box";
import {TreeItem, TreeView} from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default class ChannelTree extends React.Component {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {messages: []};
        this.hook();
    }

    hook() {
        window.electron.ipcRenderer.on('messages', (arg) => {
            // @ts-ignore
            let string = new TextDecoder().decode(arg);
            let tokens = string.split("\n")

            // @ts-ignore
            this.setState({messages: [...this.state.messages, ...tokens]})
        });
    }

    render() {
        return (
            <Box sx={{width: "150px"}}>
                <TreeView
                    expanded={["1", "7"]}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ width: "150px", overflowY: 'auto' }}
                >
                    <TreeItem nodeId="1" label="Server" sx={{paddingBottom: "4px", fontWeight: "bold"}}>
                        <TreeItem nodeId="2" label="# DaRK" sx={{paddingBottom: "4px", marginLeft: "-8px"}}/>
                        <TreeItem nodeId="3" label="# Fatal-Error" sx={{paddingBottom: "4px", marginLeft: "-8px"}}/>
                        <TreeItem nodeId="4" label="# ~EwR~" sx={{paddingBottom: "4px", marginLeft: "-8px"}} />
                        <TreeItem nodeId="5" label="# KoG" sx={{paddingBottom: "4px", marginLeft: "-8px"}} />
                        <TreeItem nodeId="6" label="# test" sx={{paddingBottom: "4px", marginLeft: "-8px"}} />
                    </TreeItem>
                    <TreeItem nodeId="7" label="Favorites">
                        <TreeItem nodeId="8" label="# KoG" sx={{paddingBottom: "4px", marginLeft: "-8px"}} />
                    </TreeItem>
                </TreeView>
            </Box>
        );
    }
}