import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Force dark text regardless of scroll state */
  dark?: boolean;
}

/**
 * ShajSutro brand lockup.
 * Mark: precision-notched clothing tag (tailoring V-cut + hang hole).
 * Wordmark: stacked "SHAJ / SUTRO" typographic lockup — luxury fashion style.
 * Palette: charcoal-950 (near-black) + charcoal-500 (mid) + warm-300 (beige separator).
 */
export default function Logo({ href = "/", size = "md", className = "", dark = true }: LogoProps) {
  /* ── Responsive scale tokens ── */
  const scale = {
    sm: { markW: 14, markH: 19, labelPx: 7,  namePx: 11, gap: 2.5, sepMy: 2 },
    md: { markW: 17, markH: 23, labelPx: 8,  namePx: 13, gap: 3,   sepMy: 3 },
    lg: { markW: 22, markH: 30, labelPx: 10, namePx: 17, gap: 4,   sepMy: 3 },
  }[size];

  const textColor  = dark ? "#1a1a1f" : "#ffffff";   /* charcoal-950 / white */
  const labelColor = dark ? "#737382" : "rgba(255,255,255,0.55)"; /* charcoal-500 */
  const sepColor   = dark ? "#ddd0be" : "rgba(255,255,255,0.2)";  /* warm-300 */
  const markColor  = dark ? "#1a1a1f" : "#ffffff";

  const mark = (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ gap: scale.gap }}
    >
      {/* ── Clothing-tag mark ── */}
      {/*
          Shape: rectangle with a precision V-notch cut at top-right corner
          + a small hang-hole circle near the top — a universal couture / hang-tag motif.
          Stroke only, no fill — pure negative space play.
      */}
      <svg
        width={scale.markW}
        height={scale.markH}
        viewBox="0 0 22 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Tag silhouette with notched top-right corner */}
        <path
          d="M 2 2 L 14 2 L 20 8 L 20 28 L 2 28 Z"
          stroke={markColor}
          strokeWidth="1.25"
          strokeLinejoin="miter"
          fill="none"
        />

        {/* Notch accent — single diagonal line echoing the cut */}
        <line
          x1="14" y1="2"
          x2="20" y2="8"
          stroke={markColor}
          strokeWidth="0.5"
          opacity="0.35"
        />

        {/* Hang hole */}
        <circle
          cx="7"
          cy="7"
          r="1.6"
          stroke={markColor}
          strokeWidth="1"
          fill="none"
        />

        {/* Subtle inner horizontal rule — referencing size/care label lines */}
        <line
          x1="5"  y1="21"
          x2="17" y2="21"
          stroke={markColor}
          strokeWidth="0.75"
          opacity="0.25"
        />
        <line
          x1="5"  y1="24"
          x2="13" y2="24"
          stroke={markColor}
          strokeWidth="0.75"
          opacity="0.15"
        />
      </svg>

      {/* ── Wordmark lockup ── */}
      {/*
          Two-tier typographic treatment:
          "SHAJ"  — small, ultra-wide tracking, mid-weight  (like a sub-label / house name)
          ——————  — thin warm-toned rule                    (negative space divider)
          "SUTRO" — larger, tight tracking, bold            (the primary identifier)
          Inspired by ALD, Toteme, Fear of God stacked wordmarks.
      */}
      <div className="flex flex-col" style={{ lineHeight: 1 }}>
        {/* Sub-label */}
        <span
          style={{
            fontSize: scale.labelPx,
            color: labelColor,
            fontWeight: 500,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          SHAJ
        </span>

        {/* Separator rule */}
        <div
          style={{
            height: "0.75px",
            background: sepColor,
            marginTop: scale.sepMy,
            marginBottom: scale.sepMy,
            width: "100%",
          }}
        />

        {/* Primary name */}
        <span
          style={{
            fontSize: scale.namePx,
            color: textColor,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          SUTRO
        </span>
      </div>
    </div>
  );

  return href ? (
    <Link
      href={href}
      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-400 focus-visible:ring-offset-2 rounded-sm"
      aria-label="ShajSutro — Home"
    >
      <div className="transition-opacity duration-300 group-hover:opacity-60">
        {mark}
      </div>
    </Link>
  ) : (
    mark
  );
}
