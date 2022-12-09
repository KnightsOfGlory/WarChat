import {ipcMain} from "electron";
import log from "electron-log";
import {autoUpdater, UpdateInfo} from "electron-updater";
import {ProgressInfo} from "electron-builder";

export namespace AutoUpdateManager {

    export function initialize() {
        listen()
    }

    function listen() {
        ipcMain.on("updater", async (event, command) => {
            switch (command) {
                case "initialize":
                    log.transports.file.level = 'verbose';
                    autoUpdater.logger = log;

                    autoUpdater.autoDownload = false
                    autoUpdater.on('checking-for-update', () => {
                    })
                    autoUpdater.on('update-available', (info: UpdateInfo) => {
                        event.reply("updater", "update.available")
                    })
                    autoUpdater.on('update-not-available', (info: UpdateInfo) => {
                        event.reply("updater", "update.not.available")
                    })
                    autoUpdater.on('error', (err) => {
                        event.reply("updater", "error", err)
                    })
                    // @ts-ignore
                    autoUpdater.on('download-progress', (progressObj: ProgressInfo) => {
                        event.reply("updater", "download.progress", progressObj)
                    })
                    autoUpdater.on('update-downloaded', (info) => {
                        event.reply("updater", "update.downloaded")
                    })
                    break;
                case "check":
                    autoUpdater.checkForUpdates()
                    break;
                case "download":
                    autoUpdater.downloadUpdate()
                    break;
                case "install":
                    autoUpdater.quitAndInstall()
                    break;
            }
        })
    }
}