import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export interface IError{
    message: string
}

export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className: string;
}