import { Box, Button, Typography } from "@mui/material";
import { Home, ExitToApp } from "@mui/icons-material";
import Link from "next/link";
import { useGameContext } from "@/app/context/GameProvider";

/*-------------------------------------------------------------------*/

export default function Header() {
  const { setShowExitConfirmDialog, returnToSetup } = useGameContext();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: { xs: "start", md: "space-between" },
        gap: { xs: 2, md: "auto" },
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h6" color="primary">
        🎲 Roll two times
      </Typography>
      <Box>
        <Link href="/">
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={returnToSetup}
            sx={{ mr: 1 }}
          >
            Return Home
          </Button>
        </Link>

        <Button
          variant="outlined"
          color="error"
          startIcon={<ExitToApp />}
          onClick={() => setShowExitConfirmDialog(true)}
        >
          Exit Game
        </Button>
      </Box>
    </Box>
  );
}
