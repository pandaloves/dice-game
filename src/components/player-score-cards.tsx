import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
} from "@mui/material";
import { Person, Computer } from "@mui/icons-material";
import { useGameContext } from "@/app/context/GameProvider";

/*-------------------------------------------------------------------*/

export default function PlayerScoreCards() {
  const { gameState } = useGameContext();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {gameState.players.map((player, index) => (
        <Grid sx={{ xs: 12, md: 6 }} key={index}>
          <Card
            sx={{
              border: index === gameState.currentPlayerIndex ? 3 : 1,
              borderColor:
                index === gameState.currentPlayerIndex
                  ? "primary.main"
                  : "divider",
              backgroundColor:
                index === gameState.currentPlayerIndex
                  ? "primary.light"
                  : "background.paper",
              color:
                index === gameState.currentPlayerIndex
                  ? "white"
                  : "text.primary",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {player.name === "Computer" ? (
                  <Computer sx={{ mr: 1 }} />
                ) : (
                  <Person sx={{ mr: 1 }} />
                )}
                <Typography variant="h6">{player.name}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "start", gap: 2, mb: 1 }}>
                <Typography variant="h4">Total score:</Typography>
                <Typography variant="h4" color={"red"}>
                  {player.totalScore}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  History:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {player.scores.map((score, scoreIndex) => (
                    <Chip
                      key={scoreIndex}
                      label={score}
                      size="small"
                      color={
                        index === gameState.currentPlayerIndex
                          ? "secondary"
                          : "primary"
                      }
                    />
                  ))}
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(2 - player.rollsLeft) * 50}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Box sx={{ display: "flex", alignItems: "start", gap: 1, mt: 1 }}>
                <Typography variant="caption">Has rolled</Typography>
                <Typography variant="caption" color={"red"}>
                  {2 - player.rollsLeft}
                </Typography>
                <Typography variant="caption" sx={{ ml: -1 }}>
                  /2 times
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
