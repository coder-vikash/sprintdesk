import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  onConfirm,
  onClose,
}: DeleteConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete task?">
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        This will permanently remove the task. This action can't be undone.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}