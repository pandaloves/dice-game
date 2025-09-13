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
import { Player } from "../types/player";

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
  renderDice: () => React.ReactElement;
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
    (mode: "human-computer" | "human-human") => {
      let players: Player[] = [];

      if (mode === "human-computer") {
        players = [
          {
            name: `${playerNames.p1First} ${playerNames.p1Last}`,
            scores: [],
            totalScore: 0,
            rollsLeft: 2,
          },
          { name: "Computer", scores: [], totalScore: 0, rollsLeft: 2 },
        ];
      } else {
        players = [
          {
            name: `${playerNames.p1First} ${playerNames.p1Last}`,
            scores: [],
            totalScore: 0,
            rollsLeft: 2,
          },
          {
            name: `${playerNames.p2First} ${playerNames.p2Last}`,
            scores: [],
            totalScore: 0,
            rollsLeft: 2,
          },
        ];
      }

      setGameState({
        players,
        currentPlayerIndex: 0,
        gameMode: mode,
        gameStatus: "playing",
        winner: null,
      });
    },
    [playerNames]
  );

  const rollDice = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);

    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      setCurrentDiceValue(dice);

      setGameState((prev) => {
        const players = [...prev.players];
        const current = { ...players[prev.currentPlayerIndex] };
        current.scores.push(dice);
        current.totalScore += dice;
        current.rollsLeft -= 1;
        players[prev.currentPlayerIndex] = current;

        let nextIndex = prev.currentPlayerIndex;
        if (current.rollsLeft === 0) {
          nextIndex = (prev.currentPlayerIndex + 1) % players.length;
          if (players[nextIndex].rollsLeft === 0) {
            // do nothing, all rolls finished
          } else {
            players[nextIndex].rollsLeft = 2;
          }
        }

        const gameOver = players.every((p) => p.rollsLeft === 0);

        return {
          ...prev,
          players,
          currentPlayerIndex: nextIndex,
          gameStatus: gameOver ? "finished" : "playing",
          winner: gameOver
            ? players[0].totalScore === players[1].totalScore
              ? "平局"
              : players[0].totalScore > players[1].totalScore
              ? players[0].name
              : players[1].name
            : null,
        };
      });
      setIsRolling(false);
    }, 500);
  }, [isRolling]);

  const returnToSetup = () => {
    setGameState({
      players: [],
      currentPlayerIndex: 0,
      gameMode: null,
      gameStatus: "setup",
      winner: null,
    });
    setPlayerNames({ p1First: "", p1Last: "", p2First: "", p2Last: "" });
    setShowGameOverDialog(false);
  };

  const exitGame = () => {
    returnToSetup();
    setShowExitConfirmDialog(false);
  };

  const playAgain = () => {
    if (gameState.gameMode) {
      initializeGame(gameState.gameMode);
      setShowGameOverDialog(false);
    }
  };

  const renderDice = () => {
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

    for (let i = 0; i < dotConfigurations[currentDiceValue].length; i++) {
      const position = dotConfigurations[currentDiceValue][i];
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
