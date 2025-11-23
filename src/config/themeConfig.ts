/**
 * Theme Configuration
 * Age-appropriate visual styling and artwork for Teen vs Adult experiences
 */

export type AgeGroup = 'Teen (12-18)' | 'Adult (18+)';

export interface ThemeConfig {
  // Visual Style
  primaryFont: string;
  secondaryFont: string;
  titleFont: string;

  // Color Palette
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  secondaryTextColor: string;

  // UI Style
  borderRadius: number;
  borderStyle: 'solid' | 'dashed' | 'mystical';
  glowIntensity: number;
  particleDensity: number;

  // Visual Effects
  useFantasyEffects: boolean;
  useGradients: boolean;
  animationSpeed: number;

  // Artwork Style
  artworkStyle: 'adventure' | 'clinical' | 'therapeutic';
  iconStyle: 'fantasy' | 'modern' | 'minimal';
}

export interface ThemeAssets {
  // Background imagery (to be generated)
  backgroundImageStyle: string;
  moduleBackgroundStyle: string;

  // UI Elements
  buttonStyle: 'rounded-fantasy' | 'clean-modern' | 'therapeutic-soft';
  modalStyle: 'mystical' | 'professional' | 'calming';

  // Character/Avatar style
  avatarStyle: 'animated-adventure' | 'realistic' | 'illustrated';
}

// Teen Theme: Adventure, Fantasy, Discovery
export const TEEN_THEME: ThemeConfig = {
  primaryFont: 'Cinzel, serif', // Fantasy-style font
  secondaryFont: 'Merriweather, serif',
  titleFont: 'Cinzel, serif',

  backgroundColor: '#1A1A2E', // Deep mystical blue-black
  accentColor: '#FFD700', // Gold
  textColor: '#FFFFFF',
  secondaryTextColor: '#AACCFF', // Light blue

  borderRadius: 12,
  borderStyle: 'mystical',
  glowIntensity: 0.8,
  particleDensity: 20,

  useFantasyEffects: true,
  useGradients: true,
  animationSpeed: 1.0,

  artworkStyle: 'adventure',
  iconStyle: 'fantasy',
};

// Adult Theme: Professional, Therapeutic, Evidence-based
export const ADULT_THEME: ThemeConfig = {
  primaryFont: 'Inter, sans-serif', // Clean, professional font
  secondaryFont: 'Georgia, serif',
  titleFont: 'Poppins, sans-serif',

  backgroundColor: '#F5F7FA', // Light, calming background
  accentColor: '#4A90E2', // Professional blue
  textColor: '#2C3E50', // Dark gray text
  secondaryTextColor: '#7F8C8D', // Medium gray

  borderRadius: 8,
  borderStyle: 'solid',
  glowIntensity: 0.2,
  particleDensity: 5,

  useFantasyEffects: false,
  useGradients: false,
  animationSpeed: 0.7,

  artworkStyle: 'therapeutic',
  iconStyle: 'modern',
};

export const TEEN_ASSETS: ThemeAssets = {
  backgroundImageStyle: 'mystical fantasy realm with floating islands, aurora borealis, magical crystals',
  moduleBackgroundStyle: 'enchanted forest, cosmic space, magical caves, crystal caverns',

  buttonStyle: 'rounded-fantasy',
  modalStyle: 'mystical',

  avatarStyle: 'animated-adventure',
};

export const ADULT_ASSETS: ThemeAssets = {
  backgroundImageStyle: 'calm gradient backgrounds, nature photography, serene landscapes',
  moduleBackgroundStyle: 'peaceful nature scenes, minimal abstract art, calming patterns',

  buttonStyle: 'clean-modern',
  modalStyle: 'professional',

  avatarStyle: 'realistic',
};

/**
 * Get theme configuration based on age group
 */
export function getThemeForAgeGroup(ageGroup: AgeGroup): ThemeConfig {
  return ageGroup === 'Teen (12-18)' ? TEEN_THEME : ADULT_THEME;
}

/**
 * Get asset configuration based on age group
 */
export function getAssetsForAgeGroup(ageGroup: AgeGroup): ThemeAssets {
  return ageGroup === 'Teen (12-18)' ? TEEN_ASSETS : ADULT_ASSETS;
}

/**
 * Apply theme to Phaser scene camera
 */
export function applyThemeToScene(theme: ThemeConfig, scene: Phaser.Scene): void {
  // Convert hex to number for Phaser
  const bgColor = parseInt(theme.backgroundColor.replace('#', ''), 16);
  scene.cameras.main.setBackgroundColor(bgColor);
}
