/**
 * Narrative Configuration
 * Age-appropriate content, story elements, and guidance text
 */

import type { AgeGroup } from './themeConfig';

export interface ModuleNarrative {
  title: string;
  subtitle: string;
  instructions: string;
  companionGuidance: string;
  completionMessage: string;
}

export interface NarrativeConfig {
  // Landing/Intro
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeDescription: string;

  // Character Creation
  characterCreationTitle: string;
  characterCreationSubtitle: string;
  namePromptTitle: string;
  namePromptGuidance: string;
  companionNameTitle: string;
  companionNameGuidance: string;

  // Emotion Selection
  emotionSelectionTitle: string;
  emotionSelectionPrompt: string;

  // Module 1: Awakening Circle (Intensity)
  module1: ModuleNarrative;

  // Module 2: Memory Constellation
  module2: ModuleNarrative;

  // Module 3: Reflection Mirror
  module3: ModuleNarrative;

  // Module 4: Speaking Stone
  module4: ModuleNarrative;

  // Module 5: Mirror Portal
  module5: ModuleNarrative;

  // Module 6: Cathartic Falls
  module6: ModuleNarrative;

  // Module 7: Emotional Compass
  module7: ModuleNarrative;

  // Module 8: Wisdom Tree
  module8: ModuleNarrative;

  // Module 9: Ripple Pool
  module9: ModuleNarrative;
}

// Teen Narrative: Adventure, Quest, Discovery
export const TEEN_NARRATIVE: NarrativeConfig = {
  welcomeTitle: 'Welcome, Young Explorer',
  welcomeSubtitle: 'Your Quest Through the Realm of Emotions Begins',
  welcomeDescription: 'You have been chosen to explore the mystical Realm of Emotions. Each emotion holds ancient power, waiting to be discovered. Your companion will guide you on this epic journey of self-discovery.',

  characterCreationTitle: 'Create Your Hero',
  characterCreationSubtitle: 'Design your avatar for the adventure ahead',
  namePromptTitle: 'Choose Your Hero Name',
  namePromptGuidance: 'This is how you will be known throughout your quest in the Realm of Emotions. Choose a name that represents your strength and courage.',
  companionNameTitle: 'Name Your Mystical Guide',
  companionNameGuidance: 'Your companion is a wise spirit who will guide you through emotional challenges. Choose a name that feels magical and protective.',

  emotionSelectionTitle: 'Choose Your First Quest',
  emotionSelectionPrompt: 'Which emotion calls out to you? Select one to begin your exploration.',

  module1: {
    title: 'The Awakening Circle',
    subtitle: 'Quest 1: Measure Your Emotional Power',
    instructions: 'The Awakening Circle reveals the intensity of your emotional energy. Use the magical slider to show how strongly this emotion flows through you right now.',
    companionGuidance: 'Take your time, brave explorer. Every emotion has its own unique strength. There is no right or wrong—only truth.',
    completionMessage: 'You have awakened your first emotional power! The Circle glows with your energy. Your journey continues to the Memory Constellation.',
  },

  module2: {
    title: 'The Memory Constellation',
    subtitle: 'Quest 2: Connect the Stars of Your Past',
    instructions: 'Click the glowing memory stars to reveal moments when you felt this emotion. Each star holds a piece of your emotional story.',
    companionGuidance: 'Memories are like stars in your night sky—each one tells a story of who you are becoming.',
    completionMessage: 'The constellation shines brightly! You have connected your memories and unlocked deeper understanding.',
  },

  module3: {
    title: 'The Reflection Mirror',
    subtitle: 'Quest 3: See Through Different Lenses',
    instructions: 'The Reflection Mirror shows your emotion from new perspectives. Click each magical lens to discover wisdom you might have missed.',
    companionGuidance: 'Sometimes the greatest power comes from seeing things differently. Be open to new truths.',
    completionMessage: 'The Mirror reveals its secrets! You now see your emotion through the eyes of wisdom.',
  },

  module4: {
    title: 'The Speaking Stone',
    subtitle: 'Quest 4: Give Voice to Your Feelings',
    instructions: 'Click the ancient Speaking Stone to express your emotion in your own words. Your voice has power—use it!',
    companionGuidance: 'Words are spells that shape reality. Speak your truth and watch your understanding grow stronger.',
    completionMessage: 'The Stone resonates with your words! Your voice has been heard across the realm.',
  },

  module5: {
    title: 'The Mirror Portal',
    subtitle: 'Quest 5: Walk Through New Realities',
    instructions: 'Step through the Mirror Portal to see your emotion reframed in powerful new ways. Each portal shows a different truth.',
    companionGuidance: 'Change how you see, and you change what is possible. Each perspective is a portal to growth.',
    completionMessage: 'The Portals shimmer with your wisdom! You have learned to reshape reality with your mind.',
  },

  module6: {
    title: 'The Cathartic Falls',
    subtitle: 'Quest 6: Harness the Power of Breath',
    instructions: 'Follow the rhythm of the magical falls to practice ancient breathing techniques. Let the water carry away what no longer serves you.',
    companionGuidance: 'Breath is the bridge between mind and body. Let it flow, and find your balance.',
    completionMessage: 'The Falls cleanse your spirit! You have mastered the art of emotional regulation through breath.',
  },

  module7: {
    title: 'The Emotional Compass',
    subtitle: 'Quest 7: Navigate Your Inner Landscape',
    instructions: 'Use the mystical compass to map your emotional territory. Each direction reveals a new aspect of your inner world.',
    companionGuidance: 'Know yourself, and you will never be lost. The compass always points toward your truth.',
    completionMessage: 'The Compass glows with understanding! You now have a map to navigate any emotional storm.',
  },

  module8: {
    title: 'The Wisdom Tree',
    subtitle: 'Quest 8: Harvest the Fruits of Knowledge',
    instructions: 'Click the glowing wisdom orbs to gather ancient knowledge about your emotion. Each fact helps the tree grow stronger.',
    companionGuidance: 'Knowledge is power, young explorer. Collect these truths and become wise beyond your years.',
    completionMessage: 'The Wisdom Tree blooms! You have gained deep understanding of the emotional realm.',
  },

  module9: {
    title: 'The Ripple Pool',
    subtitle: 'Quest 9: Create Waves of Change',
    instructions: 'Cast your action stones into the Ripple Pool. Each choice creates waves that spread through your world. What will you change?',
    companionGuidance: 'You are not powerless. Every action creates ripples. Choose wisely, and watch your world transform.',
    completionMessage: 'Your ripples spread across the realm! You have completed your quest and unlocked true emotional mastery.',
  },
};

