/**
 * Zustand store for managing the state of the mobile sidebar.
 *
 * This store keeps track of whether the sidebar is open or closed (`isOpen`).
 * The `onOpen` function opens the sidebar, while the `onClose` function closes it.
 *
 * @returns {object} - The store contains the sidebar state and functions to open and close it.
 */

import { create } from 'zustand';

type MobileSidebarStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useMobileSidebar = create<MobileSidebarStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
