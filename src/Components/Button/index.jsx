import "./index.css";

function Button(props) {
  const { size, className, children, ...args } = props;
  return <div className={`button ${size || ""} ${className}`} {...args}>{children}</div>;
}

export default Button;
