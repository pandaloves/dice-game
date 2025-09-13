"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import { Person, Computer } from "@mui/icons-material";
import { useGameContext } from "../context/GameProvider";
import SingleFirstPlayerDialog from "@/components/dialogs/single-first-player-dialog";
import SecondPlayerDialog from "@/components/dialogs/second-player-dialog";

/*-------------------------------------------------------------------*/

export default function ChooseModeView() {
  const { gameState, setPendingMode } = useGameContext();

  const [showSinglePlayerDialog, setShowSinglePlayerDialog] = useState(false);
  const [showFirstPlayerDialog, setShowFirstPlayerDialog] = useState(false);
  const [showSecondPlayerDialog, setShowSecondPlayerDialog] = useState(false);

  if (gameState.gameStatus === "setup") {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", pt: 8, pb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            🎲 Dice Game
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Choose a game mode to start playing
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            <Grid sx={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                onClick={() => {
                  setPendingMode("human-computer");
                  setShowSinglePlayerDialog(true);
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Computer
                    sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h5">Single player</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid sx={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                onClick={() => {
                  setPendingMode("human-human");
                  setShowFirstPlayerDialog(true);
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Person
                    sx={{ fontSize: 48, color: "secondary.main", mb: 2 }}
                  />
                  <Typography variant="h5">Two players</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Single or First Player Dialog */}
          <SingleFirstPlayerDialog
            showSinglePlayerDialog={showSinglePlayerDialog}
            showFirstPlayerDialog={showFirstPlayerDialog}
            setShowSinglePlayerDialog={setShowSinglePlayerDialog}
            setShowFirstPlayerDialog={setShowFirstPlayerDialog}
            setShowSecondPlayerDialog={setShowSecondPlayerDialog}
          />

          {/* Second Player Dialog (only for human-human) */}
          <SecondPlayerDialog
            showSecondPlayerDialog={showSecondPlayerDialog}
            setShowSecondPlayerDialog={setShowSecondPlayerDialog}
          />
        </Box>
      </Container>
    );
  }
}
