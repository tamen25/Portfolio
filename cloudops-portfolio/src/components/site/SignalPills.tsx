import { StatusPill } from "@/components/ui/status-pill";

/**
 * Row of system-status signals rendered above the hero headline. Variants
 * reuse the design-system pill so the colours are AA-verified. Pure visual —
 * the underlying systems are wired in the platform but their up/down state
 * is not polled here.
 */
export function SignalPills() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill variant="live">platform online</StatusPill>
      <StatusPill variant="muted">Cognito · OIDC</StatusPill>
      <StatusPill variant="muted">OTel · traces</StatusPill>
      <StatusPill variant="muted">Step Functions</StatusPill>
      <StatusPill variant="muted">WS · streaming</StatusPill>
      <StatusPill variant="muted">RLS · multi-tenant</StatusPill>
    </div>
  );
}
