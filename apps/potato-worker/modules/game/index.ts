import { Game } from "./game/Game";

const game = new Game();

export function getGameHistory() {
  game.startGame();
  return game.history;
}
