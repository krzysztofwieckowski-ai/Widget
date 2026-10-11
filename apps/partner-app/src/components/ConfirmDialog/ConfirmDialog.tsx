import { useEffect, useRef } from 'react';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Native modal <dialog>: the browser traps focus, makes the page behind inert and closes on Esc.
 * Focus starts on Cancel, the safe choice.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <h2 id="dialog-title" className="dialog-title">
        {title}
      </h2>
      <p id="dialog-description" className="dialog-text">
        {description}
      </p>
      <div className="dialog-actions">
        <button type="button" className="dialog-button dialog-button--cancel" onClick={onCancel} autoFocus>
          {cancelLabel}
        </button>
        <button type="button" className="dialog-button dialog-button--confirm" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
