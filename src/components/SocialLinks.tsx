import { LinkedinLogo, MediumLogo } from "@phosphor-icons/react";

// Using the same wood tones as the house
const COLORS = {
  woodMedium: "#8B4513",
  woodLight: "#A0522D",
  woodHighlight: "#CD853F",
};

export default function SocialLinks() {
  return (
    <div className="flex gap-3 pointer-events-auto">
      <a
        href="https://www.linkedin.com/in/sinemdemiroz"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 transition-all hover:scale-110 rounded-lg shadow-sm hover:shadow-md"
        style={{
          backgroundColor: COLORS.woodLight,
          border: `2px solid ${COLORS.woodMedium}`,
          color: "#FEF3E2",
        }}
        aria-label="LinkedIn"
      >
        <LinkedinLogo size={24} weight="bold" />
      </a>
      <a
        href="https://medium.com/@sinemdemiroz"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 transition-all hover:scale-110 rounded-lg shadow-sm hover:shadow-md"
        style={{
          backgroundColor: COLORS.woodLight,
          border: `2px solid ${COLORS.woodMedium}`,
          color: "#FEF3E2",
        }}
        aria-label="Medium"
      >
        <MediumLogo size={24} weight="bold" />
      </a>
    </div>
  );
}
