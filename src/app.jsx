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
  const [publicIP, setPublicIP] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /**
   * @desc start service
   */
  const onStartServiceHandle = () => {
    console.log("onStartServiceHandle", directoryPath, port);
    if (shareType !== SHARE_TYPE.CLIPBORAD && !directoryPath) {
      alert("Please select a directory!");
      return;
    }
    const params = { directoryPath, port, publicIP, username, password };
    window.electronAPI
      .emit("sharing", { type: shareType, params })
      .then((res) => {
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

  /**
   * @desc change public IP
   */
  const onpublicIPChange = (e) => {
    const publicIP = e.target.value;
    setPublicIP(publicIP);
  };

  /**
   * @desc change username
   */
  const onUsernameChange = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  /**
   * @desc change password
   */
  const onPasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
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
                  className="input input-port"
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
                className="input input-port"
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
                  className="input input-port"
                  placeholder="Default"
                  onChange={onPortChange}
                ></Input>
              </div>
            </>
          )}
        </div>
        <div className="from-group">
          <div className="form-item">
            <label>Public IP</label>
            <Input
              className="input"
              placeholder="Public IP address"
              onChange={onpublicIPChange}
            ></Input>
          </div>
        </div>
        <div className="from-group">
          <div className="form-item form-many-item">
            <div className="form-item-sub-item">
              <label>Username</label>
              <Input
                className="input"
                placeholder="No by default"
                onChange={onUsernameChange}
              ></Input>
            </div>
            <div className="form-item-sub-item">
              <label>Password</label>
              <Input
                className="input"
                placeholder="No by default"
                onChange={onPasswordChange}
              ></Input>
            </div>
          </div>
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
