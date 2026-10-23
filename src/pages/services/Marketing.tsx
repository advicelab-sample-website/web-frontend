import React, { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import Seo from "@/components/ui/Seo";
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { ContactPopup } from "@/components/ui/ContactPopup";
import { PricingCalculatorCTA } from "@/components/services/PricingCalculatorCTA";
import newCastleEmpoweredWealth from "@/assets/CLImg/new-castle-empowered-wealth.webp";
import abacusWealthSolution from "@/assets/CLImg/abacus-wealth-solution.webp";
import accountplan from "@/assets/CLImg/accountplan.webp";
import atlasWealthAdvisory from "@/assets/CLImg/atlas-wealth-advisory.webp";
import {
  Target,
  Image,
  Monitor,
  FileText,
  Search,
  Users,
  Mail,
  Megaphone,
  Calculator,
  Home,
  BookOpen,
  ShieldCheck,
  Globe,
  Share2,
  MessageSquare,
  Handshake,
  BadgeDollarSign,
  CheckCircle,
} from "lucide-react";
import CapabilityGaps from "@/components/ui/CapabilityGaps";
import ProcessTimeline from "@/components/ui/ProcessTimeline";
import CtaSection from "@/components/ui/CtaSection";

const items = [
  {
    title: "Set Clear Marketing Priorities and Direction",
    summary:
      "Replace disconnected activity with a practical direction shaped around your audience, services and business priorities.",
    points: [
      "Clarify the audiences, services and messages your marketing should focus on.",
      "Prioritise channels and campaigns relevant to agreed business goals.",
      "Give internal team members and external suppliers one roadmap to follow.",
    ],
  },
  {
    title: "Turn Marketing Plans Into Consistent Delivery",
    summary:
      "Keep agreed content, campaigns and website priorities moving when client work demands attention.",
    points: [
      "Maintain a consistent flow of useful content across agreed channels.",
      "Move campaigns from planning to launch through a coordinated process.",
      "Reduce delays caused by unclear briefs, scattered feedback and competing priorities.",
    ],
  },
  {
    title: "Bring Your Marketing Team and Suppliers Together",
    summary:
      "Create clear ownership across your internal team, Advice Lab and existing suppliers involved in the engagement.",
    points: [
      "Define ownership for strategy, production, approval, publishing and reporting.",
      "Reduce time spent coordinating separate providers.",
      "Keep messaging aligned across content, campaigns and website work.",
    ],
  },
  {
    title: "Build Digital Marketing Support Around Your Capability Gaps",
    summary:
      "Use focused capability support or coordinated ongoing digital marketing support based on what your business already has in place.",
    points: [
      "Add strategic marketing direction without immediately expanding your internal team.",
      "Access the content, campaign, website and SEO support agreed in your engagement.",
      "Adjust the level of support as priorities and internal capacity change.",
    ],
  },
];

const engagementFeatures = [
  {
    title: "Clear priorities and marketing roadmaps",
    description:
      "Know what to focus on next with a practical direction connected to your business goals.",
    icon: Target,
    highlight: "Direction",
  },
  {
    title: "Defined responsibilities and approval steps",
    description:
      "Make ownership clear across your team, Advice Lab and the suppliers supporting your marketing.",
    icon: Handshake,
    highlight: "Alignment",
  },
  {
    title: "Content and campaigns linked to agreed goals",
    description:
      "Keep content and campaigns working together to build visibility, trust and enquiries.",
    icon: Megaphone,
    highlight: "Execution",
  },
  {
    title: "Reporting and next-step recommendations",
    description:
      "Review what is working and turn useful insights into clear actions for the next stage.",
    icon: Search,
    highlight: "Improvement",
  },
];

const Marketing = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  const handleClick = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);
  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
    setOpenIndex(index);
  };
  const handleMouseLeave = () => {
    setHoverIndex(null);
    setOpenIndex(null);
  };
  const audiences = [
    {
      category: "Financial Advice",
      title: "Financial Advice Practices",
      description:
        "Build a digital presence that communicates your advice, values and client experience with clarity.",
      icon: Users,
      accent: "border-l-primary bg-primary/5",
    },
    {
      category: "Accounting",
      title: "Accounting Businesses",
      description:
        "Showcase your expertise and make it easier for the right clients to understand and choose your services.",
      icon: Calculator,
      accent: "border-l-amber-500 bg-amber-500/5",
    },
    {
      category: "Mortgage Broking",
      title: "Mortgage Brokers",
      description:
        "Create confidence with borrowers and referral partners through consistent, credible communication.",
      icon: Home,
      accent: "border-l-sky-500 bg-sky-500/5",
    },
  ];

  return (
    <Layout>
      <Seo
        title="Expert Paraplanning Services for Financial Advisers"
        description="Professional paraplanning support: SOA preparation, client file management, compliance documentation & portfolio reviews. Scale your practice with our experts."
        keywords="paraplanning services, statement of advice preparation, financial planning support, client file management, portfolio review services, compliance documentation, SOA preparation, financial adviser support, paraplanning outsourcing"
        pathname="/services/paraplanning"
        schemaData={{
          "@type": "LocalBusiness",
          name: "Advice Lab Paraplanning Services",
          description:
            "Expert paraplanning services for financial advisers including SOA preparation and compliance documentation",
          url: "https://advicelab.com.au/services/paraplanning",
        }}
      />

      {/* Hero section */}
      <section className="relative overflow-hidden gradient-primary text-white">
        <div className="pointer-events-none absolute inset-0 bg-primary-dark/15" />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[34rem] w-[34rem] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-56 -left-40 h-[28rem] w-[28rem] rounded-full border border-white/5" />

        <div className="container relative z-10 mx-auto flex min-h-[580px] items-center justify-center px-4 py-16 lg:px-8">
          <ScrollAnimation
            animation="fade-up"
            className="w-full max-w-5xl text-center"
          >
            <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
              <span className="block">A Digital Marketing Team Built For</span>
              <span className="block">Australian Financial Businesses</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
              Access ongoing digital marketing strategy and execution without
              adding every capability in-house.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                variant="white"
                size="lg"
                onClick={() => setIsContactPopupOpen(true)}
              >
                Talk to us about your marketing gaps
              </Button>
              <Button
                variant="heroOutline"
                size="lg"
                onClick={() => {
                  const element = document.getElementById("digital-services");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                Explore digital marketing services
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* second section */}
      <section
        id="services"
        className="relative overflow-hidden bg-background py-24"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="absolute top-1/4 -right-24 w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/[0.07] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/[0.05] rounded-full blur-3xl" />

          <ScrollAnimation
            animation="fade-up"
            className="w-full text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
              Marketing Support
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Keep marketing moving
              <br />
              when client work comes first.
            </h2>
            <p className="text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Explore how coordinated digital marketing support can create
              clearer direction, stronger execution and more consistent
              accountability.
            </p>
          </ScrollAnimation>

          <div className="mx-auto">
            <div className="space-y-4">
              {items.map((item, index) => (
                <ScrollAnimation
                  key={item.title}
                  animation="fade-up"
                  delay={index * 120}
                >
                  <div
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Gradient accent bar */}
                    <div className="h-1 w-0 bg-gradient-to-r from-primary to-blue-600 group-hover:w-full transition-all duration-500" />

                    <div className="px-8">
                      <div
                        className="text-left text-lg md:text-xl font-display font-bold py-6 hover:text-primary transition-colors cursor-pointer select-none flex items-start gap-4 pr-4"
                        onClick={() => handleClick(index)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:from-primary/20 group-hover:to-blue-600/20 transition-colors">
                          <span className="text-sm font-bold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <span>{item.title}</span>
                      </div>

                      {/* Smooth expand/collapse */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          openIndex === index
                            ? "max-h-[1000px] opacity-100 py-8 space-y-6"
                            : "max-h-0 opacity-0 py-0"
                        }`}
                        style={{
                          transitionProperty: "max-height, opacity, padding",
                        }}
                      >
                        <p className="text-muted-foreground leading-relaxed">
                          {item.summary}
                        </p>

                        <div className="rounded-xl border border-primary/10 bg-primary/5 p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-[5px] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-wide text-primary">
                              How this helps you
                            </p>
                          </div>
                          <ul className="space-y-3">
                            {item.points.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-blue-600 mt-2 flex-shrink-0" />
                                <span className="text-sm text-foreground leading-relaxed">
                                  {point}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* third section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-blue-50/40 py-24 dark:from-primary/20 dark:via-background dark:to-blue-950/30">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollAnimation animation="fade-up" className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
              Who We Support
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Digital marketing for <br />
              Australian financial businesses.
            </h2>
          </ScrollAnimation>

          <div className="grid gap-6 md:grid-cols-3">
            {audiences.map((audience, index) => (
              <ScrollAnimation
                key={audience.title}
                animation="fade-up"
                delay={index * 100}
              >
                <div className="group relative min-h-[260px] h-full overflow-hidden rounded-[1.75rem] border border-border bg-card/85 p-8 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10">
                  {/* <div
                    className={`absolute inset-y-0 right-0 w-[58%] bg-gradient-to-t ${index === 0 ? "from-primary/1 via-primary/8" : index === 1 ? "from-primary/1 via-primary/8" : "from-primary/1 via-primary/8"} to-transparent opacity-90 transition-all duration-500 group-hover:w-[68%] group-hover:opacity-100`}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-primary/[0.06] blur-3xl transition-transform duration-700 group-hover:scale-125"
                    aria-hidden="true"
                  /> */}

                  {/* <span className="absolute right-6 top-5 font-display text-8xl font-bold leading-none text-primary/[0.12] transition-all duration-500 group-hover:scale-110 group-hover:text-primary/[0.2]">
                    {String(index + 1).padStart(2, "0")}
                  </span> */}

                  <div className="relative z-10 flex h-full flex-col">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">
                      {audience.category}
                    </p>

                    <div className="mt-4">
                      <div className="max-w-[25rem]">
                        <h3 className="min-h-[3.5rem] text-2xl font-display font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                          {audience.title}
                        </h3>

                        <p className="min-h-[4.5rem] w-full text-muted-foreground  md:text-lg mb-4">
                          {audience.description}
                        </p>

                        <div className="mt-6 h-px w-10 bg-primary/40 transition-all duration-500 group-hover:w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="relative bg-background py-20 sm:py-10">
        <div className="absolute top-1/4 -right-24 w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/[0.07] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/[0.05] rounded-full blur-3xl" />

        <div className="container mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <ScrollAnimation animation="fade-up">
              <div className="text-left">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
                  Connected Engagement
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                  Strategy that leads to practical execution.
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Advice Lab provides coordinated digital marketing support
                  shaped around agreed priorities, working alongside your
                  internal team and existing suppliers.
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-left" delay={200}>
              <div className="space-y-3">
                {engagementFeatures.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="group rounded-xl border border-border bg-card p-5 shadow-md transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-blue-600/10 text-primary transition-colors group-hover:from-primary/20 group-hover:to-blue-600/20">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-foreground">
                              {feature.title}
                            </h4>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {feature.highlight}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <section id="digital-services">
        <CapabilityGaps />
      </section>

      <ProcessTimeline />

      <CtaSection />

      <ContactPopup
        open={isContactPopupOpen}
        onOpenChange={setIsContactPopupOpen}
        title="Digital Marketing Support Designed for You"
        description="Tell us where your marketing needs support, and we'll help you map out the right next steps."
      />
    </Layout>
  );
};

export default Marketing;
