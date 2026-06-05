import { HudFrame } from "@/components/hud-frame"
import { Hero } from "@/components/hero"
import { SectionPull } from "@/components/section-pull"
import { SectionSigns } from "@/components/section-signs"
import { SectionImmersion } from "@/components/section-immersion"
import { SectionToll } from "@/components/section-toll"
import { SectionRecovery } from "@/components/section-recovery"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="relative min-h-svh bg-background pb-10">
      <HudFrame />
      <Hero />
      <SectionPull />
      <SectionSigns />
      <SectionImmersion />
      <SectionToll />
      <SectionRecovery />
      <SiteFooter />
    </main>
  )
}
