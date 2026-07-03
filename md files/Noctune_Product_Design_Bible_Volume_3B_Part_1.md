# Noctune --- Product Design Bible

# Volume 3B --- Motion & Interaction Bible (Part 1)

> Version 1.0

------------------------------------------------------------------------

# Purpose

Motion in Noctune is not decoration.

Motion is communication.

Every animation must reduce cognitive load, reinforce hierarchy, and
create a sense of calm.

Users should notice the feeling created by motion, not the motion
itself.

------------------------------------------------------------------------

# Motion Philosophy

Animations should feel:

-   Calm
-   Organic
-   Predictable
-   Purposeful
-   Soft
-   Elegant

Never feel:

-   Flashy
-   Bouncy
-   Aggressive
-   Game-like
-   Distracting

------------------------------------------------------------------------

# Motion Tokens

## Hover

Duration: 180ms

## Click

120ms

## Section Transition

350ms

## Hero Scene Transition

1200--1800ms

## Modal

220ms

## Drawer

260ms

## Toast

200ms

------------------------------------------------------------------------

# Easing

Default: ease-in-out

Large transitions: Spring

Never use linear motion.

------------------------------------------------------------------------

# Hero Entrance

When application opens:

1.  Fade in background.
2.  Slowly reveal fog.
3.  Animate distant lighting.
4.  Fade typography.
5.  Reveal CTA.
6.  Display floating Explore button.
7.  Begin subtle environment movement.

Total entrance time: 2.5--3.5 seconds.

------------------------------------------------------------------------

# Mouse Interaction

Cursor movement should create gentle parallax.

Foreground: Highest movement.

Midground: Moderate movement.

Background: Minimal movement.

Maximum movement: 12px.

Never induce motion sickness.

------------------------------------------------------------------------

# Scroll Choreography

Each section owns its animation.

Sequence:

Hero fades

↓

Headline exits

↓

Background scales slightly

↓

Content enters

↓

Previous section fully releases

No overlapping timelines.

------------------------------------------------------------------------

# Button Motion

Hover: Scale 1.02

Shadow increases

Glow intensifies

Pressed: Scale 0.98

Release: Spring return

------------------------------------------------------------------------

# Card Motion

Hover:

-   Lift 6px
-   Scale 1.01
-   Image zoom 1.03
-   Play icon fades in
-   Shadow deepens

Duration: 180ms

------------------------------------------------------------------------

# Sidebar Motion

Navigation indicator slides.

Icons subtly brighten.

Active section glows.

Sidebar never shifts width.

------------------------------------------------------------------------

# Player Motion

Play:

Artwork pulses gently.

Waveform animates.

Progress bar begins moving.

Pause:

Pulse stops.

Waveform freezes gracefully.

------------------------------------------------------------------------

# Search Motion

Focus:

Expand shadow.

Placeholder fades.

Cursor becomes prominent.

Results appear with stagger.

------------------------------------------------------------------------

# Floating Explore Button

Hero:

Large pill.

Scroll:

Shrinks smoothly.

Hover:

Expands.

Icon rotates 8°.

Never disappear.

------------------------------------------------------------------------

# Audio Synchronization

Visual changes should align with audio.

Rain begins

↓

Rain particles appear

↓

Waveform reacts

↓

Environment darkens

Everything fades smoothly.

------------------------------------------------------------------------

# Accessibility

Reduced Motion:

Disable:

Parallax

Large transitions

Continuous particles

Keep:

Opacity fades

Focus transitions

Navigation cues

------------------------------------------------------------------------

# Motion QA Checklist

Every animation must answer:

Does it communicate?

Does it improve clarity?

Does it feel calm?

Does it affect performance?

Can it be disabled?

------------------------------------------------------------------------

# Definition of Motion Completion

Motion is complete only when:

-   Runs at 60 FPS
-   No layout shifts
-   Uses official motion tokens
-   Accessible
-   Consistent
-   Performance tested

------------------------------------------------------------------------

End of Volume 3B Part 1

Next: Volume 3B Part 2 will define page transitions, cursor system, 3D
interaction rules, environmental choreography, audio-reactive visuals,
scroll storytelling, animation sequencing, and performance budgets.
