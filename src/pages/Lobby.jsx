// src/pages/Lobby.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../services/firebase";

import {
  createGame,
  joinGame
} from "../services/gameService";

export default function Lobby() {

  const navigate = useNavigate();

  const [gameCode, setGameCode] =
    useState("");

  const [playerName, setPlayerName] =
    useState("");

  const [startingChips,
    setStartingChips] =
    useState(1000);

  const [maxRounds,
    setMaxRounds] =
    useState(10);

  const [smallBlind,
    setSmallBlind] =
    useState(10);

  const [bigBlind,
    setBigBlind] =
    useState(20);

  const [loading,
    setLoading] =
    useState(false);

  async function handleCreate() {

    try {

      setLoading(true);

      const uid =
        auth.currentUser.uid;

      const gameId =
        await createGame({

          uid,

          playerName,

          startingChips,

          maxRounds,

          smallBlind,

          bigBlind

        });

      navigate(
        `/game/${gameId}`
      );

    } catch (err) {

      console.error(err);

      alert(
        "Failed to create game"
      );

    } finally {

      setLoading(false);

    }

  }

  async function handleJoin() {

    try {

      if (!gameCode.trim()) {

        alert(
          "Enter a game code"
        );

        return;

      }

      setLoading(true);

      const uid =
        auth.currentUser.uid;

      const code =
        gameCode
          .trim()
          .toUpperCase();

      await joinGame(
        code,
        uid,
        playerName 
      );

      navigate(
        `/game/${code}`
      );

    } catch (err) {

      console.error(err);

      alert(
        "Unable to join game"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >

      <h1>
        Card Bluff
      </h1>

      <hr />

      <h2>
        Create Game
      </h2>

      <label>
        Starting Chips
      </label>

      <input
        type="number"
        value={startingChips}
        onChange={(e) =>
          setStartingChips(
            Number(
              e.target.value
            )
          )
        }
      />

      <label>
        Maximum Rounds
      </label>

      <input
        type="number"
        value={maxRounds}
        onChange={(e) =>
          setMaxRounds(
            Number(
              e.target.value
            )
          )
        }
      />

      <label>
        Small Blind
      </label>

      <input
        type="number"
        value={smallBlind}
        onChange={(e) =>
          setSmallBlind(
            Number(
              e.target.value
            )
          )
        }
      />

      <label>
        Big Blind
      </label>

      <input
        type="number"
        value={bigBlind}
        onChange={(e) =>
          setBigBlind(
            Number(
              e.target.value
            )
          )
        }
      />

      <label>
        Player Name
      </label>

        <input
        value={playerName}
        onChange={(e) =>
            setPlayerName(
            e.target.value
            )
        }
        placeholder="Ryan"
        />

      <button
        disabled={loading}
        onClick={handleCreate}
      >
        Create Game
      </button>

      <hr />

      <h2>
        Join Game
      </h2>

      <input
        placeholder="Game Code"
        value={gameCode}
        onChange={(e) =>
          setGameCode(
            e.target.value
          )
        }
      />

      <button
        disabled={loading}
        onClick={handleJoin}
      >
        Join Game
      </button>

    </div>

  );

}