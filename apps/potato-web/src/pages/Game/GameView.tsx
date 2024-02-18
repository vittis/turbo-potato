import App from "@/App";
import { PHASER_CONFIG } from "@/game/config";
import { Battle } from "@/game/scenes/battle/BattleScene";
import { useGameState } from "@/services/state/useGameState";
import { useEffect, useRef } from "react";

const GameView = () => {
  const gameInstance = useGameState((state) => state.gameInstance);
  const setGameInstance = useGameState((state) => state.setGameInstance);

  console.log(gameInstance);

  useEffect(() => {
    if (!gameInstance) {
      setGameInstance(new Phaser.Game(Object.assign(PHASER_CONFIG, { scene: [Battle] })));
    }
  }, []);

  return (
    <>
      <App />
    </>
  );
};

export { GameView };
