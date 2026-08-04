type MessageMenuProps = {
  isMine: boolean;
  isFailed: boolean;
  darkMode: boolean;
  onReply: () => void;
  onForward: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onPin: () => void;
  onStar: () => void;
  onReact: () => void;
  onInfo: () => void;
  onShare: () => void;
  onDownload: () => void;
  onRetry: () => void;
};

const actionClass = (darkMode: boolean) =>
  `flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${darkMode ? "text-slate-100 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"}`;

export function MessageMenu(props: MessageMenuProps) {
  return (
    <div className="flex flex-col gap-1">
      <button className={actionClass(props.darkMode)} onClick={props.onReply}>Reply</button>
      <button className={actionClass(props.darkMode)} onClick={props.onForward}>Forward</button>
      <button className={actionClass(props.darkMode)} onClick={props.onCopy}>Copy</button>
      <button className={actionClass(props.darkMode)} onClick={props.onDelete}>{props.isMine ? "Delete for me" : "Delete"}</button>
      <button className={actionClass(props.darkMode)} onClick={props.onPin}>Pin</button>
      <button className={actionClass(props.darkMode)} onClick={props.onStar}>Star</button>
      <button className={actionClass(props.darkMode)} onClick={props.onReact}>React</button>
      <button className={actionClass(props.darkMode)} onClick={props.onInfo}>Info</button>
      <button className={actionClass(props.darkMode)} onClick={props.onShare}>Share</button>
      <button className={actionClass(props.darkMode)} onClick={props.onDownload}>Download</button>
      {props.isFailed ? <button className={actionClass(props.darkMode)} onClick={props.onRetry}>Retry</button> : null}
    </div>
  );
}
