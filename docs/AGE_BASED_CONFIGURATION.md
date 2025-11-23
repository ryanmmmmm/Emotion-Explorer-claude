# Age-Based Configuration System

## Overview

The Emotion Explorer Game uses a clean configuration system to deliver **two distinct experiences**:
- **Teen (12-18)**: Adventure narrative with fantasy elements, quests, and magical themes
- **Adult (18+)**: Therapeutic approach with evidence-based practices and professional language

## Architecture

### Configuration Files

**`src/config/themeConfig.ts`**
- Visual styling (fonts, colors, effects)
- Particle density and animation speeds
- UI element styling
- Artwork style descriptors

**`src/config/narrativeConfig.ts`**
- All text content for both age groups
- Module titles, subtitles, instructions
- Companion guidance messages
- Completion messages

### BaseScene Integration

All scenes inherit from `BaseScene`, which provides:

```typescript
protected initializeTheme(): void    // Call first in create()
protected isTeen(): boolean          // Check if teen
protected isAdult(): boolean         // Check if adult
protected theme?: ThemeConfig        // Current theme
protected narrative?: NarrativeConfig // Current narrative
```

## Usage Pattern

### Step 1: Initialize Theme in create()

```typescript
create(): void {
  // ALWAYS call this first
  this.initializeTheme();

  // Continue with scene creation...
}
```

### Step 2: Use Narrative Config for Text

```typescript
// Get module-specific narrative
const narrative = this.narrative!.module1;

// Use narrative text instead of hardcoded strings
this.add.text(x, y, narrative.title, {
  fontSize: this.isTeen() ? '56px' : '48px',
  color: this.isTeen() ? '#FFD700' : '#4A90E2',
  fontFamily: this.theme!.titleFont,
});
```

### Step 3: Conditional Visual Effects

```typescript
// More particles for teens, less for adults
this.vfx.createFloatingOrbs(
  this.isTeen() ? 15 : 8,
  this.emotionColor
);

// Fantasy effects only for teens
if (this.isTeen()) {
  this.createEmotionalWisps();
  this.vfx.createLightRays(...);
}
```

### Step 4: Age-Appropriate Colors

```typescript
// Teen: Gold accent, fantasy colors
// Adult: Professional blue, calming colors
{
  color: this.isTeen() ? '#FFD700' : '#4A90E2',
  fontFamily: this.theme!.titleFont,
}
```

## Complete Example (Module 1)

```typescript
export class Module1AwakeningCircle extends BaseScene {
  create(): void {
    // 1. Initialize theme FIRST
    this.initializeTheme();

    this.fadeIn();
    this.createBackground();

    // 2. Conditional visual effects
    this.vfx.createFloatingOrbs(
      this.isTeen() ? 15 : 8,
      this.emotionColor
    );

    if (this.isTeen()) {
      this.createEmotionalWisps();
    }

    // 3. Use narrative config for all text
    const narrative = this.narrative!.module1;

    // Title
    this.add.text(x, y, narrative.title, {
      fontSize: this.isTeen() ? '56px' : '48px',
      color: this.isTeen() ? '#FFD700' : '#4A90E2',
      fontFamily: this.theme!.titleFont,
    });

    // Subtitle
    this.add.text(x, y, narrative.subtitle, {
      fontSize: this.isTeen() ? '28px' : '24px',
      fontFamily: this.theme!.secondaryFont,
    });

    // Instructions
    this.add.text(x, y, narrative.instructions, {
      fontSize: this.isTeen() ? '24px' : '20px',
      wordWrap: { width: this.scale.width * 0.8 },
    });

    // Companion guidance
    this.add.text(x, y, narrative.companionGuidance, {
      fontFamily: this.theme!.secondaryFont,
    });

    // Completion message
    this.showCompletionMessage(narrative.completionMessage);
  }
}
```

## Adding New Modules

When creating a new module:

1. **Add narrative to `narrativeConfig.ts`**:
   ```typescript
   module10: {
     title: 'Teen Title' | 'Adult Title',
     subtitle: '...',
     instructions: '...',
     companionGuidance: '...',
     completionMessage: '...',
   }
   ```

2. **Follow the pattern**:
   - Call `initializeTheme()` first
   - Use `narrative!.moduleX` for all text
   - Use `isTeen()` / `isAdult()` for conditionals
   - Use `theme!` properties for fonts/colors

3. **Test both experiences**:
   - Play through as Teen
   - Play through as Adult
   - Verify text, visuals, and tone match

## Benefits

✅ **Clean separation**: Content lives in config files, not scattered in code
✅ **Easy updates**: Change narrative without touching scene logic
✅ **Consistent experience**: Same pattern across all modules
✅ **Type-safe**: TypeScript ensures all narrative fields exist
✅ **Maintainable**: Single source of truth for each age group

## Next Steps

- [ ] Update modules 2-9 to use configuration
- [ ] Add LLM-generated imagery based on `artworkStyle`
- [ ] Implement dynamic theming (light/dark for adults)
- [ ] Add localization support to narrative config
