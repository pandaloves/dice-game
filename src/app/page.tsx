"use client";

import { Container } from "@mui/material";
import ChooseModeView from "./views/choose-mode-view";

/*-------------------------------------------------------------------*/

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <ChooseModeView />
    </Container>
  );
}
