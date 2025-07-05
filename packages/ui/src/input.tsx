import { forwardRef } from "react";

interface IInput {
  name: string;
  type: string;
  placeholder: string;
  className: string;
  onChange?: () => void
}

const Input = forwardRef<HTMLInputElement, IInput>(
  ({ name, type, placeholder, className, onChange }, ref) => (
    <div className="flex flex-col gap-2">
      <div className="text-xl">{name}</div>
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`border border-neutral-400 p-2 rounded-xl text-xl ${className}`}
        onChange={onChange}
      />
    </div>
  )
);

Input.displayName = "Input";

export default Input;
