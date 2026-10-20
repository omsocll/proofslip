import { describe, expect, it } from "vitest";
import { assembleCheckRuns, checksForHead } from "../src/github.js";
import type { CheckRun } from "../src/types.js";

function run(name: string, sha: string, conclusion: string | null, status = "completed"): CheckRun {
  return { name, status, conclusion, sha, url: conclusion ? `https://example.test/${name}` : null };
}

describe("checks for the pull request head", () => {
  it("attributes merge-ref checks to the head sha and keeps the head result", () => {
    const head = [run("lint", "head", "success")];
    const merge = [run("test", "merge", "success"), run("lint", "merge", "failure")];
    expect(checksForHead("head", head, merge)).toEqual([
      run("test", "head", "success"),
      run("lint", "head", "success"),
    ]);
  });

  it("keeps an older commit's sha so a stale pass stays stale", () => {
    const previous = [run("test", "old", "success")];
    const merge = [run("test", "merge", "failure")];
    expect(assembleCheckRuns("head", [], merge, [run("CI", "run", "success")], previous)).toEqual([
      run("CI", "head", "success"),
      run("test", "head", "failure"),
      run("test", "old", "success"),
    ]);
  });
});
