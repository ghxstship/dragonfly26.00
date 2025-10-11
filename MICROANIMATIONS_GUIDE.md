# Premium Microanimations Implementation Guide

This project now features a comprehensive system of sleek, luxurious microanimations across all interactive elements for a premium user experience.

## 🎨 Animation Philosophy

- **Subtle & Luxurious**: Animations are refined and understated, enhancing rather than overwhelming
- **Performance-First**: Using CSS transforms and hardware acceleration
- **Spring Physics**: Natural, organic motion using spring-based timing functions
- **Consistent Timing**: Coordinated durations (200ms for quick interactions, 300ms for transitions)

## 📦 Core Animation System

### Tailwind Configuration Extensions

**Location**: `tailwind.config.ts`

New custom animations added:
- `fade-in` / `fade-out` - Smooth opacity transitions
- `scale-in` / `scale-out` - Subtle scale animations
- `slide-in-from-*` - Directional slide animations (top/bottom/left/right)
- `shimmer` - Loading skeleton effect
- `pulse-subtle` - Gentle pulsing
- `bounce-subtle` - Minimal bounce effect
- `glow` - Premium glow effect

Custom timing functions:
- `ease-spring`: cubic-bezier(0.16, 1, 0.3, 1) - Spring-like motion
- `ease-elegant`: cubic-bezier(0.4, 0, 0.2, 1) - Smooth, refined easing

### Animation Utilities

**Location**: `src/lib/animations.ts`

Framer Motion variants and configurations:
- `elegantSpring` - Premium spring configuration
- `smoothEase` - Smooth easing function
- `buttonVariants` - Button interaction animations
- `cardVariants` - Card hover effects
- `modalVariants` - Modal entrance/exit
- `dropdownVariants` - Dropdown menu animations
- And many more...

## 🎯 Component Animations

### Buttons (`button.tsx`)
- Scale on hover: 102%
- Scale on press: 98%
- Shadow elevation on hover
- Smooth color transitions

```tsx
<Button>Click Me</Button>
```

### Cards (`card.tsx`)
- Scale on hover: 101%
- Shadow elevation
- 300ms transition duration

### Form Elements

#### Input Fields (`input.tsx`, `textarea.tsx`)
- Subtle scale on focus: 101%
- Border color transition on hover
- Ring animation on focus

#### Checkbox (`checkbox.tsx`)
- Scale on hover: 110%
- Scale-in animation when checked
- Smooth state transitions

#### Switch (`switch.tsx`)
- Scale on hover: 105%
- Thumb scales on checked state: 110%
- Spring-based thumb movement

#### Radio Buttons (`radio-group.tsx`)
- Scale on hover: 110%
- Pulse animation on selected indicator

### Navigation & Menus

#### Dropdown Menu (`dropdown-menu.tsx`)
- Zoom and fade entrance
- Items slide in with scale
- Hover: subtle scale + padding shift

#### Select (`select.tsx`)
- Chevron rotates 180° when open
- Content zoom and slide animation
- Items scale on hover

#### Tabs (`tabs.tsx`)
- Active tab scales: 105%
- Content fades in
- Smooth state transitions

### Modals & Overlays

#### Dialog (`dialog.tsx`)
- Backdrop blur with fade
- Content zoom-in from 95%
- Close button rotates 90° on hover

#### Sheet (`sheet.tsx`)
- Slide from direction (top/bottom/left/right)
- Backdrop fade with blur
- Close button with rotation

#### Tooltip (`tooltip.tsx`)
- Quick fade and scale: 200ms
- Direction-aware slide

#### Popover (`popover.tsx`)
- Zoom and fade entrance
- Shadow elevation

### Feedback Elements

#### Toast (`toast.tsx`)
- Slide from top/bottom
- Swipe gesture support
- Action buttons scale on hover
- Close button rotates

#### Alert (`alert.tsx`)
- Slide-in from top
- Fade entrance

#### Progress (`progress.tsx`)
- Spring-based bar animation
- Smooth width transitions

### Visual Elements

#### Badge (`badge.tsx`)
- Scale on hover: 105%
- Shadow elevation

