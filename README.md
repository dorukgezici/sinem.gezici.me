# sinem.gezici.me

Personal site of **Sinem Demiröz Gezici** — performance marketing manager in gaming.

A single-page, warm-editorial portfolio built with [Astro 7](https://astro.build) and Tailwind CSS 4. Zero framework runtime: every interaction is a few lines of vanilla TypeScript.

## Design

- **Warm editorial minimalism** — ivory paper with film grain, Fraunces display serif paired with Space Grotesk, oversized hero typography, scroll-reveal motion.
- **Automatic dark mode** via `prefers-color-scheme`.
- **Reduced-motion friendly** — animations, marquee, and the companion respect `prefers-reduced-motion`.

## Easter eggs 🥚

- A pixel **cat** wanders along the bottom of the page. Click it to pet it.
- Click the **portrait** in the hero… 👽
- Hover the tiny **door** in the footer.

The whole companion (cat + UFO + hearts) is a single `<canvas>` driven by ~400 lines of dependency-free TypeScript in `src/scripts/companion.ts`.

## Commands

| Command        | Action                                      |
| :------------- | :------------------------------------------ |
| `pnpm install` | Install dependencies                        |
| `pnpm dev`     | Start local dev server at `localhost:4321`  |
| `pnpm build`   | Build the production site to `./dist/`      |
| `pnpm preview` | Preview the production build locally        |

---

with ♥ by [@dorukgezici](https://doruk.gezici.me)
