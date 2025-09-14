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
  const {
    gameState,
    showGameOverDialog,
    setShowGameOverDialog,
    returnToSetup,
    playAgain,
  } = useGameContext();

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
        <EmojiEvents sx={{ fontSize: 48, color: "gold", mb: 1 }} />
      </DialogTitle>
      <Typography variant="h5">Game over!</Typography>
      <DialogContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {gameState.winner === "Draw"
            ? "🤝 Draw!"
            : `🎉 Winner: ${gameState.winner}!`}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Total scores:
          </Typography>
          {gameState.players.map((player, index) => (
            <Typography key={index} variant="body1" sx={{ mb: 1 }}>
              {player.name}: {player.score} 分
            </Typography>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Link href="/game">
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrow />}
            onClick={() => {
              playAgain();
              setShowGameOverDialog(false);
            }}
          >
            Another Game
          </Button>
        </Link>

        <Link href="/">
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={returnToSetup}
          >
            Return Home
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
}
