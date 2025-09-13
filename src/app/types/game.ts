import { Player } from "./player";

export type GameState = {
  players: Player[];
  currentPlayerIndex: number;
  gameMode: "human-computer" | "human-human" | null;
  gameStatus: "setup" | "playing" | "finished";
  winner: string | null;
}
