import { create } from "zustand";

type CoverImageType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useCoverImage = create<CoverImageType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
