export type HabitatConnectionStatus = "idle" | "connecting" | "connected" | "reconnecting" | "ended" | "error" | "full" | "offline";

export function habitatConnectionLabel(status: HabitatConnectionStatus, players: number, capacity: number, error: string, inputPaused: boolean): string {
  if (inputPaused && status === "connected") return `Connected · ${players}/${capacity} players · local input paused`;
  if (status === "connected") return `Connected · ${players}/${capacity} players`;
  if (status === "full") return "Shared habitat is full. Retry when a seat opens.";
  if (status === "reconnecting") return "Connection lost. Reconnecting to the shared habitat…";
  if (status === "ended" || /expired|ended/i.test(error)) return `Habitat expired. Start a new room with Retry. ${error}`.trim();
  if (status === "error") return `Shared habitat unavailable. ${error}`.trim();
  if (status === "offline") return "Disconnected. Retry room to join a habitat.";
  return "Connecting to shared habitat…";
}
