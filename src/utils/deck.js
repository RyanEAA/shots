const suits = ["♠", "♥", "♦", "♣"];
const ranks = [
  "A","K","Q","J",
  "10","9","8","7",
  "6","5","4","3","2"
];

export function createDeck() {
  const deck = [];

  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({
        id: `${rank}${suit}`,
        rank,
        suit
      });
    });
  });

  return shuffle(deck);
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}