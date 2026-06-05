import { Reveal } from "@/components/anim"

const resources = [
  { label: "Find a therapist", note: "Directory of clinicians experienced with behavioral addiction." },
  { label: "Support groups", note: "Peer communities for gamers and the people who love them." },
  { label: "For parents", note: "How to talk to a child or teen without pushing them away." },
  { label: "Crisis help", note: "If you or someone is in danger, contact local emergency services." },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/15 px-5 pb-20 pt-20 md:px-6">
      <Reveal className="grid gap-px border border-foreground/15 bg-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((r) => (
          <a
            key={r.label}
            href="#top"
            className="group bg-background p-7 transition-colors hover:bg-foreground hover:text-background"
          >
            <div className="hud mb-6 flex items-center justify-between text-muted-foreground group-hover:text-background/60">
              <span>RESOURCE</span>
              <span aria-hidden>↗</span>
            </div>
            <h4 className="display text-xl">{r.label}</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground group-hover:text-background/80">
              {r.note}
            </p>
          </a>
        ))}
      </Reveal>

      <div className="mt-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div>
          <div className="display text-5xl text-foreground md:text-7xl">
            RECLAIM<span className="text-signal">®</span>
          </div>
          <p className="hud mt-4 text-muted-foreground">
            © {new Date().getFullYear()} — A GAMING ADDICTION AWARENESS PROJECT
          </p>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
          This page is an awareness resource, not medical advice. If gaming is
          harming your life or someone else&apos;s, please reach out to a
          qualified professional.
        </p>
      </div>
    </footer>
  )
}
