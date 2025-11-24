/**
 * Base Scene Class
 * Foundation for all game scenes with common functionality
 */

import Phaser from 'phaser';
import type { EmotionType } from '@/types';
import { COLORS, DEPTHS, ANIMATIONS } from '../config/constants';
import { usePlayerStore } from '@/stores/playerStore';
import { getThemeForAgeGroup, type ThemeConfig, type AgeGroup } from '@/config/themeConfig';
import { getNarrativeForAgeGroup, type NarrativeConfig } from '@/config/narrativeConfig';

export abstract class BaseScene extends Phaser.Scene {
  protected currentEmotion?: EmotionType;
  protected emotionColor: number = COLORS.JOY;
  protected theme?: ThemeConfig;
  protected narrative?: NarrativeConfig;
  protected ageGroup?: AgeGroup;

  constructor(key: string) {
    super({ key });
  }

  /**
   * Initialize theme and narrative based on player's age group
   * Call this in create() of child scenes
   */
  protected initializeTheme(): void {
    const playerStore = usePlayerStore.getState();
    const profile = playerStore.profile;

    if (profile && profile.ageGroup) {
      this.ageGroup = profile.ageGroup;
      this.theme = getThemeForAgeGroup(this.ageGroup);
      this.narrative = getNarrativeForAgeGroup(this.ageGroup);

      console.log(`🎨 Theme initialized for ${this.ageGroup}`);
    } else {
      // Default to adult theme if no profile
      this.ageGroup = 'Adult (18+)';
      this.theme = getThemeForAgeGroup(this.ageGroup);
      this.narrative = getNarrativeForAgeGroup(this.ageGroup);

      console.warn('⚠️ No player profile found, defaulting to Adult theme');
    }
  }

  /**
   * Check if current player is a teen
   */
  protected isTeen(): boolean {
    return this.ageGroup === 'Teen (12-18)';
  }

  /**
   * Check if current player is an adult
   */
  protected isAdult(): boolean {
    return this.ageGroup === 'Adult (18+)';
  }

  /**
   * Set the current emotion for the scene
   * This will affect colors, particles, and atmosphere
   */
  protected setEmotion(emotion: EmotionType): void {
    this.currentEmotion = emotion;
    this.emotionColor = this.getEmotionColor(emotion);
  }

  /**
   * Get color for an emotion
   */
  protected getEmotionColor(emotion: EmotionType): number {
    const colorMap: Record<EmotionType, number> = {
      angry: COLORS.ANGRY,
      anxious: COLORS.ANXIOUS,
      scared: COLORS.SCARED,
      jealous: COLORS.JEALOUS,
      guilty: COLORS.GUILTY,
      forgiving: COLORS.FORGIVING,
      joy: COLORS.JOY,
      lonely: COLORS.LONELY,
      playful: COLORS.PLAYFUL,
      grateful: COLORS.GRATEFUL,
      other: COLORS.OTHER,
      hopeful: COLORS.HOPEFUL,
      shameful: COLORS.SHAMEFUL,
      sad: COLORS.SAD,
      stuck: COLORS.STUCK,
      nervous: COLORS.NERVOUS,
    };
    return colorMap[emotion] || COLORS.JOY;
  }

  /**
   * Create a fade-in effect for the scene
   */
  protected fadeIn(duration: number = ANIMATIONS.SCENE_TRANSITION): void {
    this.cameras.main.fadeIn(duration, 0, 0, 0);
  }

  /**
   * Create a fade-out effect for the scene
   */
  protected fadeOut(duration: number = ANIMATIONS.SCENE_TRANSITION): void {
    this.cameras.main.fadeOut(duration, 0, 0, 0);
  }

  /**
   * Transition to another scene with fade effect
   */
  protected transitionToScene(
    targetScene: string,
    data?: any,
    duration: number = ANIMATIONS.SCENE_TRANSITION
  ): void {
    this.cameras.main.fadeOut(duration, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(targetScene, data);
    });
  }

  /**
   * Create ambient particles for emotional atmosphere
   */
  protected createEmotionalWisps(): Phaser.GameObjects.Particles.ParticleEmitter {
    const particles = this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: this.scale.width },
      y: this.scale.height + 50,
      lifespan: 8000,
      speedY: { min: -100, max: -50 },
      speedX: { min: -20, max: 20 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.6, end: 0 },
      tint: this.emotionColor,
      frequency: 200,
      blendMode: 'ADD',
    });

    particles.setDepth(DEPTHS.PARTICLES_BG);
    return particles;
  }

  /**
   * Create a centered text object with default styling
   */
  protected createCenteredText(
    y: number,
    text: string,
    fontSize: number = 48,
    color: string = '#ffffff'
  ): Phaser.GameObjects.Text {
    return this.add
      .text(this.scale.width / 2, y, text, {
        fontSize: `${fontSize}px`,
        color,
        fontFamily: 'Merriweather, serif',
        align: 'center',
        wordWrap: { width: this.scale.width * 0.8 },
      })
      .setOrigin(0.5)
      .setDepth(DEPTHS.UI);
  }

  /**
   * Create a simple button
   */
  protected createButton(
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    width: number = 300,
    height: number = 80
  ): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);

    // Background
    const bg = this.add
      .rectangle(0, 0, width, height, this.emotionColor, 0.8)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff, 0.5);

    // Text
    const buttonText = this.add
      .text(0, 0, text, {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'Raleway, sans-serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    button.add([bg, buttonText]);
    button.setDepth(DEPTHS.UI);

    // Hover effects
    bg.on('pointerover', () => {
      bg.setFillStyle(this.emotionColor, 1);
      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
      });
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(this.emotionColor, 0.8);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
      });
    });

    bg.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: onClick,
      });
    });

    return button;
  }

  /**
   * Show a loading indicator
   */
  protected showLoading(text: string = 'Loading...'): Phaser.GameObjects.Container {
    const loading = this.add.container(
      this.scale.width / 2,
      this.scale.height / 2
    );

    const bg = this.add
      .rectangle(0, 0, 400, 200, 0x000000, 0.8)
      .setStrokeStyle(2, this.emotionColor);

    const loadingText = this.add
      .text(0, 0, text, {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    loading.add([bg, loadingText]);
    loading.setDepth(DEPTHS.OVERLAY);

    // Pulsing animation
    this.tweens.add({
      targets: loadingText,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    return loading;
  }

  /**
   * Show a beautiful text input modal using React component (replaces terrible prompt())
   */
  protected async showTextInputModal(
    title: string,
    placeholder: string,
    _guidance: string, // Future: could pass to modal for instructions
    _minWords: number = 0, // Future: could enforce minimum word count
    initialValue: string = ''
  ): Promise<string | null> {
    const { showTextInput } = await import('@/stores/modalStore');
    return showTextInput(title, placeholder, initialValue);
  }

  /**
   * Clean up when leaving scene
   */
  shutdown(): void {
    // Clean up any lingering DOM textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      if (textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
    });

    this.cameras.main.fadeEffect.reset();
    this.scene.stop();
  }
}
