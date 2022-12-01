import { ipcMain } from 'electron';
import net from "net";

export namespace ConnectionManager {
  let connected = false
  let client = new net.Socket()

  export function initialize() {
    listen()
  }

  export function send(data: string) {
    if (connected) {
      client.write(data)
    }
  }

  function listen() {
    ipcMain.on('socket', async (event, arg) => {
      switch (arg) {
        case "connect":
          client.connect(6112, 'war2.twistednet.org', function() {
            client.write("\x03\x04");
            client.write("fearful[L]\x0D\x0A")
            client.write("benjie\x0D\x0A")
            client.write("/join KoG\x0D\x0A")
          });

          client.on('data', function(data: string) {
            event.reply("messages", data);
          });

          /*
            on(event: 'close', listener: (hadError: boolean) => void): this;
            on(event: 'connect', listener: () => void): this;
            on(event: 'data', listener: (data: Buffer) => void): this;
            on(event: 'drain', listener: () => void): this;
            on(event: 'end', listener: () => void): this;
            on(event: 'error', listener: (err: Error) => void): this;
            on(event: 'lookup', listener: (err: Error, address: string, family: string | number, host: string) => void): this;
            on(event: 'ready', listener: () => void): this;
            on(event: 'timeout', listener: () => void): this;
          */

          client.on("close", () => {
            connected = false
            event.reply("socket", "disconnected")
          })
          client.on("end", () => {
            connected = false
            event.reply("socket", "disconnected")
          })
          client.on("error", () => {
            connected = false
            event.reply("socket", "disconnected")
          })
          client.on("connect", () => {
            connected = true
            event.reply("socket", "connected")
          })
          break;
        case "disconnect":
          client.destroy()
          setTimeout(() => {
            client.removeAllListeners("data")
            client.removeAllListeners("close")
            client.removeAllListeners("end")
            client.removeAllListeners("connect")
          }, 0)
          break;
      }
    });
  }
}

