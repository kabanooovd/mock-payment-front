import { useRef } from "react";
import "./CardNumber.css";
import { Input } from '../Input';

interface IProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const maskCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const parts = digits.match(/.{1,4}/g) || [];
  return parts.join(" ").trim();
};

export const CardNumber = (props: IProps) => {
  const { label, value, onChange } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCardNumber(e.target.value);
    onChange(masked);
  };

  return (
    <div className="CardNumber_container">
      <div className="CardNumber_label">
        <span>{label}</span>
      </div>
      <div className="CardNumber_inputWrapper">
        <Input
          ref={inputRef}
          type="text"
          className="CardNumber_input"
          value={value}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};
