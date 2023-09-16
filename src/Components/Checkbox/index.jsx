import { useState } from "react";
import { ReactComponent as CheckboxSvg } from "@/icons/checkout.svg";
import "./index.css";

function Checkbox({ defaultChecked = false, onClick = () => {} }) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const onClickHandle = () => {
    setIsChecked(!isChecked);
    onClick(!isChecked);
  };

  return (
    <div
      className={`checkbox ${isChecked ? "checked" : ""}`}
      onClick={onClickHandle}
    >
      {isChecked && <CheckboxSvg />}
    </div>
  );
}

export default Checkbox;
