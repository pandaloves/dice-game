"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useContext,
} from "react";
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
  startNewGame: () => void;
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
  const [currentGameMode, setCurrentGameMode] = useState<
    "human-computer" | "human-human" | null
  >(null);

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
      setCurrentGameMode(mode);
      const backendMode =
        mode === "human-computer" ? "human vs computer" : "human vs human";
      const p2First =
        mode === "human-computer" ? "Computer" : playerNames.p2First;
      const p2Last = mode === "human-computer" ? "" : playerNames.p2Last;

      const url = `http://localhost:8081/api/game/start?player1First=${encodeURIComponent(
        playerNames.p1First
      )}&player1Last=${encodeURIComponent(
        playerNames.p1Last
      )}&player2First=${encodeURIComponent(
        p2First
      )}&player2Last=${encodeURIComponent(
        p2Last
      )}&gameMode=${encodeURIComponent(backendMode)}`;

      const res = await fetch(url, { method: "POST" });
      const data = await res.json();

      setGameState({
        players: data.players || [],
        currentPlayerIndex: data.currentPlayerIndex || 0,
        gameMode: mode,
        gameStatus: data.gameStatus || "playing",
        winner: data.winner || null,
      });
    },
    [playerNames]
  );

  const rollDice = useCallback(async () => {
    if (isRolling) return;
    setIsRolling(true);

    try {
      const res = await fetch("http://localhost:8081/api/game/roll", {
        method: "POST",
      });
      const data = await res.json();

      setGameState((prev) => ({
        ...prev,
        players: data.players || prev.players,
        currentPlayerIndex:
          data.currentPlayerIndex !== undefined
            ? data.currentPlayerIndex
            : prev.currentPlayerIndex,
        gameStatus: data.gameStatus || prev.gameStatus,
        winner: data.winner || prev.winner,
      }));

      setCurrentDiceValue(data.roll || 1);
    } catch (error) {
      console.error("Error rolling dice:", error);
    } finally {
      setIsRolling(false);
    }
  }, [isRolling]);

  const resetGame = useCallback(async () => {
    try {
      await fetch("http://localhost:8081/api/game/reset", { method: "POST" });
    } catch (err) {
      console.error("Failed to reset backend game", err);
    }

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

  const startNewGame = useCallback(async () => {
    try {
      if (playerNames.p1First && playerNames.p1Last && currentGameMode) {
        const backendMode =
          currentGameMode === "human-computer"
            ? "human vs computer"
            : "human vs human";

        const p2First =
          currentGameMode === "human-computer"
            ? "Computer"
            : playerNames.p2First;
        const p2Last =
          currentGameMode === "human-computer" ? "" : playerNames.p2Last;

        const url = `http://localhost:8081/api/game/start?player1First=${encodeURIComponent(
          playerNames.p1First
        )}&player1Last=${encodeURIComponent(
          playerNames.p1Last
        )}&player2First=${encodeURIComponent(
          p2First
        )}&player2Last=${encodeURIComponent(
          p2Last
        )}&gameMode=${encodeURIComponent(backendMode)}`;

        const startRes = await fetch(url, { method: "POST" });
        const startData = await startRes.json();

        const playersWithFixedComputer = startData.players?.map(
          (player: any) => {
            if (
              currentGameMode === "human-computer" &&
              player.name === "Computer"
            ) {
              return { ...player, isComputer: true, name: "Computer" };
            }
            return player;
          }
        );

        setGameState({
          players: playersWithFixedComputer || [],
          currentPlayerIndex: startData.currentPlayerIndex || 0,
          gameMode: currentGameMode,
          gameStatus: startData.gameStatus || "playing",
          winner: null,
        });
      } else {
        setGameState({
          players: [],
          currentPlayerIndex: 0,
          gameMode: null,
          gameStatus: "setup",
          winner: null,
        });
      }

      setCurrentDiceValue(1);
      setShowGameOverDialog(false);
    } catch (error) {
      console.error("Error starting new game:", error);
    }
  }, [currentGameMode, playerNames]);

  useEffect(() => {
    if (gameState.gameStatus === "finished") {
      const timer = setTimeout(() => {
        setShowGameOverDialog(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus]);

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
        startNewGame,
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
