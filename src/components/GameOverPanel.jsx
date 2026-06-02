export default function GameOverPanel({ players }) {
  const sorted = [...players].sort(
    (a, b) => b.chips - a.chips
  );

  return (
    <div>
      <h1>Game Over</h1>

      <h2>Final Results</h2>

      {sorted.map((player, index) => (
        <div key={player.uid}>
          {index + 1}. {player.name} — {player.chips} chips
        </div>
      ))}
    </div>
  );
}