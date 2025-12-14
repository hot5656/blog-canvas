import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  authorName: string;
  postTitle: string;
}

const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  authorName,
  postTitle,
}: DeleteConfirmDialogProps) => {
  const [inputValue, setInputValue] = useState("");

  const isMatch = inputValue.trim().toLowerCase() === authorName.trim().toLowerCase();

  const handleConfirm = () => {
    if (isMatch) {
      onConfirm();
      setInputValue("");
    }
  };

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Post</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              Are you sure you want to delete "<strong>{postTitle}</strong>"?
            </span>
            <span className="block text-destructive">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="author-confirm" className="text-sm text-muted-foreground">
            Type the author name "<strong>{authorName}</strong>" to confirm:
          </Label>
          <Input
            id="author-confirm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter author name"
            className="mt-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isMatch}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
