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
    body.setCollideWorldBounds(true);
    body.setBounce(0.1);
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
    if (this.isAnimating) return;
    this.isAnimating = true;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const originalVelX = body.velocity.x;

    // Stop movement during animation
    body.setVelocityX(0);

    // Store original positions
    const origBodyY = this.bodyObj.y;
    const origHeadY = this.head.y;

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

  preUpdate(time: number, delta: number) {
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
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private layout?: any;
  private hasSpawned: boolean = false;
  private lastTurnTime: number = 0;

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

    window.dispatchEvent(new CustomEvent("request-house-layout"));
  }

  updateLayout(detail: any) {
    this.layout = detail;
    this.refreshWorld();
  }

  refreshWorld() {
    if (!this.layout || !this.platforms || !this.cat) return;

    const { card, roof, window: win } = this.layout;

    this.platforms.clear(true, true);

    // Window Sill
    this.createPlatform(win.left + win.width / 2, win.bottom, win.width, 10);

    // 3. Ground (inside card bottom, above the door step)
    const groundY = card.bottom - 40;
    const groundWidth = card.width - 20;
    this.createPlatform(card.left + card.width / 2, groundY, groundWidth, 20);

    // 4. Side Walls (Containment)
    // We make them tall enough to contain the cat even during jumps
    this.createPlatform(card.left, card.bottom - 150, 4, 300); // Left wall
    this.createPlatform(card.right, card.bottom - 150, 4, 300); // Right wall

    // Spawn/Reset cat at the bottom center of the card
    if (
      !this.hasSpawned ||
      this.cat.y < 0 ||
      this.cat.y > this.scale.height ||
      this.cat.x < 0 ||
      this.cat.x > this.scale.width
    ) {
      this.cat.setPosition(card.left + card.width / 2, groundY - 50);
      const body = this.cat.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
      this.hasSpawned = true;
      this.cat.setVisible(true);
    }
  }

  createPlatform(x: number, y: number, w: number, h: number) {
    const p = this.platforms?.create(x, y, undefined);
    p?.setDisplaySize(w, h);
    p?.setVisible(false);
    p?.refreshBody();
    return p;
  }

  update() {
    if (!this.cat) return;
    const body = this.cat.body as Phaser.Physics.Arcade.Body;

    // Wall collision behavior - flip direction with cooldown to prevent oscillation
    const now = this.time.now;
    if (now - this.lastTurnTime > 500) {
      if (body.blocked.left || body.touching.left) {
        body.setVelocityX(50);
        this.lastTurnTime = now;
      } else if (body.blocked.right || body.touching.right) {
        body.setVelocityX(-50);
        this.lastTurnTime = now;
      }
    }

    if (body.touching.down) {
      if (Math.abs(body.velocity.x) < 5) {
        const dir = Math.random() > 0.5 ? 1 : -1;
        body.setVelocityX(dir * 50);
      }

      if (Math.random() < 0.005) {
        body.setVelocityY(-150);
      }
    }
  }
}
