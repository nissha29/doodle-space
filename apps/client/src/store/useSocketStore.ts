import { WS_URL } from "@/config";
import { SocketStore } from "@/types/types";
import { create } from "zustand";

export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    connect: (roomId: number, token: string) => {
        if (get().socket) return;

        const ws = new WebSocket(`${WS_URL}?token=${token}`);
    
        ws.onopen = () => {
            console.log(ws);
            set({ socket: ws });
            const data = JSON.stringify({
                type: "joinRoom",
                roomId
            });
            console.log(data);
            ws.send(data);
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