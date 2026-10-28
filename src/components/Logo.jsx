import React from "react";

export function LogoMark({ className = "w-9 h-9" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Objet mark"
    >
      <rect x="1" y="1" width="38" height="38" rx="19" fill="#0a0a0a" />
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Fraunces, Georgia, serif"
        fontStyle="italic"
        fontWeight="500"
        fontSize="22"
        fill="#ffffff"
      >
        O
      </text>
      <circle cx="31" cy="10" r="2" fill="#a68d55" />
    </svg>
  );
}

export function LogoWordmark({ className = "" }) {
  return (
    <span className={`font-display italic text-ink-900 leading-none tracking-tight ${className}`}>
      Objet<span className="text-accent-500 not-italic">.</span>
    </span>
  );
}

export default LogoMark;
