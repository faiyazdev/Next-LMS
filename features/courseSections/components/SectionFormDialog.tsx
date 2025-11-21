"use client";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseSectionTable } from "@/drizzle/schema";
import { ReactNode, useState } from "react";
import SectionForm from "./SectionForm";

type SectionFormDialogProps = {
  courseId: string;
  section?: CourseSectionTable;
  children: ReactNode;
};

const SectionFormDialog = ({
  courseId,
  section,
  children,
}: SectionFormDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{section ? "Edit Section" : "New Section"}</DialogTitle>
        </DialogHeader>

        <div className="mt-3">
          <SectionForm
            section={section}
            courseId={courseId}
            onError={() => setIsOpen(false)}
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectionFormDialog;
