import { ArrowRight, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./shared";
import { TASK_COUNT } from "./data";

export function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">How it works</p>
        <h2 className="text-2xl md:text-3xl text-foreground">Three steps, then your result</h2>
        <p className="max-w-2xl text-muted-foreground">
          For each task, tell us who does it today. If it's you, estimate the hours a week. Your answers
          stay in this browser unless you choose to email yourself the plan.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { role: "pp" as const, Icon: FileText, title: "Step 1: Paraplanning", text: "Research, modelling and writing SoAs and RoAs." },
          { role: "cso" as const, Icon: Users, title: "Steps 2 and 3: Client support", text: "Reviews, implementation, records and admin." },
        ].map(({ role, Icon, title, text }) => (
          <div key={role} className="grid gap-3 rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <RoleBadge role={role} />
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-1.5 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Example result</span>
        <span className="font-display text-xl font-bold text-foreground">
          5 hrs paraplanning , 9 hrs client support
        </span>
        <span className="text-sm text-muted-foreground">
          Each role sized on its own, with the tasks to hand off first. Your emailed plan adds a cost
          comparison and a recommendation for each role.
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <span className="text-sm text-muted-foreground">{TASK_COUNT} tasks about 5 minutes</span>
        <Button onClick={onStart} size="lg">
          Start the audit
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
