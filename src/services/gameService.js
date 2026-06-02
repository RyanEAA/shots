import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  writeBatch,
  setDoc,
  runTransaction
} from "firebase/firestore";

import { db } from "./firebase";

import {advanceToNextActivePlayer} from "../utils/gameHelpers";

import { createDeck }
  from "../utils/deck";

import {
  rotateDealer,
  getSmallBlindIndex,
  getBigBlindIndex,
  getFirstActorIndex
} from "../utils/pokerEngine";

export async function createGame({
  uid,
  playerName,
  startingChips,
  maxRounds,
  smallBlind,
  bigBlind
}) {

  const gameId =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  await setDoc(
    doc(db, "games", gameId),
    {
      status: "waiting",

      hostId: uid,

      currentRound: 0,

      maxRounds,

      startingChips,

      smallBlindAmount:
        smallBlind,

      bigBlindAmount:
        bigBlind,

      dealerIndex: 0,

      playerOrder: [],

      phase: "lobby",

      currentPlayerUid: null,

      currentBet: 0,

      pot: 0,

      deck: [],

      selectedCards: {}
    }
  );
    await setDoc(
    doc(
      db,
      "games",
      gameId,
      "players",
      uid
    ),
    {
      uid,

      name:
        playerName.trim() ||
        `Player-${uid.slice(0,4)}`,

      chips:
        startingChips,

      currentBet: 0,

      folded: false,

      selectedCard: null,

      selectedCardIndex: null
    }
  );

  return gameId;
}

export async function joinGame(
  gameId,
  uid,
  playerName
) {

  const gameRef = doc(
    db,
    "games",
    gameId
  );

  const gameSnap =
    await getDoc(gameRef);

  if (!gameSnap.exists()) {

    throw new Error(
      "Game not found"
    );

  }

  const game =
    gameSnap.data();

  if (
    game.status === "finished"
  ) {

    throw new Error(
      "Game already finished"
    );

  }

  const playerRef = doc(
    db,
    "games",
    gameId,
    "players",
    uid
  );

  await setDoc(
    playerRef,
    {

      uid,

      name:
        playerName.trim() ||
        `Player-${uid.slice(0,4)}`,

      chips:
        game.startingChips,

      currentBet: 0,

      folded: false,

      selectedCard: null,

      selectedCardIndex:
        null

    }
  );

  return true;

}

