import { ParticipantStore } from "@/types/types";
import { create } from "zustand";

export const useParticipantStore = create<ParticipantStore>((set) => ({
  participants: [],
  setParticipants: (participants) => set({ participants }),
}));