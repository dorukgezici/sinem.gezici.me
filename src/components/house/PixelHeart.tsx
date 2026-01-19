type PixelHeartProps = {
  className?: string;
};

export default function PixelHeart({ className }: PixelHeartProps) {
  return (
    <svg
      width="12"
      height="10"
      viewBox="0 0 12 10"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="1" y="0" width="2" height="2" fill="#FF6B6B" />
      <rect x="4" y="0" width="2" height="2" fill="#FF6B6B" />
      <rect x="7" y="0" width="2" height="2" fill="#FF6B6B" />
      <rect x="10" y="0" width="2" height="2" fill="#FF6B6B" />
      <rect x="0" y="2" width="2" height="2" fill="#FF6B6B" />
      <rect x="2" y="2" width="2" height="2" fill="#FF9999" />
      <rect x="4" y="2" width="2" height="2" fill="#FF6B6B" />
      <rect x="6" y="2" width="2" height="2" fill="#FF6B6B" />
      <rect x="8" y="2" width="2" height="2" fill="#FF9999" />
      <rect x="10" y="2" width="2" height="2" fill="#FF6B6B" />
      <rect x="0" y="4" width="2" height="2" fill="#FF6B6B" />
      <rect x="2" y="4" width="2" height="2" fill="#FF6B6B" />
      <rect x="4" y="4" width="2" height="2" fill="#FF6B6B" />
      <rect x="6" y="4" width="2" height="2" fill="#FF6B6B" />
      <rect x="8" y="4" width="2" height="2" fill="#FF6B6B" />
      <rect x="10" y="4" width="2" height="2" fill="#FF6B6B" />
      <rect x="2" y="6" width="2" height="2" fill="#FF6B6B" />
      <rect x="4" y="6" width="2" height="2" fill="#FF6B6B" />
      <rect x="6" y="6" width="2" height="2" fill="#FF6B6B" />
      <rect x="8" y="6" width="2" height="2" fill="#FF6B6B" />
      <rect x="4" y="8" width="2" height="2" fill="#FF6B6B" />
      <rect x="6" y="8" width="2" height="2" fill="#FF6B6B" />
    </svg>
  );
}
