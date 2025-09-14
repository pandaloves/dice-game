"use client";

import {
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useGameContext } from "@/app/context/GameProvider";

/*-------------------------------------------------------------------*/

type DialogProps = {
  showSinglePlayerDialog: boolean;
  showFirstPlayerDialog: boolean;
  setShowSinglePlayerDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFirstPlayerDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSecondPlayerDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SingleFirstPlayerDialog({
  showSinglePlayerDialog,
  showFirstPlayerDialog,
  setShowSinglePlayerDialog,
  setShowFirstPlayerDialog,
  setShowSecondPlayerDialog,
}: DialogProps) {
  const { pendingMode, playerNames, setPlayerNames, initializeGame } =
    useGameContext();
  return (
    <Dialog
      open={showSinglePlayerDialog || showFirstPlayerDialog}
      maxWidth="sm"
      fullWidth
      sx={{ mt: 28 }}
    >
      {" "}
      <DialogTitle>
        {" "}
        {showSinglePlayerDialog
          ? "Please enter your name"
          : "Please enter the first player's name"}{" "}
      </DialogTitle>{" "}
      <DialogContent>
        {" "}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {" "}
          <Grid sx={{ xs: 6 }}>
            {" "}
            <TextField
              label="First name"
              fullWidth
              value={playerNames.p1First}
              onChange={(e) =>
                setPlayerNames({ ...playerNames, p1First: e.target.value })
              }
            />{" "}
          </Grid>{" "}
          <Grid sx={{ xs: 6 }}>
            {" "}
            <TextField
              label="Last name"
              fullWidth
              value={playerNames.p1Last}
              onChange={(e) =>
                setPlayerNames({ ...playerNames, p1Last: e.target.value })
              }
            />{" "}
          </Grid>{" "}
        </Grid>{" "}
      </DialogContent>{" "}
      <DialogActions sx={{ mb: 2, mr: 2 }}>
        {" "}
        <Button
          onClick={() =>
            showSinglePlayerDialog
              ? setShowSinglePlayerDialog(false)
              : setShowFirstPlayerDialog(false)
          }
        >
          {" "}
          Cancel{" "}
        </Button>{" "}
        <Link href={showSinglePlayerDialog ? "/game" : "/"}>
          {" "}
          <Button
            variant="contained"
            onClick={() => {
              setShowFirstPlayerDialog(false);
              if (pendingMode === "human-human")
                setShowSecondPlayerDialog(true);
              else initializeGame(pendingMode!);
            }}
            disabled={!playerNames.p1First || !playerNames.p1Last}
          >
            {" "}
            {showSinglePlayerDialog ? "Start playing" : "Next"}{" "}
          </Button>{" "}
        </Link>{" "}
      </DialogActions>{" "}
    </Dialog>
  );
}
