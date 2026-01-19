# Planning Guide

A personal business card website designed as a charming pixel-art house, featuring professional information and an interactive pixelated cat character that walks around, jumps on platforms, and rests at the bottom of the house.

**Experience Qualities**:

1. **Playful** - The pixelated cat and whimsical house design add delightful personality, creating a memorable first impression that balances professionalism with creative expression
2. **Immersive** - The business card transforms into a physical space where the cat lives and interacts, with realistic physics, depth perception through shadows, and environmental elements like the house roof, window, door, and drainage piping
3. **Charming** - The combination of pixel-art aesthetics, architectural house details, and smooth cat animations creates a warm, approachable personal brand that feels hand-crafted

**Complexity Level**: Light Application (multiple features with basic state)

- This is a personal portfolio card with interactive elements (cat animations, social links, house structure) that maintains state for the cat's position and animation cycles

## Essential Features

### Profile Display in House Structure

- **Functionality**: Shows avatar (as person in window), name, email, social links, and work experience within a pixel-art house design complete with roof, chimney, window, and door
- **Purpose**: Presents professional information in an accessible, scannable format while creating a cohesive physical environment for the cat to inhabit
- **Trigger**: Loads immediately on page load
- **Progression**: Page loads → House structure with roof fades in → Avatar appears in window frame → Information becomes readable → Cat begins exploring
- **Success criteria**: All information is clearly legible, house structure feels cohesive and charming, architectural elements (roof, chimney, door, window) are visually distinct and well-proportioned

### Interactive Pixel Cat with House Interaction

- **Functionality**: A cute pixelated gray cat walks around the house, can jump on platforms (roof sections, window sill, social buttons), sits, idles, and travels through drainage piping. The cat shrinks and speeds up when inside pipes, creating depth illusion.
- **Purpose**: Creates memorable personality and engagement while users read the profile, making the house feel like a lived-in space the cat inhabits naturally
- **Trigger**: Cat begins animating when page loads
- **Success criteria**: Smooth pixel-perfect animations, realistic cat behavior patterns, cat physically collides with house surfaces and platforms, cat is constrained within the house structure boundaries, dynamic shadow enhances depth perception, larger and more prominent on mobile, animations feel natural and polished

### House Architecture

- **Functionality**: Visual house structure including pitched roof with shingles and edge highlighting, brick chimney, window frame with grid panes for avatar, and decorative door at bottom.
- **Environment**: A horizontal pixelated road passing behind the house and flanking pixel-art trees.
- **Purpose**: Enhances the immersive world-building and creates a sense of place.
- **Trigger**: Renders on page load.
- **Visibility**: Environment elements (road, trees) are strictly hidden on mobile devices to maintain card focus.
- **Success criteria**: Road looks like a cohesive part of the ground plane, trees have a consistent pixel-art style, responsive hiding works correctly.

### Social Links

