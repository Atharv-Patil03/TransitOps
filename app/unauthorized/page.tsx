import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export default function UnauthorizedPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="glass-card fade-in" style={{ maxWidth: 440, width: "100%", padding: 0 }}>
        <EmptyState
          icon="🚫"
          title="Access Denied"
          description="You don't have permission to access this page. If you believe this is an error, please contact your fleet administrator."
          href="/"
          hrefLabel="Return to Dashboard"
        />
      </div>
    </div>
  );
}
