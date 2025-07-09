import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className: string;
}

export type Shape = {
  type: 'rect',
  x: number,
  y: number,
  width: number,
  height: number
} | {
  type: 'circle',
  radius: number,
  centreX: number,
  centreY: number
}

export type ShapeStore = {
  existingShapes: Shape[];
  addShape: (shape: Shape) => void;
  setShapes: (shapes: Shape[]) => void;
};

export type CanvasInitParams  = {
  canvas: HTMLCanvasElement,
  roomId: number,
  shapesStore: ShapeStore
}
