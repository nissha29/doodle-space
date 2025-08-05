import { SocketStatus, SocketStatusStore } from "@/types/types";
import { create } from "zustand";

export const useSocketStatusStore = create<SocketStatusStore>((set) => ({
  socketStatus: SocketStatus.connecting,
  setSocketStatus: (status: SocketStatus) => set({ socketStatus: status }),
}));