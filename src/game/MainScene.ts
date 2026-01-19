import Phaser from "phaser";

class HeartBalloon extends Phaser.GameObjects.Container {
  private balloon: Phaser.GameObjects.Graphics;
  private heart: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const p = 4; // pixel size

    // Balloon background
    this.balloon = scene.add.graphics();
    this.balloon.fillStyle(0xffffff, 1);
    // Rounded balloon shape (pixel art style)
    this.balloon.fillRect(-4 * p, -8 * p, 8 * p, 7 * p);
    this.balloon.fillRect(-3 * p, -9 * p, 6 * p, 1 * p);
    this.balloon.fillRect(-3 * p, -1 * p, 6 * p, 1 * p);
    // Balloon tail/pointer
    this.balloon.fillRect(-1 * p, 0, 2 * p, 2 * p);
    this.balloon.fillRect(0, 2 * p, 1 * p, 1 * p);

    // Pixel art heart - proper heart shape
    this.heart = scene.add.graphics();
    this.heart.fillStyle(0xef4444, 1);
    // Top row - two bumps with gap
    this.heart.fillRect(-3 * p, -7 * p, 2 * p, 1 * p);
    this.heart.fillRect(1 * p, -7 * p, 2 * p, 1 * p);
    // Second row - wider bumps
    this.heart.fillRect(-4 * p, -6 * p, 3 * p, 1 * p);
    this.heart.fillRect(1 * p, -6 * p, 3 * p, 1 * p);
    // Third row - connect the bumps
    this.heart.fillRect(-4 * p, -5 * p, 8 * p, 1 * p);
    // Fourth row - full width
    this.heart.fillRect(-3 * p, -4 * p, 6 * p, 1 * p);
    // Taper down
    this.heart.fillRect(-2 * p, -3 * p, 4 * p, 1 * p);
    this.heart.fillRect(-1 * p, -2 * p, 2 * p, 1 * p);

    this.add([this.balloon, this.heart]);
    scene.add.existing(this);

    // Start invisible
    this.setAlpha(0);
    this.setScale(0.5);
  }

  show() {
    // Animate in
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      scale: 1,
      y: this.y - 20,
      duration: 300,
      ease: "Back.easeOut",
      onComplete: () => {
        // Hold for a moment then fade out
        this.scene.time.delayedCall(800, () => {
          this.scene.tweens.add({
            targets: this,
            alpha: 0,
            y: this.y - 30,
            scale: 0.8,
            duration: 400,
            ease: "Quad.easeIn",
            onComplete: () => {
              this.destroy();
            },
          });
        });
      },
    });
  }
}

class ProceduralUFO extends Phaser.GameObjects.Container {
  private glow: Phaser.GameObjects.Graphics;
  private saucer: Phaser.GameObjects.Graphics;
  private dome: Phaser.GameObjects.Graphics;
  private lights: Phaser.GameObjects.Graphics;
  private thrusters: Phaser.GameObjects.Graphics;
  private beamGraphics: Phaser.GameObjects.Graphics;
  private lightPhase: number = 0;
  private isBeamActive: boolean = false;
  private beamParticles: {
    x: number;
    y: number;
    speed: number;
    size: number;
    alpha: number;
  }[] = [];
  private thrusterParticles: {
    x: number;
    y: number;
    life: number;
    maxLife: number;
  }[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const p = 4; // pixel size

    // Create graphics objects (order matters for layering)
    this.glow = scene.add.graphics();
    this.beamGraphics = scene.add.graphics();
    this.thrusters = scene.add.graphics();
    this.saucer = scene.add.graphics();
    this.dome = scene.add.graphics();
    this.lights = scene.add.graphics();

    this.drawUFO(p);

    this.add([
      this.glow,
      this.beamGraphics,
      this.thrusters,
      this.saucer,
      this.dome,
      this.lights,
    ]);
    scene.add.existing(this);

    // Start invisible and small (coming from far away)
    this.setAlpha(0);
    this.setScale(0.1);
    this.setDepth(999);
  }

