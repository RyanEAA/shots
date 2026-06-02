# Overview

Card Bluff is a multiplayer betting and bluffing game
built with React and Firebase.

Players secretly select cards from a shared deck,
bet based on confidence, and the winner may choose
whether to reveal their card.

The game supports:

• Real-time multiplayer
• Dealer rotation
• Small and Big blinds
• Turn-based card selection
• Turn-based betting
• Winner determination
• Hidden-information gameplay
• Multi-round matches


# Complete Round Sequence Diagram
```mermaid
sequenceDiagram

    participant Host
    participant Firestore
    participant Players

    Host->>Firestore: Start Round

    Firestore->>Players: Selecting Phase

    Players->>Firestore: Select Cards

    Firestore->>Players: Betting Phase

    Players->>Firestore: Check / Call / Raise / Fold

    Firestore->>Players: Reveal Phase

    Firestore->>Players: Winner Calculated

    Players->>Firestore: Reveal or Hide Card

    Firestore->>Players: Award Pot

    Firestore->>Players: Round End

    Host->>Firestore: Next Round
```

# Game Flow
```mermaid
flowchart TD

    A[Lobby]

    A -->|Host Starts Game| B[Dealer Assigned]

    B --> C[Blinds Posted]

    C --> D[Card Selection]

    D -->|All Players Select Cards| E[Betting]

    E -->|Check / Call / Raise / Fold Complete| F[Winner Calculation]

    F --> G[Reveal Phase]

    G -->|Winner Chooses| H{Reveal Card?}

    H -->|Yes| I[Show Winning Card]

    H -->|No| J[Keep Card Secret]

    I --> K[Pot Awarded]

    J --> K

    K --> L[Round End]

    L --> M{More Rounds?}

    M -->|Yes| B

    M -->|No| N[Game Over]
```

# File Responsibilities
## Components
**Game.jsx**
- Main game page and state listener.

**Lobby.jsx**
- Game creation and joining.

**CardGrid.jsx**
- 52-card selection grid.

**BettingPanel.jsx**
- Check, Call, Raise, Fold controls.

**GameInfoPanel.jsx**
- Round information and player status.

**RevealPanel.jsx**
- Winner reveal choice.

**RoundEndPanel.jsx**
- Round summary.

**GameOverPanel.jsx**
- Final rankings.

## Services
**gameService.js**
- Lobby management.

**roundService.js**
- Dealer assignment,
- blind posting,
- round initialization.

**cardService.js**
- Card selection.

**bettingService.js**
- Betting actions.

**revealService.js**
- Winner calculation and pot payout.

## Utilities
**deck.js**
- Deck generation and shuffling.

**ranking.js**
- Card comparison logic.

**pokerEngine.js**
- Dealer rotation, blind positions,
betting completion logic.

**gameHelpers.js**
Turn advancement helpers.

# Firestore Schema
## Firestore Collection Structure
```mermaid
flowchart TD

    G[games]

    G --> G1["{gameId}"]

    G1 --> GM["Game Metadata"]
    G1 --> RS["Round State"]
    G1 --> BS["Betting State"]
    G1 --> WS["Winner State"]

    G1 --> P[players]

    P --> P1["{uid}"]
    P --> P2["{uid}"]
    P --> P3["{uid}"]
```

## Firestore Entity Relationship Diagram

```mermaid
erDiagram

    GAME ||--o{ PLAYER : contains

    GAME {

        string gameId
        string hostId

        string status
        string phase

        int currentRound
        int maxRounds

        int dealerIndex

        string currentPlayerUid

        int currentBet
        int pot

        string winnerUid

        bool revealWinnerCard

        array playerOrder

        array deck

        map selectedCards
    }

    PLAYER {

        string uid

        string name

        int chips

        int currentBet

        bool folded

        bool hasActed

        bool hasRaised

        int selectedCardIndex

        object selectedCard
    }
```

## Game Document Breakdown
```mermaid
classDiagram

class Game {

    +hostId

    +status
    +phase

    +currentRound
    +maxRounds

    +dealerIndex

    +playerOrder

    +currentPlayerUid

    +currentBet
    +pot

    +deck

    +selectedCards

    +winnerUid
    +revealWinnerCard
}
```

# The Engine
The game is implemented as a state machine.

- Firestore stores the current phase.

- Clients subscribe to the game document.

