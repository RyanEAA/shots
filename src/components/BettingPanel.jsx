import { auth } from "../services/firebase";

export default function BettingPanel({
  game,
  players,
  gameId,
  onCheck,
  onCall,
  onRaise,
  onFold
}) {

  const uid =
    auth.currentUser?.uid;

  const me =
    players.find(
      p => p.uid === uid
    );

  if (!me) {
    return null;
  }

  const isMyTurn =
    game.currentPlayerUid === uid;

  const amountToCall =
    Math.max(
      0,
      game.currentBet -
      me.currentBet
    );

  const canCheck =
    amountToCall === 0;

  const canCall =
    amountToCall > 0;

  const canRaise =
    !me.hasRaised &&
    me.chips > amountToCall;

  return (

    <div
      style={{
        border:
          "1px solid #ccc",
        padding: "16px",
        marginTop: "20px",
        borderRadius: "8px"
      }}
    >

      <h2>
        Betting
      </h2>

      <p>
        Pot:
        {" "}
        ${game.pot}
      </p>

      <p>
        Current Bet:
        {" "}
        ${game.currentBet}
      </p>

      <p>
        Your Bet:
        {" "}
        ${me.currentBet}
      </p>

      <p>
        Chips:
        {" "}
        ${me.chips}
      </p>

      <p>
        To Call:
        {" "}
        ${amountToCall}
      </p>

      {!isMyTurn && (

        <p>
          Waiting for
          {" "}
          {
            players.find(
              p =>
                p.uid ===
                game.currentPlayerUid
            )?.name
          }
        </p>

      )}

      {isMyTurn && (

        <div
          style={{
            display: "flex",
            gap: "10px"
          }}
        >

          <button
            disabled={!canCheck}
            onClick={() =>
              onCheck()
            }
          >
            Check
          </button>

          <button
            disabled={!canCall}
            onClick={() =>
              onCall()
            }
          >
            Call
          </button>

          <button
            disabled={!canRaise}
            onClick={() =>
              onRaise()
            }
          >
            Raise
          </button>

          <button
            onClick={() =>
              onFold()
            }
          >
            Fold
          </button>

        </div>

      )}

    </div>

  );

}