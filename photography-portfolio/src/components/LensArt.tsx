/**
 * A camera-lens macro rendered entirely in SVG: knurled metallic barrel,
 * engraved spec and scale rings (counter-rotating), stacked glass elements,
 * a nine-blade iris, and multicoating reflections that shimmer slowly.
 * Used at full size in the hero and as a faint echo in the footer.
 */

/**
 * Nine-blade iris polygon, points on radius `r` around (408, 412).
 * Coordinates are rounded so the server and client render the exact same
 * string; raw trig output differs in the last ulp and breaks hydration.
 */
const irisPoints = (r: number, offsetDeg: number) =>
  Array.from({ length: 9 }, (_, i) => {
    const a = ((i * 40 + offsetDeg) * Math.PI) / 180;
    return `${(408 + r * Math.cos(a)).toFixed(2)},${(412 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");

export function LensArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 800"
      className={className}
      aria-hidden
      role="presentation"
    >
      <defs>
        <radialGradient id="lens-barrel" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#272c35" />
          <stop offset="55%" stopColor="#14181f" />
          <stop offset="100%" stopColor="#080a0e" />
        </radialGradient>
        <radialGradient id="lens-glass" cx="42%" cy="36%" r="75%">
          <stop offset="0%" stopColor="#070a12" />
          <stop offset="60%" stopColor="#0a1020" />
          <stop offset="100%" stopColor="#131d33" />
        </radialGradient>
        <radialGradient id="lens-element" cx="46%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#04050a" />
          <stop offset="70%" stopColor="#0a0e1e" />
          <stop offset="100%" stopColor="#141a30" />
        </radialGradient>
        <radialGradient id="lens-glint-violet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lens-glint-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d98b6a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d98b6a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lens-glint-green" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lens-hotspot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8e6e1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e8e6e1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lens-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#aab4c4" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#aab4c4" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#aab4c4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lens-element-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.18" />
        </linearGradient>
        <filter id="lens-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id="lens-blur-sm" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <path id="lens-text-arc" d="M 400 66 a 334 334 0 1 1 -0.01 0" fill="none" />
        <path id="lens-scale-arc" d="M 400 94 a 306 306 0 1 1 -0.01 0" fill="none" />
      </defs>

      {/* ── barrel ── */}
      <circle cx="400" cy="400" r="398" fill="url(#lens-barrel)" />
      <circle cx="400" cy="400" r="397" fill="none" stroke="url(#lens-rim)" strokeWidth="2" />
      {/* primary knurled grip */}
      <circle
        cx="400"
        cy="400"
        r="384"
        fill="none"
        stroke="#1b2029"
        strokeWidth="14"
        strokeDasharray="3.5 5.5"
      />
      <circle
        cx="400"
        cy="400"
        r="384"
        fill="none"
        stroke="#31384420"
        strokeWidth="14"
        strokeDasharray="1 8"
      />
      {/* machined groove pair */}
      <circle cx="400" cy="400" r="374" fill="none" stroke="#3a414d" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="400" cy="400" r="371" fill="none" stroke="#04050a" strokeWidth="2.5" />

      {/* engraved spec ring, rotating slowly */}
      <g className="lens-spin">
        <text
          fill="#7d8694"
          fontSize="16.5"
          letterSpacing="5.5"
          style={{ fontFamily: "var(--font-jbmono), monospace" }}
        >
          <textPath href="#lens-text-arc">
            TAMEN DUTTA · FIELD SERIES 16-35 ƒ/2.8 · ICELAND · HIMALAYA ·
            DEEP SKY · PHOTOGRAPHED SLOWLY ·
          </textPath>
        </text>
      </g>


      {/* tick ring + distance scale, counter-rotating */}
      <g className="lens-spin-reverse">
        <circle
          cx="400"
          cy="400"
          r="322"
          fill="none"
          stroke="#4a5260"
          strokeWidth="10"
          strokeDasharray="1.5 20.9"
          strokeOpacity="0.9"
        />
        <circle
          cx="400"
          cy="400"
          r="322"
          fill="none"
          stroke="#333a46"
          strokeWidth="6"
          strokeDasharray="1 4.6"
        />
        <text
          fill="#5d6674"
          fontSize="12.5"
          letterSpacing="4"
          style={{ fontFamily: "var(--font-jbmono), monospace" }}
        >
          <textPath href="#lens-scale-arc">
            ∞ · 3M · 1.5M · 0.9M · 0.45M · 0.28M · MACRO · ø77MM · MC ·
            SN 0207-1425 · 22 · 16 · 11 · 8 · 5.6 · 4 · 2.8 ·
          </textPath>
        </text>
      </g>

      {/* aperture-ring step */}
      <circle cx="400" cy="400" r="304" fill="#0a0d12" stroke="#2e3540" strokeWidth="1.5" />
      <circle
        cx="400"
        cy="400"
        r="294"
        fill="none"
        stroke="#20252e"
        strokeWidth="9"
        strokeDasharray="1.5 9"
      />
      {/* filter thread hint */}
      <circle
        cx="400"
        cy="400"
        r="286"
        fill="none"
        stroke="#171c24"
        strokeWidth="4"
        strokeDasharray="1 2.5"
      />
      {/* red index dot on the aperture-ring face */}
      <circle cx="400" cy="104" r="4.5" fill="#b8442e" />
      <circle cx="400" cy="104" r="4.5" fill="none" stroke="#e8e6e1" strokeOpacity="0.15" strokeWidth="1" />

      {/* ── glass stack ── */}
      <circle cx="400" cy="400" r="280" fill="url(#lens-glass)" stroke="#0d1322" strokeWidth="2" />
      <circle cx="400" cy="400" r="279" fill="none" stroke="url(#lens-rim)" strokeWidth="1.5" />
      {/* element rims caught by light */}
      <circle cx="402" cy="403" r="252" fill="none" stroke="url(#lens-element-rim)" strokeWidth="1.5" />
      <circle cx="404" cy="406" r="212" fill="url(#lens-element)" />
      <circle cx="404" cy="406" r="211" fill="none" stroke="url(#lens-element-rim)" strokeWidth="1.2" strokeOpacity="0.8" />
      <circle cx="406" cy="409" r="172" fill="none" stroke="#1c2540" strokeWidth="1" strokeOpacity="0.9" />

      {/* nine-blade iris, two layers offset for depth */}
      <polygon points={irisPoints(138, 0)} fill="#030509" />
      <polygon points={irisPoints(138, 0)} fill="none" stroke="#1a2136" strokeWidth="1.2" />
      <polygon points={irisPoints(126, 20)} fill="none" stroke="#141c30" strokeWidth="1" strokeOpacity="0.9" />
      {/* aperture opening */}
      <circle cx="408" cy="412" r="92" fill="#02030a" />
      <circle cx="408" cy="412" r="92" fill="none" stroke="#202b4d" strokeWidth="1" />
      {/* rear-element reflection floating in the dark */}
      <ellipse cx="428" cy="386" rx="26" ry="16" fill="#3b4a7a" opacity="0.35" filter="url(#lens-blur-sm)" transform="rotate(-28 428 386)" />

      {/* ── multicoating reflections ── */}
      <g className="lens-glint">
        <ellipse
          cx="492"
          cy="292"
          rx="132"
          ry="74"
          fill="url(#lens-glint-violet)"
          filter="url(#lens-blur)"
          transform="rotate(-32 492 292)"
        />
        <ellipse
          cx="304"
          cy="512"
          rx="104"
          ry="56"
          fill="url(#lens-glint-warm)"
          filter="url(#lens-blur)"
          transform="rotate(-28 304 512)"
        />
        <ellipse
          cx="330"
          cy="330"
          rx="70"
          ry="34"
          fill="url(#lens-glint-green)"
          filter="url(#lens-blur)"
          transform="rotate(-40 330 330)"
        />
        <circle cx="452" cy="330" r="54" fill="url(#lens-hotspot)" filter="url(#lens-blur)" />
      </g>

      {/* specular pinpoints */}
      <circle cx="472" cy="306" r="4" fill="#e8e6e1" opacity="0.4" filter="url(#lens-blur-sm)" />
      <circle cx="298" cy="472" r="3" fill="#e8e6e1" opacity="0.25" filter="url(#lens-blur-sm)" />
      <circle cx="510" cy="382" r="2.5" fill="#c4b5fd" opacity="0.35" filter="url(#lens-blur-sm)" />

      {/* rim highlights */}
      <path
        d="M 244 268 a 214 214 0 0 1 118 -92"
        fill="none"
        stroke="#cbd5e1"
        strokeOpacity="0.28"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 560 540 a 214 214 0 0 1 -86 62"
        fill="none"
        stroke="#cbd5e1"
        strokeOpacity="0.1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
