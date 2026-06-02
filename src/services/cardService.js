import {
  doc,
  collection,
  getDocs,
  runTransaction
} from "firebase/firestore";

import { db } from "./firebase";


export async function pickCard(
  gameId,
  uid,
  cardIndex
) {

  const gameRef =
    doc(db, "games", gameId);

  const playerRef =
    doc(
      db,
      "games",
      gameId,
      "players",
      uid
    );

  await runTransaction(
    db,
    async (transaction) => {

      const gameSnap =
        await transaction.get(
          gameRef
        );

      const playerSnap =
        await transaction.get(
          playerRef
        );

      if (
        !gameSnap.exists()
      ) {
        throw new Error(
          "Game not found"
        );
      }

      if (
        !playerSnap.exists()
      ) {
        throw new Error(
          "Player not found"
        );
      }

      const game =
        gameSnap.data();

      const player =
        playerSnap.data();

      // -------------------
      // Must be selecting
      // -------------------

      if (
        game.phase !==
        "selecting"
      ) {
        throw new Error(
          "Not selecting phase"
        );
      }

      // -------------------
      // Must be player's turn
      // -------------------

      if (
        game.currentPlayerUid
        !== uid
      ) {
        throw new Error(
          "Not your turn"
        );
      }

      // -------------------
      // Already picked?
      // -------------------

      if (
        player.selectedCard
      ) {
        throw new Error(
          "Already selected"
        );
      }

      const selected =
        game.selectedCards || {};

      // -------------------
      // Card already taken?
      // -------------------

      if (
        selected[cardIndex]
      ) {
        throw new Error(
          "Card already taken"
        );
      }

      const card =
        game.deck[
          cardIndex
        ];

      // -------------------
      // Save card
      // -------------------

      transaction.update(
        playerRef,
        {

          selectedCardIndex:
            cardIndex,

          selectedCard:
            card

        }
      );

      // -------------------
      // Update selected cards
      // -------------------

      const updatedSelected =
      {
        ...selected,

        [cardIndex]:
          uid
      };

      const selectedCount =
        Object.keys(
          updatedSelected
        ).length;


      // -------------------
      // Advance turn
      // -------------------

      const currentIndex =
        game.playerOrder
          .indexOf(uid);

      const nextIndex =
        (
          currentIndex + 1
        )
        %
        game.playerOrder
          .length;

      const nextPlayerUid =
        game.playerOrder[
          nextIndex
        ];

      transaction.update(
        gameRef,
        {

          selectedCards:
            updatedSelected,

          currentPlayerUid:
            nextPlayerUid

        }
      );

            // -------------------
      // Everyone selected?
      // -------------------

      if (
        selectedCount >=
        game.playerOrder
          .length
      ) {

        transaction.update(
          gameRef,
          {

            selectedCards:
              updatedSelected,

            phase:
              "betting"

          }
        );

        return;
      }


    }
  );

}