  private drawUFO(p: number) {
    // UFO Colors - more vibrant sci-fi palette
    const bodyDark = 0x374151;
    const bodyMedium = 0x6b7280;
    const bodyLight = 0x9ca3af;
    const bodyHighlight = 0xd1d5db;
    const bodyShine = 0xf3f4f6;
    const domeTint = 0x38bdf8;
    const domeHighlight = 0x7dd3fc;
    const domeShine = 0xbae6fd;
    const metalAccent = 0x60a5fa;

    // Main saucer body - pixel-perfect flying saucer shape
    this.saucer.clear();

    // Outer glow ring (subtle)
    this.saucer.fillStyle(metalAccent, 0.15);
    this.saucer.fillRect(-12 * p, 0, 24 * p, 1 * p);

    // Bottom underside (darkest)
    this.saucer.fillStyle(bodyDark, 1);
    this.saucer.fillRect(-7 * p, 3 * p, 14 * p, 2 * p);
    this.saucer.fillRect(-5 * p, 5 * p, 10 * p, 1 * p);

    // Main saucer rim - widest part
    this.saucer.fillStyle(bodyMedium, 1);
    this.saucer.fillRect(-11 * p, 1 * p, 22 * p, 2 * p);

    // Saucer body - middle section
    this.saucer.fillStyle(bodyLight, 1);
    this.saucer.fillRect(-9 * p, -1 * p, 18 * p, 2 * p);

    // Upper hull
    this.saucer.fillStyle(bodyHighlight, 1);
    this.saucer.fillRect(-7 * p, -2 * p, 14 * p, 1 * p);
    this.saucer.fillRect(-6 * p, -3 * p, 12 * p, 1 * p);

    // Top highlight strip
    this.saucer.fillStyle(bodyShine, 1);
    this.saucer.fillRect(-5 * p, -4 * p, 10 * p, 1 * p);

    // Metallic trim ring
    this.saucer.fillStyle(metalAccent, 0.6);
    this.saucer.fillRect(-10 * p, 0, 20 * p, 1 * p);

    // Panel lines for detail
    this.saucer.fillStyle(bodyDark, 0.3);
    this.saucer.fillRect(-8 * p, -1 * p, 1 * p, 2 * p);
    this.saucer.fillRect(-4 * p, -1 * p, 1 * p, 2 * p);
    this.saucer.fillRect(3 * p, -1 * p, 1 * p, 2 * p);
    this.saucer.fillRect(7 * p, -1 * p, 1 * p, 2 * p);

    // Dome - glass cockpit bubble
    this.dome.clear();

    // Dome shadow/base
    this.dome.fillStyle(0x1e3a5f, 0.5);
    this.dome.fillRect(-5 * p, -5 * p, 10 * p, 1 * p);

    // Main dome body
    this.dome.fillStyle(domeTint, 0.85);
    this.dome.fillRect(-4 * p, -6 * p, 8 * p, 2 * p);
    this.dome.fillRect(-3 * p, -8 * p, 6 * p, 2 * p);
    this.dome.fillRect(-2 * p, -9 * p, 4 * p, 1 * p);
    this.dome.fillRect(-1 * p, -10 * p, 2 * p, 1 * p);

    // Dome highlight - left side reflection
    this.dome.fillStyle(domeHighlight, 0.7);
    this.dome.fillRect(-3 * p, -8 * p, 2 * p, 2 * p);
    this.dome.fillRect(-2 * p, -9 * p, 1 * p, 1 * p);

    // Dome shine spot - bright reflection
    this.dome.fillStyle(domeShine, 0.6);
    this.dome.fillRect(-2 * p, -7 * p, 1 * p, 1 * p);

    // Dome rim
    this.dome.fillStyle(bodyMedium, 1);
    this.dome.fillRect(-5 * p, -5 * p, 10 * p, 1 * p);

    // Landing gear / antenna details
    this.saucer.fillStyle(bodyDark, 1);
    this.saucer.fillRect(-8 * p, 5 * p, 2 * p, 2 * p);
    this.saucer.fillRect(6 * p, 5 * p, 2 * p, 2 * p);
    this.saucer.fillRect(-1 * p, 5 * p, 2 * p, 2 * p);
  }

  private drawLights(p: number, phase: number) {
    this.lights.clear();

    // More lights in a rotating pattern around the rim
    const lightColors = [0xff6b6b, 0xfbbf24, 0x4ade80, 0x38bdf8, 0xa78bfa];
    const numLights = 7;
    const spacing = 3;

    for (let i = 0; i < numLights; i++) {
      // Rotating color pattern
      const colorIndex = Math.floor((phase * 2 + i) % lightColors.length);
      // Pulsing brightness with offset per light
      const brightness = 0.4 + 0.6 * Math.sin(phase * 3 + i * 0.9);
      const xPos = -9 * p + i * spacing * p;

      // Light core
      this.lights.fillStyle(lightColors[colorIndex], brightness);
      this.lights.fillRect(xPos, 2 * p, 2 * p, 1 * p);

      // Inner glow
      this.lights.fillStyle(0xffffff, brightness * 0.5);
      this.lights.fillRect(xPos, 2 * p, 1 * p, 1 * p);

      // Outer glow (larger, softer)
      this.lights.fillStyle(lightColors[colorIndex], brightness * 0.25);
      this.lights.fillRect(xPos - 1 * p, 1 * p, 4 * p, 3 * p);
    }

    // Central pulsing light
    const centralPulse = 0.5 + 0.5 * Math.sin(phase * 5);
    this.lights.fillStyle(0xfbbf24, centralPulse);
    this.lights.fillRect(-1 * p, 4 * p, 2 * p, 1 * p);
    this.lights.fillStyle(0xffffff, centralPulse * 0.7);
    this.lights.fillRect(0, 4 * p, 1 * p, 1 * p);
  }

