export default function LoadingSpinner({ compact = false }) {
  const sizeClass = compact ? "h-4 w-4 border-2" : "h-6 w-6 border-[3px]";
  return (
    <span
      className={`inline-block animate-spin rounded-full border-slate-300 border-t-cyan-400 ${sizeClass}`}
      aria-label="Loading"
    />
  );
}
