import { describe, expect, it } from "vitest";
import { habitatConnectionLabel } from "./habitat-connection";

describe("habitat connection feedback", () => {
  it("names every player-facing shared-room lifecycle state", () => {
    expect(habitatConnectionLabel("connecting", 0, 2, "", false)).toContain("Connecting");
    expect(habitatConnectionLabel("connected", 2, 2, "", true)).toContain("input paused");
    expect(habitatConnectionLabel("full", 2, 2, "", false)).toContain("full");
    expect(habitatConnectionLabel("reconnecting", 0, 2, "", false)).toContain("Connection lost");
    expect(habitatConnectionLabel("error", 0, 2, "Room expired", false)).toContain("expired");
    expect(habitatConnectionLabel("offline", 0, 2, "", false)).toContain("Disconnected");
  });
});