  private drawThrusters(p: number, time: number) {
    this.thrusters.clear();

    // Update thruster particles
    this.thrusterParticles = this.thrusterParticles.filter((particle) => {
      particle.life -= 1;
      particle.y += 1;
      return particle.life > 0;
    });

    // Spawn new particles from 3 thruster positions
    const thrusterPositions = [-6, 0, 6];
    for (const xOffset of thrusterPositions) {
      if (Math.random() < 0.4) {
        this.thrusterParticles.push({
          x: xOffset * p + (Math.random() - 0.5) * 4,
          y: 6 * p,
          life: 8 + Math.floor(Math.random() * 8),
          maxLife: 16,
        });
      }
    }

    // Draw thruster glow at base
    for (const xOffset of thrusterPositions) {
      const glowIntensity = 0.3 + 0.2 * Math.sin(time * 0.01 + xOffset);
      this.thrusters.fillStyle(0x38bdf8, glowIntensity);
      this.thrusters.fillRect(xOffset * p - 1 * p, 6 * p, 2 * p, 2 * p);
      this.thrusters.fillStyle(0xffffff, glowIntensity * 0.5);
      this.thrusters.fillRect(xOffset * p, 6 * p, 1 * p, 1 * p);
    }

    // Draw particles
    for (const particle of this.thrusterParticles) {
      const lifeRatio = particle.life / particle.maxLife;
      const alpha = lifeRatio * 0.8;
      const color = lifeRatio > 0.5 ? 0x7dd3fc : 0x38bdf8;
      this.thrusters.fillStyle(color, alpha);
      this.thrusters.fillRect(particle.x, particle.y, 2, 2);
    }
  }

  private drawGlow(p: number, time: number) {
    this.glow.clear();

    const glowPulse = 0.15 + 0.1 * Math.sin(time * 0.004);

    // Outer ambient glow
    this.glow.fillStyle(0x38bdf8, glowPulse * 0.3);
    this.glow.fillRect(-14 * p, -2 * p, 28 * p, 8 * p);

    // Middle glow
    this.glow.fillStyle(0x7dd3fc, glowPulse * 0.4);
    this.glow.fillRect(-12 * p, -1 * p, 24 * p, 6 * p);

    // Inner bright glow
    this.glow.fillStyle(0xbae6fd, glowPulse * 0.2);
    this.glow.fillRect(-10 * p, 0, 20 * p, 4 * p);
  }

  private drawBeam(p: number, height: number, time: number) {
    this.beamGraphics.clear();

    if (!this.isBeamActive) return;

    // Tractor beam - expanding cone of light
    const beamTopWidth = 3;
    const beamBottomWidth = 16;
    const beamStartY = 7 * p;

    // Outer beam layers (softest glow)
    const layers = [
      { color: 0x0ea5e9, alphaBase: 0.08, widthAdd: 6 },
      { color: 0x38bdf8, alphaBase: 0.12, widthAdd: 4 },
      { color: 0x7dd3fc, alphaBase: 0.15, widthAdd: 2 },
      { color: 0xbae6fd, alphaBase: 0.2, widthAdd: 0 },
    ];

    for (const layer of layers) {
      const steps = Math.floor(height / p);
      for (let i = 0; i < steps; i++) {
        const progress = i / steps;
        // Slight wave effect
        const wave = Math.sin(time * 0.008 + i * 0.1) * 0.5;
        const width =
          beamTopWidth +
          (beamBottomWidth - beamTopWidth) * progress +
          layer.widthAdd +
          wave;
        const xOffset = (-width * p) / 2;
        // Fade alpha towards bottom
        const alpha = layer.alphaBase * (1 - progress * 0.3);
        this.beamGraphics.fillStyle(layer.color, alpha);
        this.beamGraphics.fillRect(xOffset, beamStartY + i * p, width * p, p);
      }
    }

    // Core beam (brightest white center)
    const coreSteps = Math.floor(height / p);
    for (let i = 0; i < coreSteps; i++) {
      const progress = i / coreSteps;
      const wave = Math.sin(time * 0.01 + i * 0.15) * 0.3;
      const width = 1.5 + 5 * progress + wave;
      const xOffset = (-width * p) / 2;
      const alpha = 0.4 * (1 - progress * 0.5);
      this.beamGraphics.fillStyle(0xffffff, alpha);
      this.beamGraphics.fillRect(xOffset, beamStartY + i * p, width * p, p);
    }

    // Bright source point at UFO
    this.beamGraphics.fillStyle(0xffffff, 0.8);
    this.beamGraphics.fillRect(-2 * p, beamStartY - p, 4 * p, 2 * p);
    this.beamGraphics.fillStyle(0xbae6fd, 0.6);
    this.beamGraphics.fillRect(-3 * p, beamStartY, 6 * p, p);

    // Beam particles - floating upward sparkles
    for (const particle of this.beamParticles) {
      // Larger particles are brighter
      const sizeFactor = particle.size / 6;
      this.beamGraphics.fillStyle(0xffffff, particle.alpha * sizeFactor);
      this.beamGraphics.fillRect(
        particle.x,
        particle.y,
        particle.size,
        particle.size,
      );
      // Glow around larger particles
      if (particle.size > 4) {
        this.beamGraphics.fillStyle(0x7dd3fc, particle.alpha * 0.3);
        this.beamGraphics.fillRect(
          particle.x - 2,
          particle.y - 2,
          particle.size + 4,
          particle.size + 4,
        );
      }
    }

    // Ground impact glow
    this.beamGraphics.fillStyle(0x7dd3fc, 0.15 + 0.05 * Math.sin(time * 0.01));
    const groundGlowWidth = beamBottomWidth + 4;
    this.beamGraphics.fillRect(
      (-groundGlowWidth * p) / 2,
      beamStartY + height - 2 * p,
      groundGlowWidth * p,
      4 * p,
    );
  }

