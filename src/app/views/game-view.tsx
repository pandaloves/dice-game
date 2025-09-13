"use client";

import { Container } from "@mui/material";
import ExitConfirmationDialog from "@/components/dialogs/exit-confirmation-dialog";
import Header from "@/components/header";
import GameOverDialog from "@/components/dialogs/game-over-dialog";
import GameStatusDisplay from "@/components/game-status-display";
import PlayerScoreCards from "@/components/player-score-cards";
import DiceAndControlArea from "@/components/dice-and-control-area";

/*-------------------------------------------------------------------*/

export default function GameView() {
  return (
    <Container sx={{ py: 3, mb: 10 }}>
      {/* Header with navigation buttons */}
      <Header />

      {/* Game status display */}
      <GameStatusDisplay />

      {/* Player score cards */}
      <PlayerScoreCards />

      {/* Dice and control area */}
      <DiceAndControlArea />

      {/* Game over dialog */}
      <GameOverDialog />

      {/* Exit Confirmation Dialog */}
      <ExitConfirmationDialog />
    </Container>
  );
}
