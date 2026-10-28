import React, { useEffect, useState } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";

// Lightweight self-hosted captcha. Not a replacement for server-verified
// reCAPTCHA/hCaptcha, but blocks naive bots and keeps the app
// backend-free. Pair it with a honeypot field for best results.
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function pick() {
  const a = rand(2, 12);
  const b = rand(2, 12);
  const op = Math.random() > 0.5 ? "+" : "-";
  const [x, y] = op === "-" && a < b ? [b, a] : [a, b];
  const answer = op === "+" ? x + y : x - y;
  return { x, y, op, answer };
}

/**
 * Controlled: parent owns the user's input and knows when it's valid via
 * the `onChange(valid: boolean)` callback. `name` is used only for the
 * input id, so multiple captchas can coexist.
 */
function MathCaptcha({ name = "captcha", value, onChange, onValidChange, error }) {
  const [challenge, setChallenge] = useState(pick);

  useEffect(() => {
    onValidChange?.(parseInt(value, 10) === challenge.answer);
  }, [value, challenge, onValidChange]);

  const refresh = () => {
    setChallenge(pick());
    onChange?.("");
  };

  const invalid = Boolean(error) || (value && parseInt(value, 10) !== challenge.answer);
  const valid = value && parseInt(value, 10) === challenge.answer;

  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">
        Prove you're human
      </label>
      <div className="flex items-stretch gap-2">
        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-ink-100 border border-ink-200 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-ink-500 shrink-0" />
          <span className="font-display text-lg text-ink-900 select-none" aria-label={`Solve ${challenge.x} ${challenge.op} ${challenge.y}`}>
            {challenge.x} {challenge.op} {challenge.y} =
          </span>
          <input
            id={name}
            name={name}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value.replace(/[^0-9-]/g, ""))}
            placeholder="?"
            className={`w-16 bg-transparent text-lg font-medium focus:outline-none ${
              invalid ? "text-red-600" : valid ? "text-emerald-700" : "text-ink-900"
            }`}
          />
          <button
            type="button"
            onClick={refresh}
            className="ml-auto p-1.5 text-ink-500 hover:text-ink-900 rounded-full hover:bg-ink-50 transition"
            aria-label="New challenge"
            title="New challenge"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
}

/** Shared honeypot — a hidden text field that bots fill but humans don't. */
export function Honeypot({ name = "website" }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
      <label htmlFor={name}>Leave this empty</label>
      <input
        id={name}
        name={name}
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

export default MathCaptcha;
