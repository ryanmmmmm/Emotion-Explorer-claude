/**
 * Emotion Types
 * Core type definitions for the 16 emotions in the game
 */

export type EmotionType =
  | 'angry'
  | 'anxious'
  | 'scared'
  | 'jealous'
  | 'guilty'
  | 'forgiving'
  | 'joy'
  | 'lonely'
  | 'playful'
  | 'grateful'
  | 'other'
  | 'hopeful'
  | 'shameful'
  | 'sad'
  | 'stuck'
  | 'nervous';

export interface EmotionDefinition {
  id: EmotionType;
  name: string;
  color: string; // Hex color
  secondaryColor: string;
  accentColor: string;
  domainName: string; // e.g., "The Crimson Forge"
  description: string;
  companionDialogue: string;
  powers: EmotionPower[];
}

export interface EmotionPower {
  id: string;
  name: string;
  emotionId: EmotionType;
  description: string;
  unlockedAtModule: number; // 1-9
  level: 1 | 2 | 3 | 4; // Novice, Apprentice, Adept, Master
  cooldown?: number; // milliseconds
  duration?: number; // milliseconds
  effectType: 'active' | 'passive';
}

export interface EmotionProgress {
  emotionId: EmotionType;
  emotionName: string;
  timesExplored: number;
  modulesCompleted: ModuleCompletion[];
  powerLevel: 1 | 2 | 3 | 4;
  firstCompletedAt: Date;
  lastCompletedAt: Date;
  wisdomCollected: string[];
  intensityHistory: number[];
}

export interface ModuleCompletion {
  moduleId: number; // 1-9
  moduleName: string;
  completed: boolean;
  completedAt?: Date;
  data: ModuleData;
  timeSpent: number; // milliseconds
}

export interface ModuleData {
  // Module 1: Mood Meter
  emotionSelected?: EmotionType;
  intensity?: number;
  intensityDescription?: string;
  bodySensations?: string;

  // Module 2: Memory Constellation
  memoryAssociations?: string; // Free-text associations

  // Module 3: Body Language
  bodyLocation?: string;
  sensation?: string;
  bodyVoice?: string;
  bodyNeed?: string;
  bodyAction?: string;
  bodyLanguageResponses?: {
    whereFeeling: string;
    whatFeelsLike: string;
    ifCouldTalk: string;
    ifCouldAsk: string;
    actionWouldTake: string;
  };

  // Module 4: Letter Writing
  letterRecipient?: string;
  letterGreeting?: string;
  letterBody?: string;
  letterClosing?: string;

  // Module 5: Reverse Letter Writing
  perspectiveChoice?: string;
  perspectivePerson?: string;
  reverseLetterBody?: string;
  reverseLetter?: string;

  // Module 6: Feelings Journal
  journalEntry?: string;

  // Module 7: Trajectories
  shutdownState?: {
    feel: string;
    think: string;
    do: string;
    result: string;
  };
  balancedState?: {
    feel: string;
    think: string;
    do: string;
    result: string;
  };
  overwhelmedState?: {
    feel: string;
    think: string;
    do: string;
    result: string;
  };
  trajectoryPast?: string;
  trajectoryPresent?: string;
  trajectoryFuture?: string;

  // Module 8: Wisdom Tree
  lessonsLearned?: string[];
  highestPerspective?: string;

  // Module 9: Ripple Pool
  synthesisInsights?: string;
  relationshipImpact?: string;
  intention?: string;
}

