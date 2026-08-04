type PermissionDialogProps = {
  error: string;
  onRetry: () => void;
  darkMode: boolean;
};

export function PermissionDialog({ error, onRetry, darkMode }: PermissionDialogProps) {
  return (
    <div className={`absolute inset-4 flex items-center justify-center rounded-3xl border p-6 text-center ${darkMode ? "border-slate-700 bg-slate-950/90 text-slate-100" : "border-slate-200 bg-white/90 text-slate-900"}`}>
      <div className="max-w-sm">
        <p className="text-lg font-semibold">Permission required</p>
        <p className="mt-2 text-sm opacity-80">{error}</p>
        <button className="mt-4 rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white" onClick={onRetry}>
          Try again
        </button>
      </div>
    </div>
  );
}
