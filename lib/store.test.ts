import { expect, test } from "vitest";
import { createStore } from "./store";

test("set notifica e get reflete", () => {
  const s = createStore({ a: 1, b: 2 });
  const seen: number[] = [];
  const off = s.subscribe((v) => seen.push(v.a));
  s.set({ a: 5 });
  off();
  s.set({ a: 9 });
  expect(seen).toEqual([5]);
  expect(s.get()).toEqual({ a: 9, b: 2 });
});
