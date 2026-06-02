export function rotateDealer(
  currentDealerIndex,
  playerCount
) {
  return (
    currentDealerIndex + 1
  ) % playerCount;
}

export function getSmallBlindIndex(
  dealerIndex,
  playerCount
) {
  return (
    dealerIndex + 1
  ) % playerCount;
}

export function getBigBlindIndex(
  dealerIndex,
  playerCount
) {
  return (
    dealerIndex + 2
  ) % playerCount;
}

export function getFirstActorIndex(
  dealerIndex,
  playerCount
) {
  return (
    dealerIndex + 3
  ) % playerCount;
}

export function isBettingRoundComplete(
  game,
  players
) {

  const activePlayers =
    players.filter(
      p => !p.folded
    );

  return activePlayers.every(
    p =>
      p.currentBet ===
      game.currentBet
  );

}