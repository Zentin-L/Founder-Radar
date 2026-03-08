# Founder Radar - 3D Hero Section

A premium, interactive 3D hero section showcasing startup momentum tracking with glass morphism cards and particle effects.

## Features

- **3D Interactive Canvas**: React Three Fiber powered scene with smooth animations
- **Glass Morphism Cards**: Hover-interactive cards displaying startup information and momentum scores
- **Particle System**: 2,500+ glowing particles creating a galaxy/constellation effect
- **Advanced Lighting**: Multi-light setup with cyan, blue, and pink accent lights
- **Smooth Animations**: Floating motion and rotation animations on interaction
- **Responsive Design**: Full-screen immersive experience

## Technology Stack

- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **Drei**: Helpful React Three Fiber utilities
- **Tailwind CSS**: Styling and layout
- **TypeScript**: Type-safe development

## Project Structure

```
components/founder-radar-hero/
├── hero-scene.tsx      # Main 3D scene component
├── glass-card.tsx      # Interactive glass card component
├── particle-system.tsx # Glowing particle system
└── lighting.tsx        # Multi-light setup
```

## Design Details

### Color Palette
- **Primary**: Dark navy/black gradient (#0a0f1e → #000000)
- **Accent**: Cyan (#00ff88), Blue (#00ccff), Pink (#ff6b9d)
- **Glass**: Semi-transparent white with chromatic aberration effect

### Glass Cards
- 5 startup cards with customizable positions
- Momentum scores (0-100) with color-coded progress bars
- Smooth hover interactions with rotation and glow effects

### Particles
- Spherical distribution around the scene
- Cyan, blue, and purple vertex colors
- Gentle rotation and floating animations
- Emissive material for glow effect

### Lighting
- Spotlight with moving animation for dynamic shadows
- Blue and pink point lights for accent lighting
- Cyan directional light for rim effects
- Hemisphere light for atmospheric quality

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) to see the hero section

## Performance Optimization

- Points material for efficient particle rendering
- Geometry reuse across cards
- LOD considerations for large particle counts
- Smooth frame rate targeting through lerp-based animations

## Browser Compatibility

Works best on modern browsers with WebGL support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 15+

## Future Enhancements

- Post-processing effects (bloom, depth-of-field)
- Click-to-focus on specific cards
- Real-time data integration
- Mobile gesture controls
- Advanced shader effects
