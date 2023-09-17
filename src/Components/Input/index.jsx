import clsx from "clsx";
import "./index.css";

function Input(props) {
  const { icon, className, ..._props } = props;
  return (
    <div className="input-box">
      <input className={clsx(className, icon && "input-icon")} {..._props} />
      {icon}
    </div>
  );
}

export default Input;
