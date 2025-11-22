"use client";

import ActionButton from "@/app/components/common/ActionButton";
import { SortableItem } from "@/components/SortableItem";
import { SortableList } from "@/components/SortableList";
import { Button } from "@/components/ui/button";
import { CourseSectionStatus } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import React from "react";
import { deleteSection, updateSectionOrders } from "../actions/courseSections";
import { EyeClosedIcon, Trash2Icon } from "lucide-react";
import SectionFormDialog from "./SectionFormDialog";

const SortableSectionList = ({
  courseId,
  sections,
}: {
  courseId: string;
  sections: {
    id: string;
    name: string;
    status: CourseSectionStatus;
  }[];
}) => {
  return (
    <SortableList items={sections} onOrderChange={updateSectionOrders}>
      {(items) =>
        items.map((section) => {
          return (
            <SortableItem
              key={section.id}
              id={section.id}
              className="flex items-center justify-between"
            >
              <div
                className={cn(
                  "capitalize flex gap-3",
                  section.status === "private" ? "text-gray-50/25" : null
                )}
              >
                {section.status === "private" && <EyeClosedIcon />}
                {section.name}
              </div>
              <div className="flex gap-4">
                <SectionFormDialog courseId={courseId} section={section}>
                  <Button>Edit</Button>
                </SectionFormDialog>
                <ActionButton
                  requireAreYouSure={true}
                  action={deleteSection.bind(null, section.id)}
                >
                  <Trash2Icon />
                </ActionButton>
              </div>
            </SortableItem>
          );
        })
      }
    </SortableList>
  );
};

export default SortableSectionList;
