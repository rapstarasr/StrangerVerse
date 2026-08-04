type CallControlsProps = {
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeakerOff: boolean;
  isAudioOnly: boolean;
  isFullscreen: boolean;
  isPiPEnabled: boolean;
  isScreenSharing: boolean;
  devices: { audioInputs: string[]; videoInputs: string[] };
  hasPermission: boolean;
  hasRemoteStream: boolean;
  canReconnect: boolean;
  showIncomingActions: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onSwitchCamera: () => Promise<void>;
  onToggleSpeaker: () => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onToggleScreenShare: () => Promise<void>;
  onAccept: () => void;
  onDecline: () => void;
  onReconnect: () => void;
  onEnd: () => void;
  onRequestPermissions: () => void;
  darkMode: boolean;
};

const buttonClass = (active: boolean, darkMode: boolean) =>
  `rounded-full px-3 py-2 text-sm font-medium transition ${active ? "bg-sky-500 text-white" : darkMode ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-700"}`;

export function CallControls(props: CallControlsProps) {
  const { darkMode } = props;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button className={buttonClass(props.isMuted, darkMode)} onClick={props.onToggleMic}>Mic {props.isMuted ? "Off" : "On"}</button>
      <button className={buttonClass(props.isCameraOff, darkMode)} onClick={props.onToggleCamera}>Cam {props.isCameraOff ? "Off" : "On"}</button>
      <button className={buttonClass(false, darkMode)} onClick={() => void props.onSwitchCamera()}>Switch</button>
      <button className={buttonClass(props.isSpeakerOff, darkMode)} onClick={props.onToggleSpeaker}>Speaker</button>
      <button className={buttonClass(props.isFullscreen, darkMode)} onClick={props.onToggleFullscreen}>Full</button>
      <button className={buttonClass(props.isPiPEnabled, darkMode)} onClick={props.onTogglePiP}>PiP</button>
      {!props.isAudioOnly ? (
        <button className={buttonClass(props.isScreenSharing, darkMode)} onClick={() => void props.onToggleScreenShare()}>Share</button>
      ) : null}
      {!props.hasPermission ? (
        <button className={buttonClass(false, darkMode)} onClick={props.onRequestPermissions}>Allow Access</button>
      ) : null}
      {props.canReconnect && !props.hasRemoteStream ? (
        <button className={buttonClass(false, darkMode)} onClick={props.onReconnect}>Reconnect</button>
      ) : null}
      {props.showIncomingActions ? (
        <>
          <button className="rounded-full bg-rose-500 px-3 py-2 text-sm font-medium text-white" onClick={props.onDecline}>Decline</button>
          <button className="rounded-full bg-emerald-500 px-3 py-2 text-sm font-medium text-white" onClick={props.onAccept}>Accept</button>
        </>
      ) : null}
      <button className="rounded-full bg-amber-500 px-3 py-2 text-sm font-medium text-white" onClick={props.onEnd}>End</button>
    </div>
  );
}
