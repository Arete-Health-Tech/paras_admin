import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  name: string;
  value: any;
  onChange: any;
  validator?: ((value: string) => boolean) | undefined;
  placeholder: string;
  size: 'small' | 'medium' | undefined;
  errorMessage?: string;
  setInvalidCount: any;
}

const InputField = ({
  name,
  onChange,
  value,
  validator,
  errorMessage,
  placeholder,
  size,
  setInvalidCount
}: Props) => {
  const [isValid, setIsValid] = useState(true);
  useEffect(() => {
    if (validator) {
      setIsValid((prev) => {
        const curr = validator(value);
        if (prev !== curr) {
          setInvalidCount((prev: number) => (curr ? prev - 1 : prev + 1));
        }
        return curr;
      });
    }
  }, [validator, value, setInvalidCount]);
  return (
    <TextField
      name={name}
      error={!isValid}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      size={size}
      helperText={!isValid ? errorMessage : null}
    />
  );
};

export default InputField;
