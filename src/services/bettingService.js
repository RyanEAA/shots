import {
  doc,
  collection,
  getDocs,
  runTransaction
} from "firebase/firestore";

import { advanceToNextActivePlayer } from "../utils/gameHelpers";

import { isBettingRoundComplete } from "../utils/pokerEngine";

import { db } from "./firebase";

export async function foldBet(
  gameId,
  uid
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
        await transaction.get(gameRef);

      const playerSnap =
        await transaction.get(playerRef);

      const playersSnap =
        await getDocs(
          collection(
            db,
            "games",
            gameId,
            "players"
          )
        );

      const game =
        gameSnap.data();

      const players =
        playersSnap.docs.map(
          d => d.data()
        );

      transaction.update(
        playerRef,
        {
          folded: true
        }
      );

      const updatedPlayers =
        players.map(p =>
          p.uid === uid
            ? {
                ...p,
                folded: true
              }
            : p
        );

      const activePlayers =
        updatedPlayers.filter(
          p => !p.folded
        );

      if (
        activePlayers.length <= 1
      ) {

        transaction.update(
          gameRef,
          {
            phase: "reveal"
          }
        );

        return;
      }

      const nextPlayerUid =
        advanceToNextActivePlayer(
          game,
          updatedPlayers
        );

      transaction.update(
        gameRef,
        {
          currentPlayerUid:
            nextPlayerUid
        }
      );

    }
  );

}

export async function callBet(
  gameId,
  uid
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
        await transaction.get(gameRef);

      const playerSnap =
        await transaction.get(playerRef);

      const game =
        gameSnap.data();

      const player =
        playerSnap.data();

      const amountToCall =
        game.currentBet -
        player.currentBet;

      transaction.update(
        playerRef,
        {
          chips:
            player.chips -
            amountToCall,

          currentBet:
            game.currentBet
        }
      );

      const playersSnap =
        await getDocs(
          collection(
            db,
            "games",
            gameId,
            "players"
          )
        );

      const players =
        playersSnap.docs.map(
          d => d.data()
        );

      const nextPlayerUid =
        advanceToNextActivePlayer(
          game,
          players
        );

      transaction.update(
        gameRef,
        {
          pot:
            game.pot +
            amountToCall,

          currentPlayerUid:
            nextPlayerUid
        }
      );

    }
  );

}

export async function checkBet(
  gameId,
  uid
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
        await transaction.get(gameRef);

      const game =
        gameSnap.data();

      const playersSnap =
        await getDocs(
          collection(
            db,
            "games",
            gameId,
            "players"
          )
        );

      const players =
        playersSnap.docs.map(
          d => d.data()
        );

      transaction.update(
        playerRef,
        {
          hasActed: true
        }
      );

      const updatedPlayers =
        players.map(
          p =>
            p.uid === uid
              ? {
                  ...p,
                  hasActed: true
                }
              : p
        );

      if (
        isBettingRoundComplete(
          game,
          updatedPlayers
        )
      ) {

        transaction.update(
          gameRef,
          {
            phase: "reveal"
          }
        );

        return;
      }

      const nextPlayerUid =
        advanceToNextActivePlayer(
          game,
          updatedPlayers
        );

      transaction.update(
        gameRef,
        {
          currentPlayerUid:
            nextPlayerUid
        }
      );

    }
  );

}

export async function raiseBet(
  gameId,
  uid
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
        await transaction.get(gameRef);

      const playerSnap =
        await transaction.get(playerRef);

      const game =
        gameSnap.data();

      const player =
        playerSnap.data();

      if (
        player.hasRaised
      ) {

        throw new Error(
          "Already raised"
        );

      }

      const newBet =
        game.currentBet +
        game.bigBlindAmount;

      const difference =
        newBet -
        player.currentBet;

      transaction.update(
        playerRef,
        {
          chips:
            player.chips -
            difference,

          currentBet:
            newBet,

          hasRaised:
            true
        }
      );

      const playersSnap =
        await getDocs(
          collection(
            db,
            "games",
            gameId,
            "players"
          )
        );

      const players =
        playersSnap.docs.map(
          d => d.data()
        );

      const nextPlayerUid =
        advanceToNextActivePlayer(
          game,
          players
        );

      transaction.update(
        gameRef,
        {
          currentBet:
            newBet,

          pot:
            game.pot +
            difference,

          currentPlayerUid:
            nextPlayerUid
        }
      );

    }
  );

}