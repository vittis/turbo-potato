import App from "@/App";
import { PHASER_CONFIG } from "@/game/config";
import { Battle } from "@/game/scenes/battle/BattleScene";
import { useGameState } from "@/services/state/useGameState";
import { useEffect } from "react";

const GameView = () => {
  const gameInstance = useGameState((state) => state.gameInstance);
  const setGameInstance = useGameState((state) => state.setGameInstance);
  const hideGame = useGameState((state) => state.hideGame);
  const isGameHidden = useGameState((state) => state.isGameHidden);
  const showGame = useGameState((state) => state.showGame);

  useEffect(() => {
    if (!gameInstance && !isGameHidden) {
      setGameInstance(new Phaser.Game(Object.assign(PHASER_CONFIG, { scene: [Battle] })));
    } else if (gameInstance && isGameHidden) {
      if (gameInstance.scene.isActive("BattleScene")) {
        showGame();
        // gameInstance.scene.getScene("BattleScene").scene.restart(); // todo: fix battleunitsprite to make this work
      }
    }

    return () => {
      hideGame();
    };
  }, []);

  return (
    <>
      <App />
    </>
  );
};

export { GameView };
