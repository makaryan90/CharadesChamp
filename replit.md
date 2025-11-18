# Charades Party Game

## Overview
This project is a mobile-first, charades-style party game built with React, TypeScript, and Tailwind CSS. It allows players to select categories, guess words against a countdown timer, and interact through a touch-optimized interface. The game aims to provide an engaging experience for friends, incorporating features like team play, customizable settings, and a premium subscription model for expanded content. Its vision is to be a go-to digital party game, offering a fun and interactive experience with continuous enhancements and a robust, scalable architecture.

## User Preferences
No specific user preferences were provided in the original `replit.md` file.

## System Architecture
The game follows a mobile-first, vibrant party game aesthetic with a purple, cyan, and orange color scheme and Poppins font.

### Frontend (Client-Side Game)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens, Shadcn UI components
- **Routing**: Wouter (single-page application)
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Animations**: CSS transitions, Tailwind animations, react-confetti
- **Icons**: Lucide React
- **Audio**: Web Audio API for sound effects
- **Haptics**: Vibration API for feedback
- **Gesture Control**: Swipe gestures for gameplay

### Backend
- **Server**: Express.js for REST API
- **Database**: PostgreSQL (Neon) with Drizzle ORM for persistence

### Core Features & Design Decisions
- **Game Modes**: Supports both solo and team play.
- **Navigation**: Enhanced MainMenu component with Quick Start, Create Teams, How to Play, Settings, and Subscribe options.
- **Quick Start Flow**: Streamlined game setup bypassing traditional category selection.
- **Premium Subscription System**: Simulated premium unlock with locked categories (5 free, 4 premium) and a subscription modal. Premium state persists across reloads.
- **Team Multiplayer Mode**: Supports 2-6 teams with custom names and colors, team rotation, individual scoring, and team rankings. Team names and colors persist on "Play Again".
- **Customizable Timer**: Options for 30s, 60s, or 90s per round.
- **Score Tracking**: Real-time display with animated updates.
- **Settings Persistence**: User preferences saved to localStorage.
- **Round Management**: Timer resets and game state transitions correctly between rounds and team turns.
- **Exit & Navigation**: Exit button with confirmation and a Main Menu button on the end screen.
- **Word Lists**: Comprehensive word lists (60 words per category, 540+ total).
- **Responsive Design**: Optimized for all mobile devices and tablets, with consistent spacing and touch targets.

### Data Structures
- **GameState**: Manages game status, score, current word, time, words guessed, game mode, teams, and current team index.
- **Team**: Defines team name, score, and color.
- **GameSettings**: Stores timer length, selected categories, sound toggle, and game mode.
- **Database Schema**: Includes tables for `games` (mode, teamCount, finalScore, duration, categories, wordsGuessed), `teams` (gameId, name, score, color), and `customCategories` (userId, name, words[]).

## External Dependencies
- **React 18**: Frontend library
- **TypeScript**: Superset of JavaScript for type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Wouter**: Small routing library for React
- **Lucide React**: Icon library
- **react-confetti**: For confetti animations
- **Web Audio API**: For sound effects
- **Vibration API**: For haptic feedback
- **Express.js**: Backend web application framework
- **PostgreSQL (Neon)**: Database
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **React Hook Form**: For form validation
- **Zod**: TypeScript-first schema declaration and validation library