import { useEffect, useRef, useState, useMemo } from "react";
import { cn } from "../lib/utils";
import ExperienceList from "./ExperienceList";
import SocialLinks from "./SocialLinks";
import DoorFrame from "./house/DoorFrame";
import HouseDoor from "./house/HouseDoor";
import HouseRoof from "./house/HouseRoof";
import PixelHeart from "./house/PixelHeart";
import PixelSmokePuff from "./house/PixelSmokePuff";
import { HOUSE_COLORS } from "./house/houseColors";

// Unified color palette for the house
const COLORS = HOUSE_COLORS;

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

  // Generate stable smoke puff keys to avoid hydration issues
  const smokePuffs = useMemo(
    () =>
      [...Array(12)].map((_, i) => ({
        id: i,
        delay: i * 0.4,
        offsetX: ((i % 3) - 1) * 8,
        size: 40 + (i % 3) * 12,
      })),
    [],
  );

  return (
    <div
      ref={cardRef}
      className="absolute bottom-[5%] sm:bottom-[7%] left-1/2 -translate-x-1/2 w-[calc(100%-24px)] sm:w-[calc(100%-32px)] md:w-full max-w-md pt-30 pointer-events-auto h-fit max-h-[calc(100vh-70px)] sm:max-h-[calc(100vh-100px)] flex flex-col"
    >
      {/* Smoke Animation - positioned above chimney */}
      <div
        className="absolute z-30 pointer-events-none overflow-visible"
        style={{
          left: "20%",
          top: "-105px",
          width: "60px",
          height: "150px",
          transform: "translateX(-50%)",
        }}
      >
        {smokePuffs.map((puff) => (
          <div
            key={`smoke-${puff.id}`}
            className="smoke-puff absolute"
            style={{
              bottom: "0",
              left: "50%",
              animation: `smokeRise 5s ease-out infinite`,
              animationDelay: `${puff.delay}s`,
              width: `${puff.size}px`,
              height: `${puff.size}px`,
              marginLeft: `${puff.offsetX}px`,
              opacity: 0,
            }}
          >
            <PixelSmokePuff className="w-full h-full" />
          </div>
        ))}
        <style>
          {`
            @keyframes smokeRise {
              0% {
                transform: translateX(-50%) translateY(0) scale(0.3);
                opacity: 0;
              }
              5% {
                opacity: 0.6;
              }
              25% {
                transform: translateX(-50%) translateY(-35px) scale(0.6);
                opacity: 0.5;
              }
              50% {
                transform: translateX(-40%) translateY(-70px) scale(0.85);
                opacity: 0.35;
              }
              75% {
                transform: translateX(-25%) translateY(-100px) scale(1.1);
                opacity: 0.2;
              }
              100% {
                transform: translateX(-10%) translateY(-130px) scale(1.3);
                opacity: 0;
              }
            }
          `}
        </style>
      </div>

      {/* Pitched Roof with Pixel-Art Shingles */}
      <div
        id="house-roof"
        className="absolute left-0 right-0 top-0 h-30 z-20 shrink-0"
      >
        <HouseRoof className="w-full h-full drop-shadow-lg" />
      </div>

      {/* Main House Body (Card) */}
      <div
        id="house-body"
        className={cn(
          "relative z-10 bg-warm-cream border-x-4 border-b-4 border-charcoal rounded-b-[40px] p-6 pb-28 sm:pb-36 shadow-2xl flex flex-col items-center text-center space-y-3 pt-8 flex-1 min-h-0 overflow-hidden",
          "before:absolute before:inset-0 before:bg-amber-50/40 before:rounded-b-[36px] before:pointer-events-none",
        )}
      >
        {/* Window (Avatar) - Click to trigger UFO abduction! */}
        <div id="house-window" className="relative mb-1 shrink-0">
          {/* Pixel-art circular window frame */}
          <div
            className="relative w-24 h-24 group transition-all duration-300 hover:scale-110 cursor-pointer"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("avatar-clicked"));
            }}
            title="Click me! 👽"
          >
            {/* Hover glow effect - alien green/blue */}
            <div
              className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
              style={{
                background:
                  "radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, rgba(74, 222, 128, 0.2) 50%, transparent 70%)",
              }}
            />
            {/* Outer frame - using wood dark */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]"
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
                className="w-full h-full object-cover pointer-events-none transition-all duration-300 group-hover:brightness-110"
              />
            </div>
            {/* Sparkle hints on hover */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping animation-delay-200" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1 mt-2 shrink-0">
          <h1 className="text-sm leading-tight tracking-tight text-charcoal">
            Sinem Demiröz Gezici
          </h1>
          <a
            href="mailto:sinem@gezici.me"
            className="text-[10px] text-muted hover:text-coral transition-colors block"
          >
            sinem@gezici.me
          </a>
        </div>

        <div className="shrink-0">
          <SocialLinks />
        </div>

        <div className="w-full h-px bg-charcoal/10 shrink-0" />

        <div className="w-full text-left space-y-2 flex-1 min-h-0 flex flex-col overflow-hidden">
          <h2 className="text-[8px] uppercase tracking-[0.15em] text-muted shrink-0">
            Experience
          </h2>
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 mb-6 scrollbar-thin">
            <ExperienceList />
          </div>
        </div>
      </div>

      {/* Pixel-Art Door - Interactive Footer */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer group"
        onMouseEnter={() => setDoorOpen(true)}
        onMouseLeave={() => setDoorOpen(false)}
      >
        {/* Door container with perspective */}
        <div className="relative" style={{ perspective: "400px" }}>
          {/* Door frame (static) */}
          <DoorFrame className="drop-shadow-lg block" />

          {/* Footer content inside the door (visible when open) */}
          <a
            href="https://doruk.gezici.me"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-300 hover:text-white",
              doorOpen ? "opacity-100" : "opacity-0",
            )}
            style={{
              top: "12px",
              left: "12px",
              right: "12px",
              bottom: "16px",
              textDecoration: "none",
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
              <PixelHeart className="inline-block align-middle mr-1" />
              <span style={{ color: "#D4A03A" }}> by </span>
              <span>@dorukgezici</span>
            </div>
          </a>

          {/* Animated door (swings open) */}
          <HouseDoor
            className={cn(
              "absolute top-0 left-0 drop-shadow-lg block transition-transform duration-500 ease-out",
              doorOpen ? "door-open" : "",
            )}
            isOpen={doorOpen}
          />
        </div>

        {/* Pixel-art steps - using stone colors that complement wood */}
        <div
          className="-mt-1 w-21.5 h-1.5 sm:w-30 sm:h-2"
          style={{
            backgroundColor: "#9A8B7A",
            borderLeft: "2px solid #7A6B5A",
            borderRight: "2px solid #7A6B5A",
            borderTop: "2px solid #7A6B5A",
            imageRendering: "pixelated",
          }}
        />
        <div
          className="w-24.5 h-1.5 sm:w-34 sm:h-2"
          style={{
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
