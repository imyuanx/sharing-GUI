import { ReactComponent as CheckmarkSvg } from "@/icons/checkmark.svg";
import "./index.css";

function Tips({ title, icon }) {
  return (
    <div className="copy-tips">
      {title}
      {icon === "check-mark" && <CheckmarkSvg style={{ marginLeft: 4 }} />}
    </div>
  );
}

export default Tips;
