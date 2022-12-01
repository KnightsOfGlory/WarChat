import { ipcMain } from 'electron';
import { ConnectionManager } from './ConnectionManager';

export namespace ChatManager {

  export function initialize() {
    listen();
  }

  function listen() {
    ipcMain.on('chat', async (event, arg) => {
      ConnectionManager.send(arg);
      ConnectionManager.send('\x0D\x0A');
    });
  }
}