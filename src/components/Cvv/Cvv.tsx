import { useRef } from "react";
import "./Cvv.css";
import { Input } from '../Input';

interface IProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const maskCvv = (value: string, maxLength: number = 3): string => {
  return value.replace(/\D/g, "").slice(0, maxLength);
};

export const Cvv = (props: IProps) => {
  const { label, value, onChange } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCvv(e.target.value);
    onChange(masked);
  };

  return (
    <div className="Cvv_container">
      <div className="Cvv_label">
        <span>{label}</span>
      </div>
      <div className="Cvv_inputWrapper">
        <Input
          ref={inputRef}
          className="Cvv_input"
          type="text"
          value={value}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};
