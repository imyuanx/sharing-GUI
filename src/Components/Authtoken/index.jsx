import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../Input";
import Button from "../Button";
import HelpIcon from "../HelpIcon";
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            className="trash-icon"
            onClick={onClean}
          >
            <path
              fill="#16A34A"
              d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6q-.425 0-.713-.287Q4 5.425 4 5t.287-.713Q4.575 4 5 4h4q0-.425.288-.713Q9.575 3 10 3h4q.425 0 .713.287Q15 3.575 15 4h4q.425 0 .712.287Q20 4.575 20 5t-.288.713Q19.425 6 19 6v13q0 .825-.587 1.413Q17.825 21 17 21ZM7 6v13h10V6Zm2 10q0 .425.288.712Q9.575 17 10 17t.713-.288Q11 16.425 11 16V9q0-.425-.287-.713Q10.425 8 10 8t-.712.287Q9 8.575 9 9Zm4 0q0 .425.288.712q.287.288.712.288t.713-.288Q15 16.425 15 16V9q0-.425-.287-.713Q14.425 8 14 8t-.712.287Q13 8.575 13 9ZM7 6v13V6Z"
            />
          </svg>
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
