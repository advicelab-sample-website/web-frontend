import { useState } from "react";
import { ArrowUpRight, Check, Circle, Sparkles } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { ContactPopup } from "@/components/ui/ContactPopup";
import { Button } from "./button";

const highlights = [
  "20-minute, no-obligation conversation",
  "We map your current capability gaps",
  "Walk away with a clear next step",
];

const CtaSection = () => {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-dark py-24 md:py-28">
      <style>{`
        .cta-grid {
          background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent);
        }
      `}</style>

      <div className="cta-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 text-[18rem] font-display font-bold leading-none text-white/[0.04] lg:block">
        /
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Text side */}
          <ScrollAnimation animation="fade-right">
            <div className="max-w-xl">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-white/80" />
                Start with the gap
              </span>
              <h2 className="mb-5 text-3xl font-display font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                Marketing keeps slipping. It does not have to.
              </h2>
              <p className="max-w-lg text-lg leading-relaxed text-white/80">
                Tell us what is holding your marketing back. We will help
                identify the priorities and support your business needs.
              </p>
              {/* <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-white/70">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Clear direction
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  Practical support
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  Measurable progress
                </span>
              </div> */}
            </div>
          </ScrollAnimation>

          {/* Card side */}
          <ScrollAnimation animation="fade-left" delay={150}>
            <div className="rounded-2xl border border-white/20 bg-white p-7 shadow-2xl md:p-8">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-lg font-display font-bold text-foreground">
                    A useful first conversation
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Leave with a clearer next step.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  20 min
                </span>
              </div>

              <ul className="mb-8 space-y-5">
                {highlights.map((item, index) => (
                  <li key={item} className="relative flex items-start gap-3">
                    {index < highlights.length - 1 && (
                      <span className="absolute left-[0.6rem] top-6 h-6 w-px bg-primary/15" />
                    )}
                    <span className="relative mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="w-full h-14 gradient-primary text-primary-foreground hover:opacity-90 font-semibold rounded-xl group shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl"
                onClick={() => setIsContactPopupOpen(true)}
              >
                Talk to us about your marketing gaps
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </div>
      <ContactPopup
        open={isContactPopupOpen}
        onOpenChange={setIsContactPopupOpen}
        title="Digital Marketing Support Designed for You"
        description="Tell us where your marketing needs support, and we'll help you map out the right next steps."
      />
    </section>
  );
};

export default CtaSection;
