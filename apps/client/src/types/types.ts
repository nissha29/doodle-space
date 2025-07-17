import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { StoreApi, UseBoundStore } from "zustand";
import { Shape } from "@repo/common/types";

export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className: string;
}

export type ShapeStore = {
  existingShapes: Shape[];
  addShape: (shape: Shape) => void;
  setShapes: (shapes: Shape[]) => void;
};

export type CanvasInitParams = {
  canvas: HTMLCanvasElement,
  roomId: number,
  shapesStore: UseBoundStore<StoreApi<ShapeStore>>,
  socket: WebSocket | null
}

export type SocketStore = {
  socket: WebSocket | null;
  connect: (roomId: number, token: string) => void;
  disconnect: () => void;
};

export type User = {
  name: string;
  email: string;
};

export type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export interface ToolProps {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export type ToolType = 'rectangle' | 'circle' | 'diamond' | 'arrow' | 'line' | 'pencil' | 'text' | 'eraser' | 'hand' | 'select'

export type ShapeTypeStore = {
  activeTool: ToolType;
  setActive: (shapeType: ToolType) => void;
}

export type Action = 'none' | 'move' | 'draw' | 'resize'