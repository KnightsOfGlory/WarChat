import {ipcMain} from "electron";
import log from "electron-log";
import {autoUpdater, UpdateInfo} from "electron-updater";
import {Interprocess} from "../../common/Interprocess";

export namespace AutoUpdateManager {

    export function initialize() {
        listen()
    }

    function listen() {
        ipcMain.on(Interprocess.Channels.UPDATER, async (event, command) => {
            switch (command) {
                case Interprocess.Commands.Updater.INITIALIZE:
                    log.transports.file.level = 'verbose';
                    autoUpdater.logger = log;

                    autoUpdater.autoDownload = false
                    autoUpdater.on('checking-for-update', () => {
                    })
                    autoUpdater.on('update-available', (info: UpdateInfo) => {
                        event.reply(
                            Interprocess.Channels.UPDATER,
                            Interprocess.Commands.Updater.UPDATE_AVAILABLE
                        )
                    })
                    autoUpdater.on('update-not-available', (info: UpdateInfo) => {
                        event.reply(
                            Interprocess.Channels.UPDATER,
                            Interprocess.Commands.Updater.UPDATE_NOT_AVAILABLE
                        )
                    })
                    autoUpdater.on('error', (err) => {
                        event.reply(
                            Interprocess.Channels.UPDATER,
                            Interprocess.Commands.Updater.ERROR,
                            err
                        )
                    })
                    autoUpdater.on('update-downloaded', (info) => {
                        event.reply(
                            Interprocess.Channels.UPDATER,
                            Interprocess.Commands.Updater.UPDATE_DOWNLOADED
                        )
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