  activateBeam(targetY: number) {
    this.isBeamActive = true;
    const beamHeight = targetY - this.y;

    // Initialize more particles with varied properties
    for (let i = 0; i < 35; i++) {
      this.beamParticles.push({
        x: (Math.random() - 0.5) * 50,
        y: Math.random() * beamHeight + 28,
        speed: 0.8 + Math.random() * 2.5,
        size: 2 + Math.floor(Math.random() * 3) * 2,
        alpha: 0.5 + Math.random() * 0.5,
      });
    }

    this.drawBeam(4, beamHeight, 0);
  }

  deactivateBeam() {
    this.isBeamActive = false;
    this.beamParticles = [];
    this.beamGraphics.clear();
  }

  updateBeam(targetY: number, time: number = 0) {
    if (!this.isBeamActive) return;

    const beamHeight = targetY - this.y;

    // Update particles - moving upward with slight horizontal drift
    for (const particle of this.beamParticles) {
      particle.y -= particle.speed;
      particle.x += (Math.random() - 0.5) * 0.5; // Slight drift
      particle.alpha = 0.3 + 0.5 * Math.sin(time * 0.01 + particle.y * 0.02);

      // Reset particles that reach the top
      if (particle.y < 28) {
        particle.y = beamHeight + 28;
        particle.x = (Math.random() - 0.5) * 50;
        particle.speed = 0.8 + Math.random() * 2.5;
        particle.alpha = 0.5 + Math.random() * 0.5;
      }
    }

    this.drawBeam(4, beamHeight, time);
  }

  preUpdate(time: number, _delta: number) {
    this.lightPhase = time * 0.003;
    this.drawLights(4, this.lightPhase);
    this.drawThrusters(4, time);
    this.drawGlow(4, time);

    // Gentle hover wobble when visible
    if (this.alpha > 0.5) {
      // Multi-frequency wobble for more organic movement
      const wobbleY =
        Math.sin(time * 0.004) * 0.4 + Math.sin(time * 0.007) * 0.2;
      const wobbleRot =
        Math.sin(time * 0.003) * 0.015 + Math.sin(time * 0.005) * 0.01;
      this.y += wobbleY;
      this.rotation = wobbleRot;
    }

    // Update beam if active
    if (this.isBeamActive) {
      // Beam is updated in updateBeam call from scene
    }
  }
}

class ProceduralCat extends Phaser.GameObjects.Container {
  public bodyObj: Phaser.GameObjects.Rectangle;
  private head: Phaser.GameObjects.Rectangle;
  private earL: Phaser.GameObjects.Triangle;
  private earR: Phaser.GameObjects.Triangle;
  private tail: Phaser.GameObjects.Graphics;
  private legs: Phaser.GameObjects.Rectangle[] = [];
  private eye: Phaser.GameObjects.Rectangle;

  private walkPhase: number = 0;
  private isWalking: boolean = false;
  private isAnimating: boolean = false;
  public isBeingAbducted: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const color = 0x9ca3af; // Gray
    const colorDark = 0x6b7280;

    // Pixel size multiplier
    const p = 4;

    // Body (8x5 pixels)
    this.bodyObj = scene.add
      .rectangle(0, 0, 8 * p, 5 * p, color)
      .setOrigin(0.5);

    // Head (5x5 pixels)
    this.head = scene.add
      .rectangle(4 * p, -3 * p, 5 * p, 5 * p, color)
      .setOrigin(0.5);

    // Ears
    this.earL = scene.add
      .triangle(
        this.head.x - 1.5 * p,
        this.head.y - 2.5 * p,
        0,
        p,
        p,
        p,
        p / 2,
        0,
        colorDark,
      )
      .setOrigin(0.5);
    this.earR = scene.add
      .triangle(
        this.head.x + 1.5 * p,
        this.head.y - 2.5 * p,
        0,
        p,
        p,
        p,
        p / 2,
        0,
        colorDark,
      )
      .setOrigin(0.5);

