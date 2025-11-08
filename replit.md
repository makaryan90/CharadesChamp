# Charades Party Game

## Project Overview
A vibrant, mobile-first charades-style party game built with React, TypeScript, and Tailwind CSS. Players select categories, race against a countdown timer, and guess words with friends in an engaging, touch-optimized interface.

## Recent Changes (November 8, 2025)
- ✅ Implemented complete game with 5 categories (Movies, Animals, Celebrities, Actions, Objects)
- ✅ Created vibrant design system with purple/cyan/orange color scheme using Poppins font
- ✅ Built all game screens: Welcome, Category Selection, Gameplay, Pause, End Screen
- ✅ Added circular SVG countdown timer with visual feedback
- ✅ Implemented Web Audio API sound effects (start, correct, skip, timeout, tick)
- ✅ Added haptic feedback via Vibration API
- ✅ Implemented swipe gestures (swipe up to skip, swipe right for correct)
- ✅ Added confetti animation on game end
- ✅ Created settings modal for timer length (30s/60s/90s), category selection, and sound toggle
- ✅ Implemented localStorage for settings persistence
- ✅ Added comprehensive word lists (60 words per category)
- ✅ All components use Lucide React icons (Film, Dog, Star, Sparkles, Package)
- ✅ Successfully tested complete user journey end-to-end

## Project Architecture

### Frontend (Client-Side Game)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: Wouter (single-page app)
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Animations**: CSS transitions, Tailwind animations, react-confetti
- **Icons**: Lucide React

### Game Logic
All game logic runs client-side with no backend dependencies:
- Game state management in `useGameState` hook
- Settings persistence via localStorage in `useGameSettings` hook
- Sound effects via Web Audio API in `useSoundEffects` hook
- Swipe gesture detection in `useSwipeGesture` hook

### Data Structure
```typescript
GameState {
  status: "welcome" | "category-select" | "playing" | "paused" | "ended"
  score: number
  currentWord: string | null
  currentCategory: string | null
  timeRemaining: number
  wordsGuessed: string[]
}

GameSettings {
  timerLength: "30" | "60" | "90"
  selectedCategories: string[]
  soundEnabled: boolean
}
```

### Key Files
- `client/src/pages/game.tsx` - Main game orchestrator
- `client/src/components/game/*` - All game UI components
- `client/src/hooks/*` - Custom React hooks for game logic
- `client/src/lib/categories.ts` - Word lists for all categories (300+ words total)
- `client/src/lib/iconMap.tsx` - Lucide icon mapping helper
- `client/src/index.css` - Design tokens and custom animations
- `shared/schema.ts` - TypeScript types for game state

## Design Guidelines
The game follows a mobile-first, vibrant party game aesthetic:
- **Colors**: Purple primary (#9747FF), Cyan secondary (#14D4E8), Orange accent (#FF8A3D)
- **Typography**: Poppins (friendly, rounded) for all text
- **Spacing**: Consistent 4/6/8/12 spacing scale
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Animations**: Smooth transitions (200-300ms), strategic use only
- **Accessibility**: High contrast text, clear focus indicators, haptic feedback

## Features
1. **Multiple Categories**: 5 categories with 60 words each (300+ total words)
2. **Customizable Timer**: Choose between 30s, 60s, or 90s per round
3. **Score Tracking**: Real-time score display with animated updates
4. **Sound Effects**: Web Audio API sounds for game events (optional)
5. **Haptic Feedback**: Vibration on button presses (mobile devices)
6. **Swipe Gestures**: Touch-friendly swipe controls for gameplay
7. **Settings Persistence**: Preferences saved to localStorage
8. **Confetti Celebration**: Animated confetti on game completion
9. **Responsive Design**: Optimized for all mobile devices and tablets
10. **Pause/Resume**: Ability to pause and resume during gameplay

## Development

### Running the Project
```bash
npm run dev
```
The app runs on port 5000 (frontend and backend on same port via Vite).

### Testing
Comprehensive end-to-end tests validate:
- Complete user journey (welcome → categories → gameplay → end)
- All interactive elements work correctly
- Mobile responsiveness (no horizontal scroll, proper touch targets)
- Timer accuracy and game state transitions
- Settings persistence across sessions

### Known Minor Issues
- ARIA description missing on settings modal (accessibility enhancement opportunity)
- Transient timeout during rapid state changes (non-blocking, recovers automatically)

## Future Enhancements
- Multiplayer team mode with score tracking
- Difficulty levels (easy/medium/hard) with word complexity
- Custom category builder for user-created word lists
- Game history and statistics dashboard
- Social sharing features for scores
- Dark mode support (infrastructure in place)

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React
- **Animations**: CSS transitions, react-confetti
- **Storage**: localStorage for settings
- **Audio**: Web Audio API
- **Backend**: Express.js (minimal, serves static files only)

## Deployment
The app is ready for deployment. All assets are bundled client-side with no external dependencies or API requirements.
