export const COOKIE_NAME = "transitops_token";
const SECRET = process.env.JWT_SECRET || "transitops-super-secret-jwt-key-2026";

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  exp?: number;
}

// ── Pure Web Crypto JWT (works in both Node.js and Edge runtime) ──────────────

function base64url(buf: Uint8Array | ArrayBuffer): string {
  const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf;
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  return new Uint8Array([...bin].map((c) => c.charCodeAt(0)));
}

async function getKey(usage: KeyUsage[]): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  );
}

export async function signToken(payload: JWTPayload): Promise<string> {
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = base64url(
    new TextEncoder().encode(
      JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 })
    )
  );
  const message = `${header}.${body}`;
  const key = await getKey(["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return `${message}.${base64url(sig)}`;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const message = `${header}.${body}`;
    const key = await getKey(["verify"]);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlDecode(sig),
      new TextEncoder().encode(message)
    );
    if (!valid) return null;
    const payload: JWTPayload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(body))
    );
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
