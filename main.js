const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
  clipboard,
} = require("electron");
const path = require("path");
const { exec, execFile, spawn } = require("child_process");
const pkg = require("./package.json");
const APP_URL = `http://${pkg.env.SERVER_HOST}:${pkg.env.SERVER_PORT}`;

const SHARE_TYPE = {
  DIRECTORY: 0,
  CLIPBORAD: 1,
  RECEIVE: 2,
};

const SHARING_PKG = {
  darwin: "easy-sharing-macos",
  win32: "easy-sharing-win.exe",
  linux: "easy-sharing-linux",
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

  // TODO: when we are development mode we can get process but when used the electron forge we can't get process, so when can't get process default used production. This is a hack if we can get process then fix it.
  // development mode use load url, production mode use load file
  if (process.env.NODE_ENV == "development") {
    return win.loadURL(APP_URL + "/index");
  } else {
    return win.loadFile("./vite-build/index.html");
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
  let serviceLs = null;
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
      const binaryPath = path.join(__dirname, "/sharing-pkg/" + SHARING_PKG[process.platform]);

      let params = [];
      if (shareType === SHARE_TYPE.CLIPBORAD) {
        let tmpPath = path.join(__dirname, '../');
        tmpPath = tmpPath.replace(/\s/g, '\\ ');
        params = ["--clipboard", `--tmpdir ${tmpPath}`];
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

      // console.log("execFile", binaryPath, params);
      serviceLs = execFile(binaryPath, params, { shell: true })
      serviceLs.stdout.on("data", function (data) {
        console.log("stdout: \r\n" + data);
        let dataStr = data.toString();
        if (dataStr.indexOf("link") >= 0) {
          let url = dataStr.match(/link:\s*(.*?)\s/)[1];
          reslove({ success: true, url });
        }
      });

      serviceLs.stderr.on("data", function (data) {
        console.log("stderr: " + data);
        if (data.indexOf("address already in use") !== -1) {
          reslove({ success: false, msg: "Failed: Port already in use" });
        } else {
          reslove({ success: false, msg: "Error: Service startup failed", err: data.toString() });
        }
      });

      serviceLs.on("exit", function (code) {
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

  ipcMain.handle("end-sharing", (event) => {
    return new Promise((reslove, reject) => {
      execFile("kill", [serviceLs.pid]);
      reslove();
    });
  });

  ipcMain.handle("copy", (event, conetnt) => {
    return new Promise((reslove, reject) => {
      clipboard.writeText(conetnt);
      reslove();
    });
  });
};
