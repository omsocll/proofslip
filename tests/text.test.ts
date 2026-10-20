import { describe, expect, it } from "vitest";
import { countLabel } from "../src/text.js";

describe("countLabel", () => {
  it("uses the singular word for one", () => {
    expect(countLabel(1, "file")).toBe("1 file");
    expect(countLabel(1, "line")).toBe("1 line");
  });

  it("uses the plural word for every other count", () => {
    expect(countLabel(0, "file")).toBe("0 files");
    expect(countLabel(3, "line")).toBe("3 lines");
    expect(countLabel(22, "file", "files")).toBe("22 files");
  });
});