- The UI automatically changes based on phase.

**Valid phases:**
- lobby
- selecting
- betting
- reveal
- roundEnd
- gameOver

# Diagrams
## Overall System Architecture
```mermaid
flowchart TD

    A[Players]

    A --> B[React UI]

    B --> C[Game.jsx]
    B --> D[CardGrid.jsx]
    B --> E[BettingPanel.jsx]
    B --> F[RevealPanel.jsx]

    C --> G[Services]

    G --> H[gameService.js]
    G --> I[roundService.js]
    G --> J[cardService.js]
    G --> K[bettingService.js]
    G --> L[revealService.js]

    H --> M[Game Engine]
    I --> M
    J --> M
    K --> M
    L --> M

    M --> N[pokerEngine.js]
    M --> O[ranking.js]
    M --> P[deck.js]

    N --> Q[(Firestore)]
    O --> Q
    P --> Q
```

## Game Machine
```mermaid
stateDiagram-v2

    [*] --> Lobby

    Lobby --> Selecting : Start Round

    Selecting --> Betting : All Players Selected

    Betting --> Reveal : Betting Complete

    Reveal --> RoundEnd : Winner Chooses Reveal

    RoundEnd --> Selecting : Next Round

    RoundEnd --> GameOver : Max Rounds Reached

    GameOver --> [*]
```


## Round Initialization
```mermaid
flowchart TD

    A[startRound]

    A --> B[Load Game]

    B --> C[Load Players]

    C --> D[Rotate Dealer]

    D --> E[Assign Small Blind]

    E --> F[Assign Big Blind]

    F --> G[Shuffle Deck]

    G --> H[Reset Players]

    H --> I[Set Phase Selecting]
```

## Card Selection Flow
```mermaid
flowchart TD

    A[Current Player]

    A --> B[Select Card]

    B --> C[pickCard]

    C --> D[Store selectedCard]

    D --> E[Mark Card Taken]

    E --> F[Advance Turn]

    F --> G{Everyone Picked?}

    G -->|No| H[Next Player]

    G -->|Yes| I[Betting Phase]
```

## Betting Engine
```mermaid
flowchart TD

    A[Current Player]

    A --> B{Action}

    B --> C[Check]
    B --> D[Call]
    B --> E[Raise]
    B --> F[Fold]

    C --> G[Update Firestore]
    D --> G
    E --> G
    F --> G

    G --> H[Advance Turn]

    H --> I{Betting Complete?}

    I -->|No| J[Next Player]

    I -->|Yes| K[Reveal Phase]
```

## Winner Determination
```mermaid
flowchart TD

    A[Players]

    A --> B[Remove Folded Players]

    B --> C[Compare Card Ranks]

    C --> D{Same Rank?}

    D -->|No| E[Winner]

    D -->|Yes| F[Compare Suits]

    F --> G[Spades]
    F --> H[Hearts]
    F --> I[Diamonds]
    F --> J[Clubs]

    G --> E
    H --> E
    I --> E
    J --> E
```

## Reveal Phase
```mermaid
flowchart TD

    A[Winner Determined]

    A --> B{Reveal Card?}

    B -->|Yes| C[Show Card]

    B -->|No| D[Keep Secret]

    C --> E[Award Pot]

    D --> E

    E --> F[Round End]
```

## Firestore Schema
```mermaid
erDiagram

    GAME ||--o{ PLAYER : contains

    GAME {
        string hostId
        string phase
        int currentRound
        int maxRounds
        int dealerIndex
        string currentPlayerUid
        int currentBet
        int pot
        string winnerUid
        bool revealWinnerCard
    }

    PLAYER {
        string uid
        string name
        int chips
        int currentBet
        bool folded
        bool hasActed
        bool hasRaised
        object selectedCard
    }
```

## Real-Time Synchronization
```mermaid
flowchart LR

    A[Player A Browser]

    B[(Firestore)]

    C[Player B Browser]

    D[Player C Browser]

    E[Player D Browser]

    A --> B

    B --> A

    B --> C

    B --> D

    B --> E
```

## Service Layer
```mermaid
flowchart TD

    A[Game.jsx]

    A --> B[roundService]

    A --> C[cardService]

    A --> D[bettingService]

    A --> E[revealService]

    B --> F[(Firestore)]

    C --> F

    D --> F

    E --> F
```