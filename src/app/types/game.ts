import { Player } from "./player";

export type GameState = {
  players: Array<{
    name: string;
    score: number;
    scores: number[]
    rollsLeft: number;
    isComputer: boolean;
  }>;
  currentPlayerIndex: number;
  gameMode: "human-computer" | "human-human" | null;
  gameStatus: "setup" | "playing" | "finished";
  winner: string | null;
};