import { auth } from "../services/firebase";

export default function RevealPanel({
  game,
  players,
  onReveal,
  onHide
}) {
  const winner = players.find(
    p => p.uid === game.winnerUid
  );

  const isWinner =
    auth.currentUser?.uid === game.winnerUid;

  if (!winner) {
    return <p>Calculating winner...</p>;
  }

  return (
    <div>
      <h2>Winner: {winner.name}</h2>

      {isWinner ? (
        <>
          <p>You won! Choose whether to reveal your card.</p>

          <button onClick={onReveal}>
            Reveal Card
          </button>

          <button onClick={onHide}>
            Keep Secret
          </button>
        </>
      ) : (
        <p>
          Waiting for {winner.name} to decide whether to reveal.
        </p>
      )}
    </div>
  );
}