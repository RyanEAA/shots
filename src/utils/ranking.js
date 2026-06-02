const rankValues = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
};

const suitValues = {
  "♣": 1,
  "♦": 2,
  "♥": 3,
  "♠": 4
};

export function getWinner(
  players
) {

  let winner = null;

  for (const player of players) {

    if (player.folded)
      continue;

    if (!player.selectedCard)
      continue;

    if (!winner) {

      winner = player;

      continue;
    }

    const playerRank =
      rankValues[
        player.selectedCard.rank
      ];

    const winnerRank =
      rankValues[
        winner.selectedCard.rank
      ];

    // Higher rank wins
    if (playerRank > winnerRank) {

      winner = player;

      continue;
    }

    // Tie on rank
    if (playerRank === winnerRank) {

      const playerSuit =
        suitValues[
          player.selectedCard.suit
        ];

      const winnerSuit =
        suitValues[
          winner.selectedCard.suit
        ];

      if (
        playerSuit >
        winnerSuit
      ) {

        winner = player;

      }

    }

  }

  return winner;

}