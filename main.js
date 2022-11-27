const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const path = require("path");
const { exec, execFile, spawn } = require("child_process");
const pkg = require("./package.json");
const APP_URL = `http://${pkg.env.SERVER_HOST}:${pkg.env.SERVER_PORT}`;

const SHARE_TYPE = {
  DIRECTORY: 0,
  CLIPBORAD: 1,
  RECEIVE: 2,
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 540,
    height: 525,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    resizable: false,
  });

  ipcInit();

  // 本地开发环境需要 load url，生产环境需要 load file
  if (process.env.NODE_ENV == "production") {
    win.loadFile("index.html");
  } else {
    win.loadURL(APP_URL + "/index");
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  app.quit();
});

const ipcInit = () => {
  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  });

  // open url in default browser
  ipcMain.handle("open-url", (event, url) => {
    shell.openExternal(url);
  });

  // start service
  ipcMain.handle("sharing", (event, { type: shareType, params: _params }) => {
    return new Promise((reslove, reject) => {
      // TODO: Platform judgment
      // const binaryPath = path.join(__dirname, "./sharing-pkg/easy-sharing-macos");
      const binaryPath = "./sharing-pkg/easy-sharing-macos";

      let params = [];
      if (shareType === SHARE_TYPE.CLIPBORAD) {
        params = ["--clipboard"];
      } else {
        params = [_params.directoryPath];
      }
      if (shareType === SHARE_TYPE.RECEIVE) {
        params.push("--receive");
      }
      if (_params.port) {
        params.push(`--port ${_params.port}`);
      }
      if (_params.publicIP) {
        params.push(`--ip ${_params.publicIP}`);
      }
      if (_params.username) {
        params.push(`--username ${_params.username}`);
      }
      if (_params.password) {
        params.push(`--password ${_params.password}`);
      }

      console.log("spawn", binaryPath, params);
      var ls = spawn(binaryPath, params, {
        shell: true, // 使用shell命令
      });

      ls.stdout.on("data", function (data) {
        console.log("stdout: \r\n" + data);
        let dataStr = data.toString();
        if (dataStr.indexOf("link") >= 0) {
          let url = dataStr.match(/link:\s*(.*?)\s/)[1];
          reslove(url);
        }
      });

      ls.stderr.on("data", function (data) {
        console.log("stderr: " + data);
      });

      ls.on("exit", function (code) {
        console.log("child process exited with code " + code);
      });
    });
  });

  // select directory path
  ipcMain.handle("select-directory", (event, basePath) => {
    console.log("basePath", basePath);
    return dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
  });
};
