import { useEffect, useRef, useState } from "react";

export default function PhaserScene() {
  const gameRef = useRef<any>(null);
  const catHitAreaRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (gameRef.current) return;

    // Dynamically import Phaser and MainScene to avoid SSR issues
    const initPhaser = async () => {
      const Phaser = (await import("phaser")).default;
      const { MainScene } = await import("../game/MainScene");

      if (gameRef.current) return; // Double-check after async import

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: "phaser-container",
        transparent: true,
        input: {
          activePointers: 1,
        },
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 300, x: 0 },
            debug: false,
          },
        },
        scene: [MainScene],
      };

      gameRef.current = new Phaser.Game(config);

      // Create a DOM hit area for the cat that follows its position
      const hitArea = document.createElement("div");
      hitArea.id = "cat-hit-area";
      hitArea.style.position = "absolute";
      hitArea.style.width = "60px";
      hitArea.style.height = "50px";
      hitArea.style.cursor = "pointer";
      hitArea.style.pointerEvents = "auto";
      hitArea.style.display = "none";
      hitArea.style.zIndex = "51";
      document.getElementById("phaser-container")?.appendChild(hitArea);
      catHitAreaRef.current = hitArea;

      // Listen for cat position updates from the game
      const handleCatPosition = (e: CustomEvent) => {
        if (catHitAreaRef.current) {
          const { x, y, visible } = e.detail;
          if (visible) {
            catHitAreaRef.current.style.display = "block";
            catHitAreaRef.current.style.left = `${x - 30}px`;
            catHitAreaRef.current.style.top = `${y - 25}px`;
          } else {
            catHitAreaRef.current.style.display = "none";
          }
        }
      };

      window.addEventListener(
        "cat-position-update" as any,
        handleCatPosition as EventListener,
      );

      // Forward clicks on the hit area to the game
      hitArea.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("cat-clicked"));
      });

      const handleResize = () => {
        gameRef.current?.scale.resize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleResize);

      // Store cleanup functions
      (gameRef.current as any).__cleanup = () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener(
          "cat-position-update" as any,
          handleCatPosition as EventListener,
        );
        catHitAreaRef.current?.remove();
      };
    };

    initPhaser();

    return () => {
      if (gameRef.current) {
        (gameRef.current as any).__cleanup?.();
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [isClient]);

  return (
    <div
      id="phaser-container"
      className="absolute inset-0 z-50 pointer-events-none"
    />
  );
}
