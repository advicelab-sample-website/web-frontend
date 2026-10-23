import { useEffect, useRef } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import useDelegationStore from "@/store/useDelegationStore";
import {
  API_ROLE_BY_ROLE_KEY,
  ROLE_KEY_BY_API_ROLE,
  type DelegationAuditResult,
  type RoleAuditResult,
} from "@/store/delegationAuditApi";
import { aud, digits, hrs, num, plural } from "./format";
import {
  ANNUAL_LEAVE_WEEKS,
  FULL_TIME_HOURS,
  PERSONAL_LEAVE_DAYS,
  ROLES,
  ROLE_STYLES,
  SOURCES,
  STATE_CODES,
  type RoleKey,
  type StateCode,
} from "./data";
import { PlanForm } from "./PlanForm";
import { RoleBadge, SourceRef, track } from "./shared";
import { useDelegationAudit, useHasOwnTasks } from "./useDelegationAudit";

const ROLE_KEYS: RoleKey[] = ["pp", "cso"];

const roleResultFor = (audit: DelegationAuditResult, role: RoleKey) =>
  audit.roles[API_ROLE_BY_ROLE_KEY[role]];

function RoleCard({
  role,
  roleResult,
}: {
  role: RoleKey;
  roleResult: RoleAuditResult;
}) {
  const styles = ROLE_STYLES[role];
  const sharePercent = roleResult.fullTimeWeekSharePercent;

  return (
    <div
      className={cn(
        "grid min-w-0 content-start gap-3 rounded-xl border border-border border-t-4 bg-card p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        styles.accent,
      )}
    >
      <RoleBadge role={role} />
      <p
        className={cn(
          "font-display text-3xl font-bold tabular-nums",
          styles.text,
        )}
      >
        {hrs(roleResult.hours)}
        <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">
          a week
        </span>
      </p>
      {!roleResult.hasWorkload ? (
        <p className="text-sm text-muted-foreground">
          You don't do any {ROLES[role].name.toLowerCase()} tasks yourself.
          Nothing to hand off here.
        </p>
      ) : (
        <>
          <div
            className="h-3 overflow-hidden rounded-full bg-secondary"
            role="img"
            aria-label={`${sharePercent}% of a ${FULL_TIME_HOURS}-hour week`}
          >
            <span
              className={cn(
                "block h-full rounded-full transition-[width] duration-700",
                styles.bar,
              )}
              style={{
                width: `${roleResult.fullTimeWeekBarWidthPercent ?? 0}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
            <span>0</span>
            <span>{sharePercent}% of a full-time week</span>
            <span>{FULL_TIME_HOURS} hrs</span>
          </div>
          <p className="w-fit rounded-sm bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
            Suggested: {roleResult.resourceLabel}
          </p>
          <p className="text-sm text-muted-foreground">
            {plural(roleResult.taskCount, "task")} you do yourself today.
          </p>
        </>
      )}
    </div>
  );
}

function LocalHireOption({ audit }: { audit: DelegationAuditResult }) {
  const { ppSalary, csoSalary, setField } = useDelegationStore();
  const salaryInputs: Record<RoleKey, string> = {
    pp: ppSalary,
    cso: csoSalary,
  };
  const setSalary = (role: RoleKey, salary: string) =>
    setField(role === "pp" ? { ppSalary: salary } : { csoSalary: salary });

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-secondary shadow-md">
      <div className="flex items-center gap-3 px-6 pb-11 pt-6">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-card ring-1 ring-border">
          <Building2 className="h-5 w-5 text-foreground" />
        </span>
        <h4 className="text-lg text-foreground">What a local hire costs</h4>
      </div>
      <div className="-mt-6 grid flex-1 content-start gap-5 rounded-t-3xl bg-card p-6 pt-7">
        <p className="text-sm text-muted-foreground">
          Optional: enter the salary you'd expect to pay. It's used to work out
          your figures and in your emailed plan.
        </p>

        {ROLE_KEYS.map((role) => {
          const roleResult = roleResultFor(audit, role);
          if (!roleResult.hasWorkload) return null;

          const enteredSalary = Math.round(num(salaryInputs[role]));
          const localHire =
            enteredSalary > 0 && roleResult.localHire?.salary === enteredSalary
              ? roleResult.localHire
              : null;

          return (
            <div key={role} className="grid gap-3 border-t border-border pt-4">
              <div className="grid gap-2">
                <Label
                  htmlFor={`${role}Salary`}
                  className="font-semibold text-foreground"
                >
                  {ROLES[role].title} salary a year
                </Label>
                <div className="relative w-full">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id={`${role}Salary`}
                    inputMode="numeric"
                    placeholder="Annual salary"
                    value={salaryInputs[role]}
                    onChange={(e) => setSalary(role, digits(e.target.value))}
                    className="pl-8 tabular-nums"
                  />
                </div>
              </div>
              {localHire && (
                <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1.5 text-sm">
                  <dt className="text-muted-foreground">
                    Super guarantee 12%
                    <SourceRef n={4} />
                  </dt>
                  <dd className="text-right font-semibold tabular-nums">
                    {aud.format(localHire.superannuation)}
                  </dd>
                  <dt className="text-muted-foreground">
                    Full-time, salary + super
                  </dt>
                  <dd className="text-right font-semibold tabular-nums">
                    {aud.format(localHire.loadedSalary)}
                  </dd>
                  <dt className="text-muted-foreground">
                    For {roleResult.resourceLabel}
                  </dt>
                  <dd className="text-right font-bold tabular-nums text-foreground">
                    {aud.format(localHire.annualCost)}
                  </dd>
                </dl>
              )}
            </div>
          );
        })}

        <ul className="grid list-disc gap-2 border-t border-border pl-5 pt-4 text-sm text-muted-foreground">
          <li>
            This is a minimum. It doesn't include payroll tax (if your wages
            pass your state's threshold), workers' compensation insurance,
            annual leave loading where an award or contract provides it, long
            service leave, recruitment, training, equipment or software
            licences.
          </li>
          <li>
            A full-time employee is paid for {ANNUAL_LEAVE_WEEKS} weeks' annual
            leave
            <SourceRef n={2} />, up to {PERSONAL_LEAVE_DAYS} days' sick and
            carer's leave
            <SourceRef n={3} /> and public holidays, so plan cover for those
            weeks.
          </li>
        </ul>
      </div>
    </div>
  );
}

function AdviceLabOption({ audit }: { audit: DelegationAuditResult }) {
  return (
    <div className="gradient-primary flex min-w-0 flex-col overflow-hidden rounded-2xl border-2 border-primary shadow-xl shadow-primary/15">
      <div className="flex items-center gap-3 px-6 pb-11 pt-6">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
          <Building2 className="h-5 w-5 text-primary-foreground" />
        </span>
        <h4 className="text-lg text-primary-foreground">
          A dedicated resource through Advice Lab
        </h4>
      </div>
      <div className="-mt-6 grid flex-1 content-start gap-5 rounded-t-3xl bg-card p-6 pt-7">
        <ul className="grid gap-3">
          {ROLE_KEYS.map((role) => {
            const roleResult = roleResultFor(audit, role);
            if (!roleResult.hasWorkload) return null;
            return (
              <li key={role} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong className="text-foreground">
                    {roleResult.resourceLabel}
                  </strong>{" "}
                  for your {hrs(roleResult.hours)} a week of{" "}
                  {ROLES[role].name.toLowerCase()}.
                </span>
              </li>
            );
          })}
        </ul>
        <ul className="grid list-disc gap-2 border-t border-border pl-5 pt-4 text-sm text-muted-foreground">
          <li>
            Paraplanning and client support are separate roles, so each is a
            separate person.
          </li>
          <li>
            Your resource works in your systems and follows your templates.
            Allow time at the start for them to learn your processes.
          </li>
        </ul>
        <div className="rounded-xl bg-primary/5 p-4 text-sm">
          <strong className="text-foreground">
            Your emailed plan includes Advice Lab pricing,
          </strong>{" "}
          your yearly saving against a local hire and a clear recommendation for
          each role.
        </div>
        <Button asChild className="w-fit">
          <a href="#plan">
            Get my plan
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function BackToTasksButton({
  onBack,
  label,
}: {
  onBack: () => void;
  label: string;
}) {
  return (
    <Button variant="outline" onClick={onBack}>
      <ArrowLeft className="mr-1 h-4 w-4" />
      {label}
    </Button>
  );
}

function NoOwnTasks({ onBack }: { onBack: () => void }) {
  return (
    <div className="grid gap-4 py-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Your result
      </p>
      <h2 className="text-2xl text-foreground">
        You haven't marked any tasks as yours
      </h2>
      <p className="mx-auto max-w-md text-muted-foreground">
        Go back and choose "I do this" for anything you still handle yourself,
        then add the hours.
      </p>
      <div className="mx-auto mt-2">
        <BackToTasksButton onBack={onBack} label="Back to the tasks" />
      </div>
    </div>
  );
}

function AuditLoading() {
  return (
    <div
      className="flex items-center justify-center gap-3 py-16 text-muted-foreground"
      role="status"
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      Working out your result…
    </div>
  );
}

function AuditLoadError({
  onRetry,
  onBack,
}: {
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <div className="grid gap-4 py-6 text-center" role="alert">
      <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
      <h2 className="text-2xl text-foreground">
        We couldn't work out your result
      </h2>
      <p className="mx-auto max-w-md text-muted-foreground">
        Please check your connection and try again.
      </p>
      <div className="mx-auto mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={onRetry}>Try again</Button>
        <BackToTasksButton onBack={onBack} label="Change my answers" />
      </div>
    </div>
  );
}

function useTrackResultView(
  audit: DelegationAuditResult | undefined,
  isPlaceholderData: boolean,
) {
  const hasTrackedView = useRef(false);
  useEffect(() => {
    if (!audit || isPlaceholderData || hasTrackedView.current) return;
    hasTrackedView.current = true;
    track("audit_result_view", {
      hours_band: audit.hoursBand,
      roles: audit.rolesWithWork,
    });
  }, [audit, isPlaceholderData]);
}

export function ResultStep({ onBack }: { onBack: () => void }) {
  const hasOwnTasks = useHasOwnTasks();
  return hasOwnTasks ? (
    <AuditResult onBack={onBack} />
  ) : (
    <NoOwnTasks onBack={onBack} />
  );
}

function AuditResult({ onBack }: { onBack: () => void }) {
  const { rate, st, setField } = useDelegationStore();
  const {
    data: audit,
    isError,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useDelegationAudit();
  useTrackResultView(audit, isPlaceholderData);

  if (!audit) {
    return isError ? (
      <AuditLoadError onRetry={() => refetch()} onBack={onBack} />
    ) : (
      <AuditLoading />
    );
  }

  const { teamTaskCount, outsourcedTaskCount } = audit.alreadyCovered;
  const { valueOfTime } = audit;

  return (
    <div className="grid gap-10" aria-busy={isFetching}>
      {isError && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          We couldn't update your figures just now. These are from your last
          change.
        </p>
      )}

      <section className="relative grid gap-4 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-card to-primary/10 p-5 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <p className="relative w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Your result
        </p>
        <p className="relative font-display text-3xl font-bold leading-none tabular-nums text-foreground md:text-5xl">
          <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
            {hrs(audit.totalHours)}
          </span>{" "}
          a week
        </p>
        <p className="relative text-muted-foreground">
          of work you could hand off, split across two roles:
        </p>
        <div className="relative mt-2 grid gap-4 md:grid-cols-2">
          {ROLE_KEYS.map((role) => (
            <RoleCard
              key={role}
              role={role}
              roleResult={roleResultFor(audit, role)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-5 rounded-xl bg-secondary/60 p-5 sm:grid-cols-2 md:p-6">
        <div className="grid gap-2">
          <Label htmlFor="rate">
            What is an hour of your time worth? (optional)
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="rate"
              inputMode="decimal"
              placeholder="e.g. fee revenue ÷ hours worked"
              value={rate}
              onChange={(e) => setField({ rate: digits(e.target.value) })}
              className="pl-8"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="st">Where is your practice?</Label>
          <Select
            value={st}
            onValueChange={(state) => setField({ st: state as StateCode })}
          >
            <SelectTrigger id="st" className="h-12 rounded-xl px-4 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATE_CODES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {valueOfTime && (
          <div className="rounded-lg border border-border border-l-4 border-l-primary bg-card p-4 text-sm sm:col-span-2">
            <p className="mb-1 font-semibold text-foreground">
              What your time on these tasks is worth
            </p>
            <p className="mb-2 font-display text-3xl font-bold tabular-nums text-primary">
              {aud.format(valueOfTime.annual)}
              <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">
                a year
              </span>
            </p>
            <p className="text-muted-foreground">
              {aud.format(valueOfTime.weekly)} a week, or about{" "}
              <strong className="text-foreground">
                {aud.format(valueOfTime.annual)} a year
              </strong>{" "}
              across {valueOfTime.workingWeeksPerYear} working weeks (52 less{" "}
              {ANNUAL_LEAVE_WEEKS} weeks' annual leave
              <SourceRef n={2} />
              ).
            </p>
          </div>
        )}
      </section>

      <section className="grid gap-4">
        <div className="grid gap-2">
          <h3 className="text-xl text-foreground">Hand these off first</h3>
          <span className="gradient-primary h-1 w-12 rounded-full" />
        </div>
        <ol className="grid gap-2">
          {audit.topTasksToHandOff.map((handOffTask, index) => (
            <li
              key={handOffTask.task}
              className={cn(
                "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border p-4 shadow-sm transition-all duration-300 hover:translate-x-1 hover:border-primary/40 hover:shadow-md",
                index === 0
                  ? "border-2 border-primary/50 bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border bg-card",
              )}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-primary font-display text-sm font-bold text-primary-foreground">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 font-medium text-foreground">
                {handOffTask.task}
                {index === 0 && (
                  <span className="gradient-primary ml-2 inline-block rounded-full px-2.5 py-0.5 align-middle text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                    Start here
                  </span>
                )}
              </span>
              <span className="flex items-center gap-3">
                <RoleBadge role={ROLE_KEY_BY_API_ROLE[handOffTask.role]} />
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-primary">
                  {hrs(handOffTask.hours)}/wk
                </span>
              </span>
            </li>
          ))}
        </ol>
        {(teamTaskCount > 0 || outsourcedTaskCount > 0) && (
          <p className="text-sm text-muted-foreground">
            Already covered: {plural(teamTaskCount, "task")} by your team,{" "}
            {outsourcedTaskCount} outsourced.
          </p>
        )}
      </section>

      <section className="grid gap-4">
        <div className="grid gap-2">
          <h3 className="text-xl text-foreground">
            Two ways to get these hours back
          </h3>
          <span className="gradient-primary h-1 w-12 rounded-full" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <LocalHireOption audit={audit} />
          <AdviceLabOption audit={audit} />
        </div>
      </section>

      <PlanForm />

      <div className="border-t border-border pt-6">
        <BackToTasksButton onBack={onBack} label="Change my answers" />
      </div>

      <Sources />
    </div>
  );
}

function Sources() {
  return (
    <section
      aria-labelledby="sources-title"
      className="grid gap-3 rounded-xl border border-border bg-secondary/40 p-5 md:p-6"
    >
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <span className="gradient-primary grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-md">
          <BookOpen className="h-4 w-4 text-primary-foreground" />
        </span>
        <div className="grid gap-1">
          <h3
            id="sources-title"
            className="text-base font-semibold text-foreground"
          >
            Sources
          </h3>
          <span className="gradient-primary h-0.5 w-8 rounded-full" />
        </div>
      </div>
      <ol className="grid gap-2">
        {SOURCES.map(([title, url, note], i) => (
          <li
            key={url}
            id={`src${i + 1}`}
            className="flex scroll-mt-28 gap-3 text-sm leading-relaxed text-muted-foreground"
          >
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
              {i + 1}
            </span>
            <span className="min-w-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-2 hover:text-primary hover:underline"
              >
                {title}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
              : {note}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
