// 地理坐标：后台录入地图标注用。
// 支持三种输入，统一归一化成 { lng, lat }（经度在前，和 GeoJSON 一致）。
//   1) { "lng": 110.634471, "lat": 21.664117 }
//   2) "110.634471,21.664117"（经度,纬度）
//   3) GeoJSON: { "type": "Point", "coordinates": [110.634471, 21.664117] }
// 校验：数值范围、NaN、经纬颠倒的常见误填（化州一带 |lat|<|lng|）。

export interface Coord {
  lng: number;
  lat: number;
}

export interface CoordResult {
  ok: boolean;
  coord?: Coord;
  swapped?: boolean;
  message?: string;
}

export function parseCoord(input: unknown): CoordResult {
  let lng: number | undefined;
  let lat: number | undefined;

  if (typeof input === "string") {
    const parts = input.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean);
    if (parts.length !== 2) return { ok: false, message: "字符串格式应为「经度,纬度」，例如 110.6344,21.6641" };
    lng = Number(parts[0]);
    lat = Number(parts[1]);
  } else if (input && typeof input === "object") {
    const raw = input as Record<string, unknown>;
    if (Array.isArray(raw.coordinates)) {
      lng = Number(raw.coordinates[0]);
      lat = Number(raw.coordinates[1]);
    } else if ("lng" in raw || "lon" in raw || "lat" in raw) {
      lng = Number(raw.lng ?? raw.lon);
      lat = Number(raw.lat);
    }
  }

  if (lng === undefined || lat === undefined) return { ok: false, message: "缺少经度或纬度" };
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return { ok: false, message: "经纬度必须是数字" };

  // 经纬颠倒（化州约 110.6E, 21.7N）：先纠正再校验范围，否则「纬度 110」会直接被范围挡掉
  let swapped = false;
  if (Math.abs(lat) > 90 && Math.abs(lng) <= 90) {
    const tmp = lng;
    lng = lat;
    lat = tmp;
    swapped = true;
  }
  if (Math.abs(lng) > 180 || Math.abs(lat) > 90) return { ok: false, message: "经度需在 -180~180、纬度需在 -90~90 之间" };

  const rounded = { lng: Math.round(lng * 1e6) / 1e6, lat: Math.round(lat * 1e6) / 1e6 };
  return { ok: true, coord: rounded, swapped };
}

/** 化州大致范围，仅用于给录入者一个提示，不拒绝 */
export function looksLikeHuazhou(coord: Coord): boolean {
  return coord.lng > 109.9 && coord.lng < 111.4 && coord.lat > 21.0 && coord.lat < 22.6;
}

/** 地图点位文件格式：{ "QY-001": { lng, lat, coordSource, verified } } */
export function toPointEntry(coord: Coord, source: string, verified: boolean) {
  return { lng: coord.lng, lat: coord.lat, coordSource: source, verified };
}