- **Functionality**: Clickable icons that link to LinkedIn (https://www.linkedin.com/in/sinemdemiroz) and Medium (https://medium.com/@sinemdemiroz) profiles
- **Purpose**: Provides direct pathways to connect on social platforms
- **Trigger**: User clicks on social icon
- **Progression**: Hover over icon → Icon highlights/animates → Click → Opens social profile in new tab
- **Success criteria**: Links work correctly, icons are recognizable, hover states provide clear feedback

## Edge Case Handling

- **No avatar**: Display fallback initials or placeholder icon if avatar fails to load
- **Long company names**: Truncate with ellipsis if experience entries become too long
- **Cat boundaries**: Cat physically collides with invisible platforms aligned with house elements (roof edges, window sill, door top, card bottom), walking on surfaces rather than floating. The cat is strictly contained within the house structure.
- **Mobile devices**: Cat scales larger (4x vs 3x desktop) for better visibility, animations remain smooth, platforms and pipe positions adjust to mobile card size, house elements remain proportional
- **Reduced motion preference**: Respect prefers-reduced-motion, showing static or minimal cat animation, hiding cat canvas entirely if preferred

## Design Direction

The design should evoke a sense of warmth, creativity, and approachability while maintaining professionalism—like receiving a beautifully crafted miniature house that doubles as a business card. The soft pink background creates a gentle, inviting atmosphere, while the cream-colored house structure provides architectural charm. The pixelated gray cat adds playful nostalgia reminiscent of pixel art games, creating unexpected moments of joy as it explores the house. The house features include a textured pitched roof with shingles, a brick chimney, a window where the profile avatar looks out (creating the impression of someone at home), and a decorative door at the bottom. The cat's gray coloring ensures it stands out clearly against the background while feeling integrated into the physical space through collision detection, shadow effects, and constrained boundaries within the card.

## Color Selection

A soft, warm palette with high contrast for readability, inspired by gentle sunset tones and modern minimalism.

- **Primary Color**: Soft dusty rose (`oklch(0.85 0.05 15)`) - Creates a warm, approachable background that feels personal without being overwhelming
- **Secondary Colors**:
  - Cream white (`oklch(0.98 0.01 60)`) - Card background that feels warmer than pure white
  - Charcoal (`oklch(0.25 0.01 260)`) - Primary text color for strong readability
  - Muted gray (`oklch(0.55 0.01 260)`) - Secondary text and dates
- **Accent Color**: Coral pink (`oklch(0.72 0.15 15)`) - Social icon hover states and interactive elements, ties to background
- **Foreground/Background Pairings**:
  - Background (Soft rose `oklch(0.85 0.05 15)`): Footer text (`oklch(0.60 0.02 15)`) - Ratio 2.8:1 (large text) ✓
  - Card (Cream `oklch(0.98 0.01 60)`): Primary text (`oklch(0.25 0.01 260)`) - Ratio 12.5:1 ✓
  - Card (Cream `oklch(0.98 0.01 60)`): Secondary text (`oklch(0.55 0.01 260)`) - Ratio 5.2:1 ✓
  - Accent (Coral `oklch(0.72 0.15 15)`): White text (`oklch(1 0 0)`) - Ratio 4.9:1 ✓

## Font Selection

The typography should feel modern and friendly while maintaining professionalism—like a creative professional who takes their work seriously but doesn't take themselves too seriously.

- **Typographic Hierarchy**:
  - H1 (Name): Space Grotesk Bold/32px/tight letter spacing (-0.02em) - Geometric but friendly, stands out as the focal point
  - Body (Email): Space Grotesk Regular/16px/normal - Maintains consistency with name
  - Small (Experience): DM Sans Regular/14px/relaxed line height (1.6) - Highly readable for longer content blocks
  - Caption (Dates): DM Sans Regular/13px/muted color - Clearly subordinate to job titles
  - Footer: DM Sans Regular/14px - Subtle and unobtrusive

## Animations

Animations serve three purposes: guiding attention, providing feedback, and creating delight through the cat character and house environment.

- **Card/House entrance**: Gentle fade-in with subtle upward float (300ms ease-out) on page load
- **Social icon hovers**: Scale up to 1.1x with color transition (200ms ease-out) - feels responsive and inviting
- **Cat animations**:
  - Smooth sprite-based walking animation using Phaser 3 game engine for pixel-perfect rendering
  - Idle animations with tail swish and breathing
  - Jump arc with proper physics (ease-in going up, ease-out coming down)
  - Sitting animation when cat rests on platforms
  - Collision-based physics so cat walks ON platforms (house roof, window, door, social buttons) rather than floating over them, and remains contained within the card body.
- **Reduced motion**: Disable cat movement entirely (hide canvas), show only static house structure for users who prefer reduced motion

## Component Selection

- **Components**:
  - Card: Shadcn Card component with custom soft shadow and rounded corners, serving as the house body
  - Avatar: Custom styled circular div with image, placed within window frame with sky-blue background and cross panes
  - Button: Shadcn Button component for social links, styled as icon-only with ghost variant
  - House architectural elements: Custom SVG and HTML elements for roof (with shingle pattern), chimney (brick texture), window frame (with panes), door (with panels and decorative knob)
- **Customizations**:
  - **House elements**: Custom physics platforms aligned with house elements (roof edges, window sill, door top, card bottom) to contain the cat.
  - **Roof structure**: SVG polygon with shingle pattern fill, dark stroke outline, and highlight layer for depth
  - **Chimney**: Layered rectangles with gradient and borders creating brick appearance, positioned on roof slope
  - **Window frame**: Circular window with sky-blue background, cross panes dividing into quadrants, dark border, containing avatar image scaled to fill
  - **Door**: Rectangular element at card bottom with gradient, panel details, and decorative circular knob
  - **Cat sprites**: Gray-toned pixel art (body: #9CA3AF, dark: #6B7280, white: #E5E7EB, eye: #1F2937) for clear separation from pink background
  - **Dynamic shadow ellipse**: Under cat showing depth perception, adjusts during jumps and pipe traversal
  - **Semi-transparent card background**: bg-card/95 with backdrop-blur for subtle depth layering
  - **Custom experience list styling**: Bullet points and date formatting with proper hierarchy
- **States**:
  - Social icons: default (muted), hover (coral with scale), active (pressed effect)
  - Cat sprites: idle, walk, jump, sit, in-pipe states with smooth transitions
  - Cat depth layers: Always on top of the house card body.
- **Icon Selection**:
  - LinkedIn and Twitter icons from @phosphor-icons/react
  - Simple, recognizable social media glyphs
- **Spacing**:
  - Card padding: p-10 (2.5rem) for generous breathing room, pb-12 for extra bottom padding
  - Stack spacing: space-y-6 between major sections, space-y-4 between experience entries with increased mt-1 for period text
  - Icon spacing: gap-3 between social icons
  - House element positioning: Roof extends above card by ~80px, chimney on left roof slope, window at top of card content area (pt-32 to account for window), door extends below card by ~100px.
- **Mobile**:
  - Card scales down to full width with maintained padding (p-6 on mobile)
  - Avatar/window scales proportionally
  - Font sizes reduce slightly (H1: 28px → 32px)
  - Cat canvas scales responsively with larger cat sprite on mobile (4x scale vs 3x desktop) for prominence
  - Physics platforms adjust positions based on mobile card dimensions
  - House elements (roof, chimney, window, door, pipes) maintain proportions but scale to mobile card size
  - Experience list remains readable with adjusted spacing
