# Card Bluff Game - Development Canvas

## Core Gameplay
1. Create Lobby
2. Join Lobby
3. Start Game
4. Generate & Shuffle Deck
5. Display 52 Face-Down Cards
6. Allow Each Player to Pick One Card
7. Reveal Only Player's Own Card
8. Betting Phase
9. Reveal Cards
10. Determine Winner
11. Award Pot
12. Start Next Round

---

## V1 Milestones

### Phase 1: Multiplayer Foundation
- Firebase project setup
- Anonymous authentication
- Lobby creation
- Lobby joining
- Real-time player list

### Phase 2: Card Selection
- Generate shuffled deck
- Render 52 face-down cards
- Lock selected cards
- Store card ownership
- Private card reveal

### Phase 3: Betting
- Check
- Bet
- Call
- Raise
- Fold
- Pot tracking

### Phase 4: Showdown
- Reveal remaining players
- Determine winner
- Award chips
- Round reset

---

## V2 Features

### Side Bets
- Highest Card
- Lowest Card
- Red Card
- Black Card

### Tournament Mode
- Starting chips
- Elimination
- Blind increases

### Mobile UI
- Responsive layout
- Touch-friendly card grid

---

## Recommended Stack

Frontend:
- React
- Vite
- Firebase SDK

Backend:
- Firebase Auth
- Firestore
- Firebase Hosting

---

## First Files To Create

src/
├── pages/
│   ├── Lobby.jsx
│   └── Game.jsx
├── components/
│   ├── CardGrid.jsx
│   ├── BettingPanel.jsx
│   ├── PlayerList.jsx
│   └── PotDisplay.jsx
├── services/
│   ├── firebase.js
│   └── gameService.js
├── utils/
│   ├── deck.js
│   └── ranking.js

---

## Immediate Next Task

Create a Vite React project and connect Firebase.

Commands:

npm create vite@latest card-bluff-game -- --template react
cd card-bluff-game
npm install firebase react-router-dom

Then create:
- firebase.js
- Lobby page
- Firestore game creation function
