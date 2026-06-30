interface StatusBadgeProps {
  status: "ONLINE" | "OFFLINE" | "WARNING";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    ONLINE: "bg-green-100 text-green-700",
    OFFLINE: "bg-red-100 text-red-700",
    WARNING: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}