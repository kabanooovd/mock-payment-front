import { useRef } from "react";
import "./ExpirationDate.css";
import { Input } from '../Input';

interface IProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const maskExpiryDate = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length === 0) return "";

  let month = digits.slice(0, 2);
  if (month.length === 2) {
    const monthNum = parseInt(month, 10);
    if (monthNum > 12) month = "12";
    if (monthNum < 1 && month !== "00") month = "01";
  }

  let formatted = month;
  if (digits.length >= 3) {
    const yearPart = digits.slice(2, 4);
    formatted = `${month} / ${yearPart}`;
  } else if (digits.length === 2) {
    formatted = month;
  }

  return formatted;
};

export const ExpirationDate = (props: IProps) => {
  const { label, value, onChange } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskExpiryDate(e.target.value);
    onChange(masked);
  };

  return (
    <div className="ExpirationDate_container">
      <div className="ExpirationDate_label">
        <span>{label}</span>
      </div>
      <div className="ExpirationDate_inputWrapper">
        <Input
          ref={inputRef}
          className="ExpirationDate_input"
          type="text"
          value={value}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};
