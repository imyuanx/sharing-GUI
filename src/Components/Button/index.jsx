import { ReactComponent as LoadingSvg } from "@/icons/loading.svg";
import "./index.css";

function Button({ ghost, size, className, children, isLoding, ...args }) {
  return (
    <div
      className={`button ${size || ""} ${className} ${isLoding && "loading"} ${
        ghost && "button-ghost"
      }`}
      {...args}
    >
      {children}
      {isLoding && <LoadingSvg className="loading-icon" />}
    </div>
  );
}

export default Button;