#### Avatar (`avatar.tsx`)
- Scale on hover: 110%
- Shadow elevation
- Image smooth transition

## 🎬 Page Transitions

### Page Transition Component

**Location**: `src/components/ui/page-transition.tsx`

```tsx
import { PageTransition } from "@/components/ui/page-transition"

export default function Page() {
  return (
    <PageTransition>
      <YourContent />
    </PageTransition>
  )
}
```

### Stagger Animations

For lists and grids:

```tsx
import { StaggerContainer, StaggerItem } from "@/components/ui/page-transition"

<StaggerContainer>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <Card>{item.content}</Card>
    </StaggerItem>
  ))}
</StaggerContainer>
```

### Utility Wrappers

```tsx
import { FadeIn, ScaleIn, SlideIn } from "@/components/ui/page-transition"

// Fade in with delay
<FadeIn delay={0.2}>
  <Content />
</FadeIn>

// Scale in
<ScaleIn>
  <Card />
</ScaleIn>

// Slide from direction
<SlideIn direction="left">
  <Sidebar />
</SlideIn>
```

## 🎨 Animated Icons

**Location**: `src/components/ui/animated-icon.tsx`

```tsx
import { AnimatedIcon, InteractiveIcon } from "@/components/ui/animated-icon"
import { Heart } from "lucide-react"

// Auto-animated icon
<AnimatedIcon icon={Heart} animate="pulse" />

// Interactive button
<InteractiveIcon icon={Heart} onClick={handleLike} />
```

Animation types:
- `spin` - Continuous rotation
- `bounce` - Bouncing motion
- `pulse` - Scale pulsing
- `rotate` - One-time rotation
- `scale` - Scale on appear

## 🔄 Loading States

**Location**: `src/components/ui/loading-spinner.tsx`

```tsx
import { LoadingSpinner, PulseLoader, Skeleton, ProgressBar } from "@/components/ui/loading-spinner"

// Spinning loader
<LoadingSpinner size="md" />

// Pulse dots
<PulseLoader />

// Skeleton for content
<Skeleton className="h-4 w-full" />

// Indeterminate progress
<ProgressBar />
```

## ⚡ Performance Tips

1. **Use CSS transforms**: All position/scale animations use `transform` for GPU acceleration
2. **Avoid layout thrashing**: Animations don't trigger reflows
3. **Will-change hints**: Critical animations use will-change optimization
4. **Reduced motion**: Respect user's motion preferences (consider adding):

```tsx
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🎯 Best Practices

1. **Consistency**: Use the predefined timing functions and durations
2. **Purpose**: Every animation should have a purpose (feedback, guidance, delight)
3. **Restraint**: Don't over-animate; subtlety is key
4. **Accessibility**: Ensure animations don't interfere with usability
5. **Testing**: Test on various devices and performance profiles

## 🔧 Customization

### Adding New Animations

1. Add keyframes to `tailwind.config.ts`:
```ts
keyframes: {
  "my-animation": {
    from: { /* ... */ },
    to: { /* ... */ },
  },
}
```

2. Add animation class:
```ts
animation: {
  "my-animation": "my-animation 0.3s ease-out",
}
```

3. Use in components:
```tsx
className="animate-my-animation"
```

### Creating Framer Motion Variants

Add to `src/lib/animations.ts`:

```ts
export const myVariants: Variants = {
  initial: { /* ... */ },
  animate: { /* ... */ },
  exit: { /* ... */ },
}
```

## 📱 Responsive Considerations

Animations are optimized for all screen sizes:
- Lighter animations on mobile to preserve battery
- Hover effects automatically disabled on touch devices
- Scale factors adjusted for smaller screens

## 🎉 Summary

Every interactive element now has premium microanimations:
- ✅ All buttons and interactive elements
- ✅ Form inputs and controls
- ✅ Navigation menus and dropdowns
- ✅ Modals, dialogs, and overlays
- ✅ Cards and content containers
- ✅ Loading states and feedback
- ✅ Page transitions
- ✅ Icons and visual elements

The result is a cohesive, luxurious user experience with subtle, performant animations throughout the application.
