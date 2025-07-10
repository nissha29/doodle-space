import { WS_URL } from "@/config";
import { SocketStore } from "@/types/types";
import { create } from "zustand";

export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    connect: (roomId: number, token: string) => {
        if (get().socket) return;

        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
            console.log("connected");
            set({ socket: ws });
            ws.send(JSON.stringify({
                type: 'joinRoom',
                roomId: roomId,
            }));
        };
    },
    disconnect: () => {
        const ws = get().socket;
        if (ws) {
            ws.close();
            set({ socket: null });
        }
    }
}))