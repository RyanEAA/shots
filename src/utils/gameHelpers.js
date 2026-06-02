export function getNextPlayer(
  playerOrder,
  currentUid
) {
  const currentIndex =
    playerOrder.indexOf(currentUid);

  const nextIndex =
    (currentIndex + 1) %
    playerOrder.length;

  return playerOrder[nextIndex];
}

export function advanceToNextActivePlayer(
  game,
  players
) {

  let nextUid =
    getNextPlayer(
      game.playerOrder,
      game.currentPlayerUid
    );

  while (true) {

    const player =
      players.find(
        p => p.uid === nextUid
      );

    if (
      player &&
      !player.folded
    ) {

      return nextUid;

    }

    nextUid =
      getNextPlayer(
        game.playerOrder,
        nextUid
      );

  }

}

export function getDealerUid(
  playerOrder,
  dealerIndex
) {
  return playerOrder[dealerIndex];
}

export function getSmallBlindUid(
  playerOrder,
  dealerIndex
) {
  return playerOrder[
    (dealerIndex + 1) %
    playerOrder.length
  ];
}

export function getBigBlindUid(
  playerOrder,
  dealerIndex
) {
  return playerOrder[
    (dealerIndex + 2) %
    playerOrder.length
  ];
}