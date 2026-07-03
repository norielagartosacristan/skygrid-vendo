interface Props {
  onClick: () => void;
  loading?: boolean;
}

export default function SaveButton({
  onClick,
  loading = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Saving..." : "Save Settings"}
    </button>
  );
}