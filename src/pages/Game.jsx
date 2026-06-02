import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  doc,
  collection,
  onSnapshot
} from "firebase/firestore";

import { db, auth } from "../services/firebase";

import { startRound } from "../services/roundService";

import {
  checkBet,
  callBet,
  raiseBet,
  foldBet
} from "../services/bettingService";

import CardGrid from "../components/CardGrid";
import BettingPanel from "../components/BettingPanel";
import GameInfoPanel from "../components/GameInfoPanel";

export default function Game() {

  const { gameId } = useParams();

  const [game, setGame] =
    useState(null);

  const [players, setPlayers] =
    useState([]);

  const currentPlayer =
    players.find(
      p =>
        p.uid ===
        auth.currentUser?.uid
    );

  // -----------------------------
  // Game Listener
  // -----------------------------

  useEffect(() => {

    const gameRef =
      doc(
        db,
        "games",
        gameId
      );

    const unsubscribe =
      onSnapshot(
        gameRef,
        snapshot => {

          if (
            !snapshot.exists()
          ) {

            console.log(
              "Game not found"
            );

            return;
          }

          setGame({
            id: snapshot.id,
            ...snapshot.data()
          });

        }
      );

    return unsubscribe;

  }, [gameId]);

  // -----------------------------
  // Players Listener
  // -----------------------------

  useEffect(() => {

    const playersRef =
      collection(
        db,
        "games",
        gameId,
        "players"
      );

    const unsubscribe =
      onSnapshot(
        playersRef,
        snapshot => {

          const playerList =
            snapshot.docs.map(
              doc => ({
                id: doc.id,
                ...doc.data()
              })
            );

          setPlayers(
            playerList
          );

        }
      );

    return unsubscribe;

  }, [gameId]);

  // -----------------------------
  // Betting Actions
  // -----------------------------

  async function handleCheck() {

    try {

      await checkBet(
        gameId,
        auth.currentUser.uid
      );

    }
    catch (err) {

      console.error(err);

      alert(
        err.message
      );

    }

  }

  async function handleCall() {

    try {

      await callBet(
        gameId,
        auth.currentUser.uid
      );

    }
    catch (err) {

      console.error(err);

      alert(
        err.message
      );

    }

  }

  async function handleRaise() {

    try {

      await raiseBet(
        gameId,
        auth.currentUser.uid
      );

    }
    catch (err) {

      console.error(err);

      alert(
        err.message
      );

    }

  }

  async function handleFold() {

    try {

      await foldBet(
        gameId,
        auth.currentUser.uid
      );

    }
    catch (err) {

      console.error(err);

      alert(
        err.message
      );

    }

  }

  // -----------------------------
  // Loading
  // -----------------------------

  if (!game) {

    return (

      <div>

        <h1>
          Loading Game...
        </h1>

      </div>

    );

  }

  const currentUid =
    auth.currentUser?.uid;

  const isHost =
    currentUid ===
    game.hostId;

  return (

    <div
      style={{
        padding: "20px"
      }}
    >

      <h1>
        Card Bluff
      </h1>

      <GameInfoPanel
        game={game}
        players={players}
        currentPlayer={
          currentPlayer
        }
      />

      <h3>
        Game Code:
        {" "}
        {gameId}
      </h3>

      <p>

        Current Phase:

        {" "}

        {game.phase}

      </p>

      <hr />

      {/* ===================== */}
      {/* PLAYER LIST */}
      {/* ===================== */}

      <h2>
        Players
      </h2>

      {players.length === 0 ? (

        <p>
          No players joined.
        </p>

      ) : (

        players.map(
          player => (

            <div
              key={
                player.uid
              }

              style={{
                border:
                  "1px solid gray",

                padding:
                  "8px",

                marginBottom:
                  "8px"
              }}
            >

              <strong>
                {player.name}
              </strong>

              <br />

              Chips:
              {" "}
              {
                player.chips
              }

              <br />

              Bet:
              {" "}
              {
                player.currentBet
              }

              <br />

              {
                player.folded
                  ? "Folded"
                  : "Active"
              }

            </div>

          )
        )

      )}

      <hr />

      {/* ===================== */}
      {/* HOST CONTROLS */}
      {/* ===================== */}

      {

        isHost &&

        game.phase ===
          "lobby" &&

        (

          <button

            onClick={() =>
              startRound(
                gameId
              )
            }

          >

            Start Round

          </button>

        )

      }

      {/* ===================== */}
      {/* CARD SELECTION */}
      {/* ===================== */}

      {

        game.phase ===
          "selecting" &&

        game.deck &&

        (

          <>

            <h2>
              Select A Card
            </h2>

            <CardGrid

              deck={
                game.deck
              }

              game={
                game
              }

              gameId={
                gameId
              }

              players={
                players
              }

            />

          </>

        )

      }

      {/* ===================== */}
      {/* BETTING */}
      {/* ===================== */}

      {

        game.phase ===
          "betting" &&

        (

          <BettingPanel

            game={
              game
            }

            players={
              players
            }

            gameId={
              gameId
            }

            onCheck={
              handleCheck
            }

            onCall={
              handleCall
            }

            onRaise={
              handleRaise
            }

            onFold={
              handleFold
            }

          />

        )

      }

      {/* ===================== */}
      {/* REVEAL */}
      {/* ===================== */}

      {

        game.phase ===
          "reveal" &&

        (

          <div>

            <h2>
              Reveal
            </h2>

            {

              players.map(
                player => (

                  <div
                    key={
                      player.uid
                    }
                  >

                    <strong>
                      {
                        player.name
                      }
                    </strong>

                    {" - "}

                    {

                      player.folded
                        ? "Folded"
                        : `${player.selectedCard?.rank ?? "?"}${player.selectedCard?.suit ?? ""}`

                    }

                  </div>

                )
              )

            }

          </div>

        )

      }

    </div>

  );

}