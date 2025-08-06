import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SetStateAction } from "react";
import { StoreApi, UseBoundStore } from "zustand";
import { Dimension, Shape } from "@repo/common/types";

export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className: string;
}

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

export type ToolType = 'rectangle' | 'circle' | 'diamond' | 'arrow' | 'line' | 'pencil' | 'text' | 'eraser' | 'pan' | 'select'

export type ShapeTypeStore = {
  activeTool: ToolType;
  setActive: (shapeType: ToolType) => void;
}

export type CurrentCanvasStore = {
  currentCanvas: Shape[][];
  setCurrentCanvas: (updater: Shape[][] | ((prev: Shape[][]) => Shape[][])) => void;
};

export type IndexStore = {
  index: number,
  setIndex: (updater: number | ((prev: number) => number)) => void;
}
export interface ShapeStore {
  shapes: Shape[];
  setShapes: (shapes: SetStateAction<Shape[]>) => void;
}
export type Action = 'none' | 'move' | 'draw' | 'resize' | 'erase' | 'pan'

export type TextInput = { cords: Dimension, value: string };

export type Participant = {
  id: string,
  name: string,
}

export interface ParticipantStore {
  participants: Participant[],
  setParticipants: (participants: Participant[]) => void; 
}

export enum SocketStatus {
  'connecting',
  'connected',
  'disconnected',
}

export interface SocketStatusStore {
  socketStatus: SocketStatus,
  setSocketStatus: (status: SocketStatus) => void,
}