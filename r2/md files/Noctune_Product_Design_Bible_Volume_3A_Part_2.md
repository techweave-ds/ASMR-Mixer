# Noctune --- Product Design Bible

# Volume 3A --- Component Library (Part 2)

> Official Component Specification

------------------------------------------------------------------------

# Purpose

This volume continues the canonical specification for every reusable UI
component. Components must be predictable, accessible, responsive, and
consistent with the Noctune design system.

------------------------------------------------------------------------

# Text Input

## Purpose

Collect short user input with minimal distraction.

## Variants

-   Standard
-   Search
-   Password
-   Read-only
-   Error
-   Success

## Specifications

-   Height: 48px
-   Radius: 16px
-   Horizontal padding: 16px
-   Label always visible
-   Helper text below input
-   Error message replaces helper text

## States

-   Default
-   Hover
-   Focus
-   Filled
-   Disabled
-   Error
-   Success

Keyboard: - Tab navigation - Escape clears search inputs - Enter submits
when appropriate

------------------------------------------------------------------------

# Dropdown

## Requirements

-   Width matches trigger
-   Keyboard accessible
-   Searchable when \>10 items
-   Closes on Escape
-   Supports arrow-key navigation

Never cover important content.

------------------------------------------------------------------------

# Tabs

Use tabs only when switching related content.

Variants:

-   Underline
-   Pill
-   Segmented

Animated active indicator.

------------------------------------------------------------------------

# Chips

Purpose:

Quick filtering.

Examples:

Rain

Forest

Focus

Sleep

Selected chips must remain visually obvious.

------------------------------------------------------------------------

# Accordion

Used for:

-   FAQ
-   Advanced settings
-   Help

Only one section expanded by default unless multi-expand is explicitly
enabled.

------------------------------------------------------------------------

# Drawer

Slides from:

-   Right
-   Bottom (mobile)

Uses backdrop blur.

Supports swipe-to-close on touch devices.

------------------------------------------------------------------------

# Carousel

Use for:

-   Featured environments
-   Collections
-   Recently played

Requirements:

-   Mouse wheel support
-   Keyboard support
-   Drag support
-   Snap scrolling

------------------------------------------------------------------------

# Toast Notifications

Types:

-   Success
-   Error
-   Warning
-   Information

Duration:

4 seconds default

Action button optional.

Never block user interaction.

------------------------------------------------------------------------

# Dialog

Use only for critical actions.

Must include:

-   Title
-   Description
-   Primary action
-   Secondary action

Never more than two primary choices.

------------------------------------------------------------------------

# Progress Indicators

Use determinate progress whenever possible.

Indeterminate only for unknown durations.

Skeletons are preferred over spinners.

------------------------------------------------------------------------

# Audio Controls

Every audio control must support:

-   Mouse
-   Keyboard
-   Touch

Volume slider remembers previous value.

Mute preserves previous volume.

------------------------------------------------------------------------

# Queue Panel

Contains:

-   Upcoming sounds
-   Drag reorder
-   Remove
-   Duplicate
-   Save queue

------------------------------------------------------------------------

# Waveform

Purpose:

Visual feedback only.

Never distract from listening.

Frame rate should remain smooth while minimizing CPU usage.

------------------------------------------------------------------------

# Visualizer

Modes:

-   Minimal
-   Ambient
-   Wave
-   Pulse

Visualizer must automatically reduce intensity when Reduced Motion is
enabled.

------------------------------------------------------------------------

# Notification Center

Groups notifications by day.

Supports:

-   Mark all read
-   Clear all
-   Open related content

------------------------------------------------------------------------

# Context Menu

Use native interaction patterns.

Right-click on desktop.

Long press on touch devices.

------------------------------------------------------------------------

# Keyboard Shortcuts

Ctrl/Cmd + K : Search

Space : Play/Pause

M : Mute

F : Favorite

Esc : Close overlays

? : Shortcut help

------------------------------------------------------------------------

# Component Review Checklist

Every component must pass:

-   Accessibility review
-   Motion review
-   Responsive review
-   Performance review
-   Visual consistency review
-   Keyboard navigation review
-   Screen reader review

------------------------------------------------------------------------

# Definition of Component Completion

A component is complete only when:

-   Uses official design tokens
-   Has documented API
-   Has documented states
-   Includes loading and error behavior
-   Works across supported viewports
-   Meets accessibility standards
-   Has visual regression approval

------------------------------------------------------------------------

End of Volume 3A Part 2

Next: Volume 3B --- Motion & Interaction Bible.
