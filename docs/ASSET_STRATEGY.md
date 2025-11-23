# Asset Strategy for Emotion Explorer Game

## Overview
We need age-appropriate 2D assets for Phaser.js that work for both:
- **Teen (12-18)**: Fantasy adventure style (similar to Quaternius aesthetic)
- **Adult (18+)**: Therapeutic, calming, professional style

## Free 2D Asset Resources

### 🎨 For Teen Fantasy Theme

#### **Kenny.nl** (CC0 License - Free)
- https://kenney.nl/assets
- **Best for us:**
  - `UI Pack` - Fantasy buttons, panels, icons
  - `Pixel Adventure` - Character sprites
  - `Abstract Platformer` - Colorful backgrounds
  - `Particle Pack` - Sparkles, magic effects
- **Why:** CC0, high quality, consistent style, perfect for fantasy

#### **OpenGameArt.org** (Various Free Licenses)
- https://opengameart.org/
- **Search for:**
  - "fantasy UI"
  - "magic particles"
  - "crystal cave backgrounds"
  - "mystical orbs"
- **Filter by:** CC0, CC-BY (attribution)

#### **Itch.io Free Game Assets** (Various Licenses)
- https://itch.io/game-assets/free
- **Search for:**
  - "fantasy 2D assets"
  - "pixel art magic"
  - "adventure UI kit"

#### **Freepik** (Free with attribution)
- https://www.freepik.com/
- **Search for:**
  - "fantasy game background"
  - "mystical landscape vector"
  - "magic portal illustration"
- **Note:** Requires attribution, check license

### 🧘 For Adult Therapeutic Theme

#### **Unsplash/Pexels** (Free stock photos)
- https://unsplash.com / https://pexels.com
- **Search for:**
  - "calm nature gradient"
  - "peaceful abstract"
  - "minimalist background"
  - "serene landscape"
- **Why:** Professional quality, calming imagery

#### **Subtle Patterns** (Free backgrounds)
- https://www.toptal.com/designers/subtlepatterns/
- **Best for:**
  - Clean background textures
  - Professional patterns
  - Minimal designs

#### **heroicons / FontAwesome** (Free icons)
- https://heroicons.com / https://fontawesome.com
- **Best for:**
  - Clean, modern UI icons
  - Professional interface elements

## Implementation Strategy

### Phase 1: Quick Wins (Use Now)
1. **Kenny.nl UI Pack** for Teen theme buttons/panels
2. **CSS gradients** for Adult backgrounds (code-based, free)
3. **Phaser particle emitters** for effects (already have)
4. **Web fonts** from Google Fonts (free)

### Phase 2: Custom Asset Pipeline
1. **Use LLM image generation** (DALL-E, Midjourney, Stable Diffusion)
   - Generate backgrounds based on `artworkStyle` from theme config
   - Teen: "mystical fantasy realm, aurora borealis, floating crystals"
   - Adult: "calm gradient, soft blue, peaceful minimalist"
2. **Convert to Phaser-ready sprites**
3. **Store in `/public/assets/` directory**

### Phase 3: Conditional Asset Loading
```typescript
// In BaseScene
protected loadAssets(): void {
  if (this.isTeen()) {
    this.load.image('background', '/assets/teen/fantasy-realm.png');
    this.load.image('button', '/assets/teen/crystal-button.png');
    this.load.spritesheet('particles', '/assets/teen/magic-sparkles.png');
  } else {
    this.load.image('background', '/assets/adult/calm-gradient.png');
    this.load.image('button', '/assets/adult/modern-button.png');
    this.load.spritesheet('particles', '/assets/adult/soft-glow.png');
  }
}
```

## Recommended Asset Structure

