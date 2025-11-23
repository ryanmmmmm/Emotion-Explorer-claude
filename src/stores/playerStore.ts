/**
 * Player Store
 * Manages player profile and avatar customization
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayerProfile, AvatarCustomization } from '@/types';
import { db } from '@/services/storage/database';

interface PlayerState {
  profile: PlayerProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProfile: (profile: PlayerProfile) => Promise<void>;
  updateAvatar: (avatar: Partial<AvatarCustomization>) => Promise<void>;
  updateCompanionName: (name: string) => Promise<void>;
  loadProfile: (playerId: string) => Promise<void>;
  clearProfile: () => Promise<void>;
  createNewProfile: (
    name: string,
    age: number,
    avatar: AvatarCustomization
  ) => Promise<PlayerProfile>;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      setProfile: async (profile: PlayerProfile) => {
        try {
          await db.playerProfiles.put(profile);
          set({ profile, error: null });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to save profile';
          set({ error: errorMessage });
          console.error('Error saving profile:', error);
        }
      },

      updateAvatar: async (avatarUpdate: Partial<AvatarCustomization>) => {
        const { profile } = get();
        if (!profile) {
          set({ error: 'No profile loaded' });
          return;
        }

        const updatedProfile: PlayerProfile = {
          ...profile,
          avatar: { ...profile.avatar, ...avatarUpdate },
          lastPlayed: new Date(),
        };

        await get().setProfile(updatedProfile);
      },

      updateCompanionName: async (name: string) => {
        const { profile } = get();
        if (!profile) {
          set({ error: 'No profile loaded' });
          return;
        }

        const updatedProfile: PlayerProfile = {
          ...profile,
          companionName: name,
          lastPlayed: new Date(),
        };

        await get().setProfile(updatedProfile);
      },

      loadProfile: async (playerId: string) => {
        set({ isLoading: true, error: null });
        try {
          const profile = await db.playerProfiles.get(playerId);
          if (profile) {
            set({ profile, isLoading: false });
          } else {
            set({ error: 'Profile not found', isLoading: false });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to load profile';
          set({ error: errorMessage, isLoading: false });
          console.error('Error loading profile:', error);
        }
      },

      clearProfile: async () => {
        set({ profile: null, error: null });
      },

      createNewProfile: async (
        name: string,
        age: number,
        avatar: AvatarCustomization
      ): Promise<PlayerProfile> => {
        // Determine age bracket: Teen (12-18) or Adult (18+)
        const ageGroup = age < 18 ? 'Teen (12-18)' : 'Adult (18+)';

        const newProfile: PlayerProfile = {
          id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name,
          age,
          ageGroup,
          avatar,
          createdAt: new Date(),
          lastPlayed: new Date(),
        };

        await get().setProfile(newProfile);
        return newProfile;
      },
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);
