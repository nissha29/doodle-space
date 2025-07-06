import { IInput } from "@/types/types";

const Input = ({ label, className, ...rest }: IInput) => {
  return <div className="flex flex-col gap-2">
    <div className="text-xl">{label}</div>
    <input
      className={`border border-neutral-700 p-2 rounded-xl text-xl ${className}`}
      {...rest}
    />
  </div>
};

export default Input;
