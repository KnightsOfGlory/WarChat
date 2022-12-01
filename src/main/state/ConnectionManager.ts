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

