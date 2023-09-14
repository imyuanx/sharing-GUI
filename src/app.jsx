import { useRef, useState } from "react";
import QRCode from "qrcode/lib/browser";
import { useTranslation, Trans } from "react-i18next";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import "./app.css";
import Header from "./Components/Header";
import Input from "./Components/Input";
import Radio from "./Components/Radio";
import Button from "./Components/Button";
import Tips from "./Components/Tips";
import Checkbox from "./Components/Checkbox";
import Authtoken from "./Components/Authtoken";
import HelpIcon from "./Components/HelpIcon";
import { ReactComponent as ClipSvg } from "./icons/clip.svg";
import { ReactComponent as CloseSvg } from "./icons/close.svg";

const SHARE_TYPE = {
  SHARE: 0,
  CLIPBORAD: 1,
  RECEIVE: 2,
};

const App = () => {
  const { t } = useTranslation();
  const [qrcodeImg, setQrcodeImg] = useState("");
  const [shareType, setShareType] = useState(SHARE_TYPE.SHARE);
  const [sharePathList, setSharePathList] = useState([]);
  const [receivePath, setReceivePath] = useState("");
  const [port, setPort] = useState("");
  const [publicIP, setPublicIP] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [serviceUrl, setServiceUrl] = useState("");
  const [isShowCopyTips, setIsShowCopyTips] = useState(false);
  const [isShowAuthtokenTips, setIsShowAuthtokenTips] = useState(false);
  const [isStaring, setIsStaring] = useState(false);
  const [isDragEnter, setIsDragEnter] = useState(false);
  const [ngrok, setNgrok] = useState(false);
  const [manageAuthtoken, setManageAuthtoken] = useState(false);
  const countRef = useRef(0);

  /**
   * @desc start service
   */
  const onStartServiceHandle = () => {
    if (shareType !== SHARE_TYPE.CLIPBORAD) {
      if (shareType === SHARE_TYPE.SHARE && sharePathList.length <= 0) {
        alert(t("Select at least one directory or file"));
        return;
      }
      if (shareType === SHARE_TYPE.RECEIVE && !receivePath) {
        alert(t("Please select a directory!"));
        return;
      }
    }
    setIsStaring(true);

    const pathList =
      shareType === SHARE_TYPE.SHARE ? sharePathList : [receivePath];
    let params = {
      pathList,
      port,
      publicIP,
      username,
      password,
    };
    if (ngrok) {
      const authtoken = localStorage.getItem("authtoken");
      if (!authtoken) {
        setIsShowAuthtokenTips(true);
        setTimeout(() => {
          setIsShowAuthtokenTips(false);
        }, 2000);
        setIsStaring(false);
        setManageAuthtoken(true);
        return;
      }
      params.ngrok = authtoken;
    }
    window.electronAPI.emit("sharing", { type: shareType, params }).then(
      (res) => {
        if (res.success) {
          setIsStaring(false);
          setIsStarted(true);
          setServiceUrl(res.url);
          QRCode.toDataURL(res.url).then((res) => {
            setQrcodeImg(res);
          });
        } else {
          alert(res.msg);
          setIsStaring(false);
        }
      },
      (err) => {
        alert(err);
        setIsStaring(false);
      }
    );
  };

  /**
   * @desc end service
   */
  const onEndServiceHandle = () => {
    window.electronAPI.emit("end-sharing").then((res) => {
      setIsStarted(false);
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
   * @desc select share directories or files
   */
  const onSelectSharePath = () => {
    window.electronAPI.emit("select-path").then((res) => {
      if (res.canceled) return;
      // console.log("select dir:", res.filePaths);
      if (res?.filePaths && res.filePaths.length > 0) {
        const filePaths = res.filePaths[0];
        setSharePathList([...sharePathList, filePaths]);
      }
    });
  };

  /**
   * @desc select receive directory
   */
  const onSelectReceiveDirectory = () => {
    window.electronAPI.emit("select-path", null, true).then((res) => {
      if (res.canceled) return;
      // console.log("select dir:", res.filePaths);
      if (res?.filePaths && res.filePaths.length > 0) {
        const filePaths = res.filePaths[0];
        setReceivePath(filePaths);
      }
    });
  };

  /**
   * @desc Remove path from the path list.
   * @param {String} path
   */
  const removePath = (path) => {
    const _sharePathList = sharePathList.filter(
      (pathItem) => pathItem !== path
    );
    setSharePathList(_sharePathList);
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

  const ClipIcon = (props) => {
    return (
      <div className="clip-icon" {...props}>
        <ClipSvg />
        {/* <img src={clipSvg} /> */}
      </div>
    );
  };

  /**
   * @desc copy service url
   */
  const onCopyUrlHandle = () => {
    window.electronAPI.emit("copy", serviceUrl);
    setIsShowCopyTips(true);
    setTimeout(() => {
      setIsShowCopyTips(false);
    }, 2000);
  };

  /**
   * @desc Drag enter handle
   */
  const onDragEnterHandle = (e) => {
    setIsDragEnter(true);
  };

  /**
   * @desc Drop handle
   */
  const onDropHandle = (e) => {
    setIsDragEnter(false);
    const files = e.dataTransfer.files;
    // console.log("e.dataTransfer.files", e.dataTransfer.files);
    if (files.length <= 0) return;

    if (shareType === SHARE_TYPE.SHARE) {
      let paths = [];
      for (let i = 0; i < files.length; i++) {
        const path = files[i]?.path;
        if (sharePathList.includes(path)) continue;
        paths.push(path);
      }
      setSharePathList([...sharePathList, ...paths]);
    }
    if (shareType === SHARE_TYPE.RECEIVE) {
      window.electronAPI
        .emit("path-to-dir-path", files[0]?.path)
        .then((dirPath) => {
          setReceivePath(dirPath);
        });
    }
  };

  /**
   * @desc Drag leave handle
   */
  const onDragLeaveHandle = (e) => {
    setIsDragEnter(false);
  };

  /**
   * @desc Drag events entry
   */
  const fileDrop = (e) => {
    if (shareType === SHARE_TYPE.CLIPBORAD || isStarted) return;
    if (e.type === "dragenter") {
      e.preventDefault();
      countRef.current++;
      if (countRef.current % 2) {
        onDragEnterHandle(e);
      }
    }
    if (e.type === "dragleave") {
      countRef.current++;
      if (!(countRef.current % 2)) {
        onDragLeaveHandle(e);
        countRef.current = 0;
      }
    }
    if (e.type === "dragover") {
      e.preventDefault();
    }
    if (e.type === "drop") {
      countRef.current = 0;
      onDropHandle(e);
    }
  };

  const onAuthtokenColse = () => {
    setManageAuthtoken(false);
  };

  /**
   * @desc click the use ngrok
   */
  const onClickNgrok = (checked) => {
    setNgrok(checked);
    if (checked && !localStorage.getItem("authtoken")) {
      setIsShowAuthtokenTips(true);
      setTimeout(() => setIsShowAuthtokenTips(false), 2000);
      setManageAuthtoken(true);
    }
  };

  return (
    <div
      className={`app ${isDragEnter ? "child-disable-event" : ""}`}
      onDragEnter={fileDrop}
      onDragLeave={fileDrop}
      onDragOver={fileDrop}
      onDrop={fileDrop}
    >
      <Header />
      {!isStarted && (
        <div className="content">
          {isShowAuthtokenTips && (
            <Tips title={t("An authtoken must be provided to use ngrok!")} />
          )}
          <div className="from-group">
            <div className="form-item">
              <Radio
                cehcked={shareType === SHARE_TYPE.SHARE}
                onClick={() => onRadioClickHandle(SHARE_TYPE.SHARE)}
              />
              <div>{t("Share Directories / Files")}</div>
            </div>
            {shareType === SHARE_TYPE.SHARE && (
              <>
                <div className="form-item form-item-item">
                  <div>
                    <span className="required-symbol">*</span>
                    {t("Directories / Files")}
                  </div>
                  {sharePathList.length > 0 &&
                    sharePathList.map((path) => (
                      <div key={path} className="path-item">
                        <p className="text-path">{path}</p>
                        <div
                          className="close-icon-box"
                          onClick={() => removePath(path)}
                        >
                          <CloseSvg />
                          {/* <img src={closeSvg} /> */}
                        </div>
                      </div>
                    ))}
                  <Button
                    className="btn"
                    size="small"
                    onClick={onSelectSharePath}
                  >
                    {t("Add")}
                  </Button>
                </div>
                <div className="form-item form-item-item">
                  <div>{t("Port")}</div>
                  <Input
                    className="input input-port"
                    placeholder={t("Optional")}
                    value={port}
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
              <div>{t("Share Clipborad")}</div>
            </div>
            {shareType === SHARE_TYPE.CLIPBORAD && (
              <div className="form-item form-item-item">
                <div>{t("Port")}</div>
                <Input
                  className="input input-port"
                  placeholder={t("Optional")}
                  value={port}
                  onChange={onPortChange}
                ></Input>
              </div>
            )}
            <div className="form-item">
              <Radio
                cehcked={shareType === SHARE_TYPE.RECEIVE}
                onClick={() => onRadioClickHandle(SHARE_TYPE.RECEIVE)}
              />
              <div>{t("Receive files to directory")}</div>
            </div>
            {shareType === SHARE_TYPE.RECEIVE && (
              <>
                <div className="form-item form-item-item">
                  <div>
                    <span className="required-symbol">*</span>
                    {t("Directory")}
                  </div>
                  {receivePath && <p className="text-path">{receivePath}</p>}
                  <Button
                    className="btn"
                    size="small"
                    onClick={onSelectReceiveDirectory}
                  >
                    {receivePath ? t("Change") : t("Select")}
                  </Button>
                </div>
                <div className="form-item form-item-item">
                  <div>{t("Port")}</div>
                  <Input
                    className="input input-port"
                    placeholder={t("Optional")}
                    value={port}
                    onChange={onPortChange}
                  ></Input>
                </div>
              </>
            )}
          </div>
          <div className="from-group">
            <div className="form-item  form-many-item">
              <div
                className={`form-item-sub-item ${
                  ngrok ? "form-item-disable" : ""
                }`}
              >
                <label>{t("Public IP")}</label>
                <Input
                  className="input"
                  placeholder={`${t("Public IP")} (${t("Optional")})`}
                  onChange={onpublicIPChange}
                ></Input>
              </div>
              <div className="form-item-sub-item">
                <label>{t("Use ngrok")}</label>
                <div className="form-item-sub-item-checkbox">
                  <Checkbox defaultChecked={ngrok} onClick={onClickNgrok} />
                  <div
                    className="auth-token-btn"
                    onClick={() => setManageAuthtoken(true)}
                  >
                    {t("Manage Authtoken")}
                  </div>
                  <HelpIcon className="ngrok-help" />
                </div>
              </div>
            </div>
          </div>
          <div className="from-group">
            <div className="form-item form-many-item">
              <div className="form-item-sub-item">
                <label>{t("Username")}</label>
                <Input
                  className="input"
                  placeholder={t("Optional")}
                  onChange={onUsernameChange}
                ></Input>
              </div>
              <div className="form-item-sub-item">
                <label>{t("Password")}</label>
                <Input
                  className="input"
                  placeholder={t("Optional")}
                  onChange={onPasswordChange}
                ></Input>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}></div>
          <Button
            className="btn btn-start"
            onClick={onStartServiceHandle}
            isLoding={isStaring}
          >
            {t("Start Service")}
          </Button>
        </div>
      )}
      {isStarted && (
        <div className="result-content">
          {isShowCopyTips && <Tips title={t("Copied")} icon="check-mark" />}
          <img className="img-qrcode" src={qrcodeImg} />
          <Input
            className="input-result"
            value={serviceUrl}
            readOnly
            icon={<ClipIcon onClick={onCopyUrlHandle} />}
          />
          <Button className="btn-end" onClick={onEndServiceHandle}>
            {t("End Service")}
          </Button>
        </div>
      )}
      {isDragEnter && (
        <div className="drag-modal">
          <div className="drag-box">
            {shareType === SHARE_TYPE.SHARE
              ? t("Drag and drop directories / files to share")
              : t("Drag and drop directory to receive files")}
          </div>
        </div>
      )}
      {manageAuthtoken && <Authtoken onColse={onAuthtokenColse} />}
    </div>
  );
};

export default App;
