# Noctune --- Product Design Bible

# Volume 3 --- Screen Specifications (Part 2)

> Version: 1.0 Draft

------------------------------------------------------------------------

# 16. Profile Experience

## Goal

The Profile should feel like a personal listening studio, not an account
page.

## Layout

-   Hero banner
-   Avatar
-   Listening streak
-   Favorite environments
-   Saved mixes
-   Recently played
-   Achievements
-   Settings shortcut

## Requirements

-   Editable profile
-   Theme preference
-   Download statistics
-   Listening analytics
-   Premium status
-   Sync status

------------------------------------------------------------------------

# 17. Settings

Organize into clear sections:

## Appearance

-   Theme
-   Accent color (future)
-   Reduced motion
-   Font scaling

## Audio

-   Crossfade
-   Master volume
-   Fade-in/out duration
-   Output device
-   Normalize volume

## Playback

-   Autoplay
-   Loop
-   Default timer
-   Resume previous session

## Privacy

-   Analytics
-   Crash reports
-   Download management

------------------------------------------------------------------------

# 18. Premium

Never use aggressive upselling.

Explain value.

Include:

-   Unlimited downloads
-   Exclusive environments
-   Higher quality audio
-   Future AI features
-   Cross-device sync

CTA should appear only after value explanation.

------------------------------------------------------------------------

# 19. Onboarding

Maximum five screens.

1.  Welcome
2.  Choose goals
3.  Select favorite environments
4.  Audio preview
5.  Enter Noctune

Never require account creation before exploration.

------------------------------------------------------------------------

# 20. Notifications

Only meaningful notifications.

Examples:

-   Evening reminder
-   Continue your favorite mix
-   New environment available

Allow complete control.

------------------------------------------------------------------------

# 21. Audio UX

## Principles

Audio is the primary experience.

Rules:

-   No abrupt starts
-   Fade in 400--800ms
-   Fade out 600--1000ms
-   Crossfade between scenes
-   Gapless looping
-   Per-layer volume memory

------------------------------------------------------------------------

# 22. Visualizer

Keep subtle.

Never dominate the screen.

Use:

-   Soft waveform
-   Minimal equalizer
-   Ambient pulse
-   Reactive glow

------------------------------------------------------------------------

# 23. Micro Interactions

Buttons: - Scale 1.03 - Soft shadow

Cards: - Lift 6px - Image zoom 1.04

Player: - Progress animation - Gentle pulse on play

Navigation: - Active indicator slides - Hover highlight

------------------------------------------------------------------------

# 24. Responsive Rules

Desktop: Three-column layout.

Tablet: Collapse right panel.

Mobile: Bottom navigation. Fullscreen player. Stacked content.

Never simply scale desktop down.

------------------------------------------------------------------------

# 25. Accessibility

-   Full keyboard support
-   ARIA labels
-   High contrast mode
-   Reduced motion
-   Focus rings
-   Minimum 44px targets

------------------------------------------------------------------------

# 26. QA Checklist

Visual: - No overlap - No clipped text - No inconsistent spacing -
Images maintain aspect ratio

Functional: - Search works - Player persists - Mixer saves - Navigation
stable

Performance: - Lighthouse \>= 90 - 60 FPS target - No layout shift -
Lazy loading enabled

------------------------------------------------------------------------

# 27. Component Readiness Checklist

Every component must define:

-   Purpose
-   Props
-   States
-   Interaction
-   Accessibility
-   Responsive behavior
-   Error handling
-   Animation
-   Design token usage

------------------------------------------------------------------------

# 28. Definition of Done

A screen is complete only if:

-   Pixel-perfect implementation
-   Uses design system exclusively
-   Responsive
-   Accessible
-   Performance tested
-   Reviewed against Product Bible
-   No console errors
-   Ready for production

------------------------------------------------------------------------

# Next Volume

Volume 4 will cover:

-   React architecture
-   Folder structure
-   Component hierarchy
-   State management
-   API conventions
-   Audio engine architecture
-   Coding standards
-   Naming conventions
-   Testing strategy
-   CI/CD recommendations
-   Performance optimization
-   Deployment checklist

End of Volume 3.
