# Noctune --- Product Design Bible

# Volume 3 --- Screen Specifications (Part 1)

> Version 1.0 Draft

------------------------------------------------------------------------

# Purpose

This volume defines the behavior, layout, interactions, and acceptance
criteria for every primary screen in Noctune.

Every screen must feel like part of one cohesive product.

------------------------------------------------------------------------

# 1. Global Screen Rules

-   Desktop-first.
-   Never use centered website containers.
-   Every page fills the viewport.
-   Persistent sidebar.
-   Persistent bottom player.
-   Consistent 12-column grid.
-   8px spacing system only.
-   One visual focal point per screen.

------------------------------------------------------------------------

# 2. Home Screen

## Objective

The Home screen should inspire exploration before asking the user to
interact.

Users should feel relaxed within the first five seconds.

## Layout

-   Persistent left navigation
-   Top utility bar
-   Full-screen Hero
-   Emotional transition into content
-   Curated collections
-   Continue listening
-   Popular environments
-   Featured mixes
-   Footer

------------------------------------------------------------------------

# 3. Hero Experience

## Height

100vh minimum.

## Structure

Navigation

↓

Immersive environment

↓

Headline

↓

Supporting copy

↓

Primary CTA

↓

Secondary CTA

↓

Floating Explore Button

↓

Scroll indicator

## Hero Requirements

-   Cinematic environment
-   Interactive ambient scene
-   Slow parallax
-   Mouse-responsive camera
-   Animated fog
-   Fireflies
-   Dynamic weather
-   Gentle particles
-   Smooth scene transitions

------------------------------------------------------------------------

# 4. Hero Messaging

Primary headline:

Short.

Emotional.

Examples:

-   Escape the Noise.
-   Find Your Quiet.
-   Listen Beyond Music.

Supporting copy should describe a feeling, not features.

------------------------------------------------------------------------

# 5. Persistent Explore Button

Always visible.

Desktop:

Bottom-right floating pill.

Behavior:

-   Enlarged on Hero.
-   Shrinks after scroll.
-   Expands on hover.
-   Never obstructs content.

------------------------------------------------------------------------

# 6. Explore Screen

Purpose:

Help users discover environments naturally.

Sections:

-   Search
-   Categories
-   Trending
-   New arrivals
-   Recommended
-   Featured collections

Every category includes:

-   Cover image
-   Short description
-   Preview button
-   Favorite
-   Duration

------------------------------------------------------------------------

# 7. Environment Detail Page

Contains:

-   Large hero artwork
-   Environment description
-   Sound layers
-   Preview
-   Add to mixer
-   Related environments
-   Similar moods

------------------------------------------------------------------------

# 8. Sound Cards

Every card contains:

-   Artwork
-   Title
-   Category
-   Duration
-   Favorite
-   Play
-   Hover animation
-   Waveform

Hover behavior:

-   Lift
-   Slight zoom
-   Show play button
-   Increase shadow
-   Smooth transition

------------------------------------------------------------------------

# 9. Collections

Large landscape cards.

Display:

-   Title
-   Mood
-   Number of sounds
-   Estimated duration
-   Save
-   Share

------------------------------------------------------------------------

# 10. Mixer Screen

Purpose:

Build custom soundscapes.

Layout:

Left:

Available sounds.

Center:

Active sound layers.

Right:

Master controls.

Capabilities:

-   Drag reorder
-   Volume per layer
-   Solo
-   Mute
-   Remove
-   Save mix

------------------------------------------------------------------------

# 11. Bottom Player

Persistent.

Contains:

-   Artwork
-   Current title
-   Category
-   Shuffle
-   Previous
-   Play/Pause
-   Next
-   Repeat
-   Timeline
-   Volume
-   Queue
-   Devices

Never hide on desktop.

------------------------------------------------------------------------

# 12. Search

Features:

-   Instant search
-   Recent searches
-   Trending
-   Keyboard shortcut
-   Search by mood
-   Search by environment

------------------------------------------------------------------------

# 13. Empty States

Every screen requires:

-   Empty
-   Loading
-   Error
-   Offline

Each should include:

-   Illustration
-   Helpful message
-   Primary action

------------------------------------------------------------------------

# 14. Motion

Cards:

180ms lift.

Sections:

Fade + translate.

Hero:

Parallax.

Player:

Animated progress.

Buttons:

Scale 1.03.

------------------------------------------------------------------------

# 15. Acceptance Criteria

Before implementation is complete:

-   No overlaps
-   Pixel-perfect alignment
-   Hero occupies full viewport
-   Explore button always accessible
-   Cards align perfectly
-   Player remains visible
-   Scroll transitions are smooth
-   Responsive behavior verified
-   Consistent spacing
-   Consistent typography
-   No layout shifts

------------------------------------------------------------------------

End of Volume 3 (Part 1)

Next document:

Volume 3 Part 2 will specify Profile, Settings, Premium, Onboarding,
Notifications, Authentication, Audio UX, Visualizer System,
Micro-interactions, and complete component-level behavior.