export const EMOTION_DEFINITIONS: Record<EmotionType, EmotionDefinition> = {
  angry: {
    id: 'angry',
    name: 'Angry',
    color: '#8B0000',
    secondaryColor: '#B22222',
    accentColor: '#FF4500',
    domainName: 'The Crimson Forge',
    description: 'The fire that protects boundaries and demands justice',
    companionDialogue:
      'Anger—the fire that protects boundaries and demands justice. A powerful force when understood.',
    powers: [],
  },
  anxious: {
    id: 'anxious',
    name: 'Anxious',
    color: '#CC5500',
    secondaryColor: '#FF8C00',
    accentColor: '#FFD700',
    domainName: 'The Amber Thicket',
    description: 'Alert energy that anticipates and prepares',
    companionDialogue:
      'Anxiety—your inner alarm system, always scanning for what might go wrong. It tries to keep you safe.',
    powers: [],
  },
  scared: {
    id: 'scared',
    name: 'Scared',
    color: '#B8860B',
    secondaryColor: '#DAA520',
    accentColor: '#FFF8DC',
    domainName: 'The Golden Caverns',
    description: 'The guardian that keeps you safe',
    companionDialogue:
      'Fear—the guardian that keeps you safe. It speaks of what matters to you.',
    powers: [],
  },
  jealous: {
    id: 'jealous',
    name: 'Jealous',
    color: '#6B8E23',
    secondaryColor: '#9ACD32',
    accentColor: '#7CFC00',
    domainName: 'The Jade Garden',
    description: 'The voice of unmet desires and comparison',
    companionDialogue:
      'Jealousy—showing you what you long for, what feels out of reach. It reveals your desires.',
    powers: [],
  },
  guilty: {
    id: 'guilty',
    name: 'Guilty',
    color: '#228B22',
    secondaryColor: '#2E8B57',
    accentColor: '#90EE90',
    domainName: 'The Emerald Depths',
    description: 'The voice of conscience and responsibility',
    companionDialogue:
      'Guilt—your moral compass, telling you when something feels wrong. It calls you to make things right.',
    powers: [],
  },
  forgiving: {
    id: 'forgiving',
    name: 'Forgiving',
    color: '#6A5ACD',
    secondaryColor: '#7B68EE',
    accentColor: '#E6E6FA',
    domainName: 'The Sapphire Springs',
    description: 'The power to release and heal',
    companionDialogue:
      'Forgiveness—the act of releasing resentment, freeing yourself and others. A path to peace.',
    powers: [],
  },
  joy: {
    id: 'joy',
    name: 'Joy',
    color: '#00CED1',
    secondaryColor: '#40E0D0',
    accentColor: '#AFEEEE',
    domainName: 'The Crystal Meadows',
    description: 'Pure life energy flowing freely',
    companionDialogue:
      'Joy—the light that heals and connects. Pure life energy flowing freely.',
    powers: [],
  },
  lonely: {
    id: 'lonely',
    name: 'Lonely',
    color: '#DAA520',
    secondaryColor: '#B8860B',
    accentColor: '#F0E68C',
    domainName: 'The Bronze Wasteland',
    description: 'The ache for connection and belonging',
    companionDialogue:
      'Loneliness—the ache for connection, the feeling of being unseen. It reminds you that you need others.',
    powers: [],
  },
  playful: {
    id: 'playful',
    name: 'Playful',
    color: '#FFD700',
    secondaryColor: '#FFFF00',
    accentColor: '#FFFACD',
    domainName: 'The Sunlit Playground',
    description: 'The spirit of creativity and spontaneity',
    companionDialogue:
      'Playfulness—the spirit of lightness, creativity, and joy. It reminds you not everything must be serious.',
    powers: [],
  },
  grateful: {
    id: 'grateful',
    name: 'Grateful',
    color: '#008B8B',
    secondaryColor: '#20B2AA',
    accentColor: '#B0E0E6',
    domainName: 'The Turquoise Temple',
    description: 'The awareness of abundance and blessing',
    companionDialogue:
      'Gratitude—the ability to see what is good, what you have been given. It opens your heart.',
    powers: [],
  },
  other: {
    id: 'other',
    name: 'Other',
    color: '#8FBC8F',
    secondaryColor: '#98FB98',
    accentColor: '#F5FFFA',
    domainName: 'The Twilight Crossroads',
    description: 'The unnamed feelings awaiting discovery',
    companionDialogue:
      'Other—the feelings that don\'t fit neat categories. Sometimes emotions are complex, layered, or simply new to you.',
    powers: [],
  },
  hopeful: {
    id: 'hopeful',
    name: 'Hopeful',
    color: '#BC8F8F',
    secondaryColor: '#DDA0DD',
    accentColor: '#FFE4E1',
    domainName: 'The Rose Observatory',
    description: 'The belief in possibility and better tomorrows',
    companionDialogue:
      'Hope—the belief that things can get better, that possibility exists. It lights the path forward.',
    powers: [],
  },
  shameful: {
    id: 'shameful',
    name: 'Shameful',
    color: '#DB7093',
    secondaryColor: '#FFB6C1',
    accentColor: '#FFF0F5',
    domainName: 'The Violet Veil',
    description: 'The feeling of exposure and unworthiness',
    companionDialogue:
      'Shame—the feeling of being fundamentally flawed, unworthy. It hides in the shadows, longing for acceptance.',
    powers: [],
  },
  sad: {
    id: 'sad',
    name: 'Sad',
    color: '#663399',
    secondaryColor: '#8B008B',
    accentColor: '#DA70D6',
    domainName: 'The Purple Abyss',
    description: 'The depth of loss and letting go',
    companionDialogue:
      'Sadness—the weight of loss, the ache of grief. It honors what mattered.',
    powers: [],
  },
  stuck: {
    id: 'stuck',
    name: 'Stuck',
    color: '#9370DB',
    secondaryColor: '#BA55D3',
    accentColor: '#E6E6FA',
    domainName: 'The Lavender Labyrinth',
    description: 'The feeling of being trapped in patterns',
    companionDialogue:
      'Stuck—the frustration of being trapped, unable to move forward. It begs for change.',
    powers: [],
  },
  nervous: {
    id: 'nervous',
    name: 'Nervous',
    color: '#CD853F',
    secondaryColor: '#D2691E',
    accentColor: '#F4A460',
    domainName: 'The Copper Cliffs',
    description: 'Anticipatory energy on the edge',
    companionDialogue:
      'Nervousness—the jittery energy before something important. Your body preparing, alert.',
    powers: [],
  },
};
