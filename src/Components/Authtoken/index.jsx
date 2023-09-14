import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../Input";
import Button from "../Button";
import HelpIcon from "../HelpIcon";
import { ReactComponent as DeleteSvg } from "../../icons/delete.svg";
import "./index.css";

function Authtoken({ onColse }) {
  const { t } = useTranslation();
  const [authtoken, setAuthtoken] = useState("");

  useEffect(() => {
    const authtoken = localStorage.getItem("authtoken");
    authtoken && setAuthtoken(authtoken);
  }, []);

  const saveAuthtoken = () => {
    localStorage.setItem("authtoken", authtoken);
  };

  const onChange = (e) => {
    setAuthtoken(e.target.value);
  };

  const onClean = () => {
    setAuthtoken("");
  };

  const _onCancel = () => {
    onColse();
  };

  const _onConfirm = () => {
    saveAuthtoken();
    onColse();
  };

  const onHelp = () => {
    console.log("on help");
  };

  return (
    <div className="authtoken">
      <div className="authtoken-content">
        <div className="authtoken-header" onClick={onHelp}>
          <div className="authtoken-header-title">
            {t("Your Authtoken")}
            <HelpIcon className="authtoken-header-help" />
          </div>
        </div>
        <div className="authtoken-input-box">
          <Input
            className="authtoken-input"
            placeholder={t("Enter your Authtoken")}
            value={authtoken}
            onChange={onChange}
          />
          <DeleteSvg className="trash-icon" onClick={onClean} />
        </div>
        <div className="btn-group">
          <Button className="authtoken-btn" ghost onClick={_onCancel}>
            {t("Cancel")}
          </Button>
          <Button className="authtoken-btn" onClick={_onConfirm}>
            {t("Confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Authtoken;
