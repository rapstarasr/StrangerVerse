type DeleteDialogProps = {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  darkMode: boolean;
};

export function DeleteDialog({ isVisible, onClose, onConfirm, darkMode }: DeleteDialogProps) {
  if (!isVisible) return null;

  return (
    <div className={`absolute inset-0 z-30 flex items-center justify-center rounded-2xl border p-4 ${darkMode ? "border-slate-700 bg-slate-950/90 text-slate-100" : "border-slate-200 bg-white/90 text-slate-900"}`}>
      <div className="w-full max-w-sm rounded-2xl bg-slate-900/90 p-4 text-sm">
        <p className="font-semibold">Delete this message?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded-full px-3 py-2 text-slate-200" onClick={onClose}>Cancel</button>
          <button className="rounded-full bg-rose-500 px-3 py-2 font-medium text-white" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
