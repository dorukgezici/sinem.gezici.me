/**
 * The site companion: a pixel cat that wanders along the bottom edge.
 * Petting it (click) makes it hop and throw hearts; clicking the hero
 * portrait summons a UFO that abducts it — it always comes back.
 *
 * Hand-rolled on a single canvas so the whole easter egg costs a few KB.
 */

const P = 3; // pixel size

type CatState = "walk" | "pause" | "hop" | "abducted" | "gone" | "respawn";
type UfoState = "hidden" | "approach" | "beam" | "depart";

interface Heart {
  x: number;
  y: number;
  vy: number;
  life: number;
}

export function initCompanion() {
  const canvas = document.getElementById("companion") as HTMLCanvasElement | null;
  const hit = document.getElementById("companion-hit");
  const portrait = document.getElementById("portrait");
  if (!canvas || !hit) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // --- palette, kept in sync with the CSS custom properties -----------------
  let colors = { fur: "#888", furDark: "#666", eye: "#222", accent: "#e2604c" };
  const readPalette = () => {
    const css = getComputedStyle(document.documentElement);
    colors = {
      fur: css.getPropertyValue("--ink-soft").trim() || colors.fur,
      furDark: css.getPropertyValue("--ink").trim() || colors.furDark,
      eye: css.getPropertyValue("--ink").trim() || colors.eye,
      accent: css.getPropertyValue("--accent").trim() || colors.accent,
    };
  };
  readPalette();
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", readPalette);

  // --- canvas sizing ---------------------------------------------------------
  let width = 0;
  let height = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = 160;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const groundY = () => height - 20;

  // --- cat state --------------------------------------------------------------
  const cat = {
    x: Math.min(200, window.innerWidth / 3),
    y: 0,
    dir: 1,
    speed: 28,
    state: "walk" as CatState,
    stateUntil: 0,
    walkPhase: 0,
    hopV: 0,
    blinkUntil: 0,
    nextBlink: 2000,
    rotation: 0,
    scale: 1,
    alpha: 1,
  };
  cat.y = groundY();

  const ufo = {
    x: -80,
    y: -80,
    state: "hidden" as UfoState,
    t: 0,
    beamLen: 0,
    lightPhase: 0,
  };

  let hearts: Heart[] = [];

  // --- interactions -----------------------------------------------------------
  hit.addEventListener("click", () => {
    if (cat.state !== "walk" && cat.state !== "pause") return;
    cat.state = "hop";
    cat.hopV = -160;
    for (let i = 0; i < 3; i++) {
      hearts.push({
        x: cat.x + (i - 1) * 12,
        y: cat.y - 40 - Math.random() * 10,
        vy: -22 - Math.random() * 14,
        life: 1,
      });
    }
  });

  portrait?.addEventListener("click", () => {
    if (ufo.state !== "hidden" || cat.state === "gone") return;
    ufo.state = "approach";
    ufo.t = 0;
    ufo.x = -80;
    ufo.y = -80;
  });

  // --- drawing helpers ---------------------------------------------------------
  const px = (x: number, y: number, w: number, h: number) =>
    ctx.fillRect(Math.round(x), Math.round(y), w * P, h * P);

  function drawCat(now: number) {
    if (cat.state === "gone") return;

    ctx.save();
    ctx.translate(cat.x, cat.y);
    ctx.rotate(cat.rotation);
    ctx.scale(cat.dir * cat.scale, cat.scale);
    ctx.globalAlpha = cat.alpha;

    const walking = cat.state === "walk";
    const bob = walking ? Math.sin(cat.walkPhase * 2) * 1.5 : 0;
    const breathe = walking ? 0 : Math.sin(now * 0.002) * 0.8;

    // tail — a little sine wave of pixels
    ctx.fillStyle = colors.furDark;
    for (let i = 0; i < 7; i++) {
      const tx = -14 - i * P;
      const ty = -10 - i * 1.2 + Math.sin(now * 0.004 + i * 0.5) * 3;
      ctx.fillRect(Math.round(tx), Math.round(ty + bob), P, P);
    }

    // legs
    for (let i = 0; i < 4; i++) {
      const side = i < 2 ? -7 : 5;
      const phase = i % 2 === 0 ? 0 : Math.PI;
      const lift = walking ? Math.max(0, Math.sin(cat.walkPhase + phase)) * 3 : 0;
      px(side + (i % 2) * 3, -6 - lift, 1.5, 2);
    }

    // body
    ctx.fillStyle = colors.fur;
    px(-12, -14 + bob + breathe, 8, 4);

    // head
    px(0, -22 + bob, 5, 5);

    // ears
    ctx.fillStyle = colors.furDark;
    px(0, -25 + bob, 1.5, 1.5);
    px(10 - 1.5 * P, -25 + bob, 1.5, 1.5);

    // eye (blinks)
    if (now > cat.blinkUntil) {
      ctx.fillStyle = colors.eye;
      px(9, -19 + bob, 1, 1);
    }

    ctx.restore();
    ctx.globalAlpha = 1;

    // shadow
    ctx.fillStyle = colors.furDark;
    ctx.globalAlpha = 0.12 * cat.alpha;
    const h = Math.max(0, groundY() - cat.y);
    const sw = Math.max(10, 26 - h * 0.15);
    ctx.beginPath();
    ctx.ellipse(cat.x, groundY() + 4, sw, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawUfo(now: number) {
    if (ufo.state === "hidden") return;

    ctx.save();
    ctx.translate(ufo.x, ufo.y + Math.sin(now * 0.004) * 2);

    // beam
    if (ufo.beamLen > 0) {
      const grad = ctx.createLinearGradient(0, 8, 0, 8 + ufo.beamLen);
      grad.addColorStop(0, colors.accent + "");
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-8, 8);
      ctx.lineTo(8, 8);
      ctx.lineTo(26, 8 + ufo.beamLen);
      ctx.lineTo(-26, 8 + ufo.beamLen);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.35;
      for (let i = 0; i < 8; i++) {
        const py = ((now * 0.06 + i * 40) % ufo.beamLen);
        const spread = 6 + (py / ufo.beamLen) * 16;
        ctx.fillStyle = colors.accent;
        ctx.fillRect(Math.sin(i * 2.4) * spread, 8 + ufo.beamLen - py, 2, 2);
      }
      ctx.globalAlpha = 1;
    }

    // saucer
    ctx.fillStyle = colors.furDark;
    px(-9 * P, 0, 18, 2);
    ctx.fillStyle = colors.fur;
    px(-6 * P, -2 * P, 12, 2);
    // dome
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = colors.accent;
    px(-3 * P, -5 * P, 6, 3);
    px(-2 * P, -6 * P, 4, 1);
    ctx.globalAlpha = 1;
    // rim lights
    for (let i = 0; i < 5; i++) {
      const on = Math.sin(now * 0.01 + i * 1.3) > 0;
      ctx.fillStyle = on ? colors.accent : colors.furDark;
      px(-8 * P + i * 4 * P, 0.5 * P, 1.5, 1);
    }

    ctx.restore();
  }

  function drawHearts() {
    for (const heart of hearts) {
      ctx.save();
      ctx.translate(heart.x, heart.y);
      ctx.globalAlpha = Math.max(0, heart.life);
      ctx.fillStyle = colors.accent;
      const s = 2;
      ctx.fillRect(-s * 2, -s, s * 2, s);
      ctx.fillRect(s * 0, -s, s * 2, s);
      ctx.fillRect(-s * 3, 0, s * 6, s);
      ctx.fillRect(-s * 2, s, s * 4, s);
      ctx.fillRect(-s, s * 2, s * 2, s);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // --- behavior ----------------------------------------------------------------
  function updateCat(now: number, dt: number) {
    if (now > cat.nextBlink) {
      cat.blinkUntil = now + 120;
      cat.nextBlink = now + 1800 + Math.random() * 3200;
    }

    switch (cat.state) {
      case "walk": {
        cat.walkPhase += dt * 0.011;
        cat.x += cat.dir * cat.speed * (dt / 1000);
        const margin = 40;
        if (cat.x < margin) cat.dir = 1;
        if (cat.x > width - margin) cat.dir = -1;
        if (now > cat.stateUntil) {
          if (Math.random() < 0.35) {
            cat.state = "pause";
            cat.stateUntil = now + 1200 + Math.random() * 2400;
          } else {
            if (Math.random() < 0.4) cat.dir *= -1;
            cat.speed = 22 + Math.random() * 22;
            cat.stateUntil = now + 2500 + Math.random() * 4000;
          }
        }
        break;
      }
      case "pause":
        if (now > cat.stateUntil) {
          cat.state = "walk";
          cat.stateUntil = now + 2500 + Math.random() * 4000;
        }
        break;
      case "hop":
        cat.hopV += 620 * (dt / 1000);
        cat.y += cat.hopV * (dt / 1000);
        if (cat.y >= groundY()) {
          cat.y = groundY();
          cat.state = "walk";
          cat.stateUntil = now + 1500;
        }
        break;
      case "abducted": {
        const targetY = ufo.y + 14;
        cat.y += (targetY - cat.y) * Math.min(1, dt / 600);
        cat.rotation += dt * 0.004;
        if (cat.y - targetY < 30) {
          cat.scale = Math.max(0.1, cat.scale - dt / 500);
          cat.alpha = Math.max(0, cat.alpha - dt / 400);
        }
        if (cat.alpha <= 0) {
          cat.state = "gone";
          ufo.state = "depart";
          ufo.t = 0;
          ufo.beamLen = 0;
        }
        break;
      }
      case "respawn":
        cat.hopV += 620 * (dt / 1000);
        cat.y += cat.hopV * (dt / 1000);
        cat.alpha = Math.min(1, cat.alpha + dt / 300);
        cat.scale = Math.min(1, cat.scale + dt / 300);
        if (cat.y >= groundY()) {
          cat.y = groundY();
          cat.state = "walk";
          cat.stateUntil = now + 2000;
        }
        break;
      case "gone":
        break;
    }
  }

  function updateUfo(now: number, dt: number) {
    switch (ufo.state) {
      case "approach": {
        ufo.t += dt;
        const k = Math.min(1, ufo.t / 1600);
        const e = 1 - Math.pow(1 - k, 3); // ease-out cubic
        ufo.x = -80 + (cat.x + 80) * e + Math.sin(now * 0.008) * (1 - e) * 24;
        ufo.y = -80 + (groundY() - 110 + 80) * e;
        if (k >= 1) {
          ufo.state = "beam";
          ufo.t = 0;
          cat.state = "abducted";
        }
        break;
      }
      case "beam":
        ufo.beamLen = Math.min(groundY() - ufo.y + 6, ufo.beamLen + dt * 0.4);
        break;
      case "depart": {
        ufo.t += dt;
        ufo.x += dt * 0.55;
        ufo.y -= dt * 0.35;
        if (ufo.t > 1400) {
          ufo.state = "hidden";
          // the cat parachutes back in after a breather
          setTimeout(() => {
            cat.x = Math.random() * (width - 160) + 80;
            cat.y = -30;
            cat.rotation = 0;
            cat.alpha = 0;
            cat.scale = 0.4;
            cat.hopV = 40;
            cat.state = "respawn";
          }, 1800);
        }
        break;
      }
      case "hidden":
        break;
    }
  }

  // --- main loop -----------------------------------------------------------------
  let last = performance.now();
  function frame(now: number) {
    const dt = Math.min(50, now - last);
    last = now;

    updateCat(now, dt);
    updateUfo(now, dt);

    hearts = hearts.filter((h) => h.life > 0);
    for (const h of hearts) {
      h.y += h.vy * (dt / 1000);
      h.life -= dt / 1400;
    }

    ctx.clearRect(0, 0, width, height);
    ufo.lightPhase = now;
    drawUfo(now);
    drawCat(now);
    drawHearts();

    // keep the DOM hit target glued to the cat
    if (hit) {
      const interactive = cat.state === "walk" || cat.state === "pause";
      hit.style.display = interactive ? "block" : "none";
      const rect = canvas.getBoundingClientRect();
      hit.style.transform = `translate(${cat.x - 28}px, ${rect.top + cat.y - 40}px)`;
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
