"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useContext,
} from "react";
import { Box } from "@mui/material";
import { GameState } from "../types/game";

/*-------------------------------------------------------------------*/

type GameContextProps = {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  currentDiceValue: number;
  setCurrentDiceValue: React.Dispatch<React.SetStateAction<number>>;
  showGameOverDialog: boolean;
  setShowGameOverDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showExitConfirmDialog: boolean;
  setShowExitConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isRolling: boolean;
  setIsRolling: React.Dispatch<React.SetStateAction<boolean>>;
  pendingMode: "human-computer" | "human-human" | null;
  setPendingMode: React.Dispatch<
    React.SetStateAction<"human-computer" | "human-human" | null>
  >;
  playerNames: {
    p1First: string;
    p1Last: string;
    p2First: string;
    p2Last: string;
  };
  setPlayerNames: React.Dispatch<
    React.SetStateAction<{
      p1First: string;
      p1Last: string;
      p2First: string;
      p2Last: string;
    }>
  >;
  initializeGame: (mode: "human-computer" | "human-human") => void;
  rollDice: () => void;
  returnToSetup: () => void;
  exitGame: () => void;
  playAgain: () => void;
  renderDice: () => React.ReactElement | null;
};

const GameContext = createContext<GameContextProps | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    gameMode: null,
    gameStatus: "setup",
    winner: null,
  });
  const [currentDiceValue, setCurrentDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState<boolean>(false);
  const [showExitConfirmDialog, setShowExitConfirmDialog] =
    useState<boolean>(false);
  const [playerNames, setPlayerNames] = useState({
    p1First: "",
    p1Last: "",
    p2First: "",
    p2Last: "",
  });
  const [pendingMode, setPendingMode] = useState<
    "human-computer" | "human-human" | null
  >(null);

  const initializeGame = useCallback(
    async (mode: "human-computer" | "human-human") => {
      const backendMode =
        mode === "human-computer" ? "human vs computer" : "human vs human";
      const p2First =
        mode === "human-computer" ? "Computer" : playerNames.p2First;
      const p2Last = mode === "human-computer" ? "" : playerNames.p2Last;

      const res = await fetch(
        `http://localhost:8081/api/game/start?` +
          `player1First=${encodeURIComponent(playerNames.p1First)}&` +
          `player1Last=${encodeURIComponent(playerNames.p1Last)}&` +
          `player2First=${encodeURIComponent(p2First)}&` +
          `player2Last=${encodeURIComponent(p2Last)}&` +
          `gameMode=${encodeURIComponent(backendMode)}`,
        { method: "POST" }
      );

      const data = await res.json();
      setGameState(data);
    },
    [playerNames]
  );

  const rollDice = useCallback(async () => {
    if (isRolling) return;
    setIsRolling(true);

    const res = await fetch("http://localhost:8081/api/game/roll", {
      method: "POST",
    });
    const data = await res.json();

    setGameState({
      ...gameState,
      ...data,
    });
    setCurrentDiceValue(data.roll || 1);
    setIsRolling(false);
  }, [isRolling, gameState]);

  useEffect(() => {
    if (gameState.gameStatus !== "playing") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:8081/api/game/status");
        const data = await res.json();
        setGameState(data);
      } catch (err) {
        console.error("Failed to fetch game status:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [gameState.gameStatus]);

  const resetGame = useCallback(async () => {
    const res = await fetch("http://localhost:8081/api/game/reset", {
      method: "POST",
    });
    const data = await res.json();

    setGameState({
      players: [],
      currentPlayerIndex: 0,
      gameMode: null,
      gameStatus: "setup",
      winner: null,
    });

    setPlayerNames({ p1First: "", p1Last: "", p2First: "", p2Last: "" });
    setShowGameOverDialog(false);
    setShowExitConfirmDialog(false);
  }, []);

  const returnToSetup = () => {
    resetGame();
    setShowGameOverDialog(false);
  };

  const exitGame = () => {
    resetGame();
    setShowExitConfirmDialog(false);
  };

  const resetScores = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => ({
        ...player,
        scores: [],
        score: 0,
      })),
      currentPlayerIndex: 0,
      winner: null,
      gameStatus: "setup", // go back to setup
    }));

    setCurrentDiceValue(1);
    setShowGameOverDialog(false);
  }, []);

  const playAgain = () => {
    resetScores(); // user must press Start again
  };

  const renderDice = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    const lastRoll =
      currentPlayer?.scores?.length > 0
        ? currentPlayer.scores[currentPlayer.scores.length - 1]
        : 1;

    const dots = [];
    const dotConfigurations = [
      [],
      [{ top: "50%", left: "50%" }],
      [
        { top: "25%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
      [
        { top: "25%", left: "25%" },
        { top: "50%", left: "50%" },
        { top: "75%", left: "75%" },
      ],
      [
        { top: "25%", left: "25%" },
        { top: "25%", left: "75%" },
        { top: "75%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
      [
        { top: "25%", left: "25%" },
        { top: "25%", left: "75%" },
        { top: "50%", left: "50%" },
        { top: "75%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
      [
        { top: "25%", left: "25%" },
        { top: "25%", left: "75%" },
        { top: "50%", left: "25%" },
        { top: "50%", left: "75%" },
        { top: "75%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
    ];

    for (let i = 0; i < dotConfigurations[lastRoll].length; i++) {
      const position = dotConfigurations[lastRoll][i];
      dots.push(
        <Box
          key={i}
          sx={{
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            backgroundColor: "black",
            position: "absolute",
            top: position.top,
            left: position.left,
            transform: "translate(-50%, -50%)",
          }}
        />
      );
    }

    // Always return a box, even if players aren't loaded yet
    return (
      <Box
        sx={{
          width: 100,
          height: 100,
          backgroundColor: "white",
          border: "2px solid black",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          margin: "0 auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        {dots}
      </Box>
    );
  };

  useEffect(() => {
    if (
      gameState.gameStatus === "playing" &&
      gameState.players[gameState.currentPlayerIndex]?.name === "Computer" &&
      !isRolling
    ) {
      const timer = setTimeout(() => rollDice(), 1000);
      return () => clearTimeout(timer);
    }
    if (gameState.gameStatus === "finished") {
      setShowGameOverDialog(true);
    }
  }, [gameState, isRolling, rollDice]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        currentDiceValue,
        setCurrentDiceValue,
        showGameOverDialog,
        setShowGameOverDialog,
        showExitConfirmDialog,
        setShowExitConfirmDialog,
        isRolling,
        setIsRolling,
        pendingMode,
        setPendingMode,
        playerNames,
        setPlayerNames,
        initializeGame,
        rollDice,
        returnToSetup,
        exitGame,
        playAgain,
        renderDice,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextProps {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}
