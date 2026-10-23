import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { FileText, Globe, Megaphone, Target } from "lucide-react";

const gaps = [
  {
    number: "01",
    title: "Marketing Strategy",
    description:
      "Set clear audiences, positioning, priorities, channels and measurement.",
    icon: Target,
    gradient: "from-primary/25 via-primary/8 to-transparent",
  },
  {
    number: "02",
    title: "Content Marketing",
    description:
      "Turn internal expertise into useful website, article, email and social content.",
    icon: FileText,
    gradient: "from-blue-400/25 via-primary/8 to-transparent",
  },
  {
    number: "03",
    title: "Digital Campaigns",
    description:
      "Connect the audience, message, landing experience, follow-up and tracking.",
    icon: Megaphone,
    gradient: "from-indigo-400/25 via-primary/8 to-transparent",
  },
  {
    number: "04",
    title: "Website and SEO",
    description:
      "Improve how people find, understand and move through priority pages.",
    icon: Globe,
    gradient: "from-violet-400/25 via-primary/8 to-transparent",
  },
];

const CapabilityGaps = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-blue-50/40 py-24 dark:from-primary/20 dark:via-background dark:to-blue-950/30">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollAnimation animation="fade-up">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
              Digital marketing services
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Support built around your capability gaps.
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose focused support or combine capabilities through a
              coordinated ongoing engagement.
            </p>
          </div>
        </ScrollAnimation>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-start lg:gap-6">
          {gaps.map((gap, index) => {
            const Icon = gap.icon;

            return (
              <ScrollAnimation
                key={gap.number}
                animation="fade-up"
                delay={index * 100}
              >
                <div
                  className={`group relative min-h-[270px] h-full overflow-hidden rounded-[1.75rem] border border-primary/10 bg-card p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/25 hover:shadow-xl lg:min-h-[290px] `}
                >
                  {/* Soft colour field keeps the visual weight on the card's right side. */}
                  {/* <div className="absolute top-0 left-0 right-0 h-1 gradient-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />

                <div
                  className={`absolute inset-y-0 right-0 w-[56%] bg-gradient-to-t ${gap.gradient} opacity-90 transition-all duration-500 group-hover:w-[64%] group-hover:opacity-100`}
                  aria-hidden="true"
                /> */}
                  {/* <div
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/[0.06] blur-3xl transition-transform duration-700 group-hover:scale-125"
                  aria-hidden="true"
                /> */}

                  {/* Number */}
                  {/* <span className="absolute right-5 top-5 font-display text-7xl font-bold leading-none text-primary/[0.13] transition-all duration-500 group-hover:scale-110 group-hover:text-primary/[0.2]">
                  {gap.number}
                </span> */}

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground transition-all duration-300 group-hover:shadow-glow group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* <span className="mb-auto text-[0.68rem] font-bold uppercase tracking-[0.22em] text-primary/70">
                    Capability {gap.number}
                  </span> */}

                    {/* Title */}
                    <div className="max-w-full">
                      <h3 className="text-2xl font-display font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                        {gap.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="mt-3 w-full text-muted-foreground  md:text-lg mb-4">
                        {gap.description}
                      </p>
                    </div>

                    <div className="mt-6 h-px w-12 bg-primary/40 transition-all duration-500 group-hover:w-20" />
                  </div>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CapabilityGaps;
