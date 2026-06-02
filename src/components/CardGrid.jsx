// src/components/CardGrid.jsx

import {
  doc,
  getDoc,
  getDocs,
  collection,
  writeBatch
} from "firebase/firestore";

import { auth } from "../services/firebase";
import { pickCard } from "../services/cardService";

export default function CardGrid({
  deck,
  game,
  players,
  gameId
}) {

  const uid =
    auth.currentUser?.uid;

  const isMyTurn =
    uid === game.currentPlayerUid;

  const me =
    players.find(
      player =>
        player.uid === uid
    );

  const alreadyPicked =
    !!me?.selectedCard;

  async function handlePick(
    index
  ) {

    try {

      await pickCard(
        gameId,
        uid,
        index
      );

    }
    catch (err) {

      console.error(err);

      alert(err.message);

    }

  }

  return (

    <div>

      <h3>

        {
          isMyTurn
            ? "Your Turn"
            : "Waiting For Other Players..."
        }

      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(13, 1fr)",
          gap: "6px"
        }}
      >

        {deck.map(
          (card, index) => {

            const taken =
              game.selectedCards?.[
                index
              ];

            return (

              <button
                key={index}

                disabled={
                  taken ||
                  !isMyTurn ||
                  alreadyPicked
                }

                onClick={() =>
                  handlePick(index)
                }

                style={{
                  height: "80px",
                  fontSize: "24px",
                  cursor:
                    taken ||
                    !isMyTurn ||
                    alreadyPicked
                      ? "not-allowed"
                      : "pointer"
                }}
              >

                {
                  taken
                    ? "❌"
                    : "🂠"
                }

              </button>

            );

          }
        )}

      </div>

    </div>

  );

}