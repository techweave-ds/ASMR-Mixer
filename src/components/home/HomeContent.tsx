"use client"

import dynamic from "next/dynamic"
import { ExperienceCards } from "@/components/home/ExperienceCards"
import { UseCasesSection } from "@/components/home/UseCasesSection"
import { StatsSection } from "@/components/home/StatsSection"
import { EnvironmentsCarousel } from "@/components/home/EnvironmentsCarousel"

const HeroOverlay = dynamic(() => import("@/components/hero/HeroOverlay").then((m) => ({ default: m.HeroOverlay })), { ssr: false })

export function HomeContent() {
  return (
    <div className="min-h-full">
      <HeroOverlay />
      <ExperienceCards />
      <UseCasesSection />
      <StatsSection />
      <EnvironmentsCarousel />
      {/* Bottom spacing */}
      <div className="h-12" />
    </div>
  )
}
