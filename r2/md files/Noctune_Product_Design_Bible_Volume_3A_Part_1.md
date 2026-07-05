# Noctune --- Product Design Bible

# Volume 3A --- Component Library (Part 1)

> Official UI Component Specification

------------------------------------------------------------------------

# Purpose

This document defines the canonical behavior of every reusable
component.

No component may be created outside this specification.

------------------------------------------------------------------------

# Universal Component Rules

Every component MUST define:

-   Purpose
-   Anatomy
-   Size variants
-   States
-   Design tokens
-   Accessibility
-   Keyboard behavior
-   Motion
-   Error handling
-   Responsive rules
-   Performance expectations

------------------------------------------------------------------------

# Button Component

## Purpose

Primary user action.

## Variants

-   Primary
-   Secondary
-   Ghost
-   Glass
-   Destructive
-   Icon-only

## Sizes

-   XS 32px
-   S 40px
-   M 48px
-   L 56px

## States

Default

Hover

Pressed

Focused

Disabled

Loading

Success

## Hover

-   Elevation +1
-   Scale 1.02
-   Shadow increases
-   Transition 180ms

Never animate color only.

------------------------------------------------------------------------

# Icon Button

Minimum touch target

44x44px

Icons

20px

Never mix icon libraries.

Use Lucide consistently.

------------------------------------------------------------------------

# Search Bar

Desktop width

560--720px

Height

52px

Radius

26px

Contains

Search icon

Input

Clear

Shortcut hint

Voice placeholder

States

Default

Focused

Typing

Loading

No results

------------------------------------------------------------------------

# Card Component

Types

-   Environment
-   Collection
-   Feature
-   Statistics
-   Profile
-   Premium

Rules

24px radius

24px padding

Glass surface

Hover lift

Image never stretches.

------------------------------------------------------------------------

# Environment Card

Includes

Artwork

Title

Mood

Duration

Play

Favorite

Waveform

Hover

Artwork zoom

Play appears

Shadow deepens

------------------------------------------------------------------------

# Player Component

Persistent

92px

Three sections

Left

Current playback

Center

Controls

Right

Volume

Queue

Devices

Never collapses on desktop.

------------------------------------------------------------------------

# Sidebar

Width

280px

Contains

Brand

Navigation

Library

Premium

Profile

Settings

Uses sticky positioning.

------------------------------------------------------------------------

# Modal

Max width

640px

Backdrop blur

16px

Escape closes

Focus trapped

------------------------------------------------------------------------

# Tooltip

Delay

300ms

Never blocks interaction.

------------------------------------------------------------------------

# Slider

Used for

Volume

Brightness

Opacity

Supports keyboard arrows.

------------------------------------------------------------------------

# Toggle

Animated thumb

200ms

Accessible labels required.

------------------------------------------------------------------------

# Empty State

Every empty state contains

Illustration

Title

Helpful description

Primary action

------------------------------------------------------------------------

# Loading Skeleton

Mirror final layout.

No spinner-only loading.

------------------------------------------------------------------------

# Error State

Friendly language.

Retry button.

Diagnostic logging.

------------------------------------------------------------------------

# Component Acceptance Checklist

Every component must:

-   Use design tokens
-   Support keyboard
-   Support dark mode
-   Animate smoothly
-   Pass accessibility checks
-   Render consistently
-   Be reusable
-   Have no layout shift

------------------------------------------------------------------------

End of Volume 3A Part 1

Next: Inputs, dropdowns, tabs, chips, accordions, drawers, carousels,
notifications, visualizers, audio controls and advanced interaction
patterns.
