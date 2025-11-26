"use client";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { LessonStatus } from "@/drizzle/schema";
import { ReactNode, useState } from "react";
import LessonForm from "./LessonForm";

type LessonFormDialogProps = {
  defaultSectionId: string;
  lesson?: {
    id: string;
    name: string;
    youtubeVideoId: string;
    status: LessonStatus;
    description?: string | null;
    sectionId: string;
  };

  sections: {
    id: string;
    name: string;
  }[];
  children: ReactNode;
};

const LessonFormDialog = ({
  defaultSectionId,
  sections,
  lesson,
  children,
}: LessonFormDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit Lesson" : "New Lesson"}</DialogTitle>
        </DialogHeader>

        <div className="mt-3">
          <LessonForm
            lesson={lesson}
            sections={sections}
            defaultSectionId={defaultSectionId}
            onError={() => setIsOpen(false)}
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonFormDialog;
