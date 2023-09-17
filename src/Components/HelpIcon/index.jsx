import { Trans } from "react-i18next";
import clsx from "clsx";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import { ReactComponent as HelpSvg } from "@/icons/help.svg";
import "./index.css";

function HelpIcon({ className }) {
  const openUrl = (url) => {
    window.electronAPI.emit("open-url", url);
  };
  return (
    <Tippy
      content={
        <div className="auth-token-help">
          <Trans
            i18nKey="ngrok tips" // optional -> fallbacks to defaults if not provided
            components={{
              ngrok_a: (
                <a
                  href="https://ngrok.com/"
                  onClick={(e) => {
                    e.preventDefault();
                    openUrl("https://ngrok.com/");
                  }}
                />
              ),
              token_a: (
                <a
                  href="https://dashboard.ngrok.com/get-started/your-authtoken"
                  onClick={(e) => {
                    e.preventDefault();
                    openUrl(
                      "https://dashboard.ngrok.com/get-started/your-authtoken"
                    );
                  }}
                />
              ),
            }}
          />
        </div>
      }
      theme={"default"}
      maxWidth={360}
      interactive
    >
      <div className={clsx("help-icon", className)}>
        <HelpSvg />
      </div>
    </Tippy>
  );
}

export default HelpIcon;
