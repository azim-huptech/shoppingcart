// Client-side password hashing via Web Crypto (SHA-256 + random salt).
// Not a substitute for server-side auth; adequate for a localStorage demo
// so that stored data is not plain text.

const SALT_BYTES = 16;

const bufToHex = (buf) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const hexToBuf = (hex) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
};

const sha256 = async (saltBytes, password) => {
  const encoder = new TextEncoder();
  const passBytes = encoder.encode(password);
  const combined = new Uint8Array(saltBytes.length + passBytes.length);
  combined.set(saltBytes, 0);
  combined.set(passBytes, saltBytes.length);
  const digest = await window.crypto.subtle.digest('SHA-256', combined);
  return bufToHex(digest);
};

export async function hashPassword(password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await sha256(salt, password);
  return { salt: bufToHex(salt), hash };
}

export async function verifyPassword(password, saltHex, expectedHash) {
  const hash = await sha256(hexToBuf(saltHex), password);
  return hash === expectedHash;
}
