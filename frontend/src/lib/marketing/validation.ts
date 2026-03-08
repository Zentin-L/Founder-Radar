export type RequestAccessPayload = {
  email: string;
  firm: string;
  role: string;
  sector: string;
  stageFocus: string;
  message?: string;
};

export function validateRequestAccess(payload: RequestAccessPayload): string | null {
  if (!payload.email.includes("@")) return "Please enter a valid email.";
  if (payload.firm.trim().length < 2) return "Please enter your firm name.";
  if (payload.role.trim().length < 2) return "Please enter your role.";
  if (!payload.sector) return "Please select a sector.";
  if (!payload.stageFocus) return "Please select your stage focus.";
  return null;
}
