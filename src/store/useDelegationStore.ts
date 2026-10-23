import { create } from "zustand";
import { GROUPS, type Choice, type StateCode } from "@/components/delegation-tool/data";
import type { PlanPath } from "./delegationAuditApi";

export interface ContactDraft {
  first_name: string;
  email: string;
  practice: string;
  plan_path: PlanPath;
}

export const HOURS_STEP = 0.5;
export const HOURS_MIN = 0.5;
export const HOURS_MAX = 40;

export const snapHours = (h: number) =>
  Math.max(HOURS_MIN, Math.min(HOURS_MAX, Math.round(h / HOURS_STEP) * HOURS_STEP));

const initialContact: ContactDraft = { first_name: "", email: "", practice: "", plan_path: "compare" };

const AUDIT_FIELDS = ["rate", "st", "ppSalary", "csoSalary"] as const;

const initialHours = () =>
  Object.fromEntries(GROUPS.flatMap((g) => g.tasks.map(([t]) => [t, 1]))) as Record<string, number>;

interface DelegationState {
  step: number;  
  answers: Record<string, Choice | undefined>;
  hours: Record<string, number>;
  rate: string;
  st: StateCode;
  ppSalary: string;
  csoSalary: string;
  sent: string | null;
  started: boolean;
  refCode: string | null;
  contact: ContactDraft;

  setStep: (step: number) => void;
  toggleAnswer: (task: string, choice: Choice) => void;
  stepHours: (task: string, delta: number) => void;
  setHours: (task: string, value: number) => void;
  setField: (data: Partial<Pick<DelegationState, "rate" | "st" | "ppSalary" | "csoSalary" | "sent" | "started" | "refCode">>) => void;
  setContact: (data: Partial<ContactDraft>) => void;
  reset: () => void;
}

const useDelegationStore = create<DelegationState>((set, get) => ({
  step: 0,
  answers: {},
  hours: initialHours(),
  rate: "",
  st: "NSW",
  ppSalary: "",
  csoSalary: "",
  sent: null,
  started: false,
  refCode: null,
  contact: initialContact,

  setStep: (step) => set({ step }),
  toggleAnswer: (task, choice) =>
    set((s) => ({
      answers: { ...s.answers, [task]: s.answers[task] === choice ? undefined : choice },
      sent: null,
    })),
  stepHours: (task, delta) =>
    set((s) => ({
      hours: { ...s.hours, [task]: snapHours(s.hours[task] + delta) },
      sent: null,
    })),
  setHours: (task, value) =>
    set((s) => {
      const next = Number.isFinite(value) ? snapHours(value) : s.hours[task];
      return next === s.hours[task] ? s : { hours: { ...s.hours, [task]: next }, sent: null };
    }),
  setField: (data) =>
    set(AUDIT_FIELDS.some((k) => k in data) ? { ...data, sent: null } : data),
  setContact: (data) => set((s) => ({ contact: { ...s.contact, ...data } })),
  reset: () =>
    set({
      step: 0,
      answers: {},
      hours: initialHours(),
      rate: "",
      st: "NSW",
      ppSalary: "",
      csoSalary: "",
      sent: null,
    }),
}));

export default useDelegationStore;
