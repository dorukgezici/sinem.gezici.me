type PixelSmokePuffProps = {
  className?: string;
};

export default function PixelSmokePuff({ className }: PixelSmokePuffProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ imageRendering: "pixelated" }}>
      <rect x="6" y="8" width="12" height="12" fill="#B8B8B8" />
      <rect x="8" y="4" width="8" height="6" fill="#C8C8C8" />
      <rect x="4" y="10" width="6" height="8" fill="#A8A8A8" />
      <rect x="14" y="10" width="6" height="8" fill="#D0D0D0" />
      <rect x="10" y="2" width="4" height="4" fill="#D8D8D8" />
    </svg>
  );
}
