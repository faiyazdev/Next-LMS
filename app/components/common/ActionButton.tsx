"use client";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { ComponentPropsWithRef, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ActionButtonProps = Omit<
  ComponentPropsWithRef<typeof Button>,
  "onClick"
> & {
  action: () => Promise<{ error: boolean; message: string }>;
  requireAreYouSure?: boolean;
};
const ActionButton = ({
  action,
  requireAreYouSure = true,
  ...props
}: ActionButtonProps) => {
  const [isLoading, startTransition] = useTransition();
  function performAction() {
    startTransition(async () => {
      await action();
      toast.success("Course deleted successfully");
    });
  }
  if (requireAreYouSure) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button {...props} disabled={isLoading}>
            {isLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              props.children
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              Course from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button disabled={isLoading} onClick={performAction}>
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <Button {...props} disabled={isLoading} onClick={performAction}>
      {isLoading ? <LoaderCircle className="animate-spin" /> : props.children}
    </Button>
  );
};

export default ActionButton;
