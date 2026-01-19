import type { CSSProperties } from "react";
import { HOUSE_COLORS } from "./houseColors";

type DoorFrameProps = {
  className?: string;
  style?: CSSProperties;
};

export default function DoorFrame({ className, style }: DoorFrameProps) {
  return (
    <svg
      viewBox="0 0 28 36"
      className={`w-20 h-25.75 sm:w-28 sm:h-36 ${className ?? ""}`}
      style={{ imageRendering: "pixelated", ...style }}
    >
      <rect x="0" y="0" width="28" height="36" fill={HOUSE_COLORS.woodShadow} />
      <rect x="2" y="2" width="24" height="34" fill={HOUSE_COLORS.woodDark} />
      <rect x="3" y="3" width="22" height="33" fill="#1a1a1a" />
      <rect x="0" y="34" width="28" height="2" fill={HOUSE_COLORS.woodShadow} />
    </svg>
  );
}
