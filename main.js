const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const open = require("open");
const { exec, execFile, spawn } = require("child_process");
const pkg = require("./package.json");
const APP_URL = `http://${pkg.env.SERVER_HOST}:${pkg.env.SERVER_PORT}`;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 540,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
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
  if (process.platform !== "darwin") app.quit();
});

const ipcInit = () => {
  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  });

  ipcMain.on("open-url", (event, url) => {
    open(url);
  });

  ipcMain.handle("sharing", (event, targetPath) => {
    return new Promise((reslove, reject) => {
      // TODO: Platform judgment
      // const binaryPath = path.join(__dirname, "./sharing-pkg/easy-sharing-macos");
      const binaryPath = "./sharing-pkg/easy-sharing-macos";

      var ls = spawn(binaryPath, [targetPath], {
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
};
