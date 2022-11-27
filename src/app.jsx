import { useState } from "react";
import QRCode from "qrcode/lib/browser";
import "./app.css";
import Header from "./Components/Header";
import Input from "./Components/Input";
import Radio from "./Components/Radio";
import Button from "./Components/Button";

const SHARE_TYPE = {
  DIRECTORY: 0,
  CLIPBORAD: 1,
  RECEIVE: 2,
};

const App = () => {
  const [qrcodeImg, setQrcodeImg] = useState("");
  const [shareType, setShareType] = useState(SHARE_TYPE.DIRECTORY);
  const [directoryPath, setDirectoryPath] = useState("");
  const [port, setPort] = useState("");

  /**
   * @desc start service
   */
  const onStartServiceHandle = () => {
    console.log("onStartServiceHandle", directoryPath, port);
    const params = { directoryPath, port };
    window.electronAPI.emit("sharing", { type: shareType, params }).then((res) => {
      QRCode.toDataURL(res).then((res) => {
        setQrcodeImg(res);
      });
    });
  };

  /**
   * @desc radio click event
   * @param {Number} shareType
   */
  const onRadioClickHandle = (shareType) => {
    setShareType(shareType);
  };

  /**
   * @desc select share directory
   */
  const onSelectShareDirectory = () => {
    window.electronAPI
      .emit(
        "select-directory",
        "/Users/yuanx/Desktop/workspace/program/sharing-GUI/main.js"
      )
      .then((res) => {
        if (!res.canceled) {
          console.log("select dir:", res.filePaths);
          if (res?.filePaths && res.filePaths.length > 0) {
            setDirectoryPath(res.filePaths[0]);
          }
        }
      });
  };

  /**
   * @desc change default port
   */
  const onPortChange = (e) => {
    const port = e.target.value;
    setPort(port);
  };

  return (
    <div className="app">
      <Header />
      <div className="content">
        <div className="from-group">
          <div className="form-item">
            <Radio
              cehcked={shareType === SHARE_TYPE.DIRECTORY}
              onClick={() => onRadioClickHandle(SHARE_TYPE.DIRECTORY)}
            />
            <div>Share Directory</div>
          </div>
          {shareType === SHARE_TYPE.DIRECTORY && (
            <>
              <div className="form-item form-item-item">
                <div>Directory</div>
                {directoryPath && <p className="text-path">{directoryPath}</p>}
                <Button
                  className="btn"
                  size="small"
                  onClick={onSelectShareDirectory}
                >
                  {directoryPath ? "Change Directory" : "Select Directory"}
                </Button>
              </div>
              <div className="form-item form-item-item">
                <div>Port</div>
                <Input
                  className="input"
                  placeholder="Default"
                  onChange={onPortChange}
                ></Input>
              </div>
            </>
          )}
          <div className="form-item">
            <Radio
              cehcked={shareType === SHARE_TYPE.CLIPBORAD}
              onClick={() => onRadioClickHandle(SHARE_TYPE.CLIPBORAD)}
            />
            <div>Share Clipborad</div>
          </div>
          {shareType === SHARE_TYPE.CLIPBORAD && (
            <div className="form-item form-item-item">
            <div>Port</div>
            <Input
              className="input"
              placeholder="Default"
              onChange={onPortChange}
            ></Input>
          </div>
          )}
          <div className="form-item">
            <Radio
              cehcked={shareType === SHARE_TYPE.RECEIVE}
              onClick={() => onRadioClickHandle(SHARE_TYPE.RECEIVE)}
            />
            <div>Rective files to directory</div>
          </div>
          {shareType === SHARE_TYPE.RECEIVE && (
            <>
              <div className="form-item form-item-item">
                <div>Directory</div>
                {directoryPath && <p className="text-path">{directoryPath}</p>}
                <Button
                  className="btn"
                  size="small"
                  onClick={onSelectShareDirectory}
                >
                  {directoryPath ? "Change Directory" : "Select Directory"}
                </Button>
              </div>
              <div className="form-item form-item-item">
                <div>Port</div>
                <Input
                  className="input"
                  placeholder="Default"
                  onChange={onPortChange}
                ></Input>
              </div>
            </>
          )}
        </div>
        <div style={{ flex: 1 }}></div>
        <Button onClick={onStartServiceHandle} className="btn btn-start">
          Start Service
        </Button>
      </div>
      <img src={qrcodeImg} />
    </div>
  );
};

export default App;
