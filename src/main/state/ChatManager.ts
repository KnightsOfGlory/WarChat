import {ipcMain} from 'electron';
import {ConnectionManager} from './ConnectionManager';
import {Messages} from "@knightsofglory/warlibrary/lib/common/Messages";

export namespace ChatManager {

    export function initialize() {
        listen();
    }

    function listen() {
        ipcMain.on(Messages.Channels.CHAT, async (event, arg) => {
            ConnectionManager.send(arg);
            ConnectionManager.send('\x0D\x0A');
        });
    }
}
