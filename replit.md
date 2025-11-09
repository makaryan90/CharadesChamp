# Charades Party Game

## Project Overview
A vibrant, mobile-first charades-style party game built with React, TypeScript, and Tailwind CSS. Players select categories, race against a countdown timer, and guess words with friends in an engaging, touch-optimized interface.

## Recent Changes (November 9, 2025)

### Phase 1: Enhanced Navigation & Premium Features (COMPLETED)
- ✅ **Main Menu Redesign** - New MainMenu component with Quick Start, Create Teams, How to Play, Settings, and Subscribe buttons
- ✅ **Quick Start Flow** - Streamlined game setup with category grid and timer selection, bypasses traditional category select
- ✅ **Premium Subscription System** - Simulated premium unlock via localStorage (no real payments)
  - FREE_CATEGORY_LIMIT = 5 (Movies, Animals, Celebrities, Actions, Objects are free)
  - Premium categories (Music, Sports, Food & Drinks, Travel & Places) require unlock
  - Locked categories show lock icons and "Premium" badges
  - Subscription modal with monthly ($4.99) and annual ($29.99) pricing plans
  - Premium state persists across page reloads
- ✅ **Expanded Categories** - Added 4 new premium categories for 9 total (540+ words)
- ✅ **How to Play Screen** - Tutorial screen with illustrated game mechanics and controls
- ✅ **Locked Category UI** - Click locked categories to open subscription modal
- ✅ **Premium Unlock Flow** - "Unlock Now (Demo)" simulates premium purchase
- ✅ **Navigation Consistency** - All screens properly integrate with subscription modal

### Team Multiplayer Mode
- ✅ Database setup with PostgreSQL (games, teams, customCategories tables)
- ✅ Team setup screen for 2-6 teams with custom names and colors
- ✅ Team rotation with "Pass to Next Team" button
- ✅ Individual team scoring and current team indicator
- ✅ Team rankings on end screen with winner announcement
- ✅ Database persistence for team games (proper normalization)
- ✅ Fixed Tailwind color classes for production compatibility

### Exit & Navigation
- ✅ Exit button (X icon) next to pause button with confirmation dialog
- ✅ Main Menu button on end screen to return to welcome screen
- ✅ Early game exit preserves score and shows summary

### Previous Features (November 8, 2025)
- ✅ Complete game with 9 categories (5 free + 4 premium)
- ✅ Vibrant design system with purple/cyan/orange color scheme using Poppins font
- ✅ All game screens: Main Menu, Quick Start, Category Selection, Gameplay, Pause, End Screen, How to Play
- ✅ Circular SVG countdown timer with visual feedback
- ✅ Web Audio API sound effects (start, correct, skip, timeout, tick)
- ✅ Haptic feedback via Vibration API
- ✅ Swipe gestures (swipe up to skip, swipe right for correct)
- ✅ Confetti animation on game end
- ✅ Settings modal for timer length (30s/60s/90s), category selection, and sound toggle
- ✅ localStorage for settings persistence
- ✅ Comprehensive word lists (60 words per category, 540+ total)
- ✅ All components use Lucide React icons

## Project Architecture

### Frontend (Client-Side Game)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: Wouter (single-page app)
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Animations**: CSS transitions, Tailwind animations, react-confetti
- **Icons**: Lucide React

### Game Logic & Backend
Game logic runs client-side with backend for persistence:
- Game state management in `useGameState` hook (supports solo & team modes)
- Settings persistence via localStorage in `useGameSettings` hook
- Sound effects via Web Audio API in `useSoundEffects` hook
- Swipe gesture detection in `useSwipeGesture` hook
- Database persistence for game history and team scores via PostgreSQL/Drizzle ORM
- Express.js API routes for game/team CRUD operations

### Data Structure
```typescript
GameState {
  status: "welcome" | "main-menu" | "quick-start" | "how-to-play" | "subscribe" | "team-setup" | "category-select" | "playing" | "paused" | "ended"
  score: number
  currentWord: string | null
  currentCategory: string | null
  timeRemaining: number
  wordsGuessed: string[]
  gameMode: "solo" | "team"
  teams?: Team[]
  currentTeamIndex?: number
}

Team {
  name: string
  score: number
  color: string
}

GameSettings {
  timerLength: "30" | "60" | "90"
  selectedCategories: string[]
  soundEnabled: boolean
  gameMode: "solo" | "team"
}

Database Schema {
  games: { id, mode, teamCount, finalScore, duration, categories, difficulty, wordsGuessed, createdAt }
  teams: { id, gameId, name, score, color, orderIndex }
  customCategories: { id, userId, name, words[], createdAt }
}
```

