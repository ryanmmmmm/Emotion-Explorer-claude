/**
 * Player Types
 * Character profile, avatar customization, and game progress
 */

import { EmotionProgress, EmotionPower, EmotionType } from './emotion.types';

export interface PlayerProfile {
  id: string;
  name: string;
  age: number;
  ageGroup: 'Teen (12-18)' | 'Adult (18+)';
  avatar: AvatarCustomization;
  companionName?: string;
  createdAt: Date;
  lastPlayed: Date;
}

export interface AvatarCustomization {
  bodyType: BodyType;
  skinTone: string; // Hex color
  hairStyle: HairStyle;
  hairColor: string; // Hex color or fantasy color name
  faceShape: FaceShape;
  eyeShape: EyeShape;
  eyeColor: string; // Hex color
  outfit: OutfitType;
  accessories: string[];
  emotionalCrystalColor?: string;
}

export type BodyType =
  | 'slender'
  | 'athletic'
  | 'average'
  | 'curvy'
  | 'plus-size'
  | 'broad'
  | 'very-slender'
  | 'androgynous';

export type HairStyle =
  | 'pixie'
  | 'cropped'
  | 'undercut'
  | 'bob'
  | 'shoulder-length'
  | 'wavy'
  | 'straight-long'
  | 'curly-long'
  | 'braided'
  | 'ponytail'
  | 'locs'
  | 'afro'
  | 'bun'
  | 'shaved'
  | 'mohawk';

export type FaceShape =
  | 'round'
  | 'oval'
  | 'heart'
  | 'square'
  | 'diamond'
  | 'long';

export type EyeShape =
  | 'almond'
  | 'round'
  | 'hooded'
  | 'upturned'
  | 'downturned'
  | 'monolid'
  | 'close-set'
  | 'wide-set';

export type OutfitType = 'wanderer' | 'scholar' | 'guardian' | 'free-spirit';

export interface GameProgress {
  playerId: string;
  emotionsExplored: EmotionProgress[];
  totalPlayTime: number; // milliseconds
  companionBondLevel: number; // 1-4
  powersUnlocked: EmotionPower[];
  achievements: Achievement[];
  currentSession?: SessionState;
  lastSavedAt: Date;
}

export interface SessionState {
  emotionId: EmotionType;
  currentModule: number; // 1-9
  startedAt: Date;
  lastSavedAt: Date;
  moduleData: any; // ModuleData from emotion.types
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
  icon: string;
  category: 'exploration' | 'wisdom' | 'power' | 'bond' | 'completion';
}

export const SKIN_TONES = [
  { name: 'Very Light', value: '#FFDFC4' },
  { name: 'Light', value: '#F0C5A0' },
  { name: 'Light Medium', value: '#D4A373' },
  { name: 'Medium', value: '#C68642' },
  { name: 'Medium Dark', value: '#A67B5B' },
  { name: 'Dark', value: '#8D5524' },
  { name: 'Very Dark', value: '#5C4033' },
  { name: 'Deep', value: '#3D2817' },
  { name: 'Ethereal Light', value: '#FFF0E8' },
  { name: 'Golden', value: '#E8C5A0' },
  { name: 'Warm Beige', value: '#D4AC86' },
  { name: 'Rich Brown', value: '#6F4E37' },
];

export const HAIR_COLORS = [
  // Natural
  { name: 'Black', value: '#1C1C1C', category: 'natural' },
  { name: 'Dark Brown', value: '#3B2621', category: 'natural' },
  { name: 'Brown', value: '#5C4033', category: 'natural' },
  { name: 'Light Brown', value: '#8B7355', category: 'natural' },
  { name: 'Blonde', value: '#E6CC7F', category: 'natural' },
  { name: 'Platinum', value: '#F5F5DC', category: 'natural' },
  { name: 'Red', value: '#A62C2C', category: 'natural' },
  { name: 'Auburn', value: '#8B3E2F', category: 'natural' },
  { name: 'Gray', value: '#B8B8B8', category: 'natural' },
  { name: 'White', value: '#F0F0F0', category: 'natural' },
  // Fantasy
  { name: 'Midnight Blue', value: '#191970', category: 'fantasy' },
  { name: 'Deep Purple', value: '#663399', category: 'fantasy' },
  { name: 'Silver', value: '#C0C0C0', category: 'fantasy' },
  { name: 'Rose Pink', value: '#FF69B4', category: 'fantasy' },
  { name: 'Teal', value: '#008B8B', category: 'fantasy' },
  { name: 'Lavender', value: '#E6E6FA', category: 'fantasy' },
  { name: 'Mint Green', value: '#98FF98', category: 'fantasy' },
  { name: 'Sunset Orange', value: '#FF8C00', category: 'fantasy' },
];

export const EYE_COLORS = [
  { name: 'Brown', value: '#5C4033' },
  { name: 'Dark Brown', value: '#3B2621' },
  { name: 'Hazel', value: '#8E7618' },
  { name: 'Green', value: '#2E8B57' },
  { name: 'Blue', value: '#4682B4' },
  { name: 'Gray', value: '#708090' },
  { name: 'Amber', value: '#FFBF00' },
  { name: 'Violet', value: '#8B008B' },
  { name: 'Teal', value: '#008080' },
  { name: 'Gold', value: '#FFD700' },
];