    // Eye
    this.eye = scene.add
      .rectangle(
        this.head.x + 1.5 * p,
        this.head.y - 0.5 * p,
        1 * p,
        1 * p,
        0x1f2937,
      )
      .setOrigin(0.5);

    // Tail
    this.tail = scene.add.graphics();
    this.drawTail(0);

    // Legs (2x2 pixels)
    for (let i = 0; i < 4; i++) {
      const leg = scene.add
        .rectangle((i < 2 ? -2.5 : 2.5) * p, 2.5 * p, 1.5 * p, 2 * p, colorDark)
        .setOrigin(0.5, 0);
      this.legs.push(leg);
    }

    this.add([
      this.bodyObj,
      this.head,
      this.earL,
      this.earR,
      this.eye,
      this.tail,
      ...this.legs,
    ]);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(8 * p, 7 * p);
    body.setOffset(-4 * p, -2.5 * p);
    // Don't use world bounds - we handle boundaries manually in MainScene
    body.setCollideWorldBounds(false);
    body.setBounce(0.1);
    body.setDrag(50, 0); // Slight drag for more natural stopping
    this.setVisible(false);
    this.setDepth(1000);

    // Make interactive via DOM events (since canvas has pointer-events: none)
    this.setSize(12 * p, 10 * p);

