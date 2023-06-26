import { Game } from "./game/Game";

const game = new Game();
game.startGame();

export function getGameHistory() {
  return game.history;
}

export function getGameEventHistory() {
  return game.eventHistory;
}
