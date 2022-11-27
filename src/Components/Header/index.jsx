import "./index.css";

function Header() {
  // 打开新窗口
  const openDefaultBrowser = function (url) {
    window.electronAPI.emit("open-url", url);
  };
  const onClickHandle = () => {
    openDefaultBrowser("https://github.com/yunying1/sharing-GUI");
  };

  return (
    <div className="header">
      <div className="title">Sharing GUI</div>
      <svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="github-icon"
        onClick={onClickHandle}
      >
        <path
          d="M7.99997 0.894745C6.10036 0.894817 4.26276 1.51497 2.81597 2.64423C1.36919 3.7735 0.40762 5.33819 0.103328 7.05834C-0.200964 8.77848 0.171875 10.5418 1.15513 12.0329C2.13839 13.5239 3.66791 14.6453 5.47 15.1965C5.87 15.2607 6.01999 15.0406 6.01999 14.8479C6.01999 14.6736 6.00999 14.0956 6.00999 13.481C3.99999 13.8204 3.48 13.0315 3.32 12.6187C3.14246 12.2172 2.86102 11.8614 2.5 11.5821C2.22001 11.4445 1.82001 11.105 2.49 11.0959C2.74582 11.1213 2.99119 11.203 3.2053 11.334C3.41942 11.4649 3.59597 11.6413 3.72 11.8481C3.82941 12.0284 3.97654 12.1872 4.15294 12.3152C4.32935 12.4433 4.53157 12.5382 4.74801 12.5944C4.96446 12.6506 5.19087 12.6672 5.41429 12.643C5.6377 12.6188 5.85372 12.5544 6.04996 12.4536C6.0846 12.0805 6.26585 11.7316 6.55998 11.472C4.77999 11.2885 2.92 10.6555 2.92 7.84841C2.90876 7.11902 3.20215 6.41334 3.74 5.87607C3.49542 5.24215 3.52404 4.54646 3.81999 3.93125C3.81999 3.93125 4.48997 3.7386 6.01998 4.68349C7.329 4.35322 8.71093 4.35322 10.02 4.68349C11.5499 3.72943 12.2199 3.93125 12.2199 3.93125C12.5159 4.54645 12.5445 5.24215 12.2999 5.87607C12.8394 6.41242 13.133 7.11872 13.1199 7.84841C13.1199 10.6647 11.2499 11.2885 9.46995 11.472C9.66087 11.6495 9.80791 11.8627 9.90109 12.0969C9.99426 12.3312 10.0314 12.5811 10.01 12.8297C10.01 13.8113 9.99994 14.6002 9.99994 14.8479C9.99994 15.0406 10.1499 15.2699 10.5499 15.1965C12.3489 14.6409 13.874 13.5168 14.853 12.025C15.8321 10.5332 16.2014 8.77076 15.895 7.05228C15.5886 5.33381 14.6265 3.77115 13.1803 2.64325C11.7341 1.51536 9.89812 0.895651 7.99997 0.894745V0.894745Z"
          fill="black"
        />
      </svg>
    </div>
  );
}

export default Header;
