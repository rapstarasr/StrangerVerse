type ForwardDialogProps = {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  darkMode: boolean;
};

export function ForwardDialog({ isVisible, message, onClose, onConfirm, darkMode }: ForwardDialogProps) {
  if (!isVisible) return null;

  return (
    <div className={`absolute inset-0 z-30 flex items-center justify-center rounded-2xl border p-4 ${darkMode ? "border-[rgba(255,255,255,0.08)] bg-[#070B17]/95 text-slate-100" : "border-[rgba(255,255,255,0.08)] bg-[#070B17]/95 text-slate-100"}`}>
      <div className="w-full max-w-sm rounded-2xl bg-[#0D1324]/95 p-4 text-sm">
        <p className="font-semibold">Forward message</p>
        <p className="mt-2 text-slate-300">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-2 text-slate-200 transition hover:bg-[rgba(255,255,255,0.1)]" onClick={onClose}>Cancel</button>
          <button className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] px-3 py-2 font-medium text-white" onClick={onConfirm}>Forward</button>
        </div>
      </div>
    </div>
  );
}
