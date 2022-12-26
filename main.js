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
const fs = require("fs");
const ngrok = require("ngrok-electron");
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

let serviceLs = null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 557,
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

app.on("quit", function () {
  endServices().then((res) => {
    console.log("app quit");
  });
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
      const binaryPath = path.join(
        __dirname,
        "/sharing-pkg/" + SHARING_PKG[process.platform]
      );

      let params = [];
      if (shareType === SHARE_TYPE.CLIPBORAD) {
        let tmpPath = path.join(__dirname, "../");
        tmpPath = tmpPath.replace(/\s/g, "\\ ");
        params = ["--clipboard", `--tmpdir ${tmpPath}`];
      } else {
        _params.pathList.map((path) => {
          const _path = path.replace(/\s/g, "\\ ");
          params.push(_path);
        });
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
      params.push("--dev");

      serviceLs = execFile(binaryPath, params, { shell: true });
      serviceLs.stdout.on("data", function (data) {
        console.log("stdout: \r\n" + data);
        try {
          const resData = JSON.parse(data);
          if (resData.success) {
            const linkInfo = resData.data.link;
            let url = `${linkInfo.protocol}://${linkInfo.host}:${linkInfo.port}${linkInfo.path}`;
            if (_params.ngrok) {
              useNgrok(_params.ngrok, linkInfo.port).then(
                (ngrokUrl) => {
                  url = `${ngrokUrl}${linkInfo.path}`;
                  reslove({ success: true, url });
                },
                (err) => {
                  reject(err);
                }
              );
            } else {
              reslove({ success: true, url });
            }
          } else {
            reject(resData.msg);
          }
        } catch (err) {
          // console.log("err", err);
          reject(err);
        }
      });

      serviceLs.stderr.on("data", function (data) {
        console.log("stderr: " + data);
        if (data.indexOf("address already in use") !== -1) {
          reslove({ success: false, msg: "Failed: Port already in use" });
        } else {
          reslove({
            success: false,
            msg: "Error: Service startup failed",
            err: data.toString(),
          });
        }
      });

      serviceLs.on("exit", function (code) {
        console.log("child process exited with code " + code);
      });
    });
  });

  // select directory or file path
  ipcMain.handle("select-path", (event, basePath, onlyDir) => {
    let properties = ["openFile", "openDirectory"];
    if (onlyDir) {
      properties = ["openDirectory"];
    }
    return dialog.showOpenDialog({ properties });
  });

  ipcMain.handle("end-sharing", endServices);

  ipcMain.handle("copy", (event, conetnt) => {
    return new Promise((reslove, reject) => {
      clipboard.writeText(conetnt);
      reslove();
    });
  });

  ipcMain.handle("path-to-dir-path", (event, targetPath) => {
    return new Promise((reslove, reject) => {
      fs.stat(targetPath, (err, stats) => {
        const isDir = stats.isDirectory();
        if (!isDir) {
          reslove(path.dirname(targetPath));
        }
        reslove(targetPath);
      });
    });
  });
};

/**
 * @desc stop sharing services
 * @param {*} event
 */
function endServices(event) {
  return new Promise((reslove, reject) => {
    serviceLs?.pid && execFile("kill", [serviceLs.pid]);
    ngrok.kill().then(() => {
      reslove();
    });
  });
}

/**
 * @desc use ngrok publish to public network
 * @param {String} authtoken
 * @param {Number} port
 */
function useNgrok(authtoken, port) {
  return new Promise((reslove, reject) => {
    try {
      ngrok
        .connect({
          authtoken,
          addr: port,
        })
        .then(
          (res) => {
            reslove(res);
          },
          (err) => {
            console.log("ngrok error:", err);
            reject(err);
          }
        );
    } catch (err) {
      reject(err);
    }
  });
}
