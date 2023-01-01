import {ipcMain, net} from "electron";
import os from "os";
import path from "path";
import fs from "fs";
import {Messages} from "@knightsofglory/warlibrary/lib/common/Messages";

export namespace NoticeManager {

    import IpcMainEvent = Electron.IpcMainEvent;
    let notices: {[key: string]: string} = {}
    let state: string[] = []

    let appEvent: IpcMainEvent

    export function initialize() {
        ipcMain.on(Messages.Channels.APP, async (event, arg) => {
            switch (arg) {
                case Messages.Commands.App.START:
                    appEvent = event
                    break
            }
        });

        loadState()
        setInterval(() => {
            latestMessage()
        }, 15*1000)
    }

    function latestMessage() {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: 'raw.githubusercontent.com',
            port: 443,
            path: '/KnightsOfGlory/WarChat/main/data/notices.json'
        })
        request.on('response', (response) => {
            response.on('data', (chunk) => {
                notices = JSON.parse(chunk.toString())
                handle()
            });
        });
        request.setHeader('Content-Type', 'application/json');
        request.end();
    }

    function handle() {
        const lastId = Object.keys(notices)[Object.keys(notices).length - 1]
        const lastNotice = notices[lastId]
        const worn = state.includes(lastId)

        if (worn) return

        state.push(lastId)
        save()

        appEvent.reply(
            Messages.Channels.APP,
            Messages.Commands.App.NOTICE,
            lastNotice
        )
    }

    function loadState() {
        let user = os.homedir()
        let directory = path.join(user, ".warchat", "notices")
        let file = path.join(user, ".warchat", "notices", "state")
        if (!fs.existsSync(file)) {
            saveEmpty(directory, file)
        }
        let raw = fs.readFileSync(file)
        state = JSON.parse(raw.toString())
    }

    function saveEmpty(directory: string, file: string) {
        let data = JSON.stringify([])
        fs.mkdirSync(directory, { recursive: true });
        fs.writeFileSync(file, data)
    }

    function save() {
        let user = os.homedir()
        let file = path.join(user, ".warchat", "notices", "state")
        let data = JSON.stringify(state)

        fs.writeFileSync(file, data)
    }
}
