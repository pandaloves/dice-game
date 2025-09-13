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

type DialogProps =
  {
    showSecondPlayerDialog: boolean;
    setShowSecondPlayerDialog: React.Dispatch<React.SetStateAction<boolean>>;
  };
  
export default function SecondPlayerDialog({
  showSecondPlayerDialog,
  setShowSecondPlayerDialog,
}: DialogProps) {
  const { pendingMode, playerNames, setPlayerNames, initializeGame } =
    useGameContext();
  return (
    <Dialog
      open={showSecondPlayerDialog}
      maxWidth="sm"
      fullWidth
      sx={{ mt: 28 }}
    >
      {" "}
      <DialogTitle>Please enter the second player's name</DialogTitle>{" "}
      <DialogContent>
        {" "}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {" "}
          <Grid sx={{ xs: 6 }}>
            {" "}
            <TextField
              label="First name"
              fullWidth
              value={playerNames.p2First}
              onChange={(e) =>
                setPlayerNames({ ...playerNames, p2First: e.target.value })
              }
            />{" "}
          </Grid>{" "}
          <Grid sx={{ xs: 6 }}>
            {" "}
            <TextField
              label="Last name"
              fullWidth
              value={playerNames.p2Last}
              onChange={(e) =>
                setPlayerNames({ ...playerNames, p2Last: e.target.value })
              }
            />{" "}
          </Grid>{" "}
        </Grid>{" "}
      </DialogContent>{" "}
      <DialogActions sx={{ mb: 2, mr: 2 }}>
        {" "}
        <Button onClick={() => setShowSecondPlayerDialog(false)}>
          Cancel
        </Button>{" "}
        <Link href="/game">
          {" "}
          <Button
            variant="contained"
            onClick={() => {
              setShowSecondPlayerDialog(false);
              initializeGame(pendingMode!);
            }}
            disabled={!playerNames.p2First || !playerNames.p2Last}
          >
            {" "}
            Start playing{" "}
          </Button>{" "}
        </Link>{" "}
      </DialogActions>{" "}
    </Dialog>
  );
}
