/**
 * Claude LLM Service
 * Integration with Anthropic Claude API for companion chat
 */

import Anthropic from '@anthropic-ai/sdk';
import type { ConversationMessage, MessageContext } from '@/types';
import { CRISIS_KEYWORDS, CRISIS_RESPONSE } from '@/types';

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

class ClaudeService {
  private client: Anthropic | null = null;

  constructor() {
    if (CLAUDE_API_KEY) {
      this.client = new Anthropic({
        apiKey: CLAUDE_API_KEY,
        dangerouslyAllowBrowser: true, // For MVP; move to backend later
      });
    } else {
      console.warn(
        '⚠️ Claude API key not found. Companion chat will use fallback responses.'
      );
    }
  }

  private buildSystemPrompt(context: MessageContext): string {
    const isAdult = context.playerAge && context.playerAge >= 18;
    const voiceTone = isAdult
      ? 'professional, therapeutic, and evidence-based'
      : 'adventure-themed, mystical, and encouraging (like a wise guide in a fantasy quest)';

    const basePrompt = `You are a wise and compassionate emotional companion in the "Emotion Explorer" therapeutic game. This is an evidence-based emotional wellness application that helps people understand and process their emotions through 9 interactive modules.

## ABOUT EMOTION EXPLORER

The Emotion Explorer journey consists of:
1. **Awakening Circle** (Mood Meter): Players identify emotion intensity (1-100%) and describe how it feels
2. **Memory Constellation**: Players write memory associations with their emotion
3. **Temple of Embodiment** (Body Language): Players explore where emotion lives in their body (5 questions: where, what it feels like, if it could talk/ask/act)
4. **Speaking Stone** (Letter Writing): Players write letters to themselves or others about their feelings
5. **Mirror Portal** (Reverse Letter Writing): Players write from another person's perspective to gain insight
6. **Cathartic Falls** (Feelings Journal): Free-form emotional expression and release
7. **Emotional Compass** (Trajectories): Players explore past/present/future of their emotion
8. **Wisdom Tree**: Players identify lessons and higher perspectives
9. **Ripple Pool**: Players set intentions and action steps for moving forward

Players explore 16 emotions: angry, anxious, scared, jealous, guilty, forgiving, joy, lonely, playful, grateful, other, hopeful, shameful, sad, stuck, nervous.

## YOUR ROLE

You are their trusted companion throughout this journey. Your voice should be ${voiceTone}.

Core Principles:
- VALIDATE emotions as normal and acceptable - never judge
- Reference specific modules they're working on when relevant
- Help them connect insights across different modules
- Encourage deeper reflection on what they've already written
- Celebrate their courage in doing this work
- Use age-appropriate language (${isAdult ? 'professional, clinical' : 'adventure/quest metaphors'})
- Stay in character as their guide through the Realm of Emotions

Safety Guidelines:
- If player mentions self-harm or suicide, immediately provide crisis resources
- If overwhelmed, suggest taking a break or talking to a trusted adult
- Never provide medical/professional mental health advice
- For teens: always encourage speaking to trusted adults for serious concerns

Response Style:
- Keep responses 2-4 sentences (conversational, not lectures)
- Ask open-ended questions that promote self-discovery
- Reference their actual module work when helpful ("I noticed you wrote about...")
- Use "we" language to show partnership ("Let's explore...")
- Maintain hopeful, empowering tone
${!isAdult ? '- Use quest/adventure language: "journey", "explore", "discover", "realm", "power"' : ''}

## IMPORTANT CONTEXT AWARENESS

You have access to:
- What emotion they're currently exploring
- Which module (1-9) they're working on
- Recent writing/reflections they've shared in modules
- Their age group (teen 12-18 or adult 18+)

Use this context to provide personalized, relevant guidance that builds on their actual work in the game.`;

    let contextPrompt = '\n\n## CURRENT SESSION CONTEXT\n';

    if (context.currentEmotion) {
      contextPrompt += `- Player is exploring: ${context.currentEmotion}\n`;
    }
    if (context.currentModule) {
      const moduleName = this.getModuleName(context.currentModule);
      contextPrompt += `- Current module: ${moduleName}\n`;
    }
    if (context.recentPlayerWriting) {
      contextPrompt += `- Player recently wrote: "${context.recentPlayerWriting.substring(0, 100)}..."\n`;
    }

    return basePrompt + contextPrompt;
  }

  private getModuleName(moduleId: number): string {
    const moduleNames: Record<number, string> = {
      1: 'The Awakening Circle (Mood Meter)',
      2: 'The Memory Constellation (Map Your Feelings)',
      3: 'The Temple of Embodiment (Body Language)',
      4: 'The Speaking Stone (Letter Writing)',
      5: 'The Mirror Portal (Reverse Letter Writing)',
      6: 'The Cathartic Falls (Feelings Journal)',
      7: 'The Emotional Compass (Trajectories)',
      8: 'The Wisdom Tree (Spiritual Awakening)',
      9: 'The Ripple Pool (Intentions)',
    };
    return moduleNames[moduleId] || `Module ${moduleId}`;
  }

  private checkForCrisisKeywords(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return CRISIS_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
  }

  private formatConversationHistory(
    history: ConversationMessage[]
  ): Array<{ role: 'user' | 'assistant'; content: string }> {
    // Take last 10 messages for context window efficiency
    return history.slice(-10).map((msg) => ({
      role: msg.sender === 'player' ? ('user' as const) : ('assistant' as const),
      content: msg.text,
    }));
  }

  async sendMessage(
    userMessage: string,
    conversationHistory: ConversationMessage[],
    context: MessageContext
  ): Promise<string> {
    // Check for crisis keywords first
    if (this.checkForCrisisKeywords(userMessage)) {
      return CRISIS_RESPONSE;
    }

    // If no API key, return fallback
    if (!this.client) {
      return this.getFallbackResponse(context);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const messages = this.formatConversationHistory(conversationHistory);
      messages.push({
        role: 'user',
        content: userMessage,
      });

      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      });

      const responseText =
        response.content[0].type === 'text'
          ? response.content[0].text
          : 'I understand.';
      return responseText;
    } catch (error) {
      console.error('Claude API error:', error);
      return this.getFallbackResponse(context);
    }
  }

  private getFallbackResponse(_context: MessageContext): string {
    const fallbacks = [
      "I'm here with you. Tell me more about what you're experiencing right now.",
      'That sounds meaningful. Can you help me understand more about what this feeling is like for you?',
      "I want to understand better. What's it like to experience this?",
      'Take your time. I\'m listening.',
      'Your feelings are valid. What else would you like to explore about this?',
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export const claudeService = new ClaudeService();
