export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-[#d6a842]/15 bg-white p-4 shadow-soft md:p-5 ${className}`}>{children}</div>;
}
