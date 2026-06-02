export default function RoundEndPanel({
  game,
  players,
  isHost,
  onNextRound
}) {
  const winner = players.find(
    p => p.uid === game.winnerUid
  );

  return (
    <div>
      <h2>Round Complete</h2>

      <h3>Winner: {winner?.name}</h3>

      {game.revealWinnerCard ? (
        <h1>
          {winner?.selectedCard?.rank}
          {winner?.selectedCard?.suit}
        </h1>
      ) : (
        <p>Winner kept their card secret.</p>
      )}

      {isHost && (
        <button onClick={onNextRound}>
          Next Round
        </button>
      )}
    </div>
  );
}