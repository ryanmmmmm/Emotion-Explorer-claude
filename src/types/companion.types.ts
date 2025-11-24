/**
 * Companion Types
 * AI companion state, conversation, and evolution
 */

import { EmotionType } from './emotion.types';

export interface CompanionState {
  playerId: string;
  name: string;
  bondLevel: number; // 1-4
  conversationHistory: ConversationMessage[];
  personalityTraits: string[];
  appearanceEvolution: number; // 0-3 (visual state)
  totalInteractions: number;
  lastInteractionAt: Date;
}

export interface ConversationMessage {
  id: string;
  sender: 'player' | 'companion';
  text: string;
  timestamp: Date;
  context: MessageContext;
}

export interface MessageContext {
  currentEmotion?: EmotionType;
  currentModule?: number;
  playerAge?: number; // For age-appropriate responses
  playerMood?: string;
  recentPlayerWriting?: string; // Last thing player wrote
}

export interface CompanionResponse {
  text: string;
  suggestedActions?: string[];
  emotionalTone?: 'supportive' | 'curious' | 'celebratory' | 'gentle' | 'encouraging';
}

export const BOND_LEVEL_NAMES = {
  1: 'New Friends',
  2: 'Trusted Guide',
  3: 'Close Companion',
  4: 'Soul Bond',
};

export const BOND_LEVEL_DESCRIPTIONS = {
  1: 'You\'ve just met your companion. They are warm and welcoming, but still learning about you.',
  2: 'Your companion knows you well now. They remember your journey and offer deeper insights.',
  3: 'A profound connection has formed. Your companion feels like a true friend and confidant.',
  4: 'You and your companion are bonded at the deepest level. They are an extension of your own wisdom.',
};

// Crisis keywords that trigger immediate resource provision
export const CRISIS_KEYWORDS = [
  'suicide',
  'suicidal',
  'kill myself',
  'end my life',
  'hurt myself',
  'self harm',
  'self-harm',
  'want to die',
  'better off dead',
  'no reason to live',
];

export const CRISIS_RESPONSE = `I'm so glad you told me. What you're feeling matters, and you deserve support. Please reach out to someone who can help right now:

• **Crisis Text Line**: Text HOME to 741741
• **National Suicide Prevention Lifeline**: Call or text 988
• **Talk to a trusted adult, school counselor, or therapist**

You don't have to face this alone. Would you like to take a break from the game?`;
