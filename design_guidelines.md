# Charades Party Game - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from successful mobile party games like Heads Up!, Psych!, and Jackbox Games. The design prioritizes fun, clarity, and immediate usability on touch devices with a playful, energetic aesthetic.

## Core Design Principles

1. **Mobile-First Gaming**: Every element sized for thumb-friendly interaction
2. **Instant Clarity**: Players should understand the game state at a glance
3. **Playful Energy**: Vibrant, approachable design that feels like a party
4. **Zero Learning Curve**: Intuitive controls requiring no instructions

## Typography

**Primary Font**: Poppins (Google Fonts) - rounded, friendly, highly legible
- Game Title: 700 weight, 3xl-4xl
- Active Word/Phrase: 900 weight, 5xl-6xl (large and bold)
- Category Labels: 600 weight, xl
- Buttons: 600 weight, lg-xl
- Timer/Score: 700 weight, 2xl-3xl
- Settings/Instructions: 400 weight, base-lg

**Secondary Font**: Inter (Google Fonts) - for body text and small UI elements
- Menu items, settings descriptions: 400-500 weight

## Layout System

**Spacing Primitives**: Tailwind units of 3, 4, 6, 8, 12
- Button padding: p-4 to p-6
- Screen margins: p-6 to p-8
- Component gaps: gap-4 to gap-6
- Section spacing: mb-8 to mb-12

**Full-Screen Approach**: Each game state occupies the full viewport with centered content
- Use min-h-screen for all main screens
- Vertical centering with flex/grid
- Maximum content width: max-w-2xl for optimal readability

## Component Library

### Game Screens

**Welcome Screen**
- Full-screen centered layout
- Large game title with playful scaling
- Prominent "Start Game" button (w-64, h-16)
- Category icons grid preview (3 columns)
- Settings icon in top-right corner

**Category Selection**
- Grid layout of category cards (2 columns on mobile, 3-4 on tablet)
- Each card: rounded-2xl, p-6, with category icon and name
- Active selection indicated with scale transform and visual treatment
- "Start Playing" button fixed at bottom
- Back button top-left

**Active Gameplay Screen** (Most Critical)
- Word/phrase card: Large centered card (rounded-3xl, p-8-12) with shadow
- Timer: Circular progress indicator at top with seconds remaining
- Score counter: Top-right corner with icon
- Next/Skip button: Bottom center, extra large (w-48, h-16)
- Pause/Settings button: Top-left corner
- Category badge: Small pill at top of word card

**End Screen**
- Score celebration with large number display
- "Words Guessed" label
- Breakdown by category if multiple played
- "Play Again" and "Change Settings" buttons stacked
- Share score button

**Settings Menu**
- Modal overlay with blur backdrop
- Timer length selector: Segmented control (30s/60s/90s)
- Category toggles: List with switches
- Sound effects toggle
- Close button (X) top-right

### UI Components

**Buttons**
- Primary: Large rounded-full, px-8 py-4
- Secondary: Outlined style, rounded-full
- Icon buttons: Circular, p-3-4
- All buttons have active/pressed states with slight scale reduction

**Cards**
- Word cards: Rounded-3xl with heavy shadow, rotate slightly on appearance
- Category cards: Rounded-2xl with hover lift effect
- Settings cards: Rounded-xl, subtle shadow

**Timer**
- Circular SVG progress ring
- Pulsing animation when under 10 seconds
- Number display in center

**Progress Elements**
- Score: Animated counter with "+1" popup on increment
- Timer ring: Smooth countdown with segment fills

## Animations

**Strategic Use Only:**
- Card reveal: Slide-up + fade-in (300ms)
- Button press: Scale down to 0.95 (100ms)
- Timer warning: Gentle pulse when <10s
- Score increment: Number pop + confetti burst
- Screen transitions: Fade (200ms)
- Skip word: Card flip animation (400ms)

## Icons

**Heroicons** (via CDN) for all interface icons:
- Play/Pause: play-circle, pause-circle
- Settings: cog-6-tooth
- Close: x-mark
- Category icons: film (Movies), face-smile (Celebrities), sparkles (custom categories)
- Timer: clock
- Score: trophy
- Sound: speaker-wave

## Accessibility

- Minimum touch target: 44x44px
- High contrast text on all backgrounds
- Clear focus indicators for all interactive elements
- Haptic feedback via vibration API on button presses
- Alternative text for all icons

## Mobile Optimization

- Landscape support with adjusted layouts
- Safe areas for notched devices (iOS)
- Prevent zoom on input focus
- Touch-only interactions (no hover states)
- Swipe gestures: Swipe up to skip word (alternative to button)
- Prevent accidental page refresh on pull-down

## Sound Design

**Audio Cues** (using Web Audio API):
- Game start: Upbeat chime
- Correct guess (Next button): Positive ding
- Timer warning (10s left): Gentle tick-tock
- Timeout: Buzzer sound
- Skip: Whoosh sound

All sounds brief (<1s), optional via settings toggle

## Images

**No hero images needed** - This is a game app focused on dynamic text content. Use:
- Category illustration icons (simple, flat design SVGs)
- Decorative background patterns (subtle geometric shapes)
- Confetti/celebration graphics on end screen