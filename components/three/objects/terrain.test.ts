import { expect, test } from "vitest";
import { mulberry32 } from "@/lib/math";
import { heightAt, riverSources, traceRiver } from "./terrain";

test("heightAt determinístico e limitado", () => {
  expect(heightAt(0.3, -0.2)).toBe(heightAt(0.3, -0.2));
  const rand = mulberry32(5);
  for (let i = 0; i < 500; i++) {
    const h = heightAt(rand() * 2 - 1, rand() * 2 - 1);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(1);
  }
});

test("rio só desce", () => {
  for (const source of riverSources(6)) {
    const r = traceRiver(source, 200);
    expect(r.length).toBeGreaterThan(5);
    for (let i = 1; i < r.length; i++) {
      expect(heightAt(...r[i])).toBeLessThanOrEqual(heightAt(...r[i - 1]) + 1e-9);
    }
  }
});

test("nascentes nos pontos altos, afastadas entre si", () => {
  const s = riverSources(6);
  expect(s).toHaveLength(6);
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j < s.length; j++) {
      expect(Math.hypot(s[i][0] - s[j][0], s[i][1] - s[j][1])).toBeGreaterThanOrEqual(0.3);
    }
  }
});
