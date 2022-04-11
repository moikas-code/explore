import React from 'react';
interface p_Input {
  id?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder?: string;
  error?: string;
  min?: number;
  max?: number;
  pattern?: string;
  inputStyle?: string;
  accept?: string;
}
export default function Input({
  id,
  onChange,
  label,
  type,
  min,
  max,
  pattern = '',
  placeholder = '',
  inputStyle = '',
  accept = '',
}: p_Input) {
  return (
    <>
      <style jsx>{`
        input {
          min-height: 2.5rem;
        }
      `}</style>
      <label htmlFor={id} className={`text-capitalize`}>
        {label}
      </label>
      <input
        className={inputStyle}
        type={type}
        pattern={pattern}
        placeholder={placeholder}
        onChange={async (e) => {
          e.preventDefault();
          // console.log(e,type,type == 'number')
          type == 'number'
            ? onChange(e.target.value.match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$\d+/).join(''))
            : onChange(e);
        }}
        min={min}
        max={max}
        accept={accept}
        spellCheck
      />
    </>
  );
}
