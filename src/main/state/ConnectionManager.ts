import { ipcMain } from 'electron';
import net from "net";
import {ProfileManager} from "./ProfileManager";
import {Interprocess} from "../../common/Interprocess";

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
    ipcMain.on(Interprocess.Channels.SOCKET, async (event, arg) => {
      switch (arg) {
        case Interprocess.Commands.Socket.CONNECT:
          let profile = ProfileManager.getProfile()
          client.removeAllListeners("data")
          client.removeAllListeners("close")
          client.removeAllListeners("error")
          client.removeAllListeners("connect")
          client.destroy()
          client = new net.Socket()
          client.connect(6112, profile.server, function() {
            client.write("\x03\x04");
            client.write(profile.username + "\x0D\x0A")
            client.write(profile.password.toLowerCase() + "\x0D\x0A")
            client.write("/join " + profile.home + "\x0D\x0A")
          });

          client.on('data', function(data: string) {
            event.reply(Interprocess.Channels.MESSAGES, data);
          });
          client.on("close", () => {
            if (connected) {
              connected = false
              event.reply(
                  Interprocess.Channels.SOCKET,
                  Interprocess.Commands.Socket.DISCONNECTED
              )
            }
          })
          client.on("error", () => {

          })
          client.on("connect", () => {
            if (!connected) {
              connected = true
              event.reply(
                  Interprocess.Channels.SOCKET,
                  Interprocess.Commands.Socket.CONNECTED
              )
            }
          })
          break;
        case Interprocess.Commands.Socket.DISCONNECT:
          client.destroy()
          setTimeout(() => {
            client.removeAllListeners("data")
            client.removeAllListeners("close")
            client.removeAllListeners("error")
            client.removeAllListeners("connect")
          }, 1000)
          break;
      }
    });
  }
}

