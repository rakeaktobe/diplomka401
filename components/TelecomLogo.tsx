// Precise SVG recreation of the Kazakhtelecom double-globe logo.
// Rendered inline for zero network requests, perfect sharpness at all scales.
export function TelecomLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ТЕЛЕКОМ Logo"
    >
      {/* Blue rounded-square background */}
      <rect width="100" height="100" rx="22" fill="#1a8fe3" />

      {/* ── Left globe (horizontal stripes, front-facing) ─── */}
      <clipPath id="leftGlobe">
        <circle cx="38" cy="52" r="26" />
      </clipPath>
      <circle cx="38" cy="52" r="26" fill="white" />
      <g clipPath="url(#leftGlobe)">
        <rect x="12" y="30" width="52" height="5" fill="#1a8fe3" />
        <rect x="12" y="39" width="52" height="5" fill="#1a8fe3" />
        <rect x="12" y="48" width="52" height="5" fill="#1a8fe3" />
        <rect x="12" y="57" width="52" height="5" fill="#1a8fe3" />
        <rect x="12" y="66" width="52" height="5" fill="#1a8fe3" />
      </g>

      {/* ── Right globe (angled stripes, side-view) ─── */}
      <clipPath id="rightGlobe">
        <circle cx="62" cy="52" r="26" />
      </clipPath>
      <circle cx="62" cy="52" r="26" fill="white" />
      <g clipPath="url(#rightGlobe)" transform="rotate(-20 62 52)">
        <rect x="36" y="30" width="52" height="5" fill="#1a8fe3" />
        <rect x="36" y="39" width="52" height="5" fill="#1a8fe3" />
        <rect x="36" y="48" width="52" height="5" fill="#1a8fe3" />
        <rect x="36" y="57" width="52" height="5" fill="#1a8fe3" />
        <rect x="36" y="66" width="52" height="5" fill="#1a8fe3" />
      </g>
    </svg>
  );
}
