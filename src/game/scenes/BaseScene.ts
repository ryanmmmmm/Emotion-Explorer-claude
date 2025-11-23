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
   * Show a beautiful text input modal (replaces terrible prompt())
   */
  protected showTextInputModal(
    title: string,
    placeholder: string,
    guidance: string,
    minWords: number = 0,
    initialValue: string = ''
  ): Promise<string | null> {
    return new Promise((resolve) => {
      const overlay = this.add.container(this.scale.width / 2, this.scale.height / 2);
      overlay.setDepth(2000);

      // Dark background overlay
      const darkBg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.85);
      darkBg.setOrigin(0.5);

      // Modal background
      const modalBg = this.add.rectangle(0, 0, 900, 600, 0x1a1a2e, 0.98)
        .setStrokeStyle(4, this.emotionColor, 0.9);

      // Title
      const titleText = this.add.text(0, -240, title, {
        fontSize: '38px',
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
        align: 'center',
        wordWrap: { width: 850 }
      }).setOrigin(0.5);

      // Guidance text
      const guidanceText = this.add.text(0, -180, guidance, {
        fontSize: '18px',
        color: '#AACCFF',
        fontFamily: 'Merriweather, serif',
        align: 'center',
        lineSpacing: 6,
        wordWrap: { width: 850 }
      }).setOrigin(0.5);

      // Text input area (simulated with DOM)
      const inputBg = this.add.rectangle(0, -50, 850, 200, 0x2d3748, 1)
        .setStrokeStyle(3, this.emotionColor, 0.7);

      // Create actual DOM input
      const inputElement = document.createElement('textarea');
      inputElement.style.position = 'absolute';
      inputElement.style.left = `${this.scale.width / 2 - 425}px`;
      inputElement.style.top = `${this.scale.height / 2 - 150}px`;
      inputElement.style.width = '850px';
      inputElement.style.height = '200px';
      inputElement.style.fontSize = '18px';
      inputElement.style.fontFamily = 'Merriweather, serif';
      inputElement.style.padding = '15px';
      inputElement.style.backgroundColor = '#2d3748';
      inputElement.style.color = '#ffffff';
      inputElement.style.border = `3px solid ${this.emotionColor.toString(16).padStart(6, '0')}`;
      inputElement.style.borderRadius = '8px';
      inputElement.style.resize = 'none';
      inputElement.style.outline = 'none';
      inputElement.style.zIndex = '2001';
      inputElement.placeholder = placeholder;
      inputElement.value = initialValue;
      document.body.appendChild(inputElement);
      inputElement.focus();

      // Word count display
      const wordCountText = this.add.text(0, 120, `Words: 0 ${minWords > 0 ? `(minimum ${minWords})` : ''}`, {
        fontSize: '20px',
        color: '#888888',
        fontFamily: 'Raleway, sans-serif'
      }).setOrigin(0.5);

      // Update word count
      const updateWordCount = () => {
        const words = inputElement.value.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const meetsMinimum = wordCount >= minWords;
        wordCountText.setText(`Words: ${wordCount} ${minWords > 0 ? `(minimum ${minWords})` : ''}`);
        wordCountText.setColor(meetsMinimum ? '#4ADE80' : '#888888');
        submitBtn.setAlpha(meetsMinimum || minWords === 0 ? 1 : 0.5);
      };

      inputElement.addEventListener('input', updateWordCount);
      updateWordCount();

      // Submit button
      const submitBtn = this.createButton(0, 210, 'Submit', () => {
        const words = inputElement.value.trim().split(/\s+/).filter(w => w.length > 0);
        if (words.length >= minWords || minWords === 0) {
          document.body.removeChild(inputElement);
          overlay.destroy();
          resolve(inputElement.value.trim());
        }
      }, 250, 60);

      // Cancel button
      const cancelBtn = this.createButton(-280, 210, 'Cancel', () => {
        document.body.removeChild(inputElement);
        overlay.destroy();
        resolve(null);
      }, 180, 60);

      overlay.add([darkBg, modalBg, titleText, guidanceText, inputBg, wordCountText, submitBtn, cancelBtn]);

      // Fade in
      overlay.setAlpha(0);
      this.tweens.add({
        targets: overlay,
        alpha: 1,
        duration: 300
      });
    });
  }

  /**
   * Clean up when leaving scene
   */
  shutdown(): void {
    this.cameras.main.fadeEffect.reset();
    this.scene.stop();
  }
}
