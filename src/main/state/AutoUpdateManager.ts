import {ipcMain} from "electron";
import log from "electron-log";
import {autoUpdater, UpdateInfo} from "electron-updater";
import {Messages} from "@knightsofglory/warlibrary/lib/common/Messages";

export namespace AutoUpdateManager {

    export function initialize() {
        listen()
    }

    function listen() {
        ipcMain.on(Messages.Channels.UPDATER, async (event, command) => {
            switch (command) {
                case Messages.Commands.Updater.INITIALIZE:
                    log.transports.file.level = 'verbose';
                    autoUpdater.logger = log;

                    autoUpdater.autoDownload = false
                    autoUpdater.on('checking-for-update', () => {
                    })
                    autoUpdater.on('update-available', (info: UpdateInfo) => {
                        event.reply(
                            Messages.Channels.UPDATER,
                            Messages.Commands.Updater.UPDATE_AVAILABLE
                        )
                    })
                    autoUpdater.on('update-not-available', (info: UpdateInfo) => {
                        event.reply(
                            Messages.Channels.UPDATER,
                            Messages.Commands.Updater.UPDATE_NOT_AVAILABLE
                        )
                    })
                    autoUpdater.on('error', (err) => {
                        event.reply(
                            Messages.Channels.UPDATER,
                            Messages.Commands.Updater.ERROR,
                            err
                        )
                    })
                    autoUpdater.on('update-downloaded', (info) => {
                        event.reply(
                            Messages.Channels.UPDATER,
                            Messages.Commands.Updater.UPDATE_DOWNLOADED
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
