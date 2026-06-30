import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PortalLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}