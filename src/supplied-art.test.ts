import { describe, expect, it } from "vitest";
import { suppliedArtStatus } from "./supplied-art";

describe("supplied art status", () => {
  it("keeps the habitat blank while approved artwork is loading", () => {
    expect(suppliedArtStatus([true, false], [])).toBe("loading");
  });

  it("reports a required-asset failure without a legacy-art fallback", () => {
    expect(suppliedArtStatus([true, false], ["/assets/rabbit/BunnyIdle-Sheet.png"])).toBe("error");
  });

  it("allows rendering after every supplied image is available", () => {
    expect(suppliedArtStatus([true, true], [])).toBe("ready");
  });
});
