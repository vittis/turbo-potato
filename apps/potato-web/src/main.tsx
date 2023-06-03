import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Phaser from "phaser";
import "./styles/main.css";
import { PHASER_CONFIG } from "./game/config";
import { Battle } from "./game/scenes/Battle";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/api/queryClient";

const game = new Phaser.Game(
  Object.assign(PHASER_CONFIG, {
    scene: [Battle],
  })
);

/* function onReady() {
   const canvas = document.querySelector("canvas");

   if (!canvas) return;

   canvas.classList.add(
      "shadow-md",
      "border-base-content/5",
      "border",
      "rounded-box"
   );
}

game.events.on("ready", onReady); */

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
