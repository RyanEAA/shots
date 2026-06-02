import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  runTransaction
} from "firebase/firestore";

import { db } from "./firebase";
import { getWinner } from "../utils/ranking";

export async function calculateWinner(gameId) {
  const gameRef = doc(db, "games", gameId);

  const playersSnap = await getDocs(
    collection(db, "games", gameId, "players")
  );

  const players = playersSnap.docs.map(d => d.data());
  const winner = getWinner(players);

  if (!winner) {
    throw new Error("No winner found");
  }

  await updateDoc(gameRef, {
    winnerUid: winner.uid,
    revealWinnerCard: false
  });

  return winner;
}

export async function chooseRevealAndAwardPot(gameId, reveal) {
  const gameRef = doc(db, "games", gameId);

  await runTransaction(db, async transaction => {
    const gameSnap = await transaction.get(gameRef);
    const game = gameSnap.data();

    if (!game.winnerUid) {
      throw new Error("Winner has not been calculated");
    }

    const winnerRef = doc(
      db,
      "games",
      gameId,
      "players",
      game.winnerUid
    );

    const winnerSnap = await transaction.get(winnerRef);
    const winner = winnerSnap.data();

    transaction.update(winnerRef, {
      chips: winner.chips + game.pot
    });

    transaction.update(gameRef, {
      revealWinnerCard: reveal,
      pot: 0,
      phase: "roundEnd"
    });
  });
}