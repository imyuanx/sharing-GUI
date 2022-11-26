import { useState } from 'react';
import QRCode from 'qrcode/lib/browser';
import "./app.css";
import Header from "./Components/Header";
import Input from "./Components/Input";
import Checkbox from "./Components/Checkbox";
import Button from "./Components/Button";

const App = () => {
const [qrcodeImg, setQrcodeImg] = useState ('');

  const startServiceHandle = () => {
    console.log("startServiceHandle");
    window.electronAPI.emit('sharing', '~').then((res) => {
      QRCode.toDataURL(res).then((res) => {
          console.log(res);
          setQrcodeImg(res);
      });
      
    });
  };

  return (
    <div className="app">
      <Header />
      <div className="content">
        <div className="form-item">
          <label>Port:</label>
          <Input placeholder="Default"></Input>
        </div>
        <div className="form-item">
          <label>Public IP:</label>
          <Input></Input>
        </div>
        <div className="form-item">
          <label>Share Clipboard:</label>
          <Checkbox></Checkbox>
        </div>
        <div className="form-item">
          <label>Receive files:</label>
          <Checkbox></Checkbox>
        </div>
        <div className="form-item">
          <label>Receive Port:</label>
          <Input></Input>
        </div>
        <div className="form-item">
          <label>Username:</label>
          <Input></Input>
        </div>
        <div className="form-item">
          <label>Password:</label>
          <Input></Input>
        </div>
      </div>
      <Button onClick={startServiceHandle}>Start Service</Button>
      <img src={qrcodeImg} />
    </div>
  );
};

export default App;
