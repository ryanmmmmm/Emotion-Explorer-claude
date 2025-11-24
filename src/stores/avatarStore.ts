import { create } from 'zustand';

interface AvatarStore {
  isAvatarCreatorOpen: boolean;
  avatarUrl: string | null;
  openAvatarCreator: () => void;
  closeAvatarCreator: () => void;
  setAvatarUrl: (url: string) => void;
}

export const useAvatarStore = create<AvatarStore>((set) => ({
  isAvatarCreatorOpen: false,
  avatarUrl: null,

  openAvatarCreator: () => set({ isAvatarCreatorOpen: true }),
  closeAvatarCreator: () => set({ isAvatarCreatorOpen: false }),
  setAvatarUrl: (url: string) => set({ avatarUrl: url }),
}));

// Global helper for Phaser scenes
export const openAvatarCreator = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const store = useAvatarStore.getState();
    store.openAvatarCreator();

    // Set up one-time listener for avatar creation
    const unsub = useAvatarStore.subscribe((state) => {
      if (!state.isAvatarCreatorOpen && state.avatarUrl) {
        resolve(state.avatarUrl);
        unsub();
      }
    });
  });
};
