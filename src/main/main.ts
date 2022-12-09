import path from 'path';
import {app, BrowserWindow, shell, ipcMain, ipcRenderer} from 'electron';
import {autoUpdater, UpdateInfo} from 'electron-updater';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { ChatManager } from './state/ChatManager';
import {ConnectionManager} from "./state/ConnectionManager";
import {ProfileManager} from "./state/ProfileManager";
import {ProgressInfo} from "electron-builder";
import log from 'electron-log';

ipcMain.on('app', async (event, arg) => {
  if (arg == "quit") {
    mainWindow?.close()
    process.exit()
  }
});

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

ConnectionManager.initialize()
ChatManager.initialize()
ProfileManager.initialize()

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    // icon: getAssetPath('icon.png'),
    icon: getAssetPath('logos/icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
