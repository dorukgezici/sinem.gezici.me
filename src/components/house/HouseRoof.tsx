import type { CSSProperties } from "react";
import { HOUSE_COLORS } from "./houseColors";

type HouseRoofProps = {
  className?: string;
  style?: CSSProperties;
};

export default function HouseRoof({ className, style }: HouseRoofProps) {
  return (
    <svg
      viewBox="0 0 400 120"
      preserveAspectRatio="none"
      className={className}
      style={{ imageRendering: "pixelated", ...style }}
    >
      <defs>
        <clipPath id="roofClip">
          <path d="M0 120 L200 0 L400 120 Z" />
        </clipPath>
      </defs>

      {/* Chimney body - rendered first so roof overlaps bottom */}
      <g>
        <rect
          x="60"
          y="20"
          width="40"
          height="100"
          fill={HOUSE_COLORS.brickMedium}
        />
        <rect
          x="56"
          y="20"
          width="4"
          height="100"
          fill={HOUSE_COLORS.brickDark}
        />
        <rect
          x="100"
          y="20"
          width="4"
          height="50"
          fill={HOUSE_COLORS.brickDark}
        />
      </g>

      {/* Main Roof base */}
      <g clipPath="url(#roofClip)">
        <rect
          x="0"
          y="0"
          width="400"
          height="120"
          fill={HOUSE_COLORS.woodDark}
        />

        {[...Array(10)].map((_, row) => {
          const rowY = row * 12;
          const progress = (row + 1) / 10;
          const rowWidth = 400 * progress;
          const startX = (400 - rowWidth) / 2;
          const offset = row % 2 === 0 ? 0 : 10;

          const colors = [
            HOUSE_COLORS.woodMedium,
            HOUSE_COLORS.woodLight,
            HOUSE_COLORS.woodAccent,
          ];
          const highlights = [HOUSE_COLORS.woodHighlight, "#D2996C", "#BC7642"];

          return (
            <g key={`row-${row}`}>
              {[...Array(Math.ceil(rowWidth / 20) + 1)].map((_, i) => {
                const x = startX + i * 20 - offset;
                const colorIndex = (row + i) % 3;

                return (
                  <g key={`tile-${row}-${i}`}>
                    <rect
                      x={x}
                      y={rowY}
                      width={19}
                      height={12}
                      fill={colors[colorIndex]}
                    />
                    <rect
                      x={x}
                      y={rowY}
                      width={19}
                      height={3}
                      fill={highlights[colorIndex]}
                    />
                    <rect
                      x={x}
                      y={rowY + 10}
                      width={19}
                      height={2}
                      fill={HOUSE_COLORS.woodShadow}
                    />
                    <rect
                      x={x}
                      y={rowY + 3}
                      width={2}
                      height={7}
                      fill={HOUSE_COLORS.woodDark}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        <path
          d="M0 120 L200 0 L400 120"
          fill="none"
          stroke={HOUSE_COLORS.woodShadow}
          strokeWidth="6"
        />
      </g>

      {/* Chimney top and bricks - rendered on top of roof */}
      <g>
        <rect
          x="60"
          y="20"
          width="40"
          height="50"
          fill={HOUSE_COLORS.brickMedium}
        />

        {[...Array(5)].map((_, row) => (
          <g key={`chimney-row-${row}`}>
            {row % 2 === 0 ? (
              <>
                <rect
                  x={60}
                  y={20 + row * 10}
                  width={18}
                  height={9}
                  fill={HOUSE_COLORS.brickDark}
                />
                <rect
                  x={80}
                  y={20 + row * 10}
                  width={20}
                  height={9}
                  fill={HOUSE_COLORS.brickLight}
                />
              </>
            ) : (
              <>
                <rect
                  x={60}
                  y={20 + row * 10}
                  width={10}
                  height={9}
                  fill={HOUSE_COLORS.brickLight}
                />
                <rect
                  x={72}
                  y={20 + row * 10}
                  width={18}
                  height={9}
                  fill={HOUSE_COLORS.brickDark}
                />
                <rect
                  x={92}
                  y={20 + row * 10}
                  width={8}
                  height={9}
                  fill={HOUSE_COLORS.brickLight}
                />
              </>
            )}
            <rect
              x={60}
              y={29 + row * 10}
              width={40}
              height={1}
              fill={HOUSE_COLORS.brickMortar}
            />
          </g>
        ))}

        <rect
          x={54}
          y={14}
          width={52}
          height={6}
          fill={HOUSE_COLORS.woodShadow}
        />
        <rect x={56} y={8} width={48} height={6} fill={HOUSE_COLORS.woodDark} />
        <rect
          x={58}
          y={4}
          width={44}
          height={4}
          fill={HOUSE_COLORS.woodAccent}
        />

        <rect
          x={56}
          y={4}
          width={4}
          height={66}
          fill={HOUSE_COLORS.brickMortar}
        />
        <rect
          x={100}
          y={4}
          width={4}
          height={66}
          fill={HOUSE_COLORS.brickMortar}
        />

        <rect
          x={60}
          y={8}
          width={40}
          height={4}
          fill={HOUSE_COLORS.brickDark}
        />
      </g>
    </svg>
  );
}
