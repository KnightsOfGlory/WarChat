import { ipcMain } from 'electron';

export namespace ConnectionManager {
  const net = require('net')
  const client = new net.Socket()

  export function initialize() {
    listen()
  }

  export function send(data: string) {
    //TODO add handling for not connecting
    client.write(data)
  }

  function listen() {
    ipcMain.on('socket', async (event, arg) => {

      console.log(arg)

      switch (arg) {
        case "connect":
          client.connect(6112, 'war1.twistednet.org', function() {
            console.log('Connected');
            client.write("\x03\x04");
            client.write("fearful[L]\x0D\x0A")
            client.write("benjie\x0D\x0A")
            client.write("/join KoG\x0D\x0A")
          });

          client.on('data', function(data: string) {
            //client.write(data);
            event.reply("messages", data);
            // ipcMain.emit("messages", data);
            console.log('Received: ' + data);
          });
          break;
        case "disconnect":
          break;
      }
    });
  }
}

