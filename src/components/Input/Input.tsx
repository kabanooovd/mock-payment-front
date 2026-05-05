import classNames from 'classnames';
import { forwardRef } from "react";
import './Input.css'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, ...rest } = props;
  return <input ref={ref} className={classNames(className, 'Input_styles')} {...rest} />;
});
