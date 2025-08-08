"use client";

import { IButton } from "@/types/types";

const Button = ({ children, className, ...rest }: IButton) => {
  return (
    <button
      className={`bg-white text-black rounded-xl w-[15.8rem] sm:w-full py-2 text-xl hover:cursor-pointer disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;