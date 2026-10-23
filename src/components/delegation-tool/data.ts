// ─── Settings ──────────────────────────────────────────────────────────────────
// Lambda Function URL (Developer Build Guide, Step 4). Empty = preview mode: nothing is sent.
export const API_URL = "";
// Advice Lab backend (advice-lab-web-backend). Point this at the deployed API Gateway URL in production.
export const BACKEND_URL = "https://jkx0gf7zwi.execute-api.ap-southeast-2.amazonaws.com/default";
export const AUDIT_CALCULATE_URL = `${BACKEND_URL}/api/v1/delegation-audit/calculate`;
export const PLAN_PDF_URL = `${BACKEND_URL}/api/v1/delegation-audit/pdf`;
export const PLAN_EMAIL_URL = `${BACKEND_URL}/api/v1/delegation-audit/send-plan`;
export const CONTACT_URL = "/contact-us";
export const PRIVACY_URL = "https://www.advicelab.com.au/privacy-policy"; // check this address: no matching route in this site yet


export const FULL_TIME_HOURS = 38; 
export const ANNUAL_LEAVE_WEEKS = 4; 
export const PERSONAL_LEAVE_DAYS = 10; 

export const STATE_CODES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;
export type StateCode = (typeof STATE_CODES)[number];

export const SOURCES: [title: string, url: string, note: string][] = [
  ["Fair Work Ombudsman, Hours of work", "https://www.fairwork.gov.au/employment-conditions/hours-of-work-breaks-and-rosters/hours-of-work", "a maximum of 38 hours a week, plus reasonable additional hours."],
  ["Fair Work Ombudsman, Annual leave", "https://www.fairwork.gov.au/leave/annual-leave", "4 weeks a year for full-time and part-time employees."],
  ["Fair Work Ombudsman, Paid sick and carer's leave", "https://www.fairwork.gov.au/leave/sick-and-carers-leave/paid-sick-and-carers-leave", "10 days a year for full-time employees."],
  ["Australian Taxation Office, Super guarantee", "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee", "12% from 1 July 2025."],
  ["Money Management, How advice salaries will look in FY24–25 (17 June 2024)", "https://www.moneymanagement.com.au/news/financial-planning/how-advice-salaries-will-look-fy24-25", "reporting Hays Salary Guide FY24/25 paraplanner salaries by state."],
  ["Hays Salary Guide FY24/25", "https://public.careertools.com.au/uploads/files/1160266/nvmnxbnk0ejzMl2BLRxv72ygGcRQCFmWdoVlPCAG.pdf", "salaries shown are exclusive of superannuation."],
  ["Australian Taxation Office, changes to super for employees", "https://www.ato.gov.au/businesses-and-organisations/business-bulletins-newsroom/hiring-holiday-employees-be-aware-of-changes-to-super", "the $450-a-month threshold was removed, so super is paid regardless of how much an employee earns."],
  ["Revenue NSW, Payroll tax thresholds and rates", "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/lodge-and-pay-returns/thresholds-and-rates", "NSW threshold $1,200,000 at 5.45% for 2025–26 and 2026–27."],
  ["icare NSW, Premium updates", "https://icare.nsw.gov.au/employers/premiums/premium-updates", "workers' compensation premiums start from wages multiplied by the employer's industry rate."],
];

export const FREE_EMAIL = ["gmail.com", "googlemail.com", "outlook.com", "outlook.com.au", "hotmail.com", "hotmail.com.au", "live.com", "live.com.au", "msn.com", "yahoo.com", "yahoo.com.au", "ymail.com", "icloud.com", "me.com", "mac.com", "aol.com", "proton.me", "protonmail.com", "gmx.com", "mail.com", "zoho.com", "bigpond.com", "bigpond.net.au", "optusnet.com.au", "iinet.net.au", "internode.on.net", "tpg.com.au", "westnet.com.au", "dodo.com.au", "aapt.net.au"];


export type RoleKey = "pp" | "cso";

export const ROLES: Record<RoleKey, { name: string; person: string; title: string }> = {
  pp: { name: "Paraplanning", person: "paraplanner", title: "Paraplanner" },
  cso: { name: "Client support", person: "client service officer", title: "Client service officer" },
};

export interface TaskGroup {
  key: string;
  apiKey: string; 
  role: RoleKey;
  name: string;
  intro: string;
  tasks: [name: string, detail: string][];
}

export const GROUPS: TaskGroup[] = [
  {
    key: "para",
    apiKey: "paraplanning",
    role: "pp",
    name: "Paraplanning",
    intro: "Research, modelling and writing advice documents.",
    tasks: [
      ["Product research and comparisons", "Existing vs recommended products, alternative platforms (e.g. Wealthsolver)"],
      ["Modelling and projections", "Retirement, cash flow, contribution strategies, tax impacts (e.g. Xtools)"],
      ["Insurance research", "Policy comparisons, definitions and exclusions, premium structures (e.g. Risk Researcher)"],
      ["Writing Statements and Records of Advice", "Once you have approved the research outcomes"],
    ],
  },
  {
    key: "review",
    apiKey: "client_support_reviews_and_implementation",
    role: "cso",
    name: "Client support: reviews and implementation",
    intro: "The work around review meetings and putting advice in place.",
    tasks: [
      ["Preparing review packs", "Getting client files ready for annual review meetings"],
      ["Post-review updates", "Benchmark linking, rolling over review dates, updating records"],
      ["Ongoing fee consent forms and client service agreements", "Preparing, sending and processing them"],
      ["Preparing applications", "Drafting applications to support SoA and RoA recommendations"],
      ["Implementing advice", "Lodging signed applications and following providers up until processed"],
      ["Switches, rebalances and trades", "Executing them once advice is approved"],
      ["Execution-only and hold RoAs", "Simple advice documents prepared in your CRM"],
      ["Third-party authority forms", "Preparing TPAs for providers"],
    ],
  },
  {
    key: "admin",
    apiKey: "client_support_records_and_admin",
    role: "cso",
    name: "Client support: records and admin",
    intro: "Keeping client records, providers and paperwork moving.",
    tasks: [
      ["Updating client records in your CRM", "New clients, offboarding, deceased estates, client splits (e.g. Xplan)"],
      ["Insurance admin", "Quotes, alterations, renewals, overdue premiums and claims"],
      ["AML and compliance checks", "Identity checks and record updates"],
      ["Liaising with providers on client queries", "Calls and follow-ups until resolved"],
      ["DocuSign and e-signatures", "Sending, tracking, confirming and archiving"],
      ["Mailbox management", "Triaging the shared inbox and client requests"],
      ["Platform reports and corporate actions", "Generating reports and handling provider corporate actions"],
      ["Filing and documentation", "Saving documents to your CRM and server"],
    ],
  },
];

export const TASK_COUNT = GROUPS.reduce((n, g) => n + g.tasks.length, 0);

export type Choice = "me" | "team" | "out" | "na";
export const CHOICES: [Choice, string][] = [
  ["me", "I do this"],
  ["team", "My team does it"],
  ["out", "Outsourced"],
  ["na", "Not relevant"],
];

export const ROLE_STYLES: Record<RoleKey, { badge: string; bar: string; text: string; accent: string }> = {
  pp: { badge: "bg-primary/10 text-primary", bar: "bg-primary", text: "text-primary", accent: "border-t-primary" },
  cso: { badge: "bg-primary/10 text-primary", bar: "bg-primary", text: "text-primary", accent: "border-t-primary" },
};