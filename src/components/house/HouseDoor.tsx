import type { CSSProperties } from "react";
import { HOUSE_COLORS } from "./houseColors";

type HouseDoorProps = {
  className?: string;
  style?: CSSProperties;
  isOpen: boolean;
};

export default function HouseDoor({ className, style, isOpen }: HouseDoorProps) {
  return (
    <svg
      width="112"
      height="144"
      viewBox="0 0 28 36"
      className={className}
      style={{
        imageRendering: "pixelated",
        transformOrigin: "left center",
        transform: isOpen ? "rotateY(-85deg)" : "rotateY(0deg)",
        ...style,
      }}
    >
      <rect x="3" y="3" width="22" height="33" fill={HOUSE_COLORS.doorMedium} />
      <rect x="5" y="5" width="8" height="10" fill={HOUSE_COLORS.doorDark} />
      <rect x="6" y="6" width="6" height="8" fill={HOUSE_COLORS.doorLight} />
      <rect x="15" y="5" width="8" height="10" fill={HOUSE_COLORS.doorDark} />
      <rect x="16" y="6" width="6" height="8" fill={HOUSE_COLORS.doorLight} />
      <rect x="5" y="17" width="8" height="14" fill={HOUSE_COLORS.doorDark} />
      <rect x="6" y="18" width="6" height="12" fill={HOUSE_COLORS.doorLight} />
      <rect x="15" y="17" width="8" height="14" fill={HOUSE_COLORS.doorDark} />
      <rect x="16" y="18" width="6" height="12" fill={HOUSE_COLORS.doorLight} />
      <rect x="13" y="3" width="2" height="33" fill={HOUSE_COLORS.doorShadow} />
      <rect x="3" y="15" width="22" height="2" fill={HOUSE_COLORS.doorShadow} />
      <rect x="19" y="19" width="4" height="6" fill={HOUSE_COLORS.woodShadow} />
      <rect x="20" y="21" width="2" height="2" fill="#D4A03A" />
      <rect x="20" y="20" width="2" height="1" fill="#E8B94A" />
      <rect x="20" y="23" width="2" height="1" fill="#B8862A" />
      <rect
        x="4"
        y="4"
        width="1"
        height="31"
        fill={HOUSE_COLORS.doorHighlight}
        opacity="0.4"
      />
    </svg>
  );
}
