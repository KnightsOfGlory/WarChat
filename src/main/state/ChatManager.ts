import {ipcMain} from 'electron';
import {ConnectionManager} from './ConnectionManager';
import {Interprocess} from "../../common/Interprocess";

export namespace ChatManager {

    export function initialize() {
        listen();
    }

    function listen() {
        ipcMain.on(Interprocess.Channels.CHAT, async (event, arg) => {
            ConnectionManager.send(arg);
            ConnectionManager.send('\x0D\x0A');
        });
    }
}