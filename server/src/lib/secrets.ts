// 供应商 Key 的加密存储：AES-256-GCM。
// 密钥来自 SECRETS_KEY（缺省退回 ADMIN_JWT_SECRET），只用于加解密，不参与下发。
// 任何接口都不得返回明文；只回 hasKey 与末四位。
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

function key(): Buffer {
  const raw = process.env.SECRETS_KEY ?? process.env.ADMIN_JWT_SECRET;
  if (!raw || raw.length < 16) throw new Error("SECRETS_KEY / ADMIN_JWT_SECRET 未配置");
  return scryptSync(raw, "hjh-secrets-v1", 32);
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ["v1", iv.toString("base64"), tag.toString("base64"), ct.toString("base64")].join(":");
}

export function decryptSecret(stored: string): string | null {
  try {
    const [v, ivB64, tagB64, ctB64] = stored.split(":");
    if (v !== "v1") return null;
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64"));
    decipher.setAuthTag(Buffer.from(tagB64, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(ctB64, "base64")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export function maskTail(plain: string): string {
  return plain.length <= 4 ? "****" : `****${plain.slice(-4)}`;
}
