"use client";

import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { PlayArrow, EmojiEvents, Home } from "@mui/icons-material";
import Link from "next/link";
import { useGameContext } from "@/app/context/GameProvider";

/*-------------------------------------------------------------------*/

export default function GameOverDialog() {
  const { gameState, showGameOverDialog, returnToSetup, startNewGame } =
    useGameContext();

  return (
    <Dialog
      open={showGameOverDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { textAlign: "center", p: 2 },
      }}
    >
      <DialogTitle>
        <EmojiEvents sx={{ fontSize: 48, color: "gold", }} />
      </DialogTitle>
      <Typography variant="h4">Game over!</Typography>
      <DialogContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {gameState.winner === "Draw"
            ? "🤝 Draw!"
            : `🎉 Winner: ${gameState.winner}!`}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Final scores:
          </Typography>
          {gameState.players.map((player, index) => (
            <Typography key={index} variant="body1" sx={{ mb: 1}}>
              {player.name}: {player.score} points
            </Typography>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, p: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrow />}
          onClick={startNewGame}
          size="large"
        >
          Play Again
        </Button>

        <Link href="/" passHref>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={returnToSetup}
            size="large"
          >
            Return Home
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
}