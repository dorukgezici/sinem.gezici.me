import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import ExperienceList from "./ExperienceList";
import SocialLinks from "./SocialLinks";

// Unified color palette for the house
const COLORS = {
  // Wood/Brown tones (roof, door frame, avatar frame)
  woodDark: "#5D3A1A",
  woodMedium: "#8B4513",
  woodLight: "#A0522D",
  woodHighlight: "#CD853F",
  woodShadow: "#3D2314",
  woodAccent: "#6B4423",

  // Door colors (warmer, lighter wood)
  doorDark: "#8B4513",
  doorMedium: "#A0522D",
  doorLight: "#C4722B",
  doorHighlight: "#D4943A",
  doorShadow: "#5D3A1A",

  // Chimney (brick red, but harmonized)
  brickDark: "#8B3A3A",
  brickMedium: "#A54A4A",
  brickLight: "#B85C5C",
  brickMortar: "#5D3A3A",
  brickCap: "#5D3A1A",
};

export default function BusinessCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Emit layout update on load and resize
  useEffect(() => {
    const updateLayout = () => {
      if (!cardRef.current) return;

      const cardRect = cardRef.current.getBoundingClientRect();
      const roof = document
        .getElementById("house-roof")
        ?.getBoundingClientRect();
      const windowFrame = document
        .getElementById("house-window")
        ?.getBoundingClientRect();

      if (cardRect && roof && windowFrame) {
        window.dispatchEvent(
          new CustomEvent("house-layout", {
            detail: { card: cardRect, roof: roof, window: windowFrame },
          }),
        );
      }
    };

    window.addEventListener("resize", updateLayout);
    window.addEventListener("request-house-layout", updateLayout);

    const timer = setTimeout(updateLayout, 500); // Wait for fonts and animations

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("request-house-layout", updateLayout);
    };
  }, []);

  const [doorOpen, setDoorOpen] = useState(false);

  return (
    <div
      ref={cardRef}
      className="absolute bottom-[7%] md:bottom-[7%] left-1/2 -translate-x-1/2 w-full max-w-md pt-20 md:pt-30 pointer-events-auto h-fit max-h-[calc(100vh-80px)] md:max-h-[calc(100vh-100px)] flex flex-col"
    >
      {/* Pitched Roof with Pixel-Art Shingles */}
      <div
        id="house-roof"
        className="absolute left-0 right-0 top-0 h-20 md:h-30 z-20 shrink-0"
      >
        <svg
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
          className="w-full h-full drop-shadow-lg"
          style={{ imageRendering: "pixelated" }}
        >
          <defs>
            {/* Clip path for roof shape */}
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
              fill={COLORS.brickMedium}
            />
            <rect
              x="56"
              y="20"
              width="4"
              height="100"
              fill={COLORS.brickDark}
            />
            <rect
              x="100"
              y="20"
              width="4"
              height="50"
              fill={COLORS.brickDark}
            />
          </g>

          {/* Main Roof base */}
          <g clipPath="url(#roofClip)">
            {/* Solid base color */}
            <rect x="0" y="0" width="400" height="120" fill={COLORS.woodDark} />

            {/* Pixel-art shingle rows */}
            {[...Array(10)].map((_, row) => {
              const rowY = row * 12;
              const progress = (row + 1) / 10;
              const rowWidth = 400 * progress;
              const startX = (400 - rowWidth) / 2;
              const offset = row % 2 === 0 ? 0 : 10;

              return (
                <g key={`row-${row}`}>
                  {[...Array(Math.ceil(rowWidth / 20) + 1)].map((_, i) => {
                    const x = startX + i * 20 - offset;
                    const colorIndex = (row + i) % 3;
                    const colors = [
                      COLORS.woodMedium,
                      COLORS.woodLight,
                      COLORS.woodAccent,
                    ];
                    const highlights = [
                      COLORS.woodHighlight,
                      "#D2996C",
                      "#BC7642",
                    ];

                    return (
                      <g key={`tile-${row}-${i}`}>
                        {/* Shingle tile */}
                        <rect
                          x={x}
                          y={rowY}
                          width={19}
                          height={12}
                          fill={colors[colorIndex]}
                        />
                        {/* Top highlight */}
                        <rect
                          x={x}
                          y={rowY}
                          width={19}
                          height={3}
                          fill={highlights[colorIndex]}
                        />
                        {/* Bottom shadow */}
                        <rect
                          x={x}
                          y={rowY + 10}
                          width={19}
                          height={2}
                          fill={COLORS.woodShadow}
                        />
                        {/* Left edge pixel */}
                        <rect
                          x={x}
                          y={rowY + 3}
                          width={2}
                          height={7}
                          fill={COLORS.woodDark}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Roof outline */}
            <path
              d="M0 120 L200 0 L400 120"
              fill="none"
              stroke={COLORS.woodShadow}
              strokeWidth="6"
            />
          </g>

          {/* Chimney top and bricks - rendered on top of roof */}
          <g>
            {/* Visible chimney body above roof line */}
            <rect
              x="60"
              y="20"
              width="40"
              height="50"
              fill={COLORS.brickMedium}
            />

            {/* Pixel brick pattern on chimney */}
            {[...Array(5)].map((_, row) => (
              <g key={`chimney-row-${row}`}>
                {row % 2 === 0 ? (
                  <>
                    <rect
                      x={60}
                      y={20 + row * 10}
                      width={18}
                      height={9}
                      fill={COLORS.brickDark}
                    />
                    <rect
                      x={80}
                      y={20 + row * 10}
                      width={20}
                      height={9}
                      fill={COLORS.brickLight}
                    />
                  </>
                ) : (
                  <>
                    <rect
                      x={60}
                      y={20 + row * 10}
                      width={10}
                      height={9}
                      fill={COLORS.brickLight}
                    />
                    <rect
                      x={72}
                      y={20 + row * 10}
                      width={18}
                      height={9}
                      fill={COLORS.brickDark}
                    />
                    <rect
                      x={92}
                      y={20 + row * 10}
                      width={8}
                      height={9}
                      fill={COLORS.brickLight}
                    />
                  </>
                )}
                {/* Mortar line */}
                <rect
                  x={60}
                  y={29 + row * 10}
                  width={40}
                  height={1}
                  fill={COLORS.brickMortar}
                />
              </g>
            ))}

            {/* Chimney cap - using wood tones to match roof */}
            <rect
              x={54}
              y={14}
              width={52}
              height={6}
              fill={COLORS.woodShadow}
            />
            <rect x={56} y={8} width={48} height={6} fill={COLORS.woodDark} />
            <rect x={58} y={4} width={44} height={4} fill={COLORS.woodAccent} />

            {/* Chimney side outlines */}
            <rect
              x={56}
              y={4}
              width={4}
              height={66}
              fill={COLORS.brickMortar}
            />
            <rect
              x={100}
              y={4}
              width={4}
              height={66}
              fill={COLORS.brickMortar}
            />

            {/* Chimney top inner shadow */}
            <rect x={60} y={8} width={40} height={4} fill={COLORS.brickDark} />
          </g>
        </svg>
      </div>

      {/* Main House Body (Card) */}
      <div
        id="house-body"
        className={cn(
          "relative z-10 bg-warm-cream border-x-4 border-b-4 border-charcoal rounded-b-[40px] p-4 md:p-6 pb-24 md:pb-36 shadow-2xl flex flex-col items-center text-center space-y-3 pt-6 md:pt-8 flex-1 min-h-0 overflow-hidden",
          "before:absolute before:inset-0 before:bg-amber-50/40 before:rounded-b-[36px] before:pointer-events-none",
        )}
      >
        {/* Window (Avatar) */}
        <div id="house-window" className="relative mb-1 shrink-0">
          {/* Pixel-art circular window frame */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 group transition-transform hover:scale-105">
            {/* Outer frame - using wood dark */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: COLORS.woodShadow }}
            />
            {/* Inner frame - using wood medium */}
            <div
              className="absolute inset-1 rounded-full"
              style={{ backgroundColor: COLORS.woodMedium }}
            />
            {/* Window opening */}
            <div className="absolute inset-2.5 bg-amber-50 rounded-full overflow-hidden">
              {/* Avatar Image */}
              <img
                src="/avatar.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1 mt-1 md:mt-2 shrink-0">
          <h1 className="text-[11px] md:text-sm leading-tight tracking-tight text-charcoal">
            Sinem Demiröz Gezici
          </h1>
          <a
            href="mailto:sinem@gezici.me"
            className="text-[9px] md:text-[10px] text-muted hover:text-coral transition-colors block"
          >
            sinem@gezici.me
          </a>
        </div>

        <div className="shrink-0">
          <SocialLinks />
        </div>

        <div className="w-full h-px bg-charcoal/10 shrink-0 my-1 md:my-0" />

        <div className="w-full text-left space-y-1 md:space-y-2 flex-1 min-h-0 flex flex-col overflow-hidden">
          <h2 className="text-[7px] md:text-[8px] uppercase tracking-[0.15em] text-muted shrink-0">
            Experience
          </h2>
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 md:pr-2 mb-4 md:mb-6 scrollbar-thin">
            <ExperienceList />
          </div>
        </div>
      </div>

      {/* Pixel-Art Door - Interactive Footer */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer group scale-75 md:scale-100"
        onMouseEnter={() => setDoorOpen(true)}
        onMouseLeave={() => setDoorOpen(false)}
      >
        {/* Door container with perspective */}
        <div className="relative" style={{ perspective: "400px" }}>
          {/* Door frame (static) */}
          <svg
            width="112"
            height="144"
            viewBox="0 0 28 36"
            className="drop-shadow-lg block"
            style={{ imageRendering: "pixelated" }}
          >
            {/* Door frame outer */}
            <rect x="0" y="0" width="28" height="36" fill={COLORS.woodShadow} />
            {/* Door frame inner */}
            <rect x="2" y="2" width="24" height="34" fill={COLORS.woodDark} />
            {/* Interior darkness (visible when door opens) */}
            <rect x="3" y="3" width="22" height="33" fill="#1a1a1a" />
            {/* Door threshold */}
            <rect x="0" y="34" width="28" height="2" fill={COLORS.woodShadow} />
          </svg>

          {/* Footer content inside the door (visible when open) */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
              doorOpen ? "opacity-100" : "opacity-0",
            )}
            style={{
              top: "12px",
              left: "12px",
              right: "12px",
              bottom: "16px",
            }}
          >
            <div
              className="text-center"
              style={{
                fontFamily: "'Press Start 2P', monospace, system-ui",
                fontSize: "6px",
                lineHeight: "1.4",
                color: "#E8B94A",
                textShadow: "1px 1px 0 #5D3A1A",
                imageRendering: "pixelated",
              }}
            >
              <svg
                width="12"
                height="10"
                viewBox="0 0 12 10"
                className="inline-block align-middle mr-1"
                style={{ imageRendering: "pixelated" }}
              >
                {/* Pixel art heart */}
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
              <span style={{ color: "#D4A03A" }}> by </span>
              <a
                href="https://doruk.gezici.me"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                style={{
                  color: "#E8B94A",
                  textDecoration: "none",
                }}
              >
                @dorukgezici
              </a>
            </div>
          </div>

          {/* Animated door (swings open) */}
          <svg
            width="112"
            height="144"
            viewBox="0 0 28 36"
            className={cn(
              "absolute top-0 left-0 drop-shadow-lg block transition-transform duration-500 ease-out",
              doorOpen ? "door-open" : "",
            )}
            style={{
              imageRendering: "pixelated",
              transformOrigin: "left center",
              transform: doorOpen ? "rotateY(-85deg)" : "rotateY(0deg)",
            }}
          >
            {/* Main door wood */}
            <rect x="3" y="3" width="22" height="33" fill={COLORS.doorMedium} />
            {/* Door panels - top left */}
            <rect x="5" y="5" width="8" height="10" fill={COLORS.doorDark} />
            <rect x="6" y="6" width="6" height="8" fill={COLORS.doorLight} />
            {/* Door panels - top right */}
            <rect x="15" y="5" width="8" height="10" fill={COLORS.doorDark} />
            <rect x="16" y="6" width="6" height="8" fill={COLORS.doorLight} />
            {/* Door panels - bottom left */}
            <rect x="5" y="17" width="8" height="14" fill={COLORS.doorDark} />
            <rect x="6" y="18" width="6" height="12" fill={COLORS.doorLight} />
            {/* Door panels - bottom right */}
            <rect x="15" y="17" width="8" height="14" fill={COLORS.doorDark} />
            <rect x="16" y="18" width="6" height="12" fill={COLORS.doorLight} />
            {/* Center vertical strip */}
            <rect x="13" y="3" width="2" height="33" fill={COLORS.doorShadow} />
            {/* Horizontal strip */}
            <rect x="3" y="15" width="22" height="2" fill={COLORS.doorShadow} />
            {/* Door knob plate */}
            <rect x="19" y="19" width="4" height="6" fill={COLORS.woodShadow} />
            {/* Door knob - metallic gold/brass to complement wood */}
            <rect x="20" y="21" width="2" height="2" fill="#D4A03A" />
            <rect x="20" y="20" width="2" height="1" fill="#E8B94A" />
            <rect x="20" y="23" width="2" height="1" fill="#B8862A" />
            {/* Highlight on door */}
            <rect
              x="4"
              y="4"
              width="1"
              height="31"
              fill={COLORS.doorHighlight}
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Pixel-art steps - using stone colors that complement wood */}
        <div
          className="-mt-1"
          style={{
            width: "120px",
            height: "8px",
            backgroundColor: "#9A8B7A",
            borderLeft: "2px solid #7A6B5A",
            borderRight: "2px solid #7A6B5A",
            borderTop: "2px solid #7A6B5A",
            imageRendering: "pixelated",
          }}
        />
        <div
          style={{
            width: "136px",
            height: "8px",
            backgroundColor: "#8A7B6A",
            borderLeft: "2px solid #6A5B4A",
            borderRight: "2px solid #6A5B4A",
            imageRendering: "pixelated",
          }}
        />
      </div>

      {/* House Base Shadow on Road */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-charcoal/5 blur-md rounded-full -z-10" />
    </div>
  );
}
