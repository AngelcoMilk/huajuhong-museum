import { describe, expect, it } from "vitest";
import { patchEnterprisePoints } from "./contentHydrate";

describe("地图点位水合", () => {
  it("用后台坐标覆盖静态点位，只改坐标相关字段", () => {
    const list = [
      { id: "QY-001", name: "甲公司", lng: 110.1, lat: 21.1, coordSource: "旧", verified: false },
      { id: "QY-002", name: "乙公司", lng: 110.2, lat: 21.2, coordSource: "旧", verified: false },
    ] as any[];
    const patched = patchEnterprisePoints(list, {
      "QY-001": { lng: 110.634471, lat: 21.664117, coordSource: "后台录入", verified: true },
    });
    expect(patched).toBe(1);
    expect(list[0].lng).toBe(110.634471);
    expect(list[0].coordSource).toBe("后台录入");
    expect(list[0].verified).toBe(true);
    expect(list[1].lng).toBe(110.2);
  });
});
