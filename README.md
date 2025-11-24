# Emotion Explorer Adventure Game 🎮✨

**A Fantasy/Magical Realism RPG for Emotional Intelligence**

Transform emotional exploration into an epic adventure. Help players aged 12-20 discover their inner superpowers through a therapeutic game experience based on Tian Dayton's Emotion Explorer framework.

---

## 🌟 Project Overview

**Emotion Explorer: Realm of Feelings** is a web-based adventure game where players:
- Embark on journeys through 16 distinct emotions
- Complete 9 therapeutic modules per emotion (transformed into game levels)
- Bond with an AI companion powered by Claude LLM
- Unlock emotion-based superpowers
- Develop emotional intelligence through engaging gameplay

**Platform:** Web (browser-based)
**Target Audience:** Ages 12-20 (with future adult adaptation)
**Timeline:** 16 weeks (4 months) for MVP
**Tech Stack:** Phaser 3, React, TypeScript, Claude API

---

## 🔑 Setup: Claude API Key (Required for Companion Chat)

The AI companion chat requires a Claude API key to function. Follow these steps:

**1. Get Your API Key:**
- Go to [https://console.anthropic.com/](https://console.anthropic.com/)
- Sign up or log in
- Navigate to "API Keys" and create a new key

**2. Configure Locally:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API key:
VITE_CLAUDE_API_KEY=sk-ant-your-actual-key-here
```

**3. Restart Dev Server:**
```bash
npm run dev
```

**Note**: Without the API key, the companion chat will use fallback responses. The rest of the game works fine without it.

---

## 📚 Complete Documentation

This project has comprehensive documentation split into 5 parts to stay under token limits:

### **[Part 1: Vision & Overview](./PRD_PART1_VISION_AND_OVERVIEW.md)**
- Executive Summary
- Current Emotion Explorer Analysis (original system)
- Game Vision & Objectives
- Target Audience & User Personas
- Core Game Pillars
- Game World & Narrative (The Realm of Emotions)
- Emotional Framework Integration

**Read this first** to understand the overall vision and narrative.

---

### **[Part 2: User Journeys & Module Specifications](./PRD_PART2_USER_JOURNEYS_AND_MODULES.md)**
- Character Creation & Onboarding
- Companion System (LLM Integration)
- **Detailed specifications for all 9 modules:**
  1. The Awakening Circle (Mood Meter)
  2. The Memory Constellation (Map Your Feelings)
  3. The Temple of Embodiment (Body Language)
  4. The Speaking Stone (Letter Writing)
  5. The Mirror Portal (Reverse Letter Writing)
  6. The Cathartic Falls (Feelings Journal)
  7. The Emotional Compass (Trajectories)
  8. The Wisdom Tree (Spiritual Awakening)
  9. The Ripple Pool (Intentions)
- Complete User Journey Maps
- Emotion Power System Details
- Game Loop & Session Structure

**Read this** for detailed gameplay mechanics and module designs.

---

### **[Part 3: Technical Architecture](./PRD_PART3_TECHNICAL_ARCHITECTURE.md)**
- Technology Stack (Phaser 3, React, TypeScript, Zustand, Dexie, Claude API)
- System Architecture Diagrams
- Component Design Patterns
- Data Models & TypeScript Types
- State Management (Zustand stores)
- LLM Integration Architecture
- Performance Requirements
- Security & Privacy
- Testing Strategy

**Read this** for technical implementation details.

---

### **[Part 4: Art Direction & Assets](./PRD_PART4_ART_DIRECTION_AND_ASSETS.md)**
- Visual Style Guide (Fantasy/Magical Realism)
- Color Psychology & Emotion Palette (16 emotions)
- Character Design Specifications
  - Player Avatar (customizable)
  - Companion Creature (evolving design)
- Environment & World Design (9 unique locations)
- UI/UX Visual Design
- Animation Specifications
- Particle & VFX Design
- Audio Design Brief
- Complete Asset List

**Read this** for art direction and asset creation.

---

### **[Part 5: Implementation Roadmap & THE PROMPT](./PRD_PART5_IMPLEMENTATION_ROADMAP.md)**
- MVP Scope Definition
- Development Phases (0-9)
- Sprint Breakdown (16 weeks)
- Testing & Quality Assurance
- Deployment Strategy
- Post-MVP Roadmap
- Risk Mitigation
- **🚀 THE COMPREHENSIVE IMPLEMENTATION PROMPT** ⭐

**Read this** for project planning and the master implementation prompt.

---

## 🎯 Quick Start Guide

### For Project Managers / Stakeholders:
1. Read **Part 1** (Vision) to understand the concept
2. Review **Part 5** (Roadmap) for timeline and scope
3. Check **Part 2** (Modules) for feature details

### For Developers:
1. Read **Part 3** (Technical Architecture) for tech stack
2. Read **Part 5** (Implementation) for the master prompt
3. Reference **Part 2** (Modules) while building each level
4. Use **Part 4** (Art Direction) for asset specifications

### For Designers/Artists:
1. Read **Part 1** (Vision) for narrative and world-building
2. Read **Part 4** (Art Direction) for complete visual guidelines
3. Reference **Part 2** (Modules) for environment designs

---

## 🌈 The 16 Emotions

Each emotion has its own color, domain, and power set:

| Emotion | Color | Domain Name | Primary Power |
|---------|-------|-------------|---------------|
| **Angry** | Dark Red | The Crimson Forge | Boundary Blade |
| **Anxious** | Burnt Orange | The Amber Thicket | Alert Network |
| **Scared** | Dark Gold | The Golden Caverns | Protective Shell |
| **Jealous** | Olive Green | The Jade Garden | Desire Sight |
| **Guilty** | Forest Green | The Emerald Depths | Conscience Compass |
| **Forgiving** | Periwinkle | The Sapphire Springs | Release Chains |
| **Joy** | Turquoise | The Crystal Meadows | Healing Light |
| **Lonely** | Muted Gold | The Bronze Wasteland | Connection Sense |
| **Playful** | Bright Yellow | The Sunlit Playground | Creative Spark |
| **Grateful** | Deep Teal | The Turquoise Temple | Abundance Sight |
| **Other** | Sage Green | The Twilight Crossroads | Pattern Recognition |
| **Hopeful** | Dusty Rose | The Rose Observatory | Future Vision |
| **Shameful** | Muted Pink | The Violet Veil | Hidden Truth |
| **Sad** | Deep Purple | The Purple Abyss | Deep Sight |
| **Stuck** | Lavender | The Lavender Labyrinth | Breaking Point |
| **Nervous** | Copper | The Copper Cliffs | Anticipatory Awareness |

---

## 🎮 The 9-Module Journey

Every emotion exploration follows the same therapeutic arc:

```
Module 1: The Awakening Circle → Identify emotion & intensity
Module 2: The Memory Constellation → Connect to life experiences
Module 3: The Temple of Embodiment → Explore body sensations
Module 4: The Speaking Stone → Express through letter writing
Module 5: The Mirror Portal → Practice perspective-taking
Module 6: The Cathartic Falls → Free emotional expression
Module 7: The Emotional Compass → Learn regulation patterns
Module 8: The Wisdom Tree → Extract lessons & meaning
Module 9: The Ripple Pool → Set intentions for change
```

**Duration:** 15 minutes to 2 hours per complete journey

---

## 💻 Technology Stack

**Frontend:**
- **Phaser 3** - 2D game engine
- **React 18** - UI layer
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - UI animations

**State & Data:**
- **Zustand** - State management
- **Dexie.js** - IndexedDB wrapper (local storage)

**AI Integration:**
- **Claude API** (Anthropic) - Companion chat

**Deployment:**
- **Vercel** or **Netlify** - Hosting
- **GitHub** - Version control

---

## 📅 Development Timeline (MVP)

**16 Weeks (4 Months):**

| Sprint | Weeks | Focus |
|--------|-------|-------|
| 1 | 1-2 | Foundation & Setup |
| 2 | 3-4 | Character Creation & Hub |
| 3 | 5-6 | Modules 1-3 |
| 4 | 7-8 | Modules 4-6 |
| 5 | 9-10 | Modules 7-9 |
| 6 | 11-12 | LLM Integration & Polish |
| 7 | 13-14 | Testing & Bug Fixes |
| 8 | 15-16 | Final Polish & Deployment |

---

## ✅ MVP Success Criteria

- ✅ All 9 modules fully playable
- ✅ Players can complete emotional journeys start-to-finish
- ✅ Save/load works reliably (no data loss)
- ✅ Companion provides helpful, empathetic AI responses
- ✅ Game runs at 30+ FPS on modern browsers
- ✅ Beautiful Fantasy/Magical Realism art style
- ✅ Positive feedback from beta testers (ages 12-20)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser (Chrome, Firefox, Safari)
- Claude API key (from Anthropic)

### Installation

```bash
# Clone repository
git clone [repository-url]
cd EmotionExplorerGame

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your VITE_CLAUDE_API_KEY to .env

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

---

## 🎨 Art Style

**Fantasy/Magical Realism** inspired by:
- Ori and the Blind Forest
- Gris
- Studio Ghibli films
- Journey

**Key Visual Elements:**
- Bioluminescent plants and creatures
- Emotional energy as visible light
- Ethereal, glowing atmospheres
- Hand-painted, illustrated quality
- Rich, emotion-specific color palettes

---

## 🧪 Testing

**Unit Tests:** Vitest (70%+ coverage target)
**Integration Tests:** Component and flow testing
**E2E Tests:** Playwright (critical user paths)
**User Testing:** 5-10 beta testers (target age)

---

## 📖 Therapeutic Framework

Based on **Tian Dayton's Emotion Explorer**, which emphasizes:
- Somatic awareness (body-emotion connection)
- Narrative therapy (writing for processing)
- Perspective-taking (empathy development)
- Emotional regulation (understanding intensity)
- Meaning-making (extracting wisdom)
- Action orientation (translating insights to behavior)

---

## 🔒 Privacy & Safety

**MVP (Local Storage Only):**
- All emotional data stored locally (IndexedDB)
- No cloud storage or user accounts
- No tracking or analytics

**Safety Features:**
- Crisis keyword detection (suicide, self-harm)
- Immediate resource provision
- Age-appropriate content filtering
- LLM safety prompts

**Post-MVP:**
- Optional cloud storage (encrypted)
- Parent/educator portals (aggregated data only)
- COPPA compliance for under-13

---

## 🤝 Contributing

This is a therapeutic game for vulnerable populations. All contributions should prioritize:
1. **Emotional Safety** - Never invalidate feelings
2. **Accessibility** - Clear, inclusive design
3. **Privacy** - Protect user data
4. **Quality** - Therapeutic integrity maintained
5. **Beauty** - Art that resonates emotionally

---

## 📄 License

[To be determined - suggest MIT or similar open license]

---

## 🙏 Acknowledgments

- **Tian Dayton** - Original Emotion Explorer therapeutic framework
- **Target Audience** - Young people (12-20) exploring their emotional worlds
- **Therapists & Educators** - Guidance on emotional intelligence development

---

## 📞 Contact & Support

**Project Lead:** [Your Name]
**Email:** [Contact Email]
**Issues:** [GitHub Issues Link]

---

## 🌟 Vision Statement

*"Embark on a mythical journey through the Realm of Emotions, where mastering your inner world grants you the power to transform reality. As a young Emotion Weaver, you'll unlock ancient emotional wisdom, bond with mystical companions, and discover that your greatest superpower lies within your own heart."*

---

**Let's create something beautiful that helps young people understand themselves.** 💜✨

---

## 📝 Documentation Index

- **[Part 1: Vision & Overview](./PRD_PART1_VISION_AND_OVERVIEW.md)** - Concept, narrative, world
- **[Part 2: User Journeys & Modules](./PRD_PART2_USER_JOURNEYS_AND_MODULES.md)** - Gameplay details
- **[Part 3: Technical Architecture](./PRD_PART3_TECHNICAL_ARCHITECTURE.md)** - Tech implementation
- **[Part 4: Art Direction & Assets](./PRD_PART4_ART_DIRECTION_AND_ASSETS.md)** - Visual design
- **[Part 5: Implementation Roadmap](./PRD_PART5_IMPLEMENTATION_ROADMAP.md)** - Timeline & master prompt

**Start with Part 1, then read the others based on your role.**

*Last Updated: 2025-01-22*
*Version: 1.0 MVP*
*Ready to Build* 🚀