// Adult Narrative: Professional, Therapeutic, Evidence-based
export const ADULT_NARRATIVE: NarrativeConfig = {
  welcomeTitle: 'Welcome to Emotional Wellness',
  welcomeSubtitle: 'A Guided Journey Through Evidence-Based Emotional Processing',
  welcomeDescription: 'This therapeutic experience uses research-backed techniques to help you understand and regulate your emotions. You will learn practical skills for emotional intelligence and well-being.',

  characterCreationTitle: 'Create Your Profile',
  characterCreationSubtitle: 'Personalize your therapeutic experience',
  namePromptTitle: 'Enter Your Name',
  namePromptGuidance: 'Enter the name you would like to use during this experience. This helps personalize your journey.',
  companionNameTitle: 'Name Your Guide (Optional)',
  companionNameGuidance: 'You may choose a name for your therapeutic guide, or use the default name.',

  emotionSelectionTitle: 'Select an Emotion to Explore',
  emotionSelectionPrompt: 'Which emotion would you like to work with today? Choose one to begin your therapeutic process.',

  module1: {
    title: 'Emotional Awareness',
    subtitle: 'Module 1: Assessing Emotional Intensity',
    instructions: 'Use the slider to rate the current intensity of your emotion on a scale from 0-10. This helps establish a baseline for your emotional state.',
    companionGuidance: 'Be honest with yourself. This assessment is for your benefit. There are no right or wrong answers.',
    completionMessage: 'Assessment complete. You have established awareness of your emotional intensity, the first step in emotional regulation.',
  },

  module2: {
    title: 'Memory Association',
    subtitle: 'Module 2: Identifying Emotional Triggers',
    instructions: 'Reflect on recent experiences that triggered this emotion. Understanding your triggers helps you respond more effectively in the future.',
    companionGuidance: 'Past experiences shape our emotional responses. Recognizing patterns is key to change.',
    completionMessage: 'You have identified important emotional patterns. This awareness enables more conscious responses.',
  },

  module3: {
    title: 'Cognitive Reframing',
    subtitle: 'Module 3: Examining Alternative Perspectives',
    instructions: 'Consider alternative ways to interpret your emotional experience. Cognitive reframing is a proven technique for emotional regulation.',
    companionGuidance: 'Our thoughts influence our feelings. Examining different perspectives can shift emotional responses.',
    completionMessage: 'You have practiced cognitive reframing. This skill improves with repeated use.',
  },

  module4: {
    title: 'Emotional Expression',
    subtitle: 'Module 4: Articulating Your Experience',
    instructions: 'Write about your emotional experience in detail. Expressive writing has been shown to improve emotional processing and well-being.',
    companionGuidance: 'Putting feelings into words activates the prefrontal cortex, which helps regulate emotions.',
    completionMessage: 'You have completed an expressive writing exercise. Regular practice enhances emotional clarity.',
  },

  module5: {
    title: 'Perspective Taking',
    subtitle: 'Module 5: Developing Emotional Flexibility',
    instructions: 'Explore multiple perspectives on your emotional situation. Cognitive flexibility is essential for emotional resilience.',
    companionGuidance: 'The ability to see from multiple angles reduces emotional rigidity and promotes adaptation.',
    completionMessage: 'You have expanded your perspective. This flexibility supports better emotional outcomes.',
  },

  module6: {
    title: 'Breathing Regulation',
    subtitle: 'Module 6: Autonomic Nervous System Control',
    instructions: 'Follow the breathing pattern to practice diaphragmatic breathing. This technique activates the parasympathetic nervous system, reducing stress.',
    companionGuidance: 'Controlled breathing is one of the most effective tools for emotional regulation.',
    completionMessage: 'You have practiced controlled breathing. Use this technique whenever you need to calm your nervous system.',
  },

  module7: {
    title: 'Emotional Mapping',
    subtitle: 'Module 7: Understanding Your Emotional Landscape',
    instructions: 'Map the different dimensions of your emotional experience. Comprehensive understanding leads to better regulation strategies.',
    companionGuidance: 'Emotions are complex. Breaking them down into components makes them more manageable.',
    completionMessage: 'You have created a detailed emotional map. This clarity enables targeted intervention.',
  },

  module8: {
    title: 'Psychoeducation',
    subtitle: 'Module 8: Learning About Your Emotions',
    instructions: 'Review evidence-based information about emotional processes. Knowledge empowers better emotional management.',
    companionGuidance: 'Understanding how emotions work reduces their power over you.',
    completionMessage: 'You have gained evidence-based knowledge. Apply these principles to your daily life.',
  },

  module9: {
    title: 'Action Planning',
    subtitle: 'Module 9: Developing Coping Strategies',
    instructions: 'Identify specific actions you can take to manage this emotion effectively. Action plans bridge insight to behavior change.',
    companionGuidance: 'Awareness without action rarely leads to change. Commit to specific steps.',
    completionMessage: 'You have completed your action plan. Implementation is key to lasting change.',
  },
};

/**
 * Get narrative configuration based on age group
 */
export function getNarrativeForAgeGroup(ageGroup: AgeGroup): NarrativeConfig {
  return ageGroup === 'Teen (12-18)' ? TEEN_NARRATIVE : ADULT_NARRATIVE;
}

/**
 * Get module-specific narrative
 */
export function getModuleNarrative(
  ageGroup: AgeGroup,
  moduleNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
): ModuleNarrative {
  const narrative = getNarrativeForAgeGroup(ageGroup);
  return narrative[`module${moduleNumber}` as keyof NarrativeConfig] as ModuleNarrative;
}
