import "./index.css";

function Button(props) {
  const { children, ...args } = props;
  return <div className='button' {...args}>{children}</div>;
}

export default Button;
