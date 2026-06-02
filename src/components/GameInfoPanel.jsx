export default function GameInfoPanel({
  game,
  players,
  currentPlayer
}) {

  const dealerPlayer =
    players.find(
      p =>
        p.uid ===
        game.playerOrder?.[
          game.dealerIndex
        ]
    );

  const smallBlindPlayer =
    players.find(
      p =>
        p.uid ===
        game.playerOrder?.[
          (game.dealerIndex + 1)
          %
          players.length
        ]
    );

  const bigBlindPlayer =
    players.find(
      p =>
        p.uid ===
        game.playerOrder?.[
          (game.dealerIndex + 2)
          %
          players.length
        ]
    );

  const currentTurnPlayer =
    players.find(
      p =>
        p.uid ===
        game.currentPlayerUid
    );

    

  return (

    <div
      style={{
        border:
          "1px solid #ccc",
        padding: "16px",
        marginBottom: "20px",
        borderRadius: "8px"
      }}
    >

      <h2>
        Round Information
      </h2>

      <p>
        Round:
        {" "}
        {game.currentRound}
        {" / "}
        {game.maxRounds}
      </p>

      <p>
        Phase:
        {" "}
        {game.phase}
      </p>

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

      <hr />

      <p>
        Dealer:
        {" "}
        {
          dealerPlayer?.name
        }
      </p>

      <p>
        Small Blind:
        {" "}
        {
          smallBlindPlayer?.name
        }
      </p>

      <p>
        Big Blind:
        {" "}
        {
          bigBlindPlayer?.name
        }
      </p>

      <p>
        Current Turn:
        {" "}
        {
          currentTurnPlayer?.name
        }
      </p>

      <hr />

      <h3>
        Your Status
      </h3>

      <p>
        Chips:
        {" "}
        {
          currentPlayer?.chips
        }
      </p>

      <p>
        Current Bet:
        {" "}
        {
          currentPlayer?.currentBet
        }
      </p>

      <p>
        Folded:
        {" "}
        {
          currentPlayer?.folded
            ? "Yes"
            : "No"
        }
      </p>

      <hr />

    <h3>Your Card</h3>

    {
    currentPlayer?.selectedCard
        ? (
            <h1>

            {
                currentPlayer
                .selectedCard.rank
            }

            {
                currentPlayer
                .selectedCard.suit
            }

            </h1>
        )
        : (
            <p>
            No card selected
            </p>
        )
    }

    </div>

  );

}