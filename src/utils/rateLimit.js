// Lightweight client-side rate limiter.
// Honest ceiling without a server: discourages casual abuse / brute-force
// via a per-browser localStorage window counter. A determined attacker can
// clear storage, but every real server-side check should ALSO be done
// server-side in a production app.

const now = () => Date.now();

const key = (name) => `rl_${name}`;

function read(name) {
  try {
    const raw = localStorage.getItem(key(name));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(name, data) {
  try {
    localStorage.setItem(key(name), JSON.stringify(data));
  } catch { /* ignore */ }
}

/**
 * Returns { allowed, retryIn, attemptsLeft }. Does NOT increment —
 * call `record()` after the action to count it.
 */
export function check(name, { max, windowMs, cooldownMs = 0 }) {
  const state = read(name) || { attempts: [], blockedUntil: 0 };
  const t = now();

  if (state.blockedUntil && state.blockedUntil > t) {
    return { allowed: false, retryIn: state.blockedUntil - t, attemptsLeft: 0 };
  }

  const windowStart = t - windowMs;
  const recent = state.attempts.filter((ts) => ts > windowStart);

  if (recent.length >= max) {
    const until = t + cooldownMs;
    write(name, { attempts: recent, blockedUntil: until });
    return { allowed: false, retryIn: cooldownMs || windowMs, attemptsLeft: 0 };
  }

  return { allowed: true, retryIn: 0, attemptsLeft: max - recent.length };
}

export function record(name, { max, windowMs, cooldownMs = 0 }) {
  const state = read(name) || { attempts: [], blockedUntil: 0 };
  const t = now();
  const windowStart = t - windowMs;
  const attempts = [...state.attempts.filter((ts) => ts > windowStart), t];
  let blockedUntil = state.blockedUntil || 0;
  if (attempts.length >= max && cooldownMs) {
    blockedUntil = t + cooldownMs;
  }
  write(name, { attempts, blockedUntil });
}

export function reset(name) {
  try { localStorage.removeItem(key(name)); } catch { /* ignore */ }
}

export function formatRetry(ms) {
  if (ms < 60_000) return `${Math.ceil(ms / 1000)}s`;
  if (ms < 3_600_000) return `${Math.ceil(ms / 60_000)} min`;
  return `${Math.ceil(ms / 3_600_000)} hr`;
}

// Named policies used across the app.
export const policies = {
  login:     { max: 5,  windowMs: 10 * 60_000, cooldownMs: 10 * 60_000 },
  signup:    { max: 3,  windowMs: 15 * 60_000, cooldownMs: 15 * 60_000 },
  contact:   { max: 3,  windowMs: 60 * 60_000, cooldownMs: 30 * 60_000 },
  newsletter:{ max: 5,  windowMs: 24 * 60 * 60_000, cooldownMs: 60 * 60_000 },
  checkout:  { max: 10, windowMs: 60 * 60_000, cooldownMs: 15 * 60_000 },
};
