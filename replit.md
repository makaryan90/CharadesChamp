# Charades Party Game

## Project Overview
A vibrant, mobile-first charades-style party game built with React, TypeScript, and Tailwind CSS. Players select categories, race against a countdown timer, and guess words with friends in an engaging, touch-optimized interface.

## Recent Changes (November 9, 2025)
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
- ✅ Complete game with 5 categories (Movies, Animals, Celebrities, Actions, Objects)
- ✅ Vibrant design system with purple/cyan/orange color scheme using Poppins font
- ✅ All game screens: Welcome, Category Selection, Gameplay, Pause, End Screen
- ✅ Circular SVG countdown timer with visual feedback
- ✅ Web Audio API sound effects (start, correct, skip, timeout, tick)
- ✅ Haptic feedback via Vibration API
- ✅ Swipe gestures (swipe up to skip, swipe right for correct)
- ✅ Confetti animation on game end
- ✅ Settings modal for timer length (30s/60s/90s), category selection, and sound toggle
- ✅ localStorage for settings persistence
- ✅ Comprehensive word lists (60 words per category)
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
  status: "welcome" | "team-setup" | "category-select" | "playing" | "paused" | "ended"
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
- `client/src/pages/game.tsx` - Main game orchestrator
- `client/src/components/game/*` - All game UI components (including TeamSetup, GamePlay, EndScreen)
- `client/src/hooks/*` - Custom React hooks (useGameState, useGameSettings, useSoundEffects, useSaveGame)
- `client/src/lib/categories.ts` - Word lists for all categories (300+ words total)
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
1. **Multiple Categories**: 5 categories with 60 words each (300+ total words)
2. **Team Multiplayer Mode**: Play with 2-6 teams, rotating turns, individual scoring
3. **Customizable Timer**: Choose between 30s, 60s, or 90s per round
4. **Score Tracking**: Real-time score display with animated updates for teams and solo
5. **Sound Effects**: Web Audio API sounds for game events (optional)
6. **Haptic Feedback**: Vibration on button presses (mobile devices)
7. **Swipe Gestures**: Touch-friendly swipe controls for gameplay
8. **Settings Persistence**: Preferences saved to localStorage
9. **Confetti Celebration**: Animated confetti on game completion
10. **Responsive Design**: Optimized for all mobile devices and tablets
11. **Pause/Resume**: Ability to pause and resume during gameplay
12. **Exit Button**: Exit game early with confirmation, shows score summary
13. **Database Persistence**: Game history and team scores saved to PostgreSQL
14. **Main Menu Navigation**: Return to main menu from end screen

## Development

### Running the Project
```bash
npm run dev
```
The app runs on port 5000 (frontend and backend on same port via Vite).

### Testing
Comprehensive end-to-end tests validate:
- Complete solo user journey (welcome → categories → gameplay → end)
- Team mode flow (team setup → gameplay → rotation → rankings → database)
- Exit button with confirmation dialog
- Main menu navigation
- All interactive elements work correctly
- Mobile responsiveness (no horizontal scroll, proper touch targets)
- Timer accuracy and game state transitions
- Settings persistence across sessions
- Database persistence for games and teams

### Known Minor Issues
- Minor database save issue when exiting early (non-blocking for UI)
- ARIA description missing on settings modal (accessibility enhancement opportunity)

## Future Enhancements
- ✅ ~~Multiplayer team mode with score tracking~~ (COMPLETED)
- Difficulty levels (easy/medium/hard) with word complexity
- Custom category builder for user-created word lists
- Game history and statistics dashboard
- Social sharing features for scores
- Dark mode support (infrastructure in place)

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
