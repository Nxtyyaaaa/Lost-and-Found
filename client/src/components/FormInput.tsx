import { FC } from 'react';

type FormInputProps = {
  label?: string;
  name: string;
  type: string;
  Icon?: React.ComponentType;
};

const FormInput: FC<FormInputProps> = ({ label, name, type, Icon }) => {
  return (
    <label
      htmlFor={name}
      className="input input-bordered flex items-center gap-2 input-primary w-full"
    >
      {Icon && <Icon />}
      <input
        type={type}
        name={name}
        id={name}
        className="grow"
        placeholder={label || ''}
      />
    </label>
  );
};

export default FormInput;