### Key Files
- `client/src/pages/game.tsx` - Main game orchestrator with navigation state management
- `client/src/components/game/*` - All game UI components:
  - `MainMenu.tsx` - Enhanced main menu with Quick Start, Create Teams, How to Play, Settings, Subscribe
  - `QuickStart.tsx` - Streamlined game setup with category grid and timer selection
  - `HowToPlay.tsx` - Tutorial screen with game mechanics
  - `SubscriptionModal.tsx` - Premium unlock modal with pricing plans
  - `CategorySelect.tsx` - Full category selection with locked category support
  - `CategoryCard.tsx` - Reusable category card with lock state
  - `TeamSetup.tsx`, `GamePlay.tsx`, `EndScreen.tsx` - Core game screens
- `client/src/hooks/*` - Custom React hooks (useGameState, useGameSettings, useSoundEffects, useSaveGame)
- `client/src/lib/categories.ts` - Word lists for all 9 categories (540+ words total)
- `client/src/lib/iconMap.tsx` - Lucide icon mapping helper
- `client/src/index.css` - Design tokens and custom animations
- `shared/schema.ts` - TypeScript types and Zod schemas for game state and database
- `server/storage.ts` - Database storage interface (IStorage) and DbStorage implementation
- `server/routes.ts` - API routes for games, teams, and categories

## Design Guidelines
The game follows a mobile-first, vibrant party game aesthetic:
- **Colors**: Purple primary (#9747FF), Cyan secondary (#14D4E8), Orange accent (#FF8A3D)
- **Typography**: Poppins (friendly, rounded) for all text
- **Spacing**: Consistent 4/6/8/12 spacing scale
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Animations**: Smooth transitions (200-300ms), strategic use only
- **Accessibility**: High contrast text, clear focus indicators, haptic feedback

## Features
1. **Enhanced Navigation**: Main menu with Quick Start, Create Teams, How to Play, Settings, Subscribe buttons
2. **Multiple Categories**: 9 categories (5 free + 4 premium) with 60 words each (540+ total words)
3. **Premium Subscription System**: Simulated premium unlock with locked categories and subscription modal
4. **Quick Start Flow**: Streamlined game setup bypassing traditional category selection
5. **Team Multiplayer Mode**: Play with 2-6 teams, rotating turns, individual scoring
6. **Customizable Timer**: Choose between 30s, 60s, or 90s per round
7. **Score Tracking**: Real-time score display with animated updates for teams and solo
8. **Sound Effects**: Web Audio API sounds for game events (optional)
9. **Haptic Feedback**: Vibration on button presses (mobile devices)
10. **Swipe Gestures**: Touch-friendly swipe controls for gameplay
11. **Settings Persistence**: Preferences saved to localStorage
12. **Confetti Celebration**: Animated confetti on game completion
13. **Responsive Design**: Optimized for all mobile devices and tablets
14. **Pause/Resume**: Ability to pause and resume during gameplay
15. **Exit Button**: Exit game early with confirmation, shows score summary
16. **Database Persistence**: Game history and team scores saved to PostgreSQL
17. **How to Play Screen**: In-game tutorial explaining mechanics and controls
18. **Premium Persistence**: Premium unlock state preserved across page reloads

## Development

### Running the Project
```bash
npm run dev
```
The app runs on port 5000 (frontend and backend on same port via Vite).

### Testing
Comprehensive end-to-end tests validate:
- **Phase 1 Navigation**: Main menu → Quick Start → locked categories → subscription modal → unlock
- Complete solo user journey (main menu → quick start/categories → gameplay → end)
- Team mode flow (team setup → gameplay → rotation → rankings → database)
- **Premium Unlock Flow**: Locked categories → subscription modal → unlock → persistence across reloads
- Exit button with confirmation dialog
- Main menu navigation
- All interactive elements work correctly
- Mobile responsiveness (no horizontal scroll, proper touch targets)
- Timer accuracy and game state transitions
- Settings persistence across sessions
- Database persistence for games and teams
- Premium state persistence in localStorage

### Known Minor Issues
- None identified in Phase 1

## Future Enhancements (Phase 2+)
- ✅ ~~Multiplayer team mode with score tracking~~ (COMPLETED)
- ✅ ~~Premium subscription system with locked categories~~ (COMPLETED)
- ✅ ~~Enhanced navigation with main menu~~ (COMPLETED)
- Enhanced Team Creation with emoji/icon picker and color selection
- Tilt control support with DeviceMotionEvent API and settings toggle
- Video replay placeholder UI for results screens
- Difficulty levels (easy/medium/hard) with word complexity
- Custom category builder for user-created word lists
- Game history and statistics dashboard
- Social sharing features for scores
- Dark mode support (infrastructure in place)
- Real payment integration for premium unlock

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom design tokens, Shadcn UI components
- **Icons**: Lucide React
- **Animations**: CSS transitions, react-confetti
- **State Management**: React hooks, localStorage for settings
- **Audio**: Web Audio API
- **Backend**: Express.js with REST API
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Form Validation**: React Hook Form, Zod schemas

## Deployment
The app is ready for deployment with full-stack capabilities including database persistence for game history and team scores.
