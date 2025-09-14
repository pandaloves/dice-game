"use client";

import { Box, Button, Card, Typography, Alert, Fade } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { useGameContext } from "@/app/context/GameProvider";

/*-------------------------------------------------------------------*/

export default function DiceAndControlArea() {
  const { gameState, isRolling, rollDice, renderDice } = useGameContext();

  return (
    <Card sx={{ p: 4, textAlign: "center", mb: 3 }}>
      <Box sx={{ mb: 3 }}>{renderDice()}</Box>
      {isRolling && (
        <Fade in={isRolling}>
          <Alert severity="info" sx={{ mb: 2 }}>
            {gameState.players[gameState.currentPlayerIndex]?.name ===
            "Computer"
              ? "The computer is rolling..."
              : "Dice being rolled..."}
          </Alert>
        </Fade>
      )}
      {gameState.players[gameState.currentPlayerIndex]?.name !== "Computer" && (
        <Button
          variant="contained"
          size="large"
          startIcon={<Casino />}
          sx={{ minWidth: 150 }}
          onClick={rollDice}
          disabled={isRolling}
        >
          Roll
        </Button>
      )}
      {gameState.players[gameState.currentPlayerIndex]?.name === "Computer" &&
        !isRolling && (
          <Typography variant="body1" color="text.secondary">
            Wait for the computer to roll...
          </Typography>
        )}
    </Card>
  );
}
