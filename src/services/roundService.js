import {
  doc,
  getDoc,
  getDocs,
  collection,
  writeBatch,
  updateDoc
} from "firebase/firestore";

import { db } from "./firebase";

import { rotateDealer, getSmallBlindIndex, getBigBlindIndex, getFirstActorIndex } from "../utils/pokerEngine";

import { createDeck } from "../utils/deck";

export async function startRound(
  gameId
) {

  const gameRef =
    doc(db, "games", gameId);

  const gameSnap =
    await getDoc(gameRef);

  const game =
    gameSnap.data();

    if (game.currentRound >= game.maxRounds) {
        await updateDoc(gameRef, {
            phase: "gameOver",
            status: "finished"
        });

        return;
    }

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

    const playerOrder =
    players
      .sort(
        (a,b) =>
          a.name.localeCompare(
            b.name
          )
      )
      .map(
        p => p.uid
      );

      const firstRound =
      game.currentRound === 0;

      let dealerIndex =
        firstRound
            ? 0
            : rotateDealer(
                game.dealerIndex,
                playerOrder.length
            );

    const smallBlindIndex =
    getSmallBlindIndex(
        dealerIndex,
        playerOrder.length
    );

    const bigBlindIndex =
    getBigBlindIndex(
        dealerIndex,
        playerOrder.length
    );

    const firstActorIndex =
    getFirstActorIndex(
        dealerIndex,
        playerOrder.length
    );

    const deck =
    createDeck();

    const batch =
    writeBatch(db);

    for (
        const playerDoc
        of playersSnap.docs
        ) {

        const player =
            playerDoc.data();

        let chips =
            player.chips;

        let currentBet =
            0;

        const uid =
            player.uid;

        if (
            uid ===
            playerOrder[
                smallBlindIndex
            ]
            ) {

            chips -=
                game.smallBlindAmount;

            currentBet =
                game.smallBlindAmount;
            }

        if (
            uid ===
            playerOrder[
                bigBlindIndex
            ]
            ) {

            chips -=
                game.bigBlindAmount;

            currentBet =
                game.bigBlindAmount;
            }

        batch.update(
            playerDoc.ref,
            {

                chips,

                currentBet,

                folded: false,

                hasActed: false,

                hasRaised: false,

                selectedCard: null,

                selectedCardIndex:
                null

            }
            );
        }

        batch.update(
            gameRef,
            {

                status:
                "inProgress",

                currentRound:
                game.currentRound + 1,

                dealerIndex,

                playerOrder,

                phase:
                "selecting",

                currentPlayerUid:
                playerOrder[
                    firstActorIndex
                ],

                currentBet:
                    game.bigBlindAmount,

                pot:
                    game.smallBlindAmount +
                    game.bigBlindAmount,

                deck,

                selectedCards: {},

                winnerUid: null

            }
        );
    await batch.commit();
}
export function isBettingRoundComplete(
  game,
  players
) {

  const activePlayers =
    players.filter(
      p => !p.folded
    );

  if (
    activePlayers.length <= 1
  ) {
    return true;
  }

  return activePlayers.every(
    p =>

      p.hasActed === true &&

      p.currentBet ===
      game.currentBet

  );

}