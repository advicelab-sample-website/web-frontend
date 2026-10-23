import { AUDIT_CALCULATE_URL, GROUPS, type Choice, type RoleKey, type StateCode } from "@/components/delegation-tool/data";
import { num } from "@/components/delegation-tool/format";

export type PlanPath = "hire" | "outsource" | "compare";


export interface TaskAnswer {
  answer: Choice;
  hours?: number;
}

export interface DelegationAuditRequest {
  state: StateCode;
  rate: number;
  ppSalary: number;
  csoSalary: number;
  tasks: Record<string, Record<string, TaskAnswer>>;
}

export interface AuditInputs {
  answers: Record<string, Choice | undefined>;
  hours: Record<string, number>;
  rate: string;
  st: StateCode;
  ppSalary: string;
  csoSalary: string;
}

export function buildAuditRequest({ answers, hours, rate, st, ppSalary, csoSalary }: AuditInputs): DelegationAuditRequest {
  const tasks = Object.fromEntries(
    GROUPS.map((group) => [
      group.apiKey,
      Object.fromEntries(
        group.tasks.flatMap(([taskName]) => {
          const answer = answers[taskName];
          if (!answer) return [];
          const taskAnswer: TaskAnswer = answer === "me" ? { answer, hours: hours[taskName] } : { answer };
          return [[taskName, taskAnswer]];
        }),
      ),
    ]),
  );

  return {
    state: st,
    rate: num(rate),
    ppSalary: num(ppSalary),
    csoSalary: num(csoSalary),
    tasks,
  };
}


export type ApiRoleKey = "paraplanning" | "clientSupport";

export const ROLE_KEY_BY_API_ROLE: Record<ApiRoleKey, RoleKey> = { paraplanning: "pp", clientSupport: "cso" };
export const API_ROLE_BY_ROLE_KEY: Record<RoleKey, ApiRoleKey> = { pp: "paraplanning", cso: "clientSupport" };

export interface LocalHireCost {
  salary: number;
  salaryBasis: string;
  superannuation: number;
  loadedSalary: number;
  fullTimeEquivalent: number;
  annualCost: number;
  description: string;
}

export interface RoleAuditResult {
  role: ApiRoleKey;
  roleTitle: string;
  hours: number;
  taskCount: number;
  tasks: { task: string; hours: number }[];
  resourceUnits: ("fullTime" | "partTime")[];
  resourceLabel: string;
  fullTimeWeekSharePercent: number;
  fullTimeWeekBarWidthPercent?: number;
  localHire?: LocalHireCost | null;
  hasWorkload: boolean;
}

export interface HandOffTask {
  task: string;
  role: ApiRoleKey;
  roleTitle: string;
  hours: number;
}

export interface DelegationAuditResult {
  totalHours: number;
  hoursBand: string;
  rolesWithWork: "both" | "paraplanner" | "cso" | "none";
  alreadyCovered: { teamTaskCount: number; outsourcedTaskCount: number };
  topTasksToHandOff: HandOffTask[];
  valueOfTime: { hourlyRate: number; weekly: number; annual: number; workingWeeksPerYear: number } | null;
  roles: Record<ApiRoleKey, RoleAuditResult>;
}

export class DelegationApiError extends Error {
  constructor(public code: string, public status?: number) {
    super(code);
    this.name = "DelegationApiError";
  }
}

export async function fetchDelegationAudit(
  request: DelegationAuditRequest,
  signal?: AbortSignal,
): Promise<DelegationAuditResult> {
  const response = await fetch(AUDIT_CALCULATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    throw new DelegationApiError(body?.error || "server_error", response.status);
  }
  return body.data as DelegationAuditResult;
}
