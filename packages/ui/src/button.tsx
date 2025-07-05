"use client";

import { ReactNode } from "react";

interface IButton {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button = ({ children, className }: IButton) => {
  return (
    <button
      className={`bg-white text-black rounded-xl w-80 sm:w-full py-2 text-xl ${className}`}
      onClick={() => {}}
    >
      {children}
    </button>
  );
};
