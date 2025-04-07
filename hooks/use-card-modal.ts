/**
 * Zustand Store for Managing Card Modal State
 *
 * This store uses Zustand for managing the state of a card modal, including its open/close state
 * and the ID of the currently selected card. It provides functions to open and close the modal,
 * as well as set the current card's ID when the modal is opened.
 *  @returns {object} - The store contains the modal state and functions to open and close it.
 */
import { create } from 'zustand';

type CardModalStore = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useCardModal = create<CardModalStore>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
