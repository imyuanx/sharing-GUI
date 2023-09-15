import "./index.css";

function Radio(props = { cehcked: false }) {
  const { cehcked, onClick } = props;

  const onClickHandle = () => {
    if (!cehcked) {
      onClick(true);
    }
  };

  return (
    <div className="radio" onClick={onClickHandle}>
      {cehcked && <div className="checked" />}
    </div>
  );
}

export default Radio;
