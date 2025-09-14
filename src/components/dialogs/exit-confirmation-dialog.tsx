"use client";

import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Link from "next/link";
import { useGameContext } from "@/app/context/GameProvider";

/*-------------------------------------------------------------------*/

export default function ExitConfirmationDialog() {
  const { showExitConfirmDialog, setShowExitConfirmDialog, exitGame } =
    useGameContext();

  return (
    <Dialog open={showExitConfirmDialog} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Exit</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to exit the game?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowExitConfirmDialog(false)}>Cancel</Button>

        <Link href="/">
          <Button variant="contained" color="error" onClick={exitGame}>
            Exit
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
}
