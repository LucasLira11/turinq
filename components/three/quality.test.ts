import { expect, test } from "vitest";
import { pickQuality } from "./quality";

const base = { webgl: true, forceStatic: false, width: 1440, cores: 8, memory: 8 };

test("níveis", () => {
  expect(pickQuality(base)).toBe("high");
  expect(pickQuality({ ...base, width: 767 })).toBe("low");
  expect(pickQuality({ ...base, cores: 4 })).toBe("low");
  expect(pickQuality({ ...base, memory: 4 })).toBe("low");
  expect(pickQuality({ ...base, cores: undefined, memory: undefined })).toBe("high");
  expect(pickQuality({ ...base, webgl: false })).toBe("static");
  expect(pickQuality({ ...base, forceStatic: true })).toBe("static");
});
