import { REDIS_PlayerFindingMatch } from "redis/types";
import { gameManager } from "../ws/GameManager";

/**
 * Handler for matchmaking messages received via Redis Pub/Sub.
 * Expects payload with a `players` array containing at least two player objects.
 */
export function handleMatchmaking(payload: REDIS_PlayerFindingMatch): void {
  const { players } = payload;
  console.log('👍🏾 ahiusdhuias',)
  if (!Array.isArray(players) || players.length < 2) {
    console.warn("Not enough players to create a match:", players);
    return;
  }

  const [player1, player2] = players;
  console.log("Matchmaking players:", player1.id, player2.id);

  try {
    gameManager.createMatch(player1.id, player2.id);
  } catch (err) {
    console.error("Error creating match:", err);
  }
}