    // Listen for clicks forwarded from the DOM hit area
    window.addEventListener("cat-clicked", () => {
      this.doCuteAnimation();
    });
  }

  doCuteAnimation() {
    if (this.isAnimating || this.isBeingAbducted) return;
    this.isAnimating = true;

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Stop movement during animation
    body.setVelocityX(0);

    // Happy jump and spin animation
    this.scene.tweens.add({
      targets: body,
      duration: 100,
      onStart: () => {
        body.setVelocityY(-180); // Jump!
      },
    });

    // Squish anticipation then stretch (chained tweens)
    this.scene.tweens.add({
      targets: this,
      scaleY: 0.7,
      scaleX: 1.3,
      duration: 80,
      ease: "Quad.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          scaleY: 1.2,
          scaleX: 0.9,
          duration: 150,
          ease: "Quad.easeOut",
          onComplete: () => {
            this.scene.tweens.add({
              targets: this,
              scaleY: 1,
              scaleX: 1,
              duration: 200,
              ease: "Bounce.easeOut",
            });
          },
        });
      },
    });

    // Wiggle the head
    this.scene.tweens.add({
      targets: this.head,
      x: this.head.x + 3,
      duration: 50,
      yoyo: true,
      repeat: 5,
      ease: "Sine.easeInOut",
    });

    // Ear wiggle
    this.scene.tweens.add({
      targets: [this.earL, this.earR],
      angle: 15,
      duration: 80,
      yoyo: true,
      repeat: 3,
      ease: "Sine.easeInOut",
    });

    // Show heart balloon
    const balloon = new HeartBalloon(
      this.scene,
      this.x + (this.scaleX > 0 ? 20 : -20),
      this.y - 50,
    );
    balloon.setDepth(1001);
    balloon.show();

    // End animation after delay
    this.scene.time.delayedCall(600, () => {
      this.isAnimating = false;
      // Resume wandering
      if (Math.abs(body.velocity.x) < 5) {
        const dir = Math.random() > 0.5 ? 1 : -1;
        body.setVelocityX(dir * 50);
      }
    });
  }

  private drawTail(angle: number) {
    this.tail.clear();
    this.tail.lineStyle(4, 0x6b7280);
    const p = 4;
    const startX = -4 * p;
    const startY = -1 * p;

    this.tail.beginPath();
    this.tail.moveTo(startX, startY);
    // Longer tail: 8 segments
    for (let i = 1; i <= 8; i++) {
      const nx = startX - i * 4;
      const ny = startY - i * 1.5 + Math.sin(angle + i * 0.4) * 6;
      this.tail.lineTo(nx, ny);
    }
    this.tail.strokePath();
  }

  startAbductionWiggle() {
    // Panic wiggle animation during abduction
    this.scene.tweens.add({
      targets: this,
      scaleX: { from: 1, to: -1 },
      duration: 100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Legs flailing
    this.legs.forEach((leg, i) => {
      this.scene.tweens.add({
        targets: leg,
        angle: i % 2 === 0 ? 30 : -30,
        duration: 80,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 20,
      });
    });
  }

  resetAfterAbduction() {
    // Stop all tweens on this cat and its parts
    this.scene.tweens.killTweensOf(this);
    this.legs.forEach((leg) => {
      this.scene.tweens.killTweensOf(leg);
      leg.setAngle(0);
      leg.y = 2.5 * 4; // Reset to default position
    });

    // Reset state
    this.isBeingAbducted = false;
    this.isAnimating = false;
    this.walkPhase = 0;
  }

  preUpdate(time: number, delta: number) {
    if (this.isBeingAbducted) {
      this.drawTail(time * 0.02); // Fast tail wag during abduction
      return;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    this.isWalking = Math.abs(body.velocity.x) > 10;

    // Only change direction when not animating
    if (!this.isAnimating) {
      if (body.velocity.x > 0) {
        this.setScale(1, 1);
      } else if (body.velocity.x < 0) {
        this.setScale(-1, 1);
      }
    }

    if (this.isWalking) {
      this.walkPhase += delta * 0.01;
      this.legs.forEach((leg, i) => {
        const offset = i % 2 === 0 ? 0 : Math.PI;
        leg.y = 2.5 * 4 + Math.sin(this.walkPhase + offset) * 4;
      });
      this.bodyObj.y = Math.sin(this.walkPhase * 2) * 2;
      this.head.y = -3 * 4 + Math.sin(this.walkPhase * 2) * 1;
    } else {
      const idlePhase = time * 0.002;
      this.bodyObj.scaleY = 1 + Math.sin(idlePhase) * 0.05;
    }
    this.drawTail(time * 0.005);

    // Emit position update for DOM hit area
    window.dispatchEvent(
      new CustomEvent("cat-position-update", {
        detail: {
          x: this.x,
          y: this.y,
          visible: this.visible,
        },
      }),
    );
  }
}

export class MainScene extends Phaser.Scene {
  private cat?: ProceduralCat;
  private ufo?: ProceduralUFO;
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private layout?: any;
  private hasSpawned: boolean = false;
  private lastTurnTime: number = 0;
  private isAbductionInProgress: boolean = false;

  // Walking boundaries - the actual area where the cat can roam
  private walkableArea = {
    left: 0,
    right: 0,
    groundY: 0,
    topY: 0,
  };

  // Cat movement parameters for more natural behavior
  private catDirection: number = 1;
  private pauseUntil: number = 0;
  private nextDirectionChange: number = 0;

  constructor() {
    super("MainScene");
  }

  create() {
    this.platforms = this.physics.add.staticGroup();

    this.cat = new ProceduralCat(this, -100, -100);
    this.physics.add.collider(this.cat, this.platforms);

    window.addEventListener("house-layout", (e: any) => {
      this.updateLayout(e.detail);
    });

    // Listen for avatar click to trigger UFO abduction
    window.addEventListener("avatar-clicked", () => {
      this.triggerUFOAbduction();
    });

    window.dispatchEvent(new CustomEvent("request-house-layout"));
  }

  updateLayout(detail: any) {
    this.layout = detail;
    this.refreshWorld();
  }

  refreshWorld() {
    if (!this.layout || !this.platforms || !this.cat) return;

    const { card } = this.layout;
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    this.platforms.clear(true, true);

    // Cat physics body dimensions (from ProceduralCat constructor: 8*4 = 32 width, 7*4 = 28 height)
    const catHalfWidth = 16;
    const catHeight = 28;

    // Road height differs between mobile and desktop
    // Mobile: 7% road height, dashed line at 50% from top
    // Desktop: 18% road height, dashed line at 60% from top
    const isMobile = screenWidth < 768; // md breakpoint
    const roadAreaHeight = isMobile ? screenHeight * 0.07 : screenHeight * 0.18;
    const dashedLineFromTop = isMobile
      ? roadAreaHeight * 0.5
      : roadAreaHeight * 0.6;
    const groundY = screenHeight - roadAreaHeight + dashedLineFromTop - 10; // Just above the dashed line

    // Define the walkable area - the entire screen width with small margins
    const margin = 50; // Safety margin from screen edges
    this.walkableArea = {
      left: margin + catHalfWidth,
      right: screenWidth - margin - catHalfWidth,
      groundY: groundY,
      topY: groundY - 200, // Cat can jump a bit but stays near road level
    };

    // Create ONE ground platform - the road that spans the entire screen
    this.createPlatform(
      screenWidth / 2,
      groundY + 15, // Platform surface just below cat feet
      screenWidth + 100, // Extra wide to ensure no gaps
      30,
    );

    // No side walls - cat can walk across the entire scene
    // The cat will turn around naturally via the update() logic

    // Handle cat position on layout updates
    const catBody = this.cat.body as Phaser.Physics.Arcade.Body;

    // Check if cat is severely out of bounds (needs respawn)
    const severelyOutOfBounds =
      this.cat.x < -100 ||
      this.cat.x > screenWidth + 100 ||
      this.cat.y < 0 ||
      this.cat.y > screenHeight + 50;

    // Check if cat is slightly out of bounds (needs gentle repositioning)
    const slightlyOutOfBounds =
      this.cat.x < this.walkableArea.left ||
      this.cat.x > this.walkableArea.right ||
      this.cat.y > groundY + 50;

    if (!this.hasSpawned || severelyOutOfBounds) {
      // Full respawn - place cat on the road, slightly to the right of the house
      const spawnX = card.right + 50; // Start to the right of the house
      const spawnY = groundY - catHeight;

      this.cat.setPosition(spawnX, spawnY);
      catBody.setVelocity(0, 0);
      this.hasSpawned = true;
      this.cat.setVisible(true);

      // Initialize movement state - start walking left (toward house)
      this.catDirection = -1;
      this.nextDirectionChange = this.time.now + 3000 + Math.random() * 4000;
    } else if (slightlyOutOfBounds && this.hasSpawned) {
      // Gentle repositioning - clamp to valid area without full respawn
      const clampedX = Math.max(
        this.walkableArea.left,
        Math.min(this.walkableArea.right, this.cat.x),
      );
      const clampedY = Math.min(groundY - 10, this.cat.y);

      this.cat.setPosition(clampedX, clampedY);

      // Adjust direction if we were heading out of bounds
      if (this.cat.x <= this.walkableArea.left && this.catDirection < 0) {
        this.catDirection = 1;
      } else if (
        this.cat.x >= this.walkableArea.right &&
        this.catDirection > 0
      ) {
        this.catDirection = -1;
      }
    }
  }

  createPlatform(x: number, y: number, w: number, h: number) {
    const p = this.platforms?.create(x, y, undefined);
    p?.setDisplaySize(w, h);
    p?.setVisible(false);
    p?.refreshBody();
    return p;
  }

  triggerUFOAbduction() {
    if (this.isAbductionInProgress || !this.cat || !this.cat.visible) return;
    this.isAbductionInProgress = true;

    // Stop the cat
    const catBody = this.cat.body as Phaser.Physics.Arcade.Body;
    catBody.setVelocity(0, 0);
    catBody.setAllowGravity(false);

    // Get cat position for UFO target
    const catX = this.cat.x;
    const catY = this.cat.y;

    // Create UFO far away at the top (mirroring how it leaves)
    // Start position: top-left, far away and tiny
    const startX = -150;
    const startY = -150;
    this.ufo = new ProceduralUFO(this, startX, startY);

    // Start small and transparent (like how it ends when leaving)
    this.ufo.setScale(0.1);
    this.ufo.setAlpha(0);

    // Target position - above the cat
    const targetX = catX;
    const targetY = catY - 150;

    // Phase 1: UFO flies in from far away (small to big, reverse of exit)
    this.tweens.add({
      targets: this.ufo,
      alpha: 1,
      scale: 1,
      x: targetX,
      y: targetY,
      duration: 1800,
      ease: "Cubic.easeOut",
      onUpdate: () => {
        // Add slight swaying motion during approach (decreases as it gets closer)
        if (this.ufo) {
          const progress = this.ufo.scale; // 0.1 -> 1
          const swayAmount = (1 - progress) * 40; // More sway when far, less when close
          const time = this.time.now;

          // Calculate interpolated position
          const baseX = startX + (targetX - startX) * progress;
          const baseY = startY + (targetY - startY) * progress;

          this.ufo.x = baseX + Math.sin(time * 0.01) * swayAmount;
          this.ufo.y = baseY + Math.cos(time * 0.008) * swayAmount * 0.5;
        }
      },
      onComplete: () => {
        // Phase 2: UFO hovers and activates beam
        this.ufo?.setPosition(targetX, targetY);

        this.time.delayedCall(300, () => {
          // Activate the tractor beam
          this.ufo?.activateBeam(catY + 20);

          // Cat starts wiggling in panic
          this.cat!.isBeingAbducted = true;
          this.cat!.startAbductionWiggle();

          // Phase 3: Cat gets lifted up
          this.time.delayedCall(800, () => {
            this.tweens.add({
              targets: this.cat,
              y: targetY + 30,
              duration: 2000,
              ease: "Sine.easeInOut",
              onUpdate: () => {
                // Update beam to follow cat
                if (this.ufo && this.cat) {
                  this.ufo.updateBeam(this.cat.y + 20, this.time.now);
                }

                // Rotate cat while being lifted
                if (this.cat) {
                  this.cat.rotation += 0.02;
                }
              },
              onComplete: () => {
                // Phase 4: Cat disappears into UFO
                this.tweens.add({
                  targets: this.cat,
                  alpha: 0,
                  scale: 0.1,
                  duration: 300,
                  ease: "Quad.easeIn",
                  onComplete: () => {
                    this.ufo?.deactivateBeam();
                    this.cat?.setVisible(false);

                    // Phase 5: UFO flies away
                    this.time.delayedCall(500, () => {
                      this.tweens.add({
                        targets: this.ufo,
                        x: -200,
                        y: -200,
                        scale: 0.1,
                        alpha: 0,
                        duration: 1500,
                        ease: "Cubic.easeIn",
                        onComplete: () => {
                          // Cleanup and reset
                          this.ufo?.destroy();
                          this.ufo = undefined;

                          // Reset cat after a delay
                          this.time.delayedCall(2000, () => {
                            this.resetCatAfterAbduction();
                          });
                        },
                      });
                    });
                  },
                });
              },
            });
          });
        });
      },
    });
  }

  resetCatAfterAbduction() {
    if (!this.cat || !this.layout) return;

    // Use the cat's reset method to properly clean up all state
    this.cat.resetAfterAbduction();

    // Reset visual properties
    this.cat.setAlpha(1);
    this.cat.setScale(1, 1);
    this.cat.setRotation(0);

    // Respawn cat on the road, near the house
    const { card } = this.layout;
    const spawnX = card.right + 50;
    const spawnY = this.walkableArea.groundY - 30;
    this.cat.setPosition(spawnX, spawnY);

    const catBody = this.cat.body as Phaser.Physics.Arcade.Body;
    catBody.setAllowGravity(true);
    catBody.setVelocity(0, 0);

    // Reset movement state
    this.catDirection = Math.random() > 0.5 ? 1 : -1;
    this.nextDirectionChange = this.time.now + 2000 + Math.random() * 3000;
    this.pauseUntil = 0;

    // Make visible with a fun entrance
    this.cat.setVisible(true);
    this.cat.setAlpha(0);
    this.cat.setScale(0.1);

    // Cat drops back in from above
    this.tweens.add({
      targets: this.cat,
      alpha: 1,
      scale: 1,
      duration: 500,
      ease: "Bounce.easeOut",
      onComplete: () => {
        this.isAbductionInProgress = false;
      },
    });
  }

  update() {
    if (!this.cat || this.cat.isBeingAbducted) return;

    const body = this.cat.body as Phaser.Physics.Arcade.Body;
    const now = this.time.now;

    // Skip movement logic if walkable area not set up yet
    if (this.walkableArea.right === 0) return;

    // Hard clamp position to walkable area (safety net)
    if (this.cat.x < this.walkableArea.left) {
      this.cat.x = this.walkableArea.left;
      body.setVelocityX(Math.abs(body.velocity.x) || 40);
      this.catDirection = 1;
    } else if (this.cat.x > this.walkableArea.right) {
      this.cat.x = this.walkableArea.right;
      body.setVelocityX(-Math.abs(body.velocity.x) || -40);
      this.catDirection = -1;
    }

    // Clamp Y position (prevent falling through or flying too high)
    if (this.cat.y > this.walkableArea.groundY + 20) {
      this.cat.y = this.walkableArea.groundY - 10;
      body.setVelocityY(0);
    }
    if (this.cat.y < this.walkableArea.topY) {
      body.setVelocityY(Math.max(body.velocity.y, 0));
    }

    // Check if cat is paused (resting/looking around)
    if (now < this.pauseUntil) {
      body.setVelocityX(0);
      return;
    }

    // Wall collision behavior - turn around when hitting walls
    if (now - this.lastTurnTime > 400) {
      if (body.blocked.left || body.touching.left) {
        this.catDirection = 1;
        this.lastTurnTime = now;
        this.nextDirectionChange = now + 1500 + Math.random() * 2000;
      } else if (body.blocked.right || body.touching.right) {
        this.catDirection = -1;
        this.lastTurnTime = now;
        this.nextDirectionChange = now + 1500 + Math.random() * 2000;
      }
    }

    // Natural walking behavior when on ground
    const isOnGround = body.blocked.down || body.touching.down;

    if (isOnGround) {
      // Randomly change direction or pause
      if (now > this.nextDirectionChange) {
        const action = Math.random();

        if (action < 0.15) {
          // Pause for a moment (cat sits/looks around)
          this.pauseUntil = now + 800 + Math.random() * 1500;
          body.setVelocityX(0);
        } else if (action < 0.4) {
          // Change direction
          this.catDirection *= -1;
        }
        // Otherwise keep going same direction

        this.nextDirectionChange = now + 2000 + Math.random() * 4000;
      }

      // Apply walking velocity with slight variation
      const baseSpeed = 35 + Math.random() * 20;
      const targetVelocity = this.catDirection * baseSpeed;

      // Smooth acceleration
      const currentVel = body.velocity.x;
      const newVel = currentVel + (targetVelocity - currentVel) * 0.1;
      body.setVelocityX(newVel);

      // Occasional small hop (playful cat behavior)
      if (Math.random() < 0.002 && Math.abs(body.velocity.x) > 20) {
        body.setVelocityY(-100 - Math.random() * 50);
      }
    }

    // Turn around before reaching boundaries (anticipatory turning)
    const turnBuffer = 40;
    if (
      this.cat.x <= this.walkableArea.left + turnBuffer &&
      this.catDirection < 0
    ) {
      this.catDirection = 1;
      this.nextDirectionChange = now + 2000 + Math.random() * 2000;
    } else if (
      this.cat.x >= this.walkableArea.right - turnBuffer &&
      this.catDirection > 0
    ) {
      this.catDirection = -1;
      this.nextDirectionChange = now + 2000 + Math.random() * 2000;
    }

    // Update UFO beam if active
    if (this.ufo && this.cat) {
      this.ufo.updateBeam(this.cat.y + 20, this.time.now);
    }
  }
}
