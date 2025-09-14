"use client";

import { Button, Card } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { useGameContext } from "@/app/context/GameProvider";

/*-------------------------------------------------------------------*/

export default function DiceAndControlArea() {
  const { isRolling, rollDice, gameState } = useGameContext();

  return (
    <Card sx={{ px: 4, pt: 4, pb: 8, textAlign: "center", mb: 3 }}>
      <Button
        variant="contained"
        size="large"
        startIcon={<Casino />}
        sx={{ minWidth: 150 }}
        onClick={rollDice}
        disabled={isRolling || gameState.gameStatus === "finished"}
      >
        Roll
      </Button>
    </Card>
  );
}
