import "./index.css";

function Input(props) {
  const { icon, className, ..._props } = props;
  return (
    <div className="input-box">
      <input
        className={`${className} ${icon ? "input-icon" : ""}`}
        {..._props}
      ></input>
      {icon}
    </div>
  );
}

export default Input;
