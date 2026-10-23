import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import {
  Search,
  Target,
  ClipboardList,
  Rocket,
  LineChart,
  type LucideIcon,
} from "lucide-react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  from: string;
  to: string;
  glow: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Understand",
    description: "Review your business, audience and marketing.",
    icon: Search,
    from: "from-primary",
    to: "to-primary",
    glow: "shadow-primary/30",
  },
  {
    number: "02",
    title: "Prioritise",
    description: "Identify agreed capability gaps.",
    icon: Target,
    from: "from-primary",
    to: "to-primary",
    glow: "shadow-primary/30",
  },
  {
    number: "03",
    title: "Plan",
    description: "Set activity, ownership and approvals.",
    icon: ClipboardList,
    from: "from-primary",
    to: "to-primary",
    glow: "shadow-primary/30",
  },
  {
    number: "04",
    title: "Execute",
    description: "Complete agreed work.",
    icon: Rocket,
    from: "from-primary",
    to: "to-primary/",
    glow: "shadow-primary/30",
  },
  {
    number: "05",
    title: "Review",
    description: "Assess performance and next steps.",
    icon: LineChart,
    from: "from-primary",
    to: "to-primary",
    glow: "shadow-primary/30",
  },
];

const ProcessTimeline = () => {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      {/* Decorative background — all in the theme's primary color, varied by size/opacity for depth */}
      <div className="absolute top-1/4 -right-24 w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/[0.07] rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/[0.05] rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollAnimation animation="fade-up">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              How the engagement works
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              One plan. Clear priorities. Consistent delivery.
            </h2>
          </div>
        </ScrollAnimation>

        {/* Steps with a connecting progress line running through the badges */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <ScrollAnimation
                  key={step.number}
                  animation="fade-up"
                  delay={index * 100}
                >
                  <div
                    className={`group relative h-full overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${step.glow}`}
                  >
                    {/* Top accent, fills in on hover, colored per step */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.from} ${step.to} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`}
                    />

                    {/* Faint tinted corner wash so each card reads its own color at rest */}
                    {/* <div
                      className={`absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br ${step.from} ${step.to} opacity-[0.07] group-hover:opacity-20 transition-opacity duration-500 bg-blue`}
                    /> */}

                    {/* Large ghost numeral — typographic marker unique to each card */}

                    {/* Icon badge, colored per step */}
                    <div className="relative z-10 mb-3">
                      <div
                        className={`w-10 h-10 shrink-0 rounded-full gradient-primary flex items-center justify-center shadow-md ${step.glow} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                      >
                        <Icon
                          className="w-4.5 h-4.5 text-white"
                          strokeWidth={2.25}
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="relative z-10 text-lg font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
