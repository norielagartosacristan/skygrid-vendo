import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PortalLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">
      {children}
    </div>
  );
}