"use client";

import { Box, Typography, Grid, Chip, Paper } from "@mui/material";
import { useGameContext } from "@/app/context/GameProvider";

/*-------------------------------------------------------------------*/

export default function GameStatusDisplay() {
  const { gameState } = useGameContext();

  return (
    <Paper
      sx={{ p: 2, my: 3, backgroundColor: "primary.light", color: "white" }}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid sx={{ xs: 12, md: 6 }}>
          <Typography variant="h6">
            Current player:{" "}
            {gameState.players[gameState.currentPlayerIndex]?.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
            <Typography variant="body2">Rolls left: </Typography>
            <Typography variant="body2" color={"red"}>
              {gameState.players[gameState.currentPlayerIndex]?.rollsLeft}
            </Typography>
          </Box>
        </Grid>
        <Grid
          sx={{
            textAlign: { xs: "left", lg: "right" },
            mt: { xs: 2, md: 0 },
          }}
        >
          <Chip
            label={
              gameState.gameMode === "human-computer"
                ? "Human vs Computer"
                : "Two Players"
            }
            color="secondary"
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
