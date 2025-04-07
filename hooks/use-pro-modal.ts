/**
 * Zustand store for managing the state of the Pro modal.
 *
 * This store keeps track of whether the Pro modal is open or closed (`isOpen`).
 * The `onOpen` function opens the Pro modal, while the `onClose` function closes it.
 *
 * @returns {object} - The store contains the modal state and functions to open and close it.
 */

import { create } from 'zustand';

type ProModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useProModal = create<ProModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
