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
    instructions: 'How powerful is this emotion flowing through you? On a scale from 1% to 100%? How much of your inner realm does it fill? Write a few mystical words to describe the strength of this emotion, how it surges through your spirit and your daily quest... Use the magical slider to reveal how much energy this emotion commands.',
    companionGuidance: 'Take your time, brave explorer. Every emotion has its own unique strength. There is no right or wrong—only truth.',
    completionMessage: 'You have awakened your first emotional power! The Circle glows with your energy. Your journey continues to the Memory Constellation.',
  },

  module2: {
    title: 'The Memory Constellation',
    subtitle: 'Quest 2: Connect the Stars of Your Past',
    instructions: 'Write whatever magical words, epic scenes, legendary names, or ancient times that your mind links to this powerful feeling right now... Let the memories flow like stardust...',
    companionGuidance: 'Memories are like stars in your night sky—each one tells a story of who you are becoming.',
    completionMessage: 'The constellation shines brightly! You have connected your memories and unlocked deeper understanding.',
  },

  module3: {
    title: 'The Reflection Mirror',
    subtitle: 'Quest 3: See Through Different Lenses',
    instructions: 'Where in your physical form does this emotion reside? What mystical sensations does it create (tension, energy, butterflies)? If that part could speak ancient wisdom, what would it say? If it could request a boon, what would it ask for? If it could take heroic action, what quest would it begin?',
    companionGuidance: 'Sometimes the greatest power comes from seeing things differently. Be open to new truths.',
    completionMessage: 'The Mirror reveals its secrets! You now see your emotion through the eyes of wisdom.',
  },

  module4: {
    title: 'The Speaking Stone',
    subtitle: 'Quest 4: Give Voice to Your Feelings',
    instructions: 'Write a magical scroll to a part of yourself you\'re battling with. Perhaps: "Dear Shadow Self... I need you to know..." Or send your heart\'s message to someone you\'ve kept feelings locked away from... To an ally you wish to be closer to... To someone who wounded you, telling them of your pain... To someone who angered you, revealing why... To someone you treasure, sharing what they mean... To someone you seek forgiveness from... To someone you need to set boundaries with...',
    companionGuidance: 'Words are spells that shape reality. Speak your truth and watch your understanding grow stronger.',
    completionMessage: 'The Stone resonates with your words! Your voice has been heard across the realm.',
  },

  module5: {
    title: 'The Mirror Portal',
    subtitle: 'Quest 5: Walk Through New Realities',
    instructions: 'These scrolls are for your eyes alone... never send them, they are sacred exercises to process your quest... Magically swap places with someone you wish to receive a message from and write as them to yourself... this is imagination magic... write a scroll you wish to receive "from": Someone who hurt you, asking your forgiveness... Someone you hurt, granting you forgiveness... Telling you how precious your spirit is... From your current hero self to your child self of long ago... From your current self to your younger adventurer self... From your future legendary self who sees all, back to today... From someone who doesn\'t see your true power...',
    companionGuidance: 'Change how you see, and you change what is possible. Each perspective is a portal to growth.',
    completionMessage: 'The Portals shimmer with your wisdom! You have learned to reshape reality with your mind.',
  },

  module6: {
    title: 'The Cathartic Falls',
    subtitle: 'Quest 6: Harness the Power of Breath',
    instructions: 'This is your sacred space to release anything weighing on your spirit, pour your feelings onto this mystical page, without filtering in your mind... unburden yourself and leave it here in the falls... Just let all your emotions cascade onto the page... don\'t hold back, this is free expression... unleash it... (press enter to create new lines whenever needed)',
    companionGuidance: 'Breath is the bridge between mind and body. Let it flow, and find your balance.',
    completionMessage: 'The Falls cleanse your spirit! You have mastered the art of emotional regulation through breath.',
  },

  module7: {
    title: 'The Emotional Compass',
    subtitle: 'Quest 7: Navigate Your Inner Landscape',
    instructions: 'When I retreat into shadows, I feel... I think... I do... and as a consequence, I\'m likely to... When my emotions are in harmonious balance, I feel... I think... I do... and as a result, I will likely... When I\'m consumed by overwhelming power, I feel... I think... I do... and as a result, I\'m likely to...',
    companionGuidance: 'Know yourself, and you will never be lost. The compass always points toward your truth.',
    completionMessage: 'The Compass glows with understanding! You now have a map to navigate any emotional storm.',
  },

  module8: {
    title: 'The Wisdom Tree',
    subtitle: 'Quest 8: Harvest the Fruits of Knowledge',
    instructions: 'What is the most illuminated path or the brightest light through which you can view this quest? Seek the Ancient Lessons: What wisdom are you gaining on this adventure... and the profound truths you wish to carry forward?',
    companionGuidance: 'Knowledge is power, young explorer. Collect these truths and become wise beyond your years.',
    completionMessage: 'The Wisdom Tree blooms! You have gained deep understanding of the emotional realm.',
  },

  module9: {
    title: 'The Ripple Pool',
    subtitle: 'Quest 9: Create Waves of Change',
    instructions: 'What new wisdom have you gained from processing your feelings and quests? How do you envision what you now understand will transform your relationships in the present and future? Cast these insights into the magical pool below and witness the ripple effect... know that what you\'re discovering will flow through your life and connections, subtly shifting everything in powerful ways... Set your heroic intention for today... Taking the legendary next step... beside the footprints write three empowering "steps" you can take to strengthen yourself and elevate how you feel... They can be as simple as "cross the chamber" or "embark on a walk" or as grand as "begin a new quest" or "enroll in academy"...',
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
    title: 'Emotion Recognition',
    subtitle: 'Identify and measure your emotional intensity',
    instructions: 'How intense is your feeling? On a scale from 1% to 100%? How much space is this feeling taking up in your inner life? Write a few words or phrases to describe the intensity of this emotion, how it plays out in your inner life and your day. Move the slider to show how much or how little you are feeling this emotion.',
    companionGuidance: 'Be honest with yourself. This assessment is for your benefit. There are no right or wrong answers.',
    completionMessage: 'Assessment complete. You have established awareness of your emotional intensity, the first step in emotional regulation.',
  },

  module2: {
    title: 'Memory Reflection',
    subtitle: 'Connect memories and associations',
    instructions: 'Write whatever words, phrases, scenes, names, or times of life that your mind associates with this feeling right now. Let your mind wander freely through these associations.',
    companionGuidance: 'Past experiences shape our emotional responses. Recognizing patterns is key to change.',
    completionMessage: 'You have identified important emotional patterns. This awareness enables more conscious responses.',
  },

  module3: {
    title: 'Body Awareness',
    subtitle: 'Explore physical sensations and body signals',
    instructions: 'Where in your body are you experiencing this feeling? What does it feel like (achy, tight, butterflies, etc.)? If that part of your body could talk, what would it say? If that part of your body could ask for something, what would it ask for? If that part of your body could take action, what would it do?',
    companionGuidance: 'Our bodies hold emotional wisdom. Physical awareness deepens emotional understanding.',
    completionMessage: 'You have connected with your body\'s emotional signals. This embodied awareness supports regulation.',
  },

  module4: {
    title: 'Letter Writing',
    subtitle: 'Module 4: Express Your Experience',
    instructions: 'Write a letter to a part of yourself that you are struggling with. For example: "Dear Addict... I want you to know..." Or pouring your heart out to someone towards whom you have bottled up feelings... To someone you might like to be closer to... To someone who has hurt you, telling them how they have hurt you... To someone you are angry at, telling them why you are angry... To someone you love telling them what they mean to you... To someone you want to ask forgiveness. To someone with whom you feel a need to set some boundaries...',
    companionGuidance: 'Putting feelings into words activates the prefrontal cortex, which helps regulate emotions.',
    completionMessage: 'You have completed an expressive writing exercise. Regular practice enhances emotional clarity.',
  },

  module5: {
    title: 'Reverse Letter Writing',
    subtitle: 'Module 5: Perspective From Another View',
    instructions: 'The letter you write are for your eyes only... do not send them, they are simply a personal exercise meant so that you can process your own feelings fully and honestly... Mentally reverse roles with someone you\'d like to get a letter from and write a letter as them back to yourself... this is an exercise of the imagination... so write a letter that you wish to receive "from" someone: Who has hurt you, asking you for your forgiveness... Who you have hurt, forgiving you for hurting them... Telling you how precious you are to them... From your adult self of today to your child self of yesterday... From your adult self of today to your adolescent self of yesterday... From your future self who can see everything back to yourself today... From someone you feel does not see you...',
    companionGuidance: 'The ability to see from multiple angles reduces emotional rigidity and promotes adaptation.',
    completionMessage: 'You have expanded your perspective. This flexibility supports better emotional outcomes.',
  },

  module6: {
    title: 'Feelings Journal',
    subtitle: 'Module 6: Reflect and Process',
    instructions: 'This is a space where you can write anything that you need to get off of your chest, pour your feelings out onto the page, without editing in your head... unload yourself and leave it on this page... Just pour all of your feelings out onto the page... don\'t edit in your head, this is a free write... go for it... (press enter if you want to change lines after only a few words)',
    companionGuidance: 'Free writing allows unconscious material to surface. Be open to what emerges.',
    completionMessage: 'You have practiced reflective journaling. This process deepens self-understanding.',
  },

  module7: {
    title: 'Trajectories',
    subtitle: 'Module 7: Past, Present, and Future',
    instructions: 'When I shut down, I feel... I think... I do... and as a result, I\'m likely to... When my feeling is in a balanced range, I feel... I think... I do... and as a result, I am likely to... When I am overwhelmed by my feeling, I feel... I think... I do... and as a result, I am likely to...',
    companionGuidance: 'Emotions are not static. Understanding their movement helps you navigate change.',
    completionMessage: 'You have traced your emotional trajectory. This awareness enables conscious direction.',
  },

  module8: {
    title: 'Integration',
    subtitle: 'Connect insights with deeper meaning',
    instructions: 'What is the highest way or the highest light in which you can see this situation? Look for the lessons: What are the lessons you are learning right now, and the thoughts you would like to take away with you?',
    companionGuidance: 'Emotions often carry messages about what matters most. Listen deeply.',
    completionMessage: 'You have connected with deeper meaning. This wisdom transcends the immediate emotion.',
  },

  module9: {
    title: 'Community Connection',
    subtitle: 'Set intentions and identify next steps',
    instructions: 'What are the new insights you have from processing your feelings and situations? How do you imagine what you now see will impact your relationships in your present and your future? Write these insights below and consider the ripple effect. Know that what you are now seeing will flow in and through your life and your relationships, subtly shifting things in positive ways. Set your intention for today. Taking the next step: Write three positive steps you can take to empower yourself and improve your feeling about yourself. They can be as small as "walk across the room" or "take a walk," or as big as "get a job" or "go to school."',
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