```
public/assets/
├── teen/
│   ├── backgrounds/
│   │   ├── awakening-circle.png
│   │   ├── memory-constellation.png
│   │   ├── wisdom-tree.png
│   │   └── ...
│   ├── ui/
│   │   ├── fantasy-button.png
│   │   ├── crystal-panel.png
│   │   ├── magic-border.png
│   │   └── ...
│   ├── particles/
│   │   ├── sparkles.png
│   │   ├── wisps.png
│   │   └── magic-glow.png
│   └── characters/
│       ├── companion-glow.png
│       └── avatar-frames.png
├── adult/
│   ├── backgrounds/
│   │   ├── gradient-blue.png
│   │   ├── nature-calm.png
│   │   └── ...
│   ├── ui/
│   │   ├── clean-button.png
│   │   ├── professional-panel.png
│   │   └── ...
│   └── particles/
│       └── soft-glow.png
└── shared/
    ├── emotions/
    │   ├── angry-icon.png
    │   ├── joy-icon.png
    │   └── ...
    └── fonts/
        └── (web fonts loaded via CDN)
```

## Immediate Next Steps

### Option A: Use Existing Free Assets (Fast)
1. Download Kenny.nl UI Pack (teen theme)
2. Create simple gradients in code (adult theme)
3. Add conditional loading to BaseScene
4. Update Module 1 to use loaded assets

### Option B: Generate with LLM (Best Quality)
1. Use DALL-E/Midjourney API to generate:
   - Teen: 9 fantasy backgrounds (one per module)
   - Adult: 9 calming backgrounds
2. Save to `/public/assets/{age}/backgrounds/`
3. Add asset loader to each module
4. Reference in theme config

### Option C: Hybrid (Recommended)
1. **Teen**: Use Kenny.nl + generated fantasy elements
2. **Adult**: Use generated calming imagery + CSS gradients
3. **Both**: Use code-based particles (already working)
4. **Shared**: Emotion icons from FontAwesome/Heroicons

## Implementation Example

### Current State (No custom assets)
```typescript
create(): void {
  this.cameras.main.setBackgroundColor('#1A1A2E'); // Hard-coded
  this.createEmotionalWisps(); // Code-based particles
}
```

### With Asset Loading
```typescript
preload(): void {
  this.initializeTheme();

  if (this.isTeen()) {
    this.load.image('bg-module1', '/assets/teen/backgrounds/awakening-circle.png');
    this.load.image('ui-button', '/assets/teen/ui/fantasy-button.png');
  } else {
    this.load.image('bg-module1', '/assets/adult/backgrounds/calm-blue.png');
    this.load.image('ui-button', '/assets/adult/ui/clean-button.png');
  }
}

create(): void {
  this.initializeTheme();

  // Use loaded background image
  const bg = this.add.image(0, 0, 'bg-module1');
  bg.setOrigin(0, 0);
  bg.setDisplaySize(this.scale.width, this.scale.height);

  // Use loaded button texture
  const button = this.add.image(x, y, 'ui-button').setInteractive();
}
```

## License Compliance

### CC0 (Public Domain) - No attribution required
- Kenny.nl assets
- Quaternius 3D models (could render to 2D sprites)
- Some OpenGameArt assets

### CC-BY (Attribution required)
- Include credits in game
- Add to `/docs/CREDITS.md`

### Free with restrictions
- Some Freepik assets (check individual licenses)
- Always verify before using

## Tools for Asset Creation

### If we want to create custom assets:
1. **Figma** (free) - UI design
2. **Aseprite** ($20) - Pixel art
3. **GIMP** (free) - Image editing
4. **Inkscape** (free) - Vector graphics
5. **Stable Diffusion** (free) - AI generation

## Next Actions

1. ✅ **Decision needed**: Which approach? (A, B, or C above)
2. Create asset loading system in BaseScene
3. Download/generate initial assets
4. Update Module 1 as proof-of-concept
5. Apply to remaining modules
6. Document credits

Would you like me to:
- Start with Kenny.nl assets? (Quick)
- Set up LLM image generation? (Best quality)
- Create the asset loading infrastructure first? (Foundation)
