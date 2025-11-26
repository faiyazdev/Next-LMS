"use client";

import ActionButton from "@/app/components/common/ActionButton";
import { SortableItem } from "@/components/SortableItem";
import { SoratableList } from "@/components/SortableList";
import { Button } from "@/components/ui/button";
import { LessonStatus } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { deleteLesson, updateLessonOrders } from "../actions/lessons";
import { EyeClosedIcon, Trash2Icon } from "lucide-react";
import LessonFormDialog from "./LessonFormDialog";

const SortableLessonList = ({
  defaultSectionId,
  lessons,
  sections,
}: {
  defaultSectionId: string;
  sections: {
    id: string;
    name: string;
  }[];
  lessons: {
    id: string;
    name: string;
    order: number;
    status: LessonStatus;
    description?: string | null;
    youtubeVideoId: string;
    sectionId: string;
  }[];
}) => {
  return (
    <SoratableList items={lessons} onOrderChange={updateLessonOrders}>
      {(lessons) =>
        lessons.map((lesson) => {
          return (
            <SortableItem
              key={lesson.id}
              id={lesson.id}
              className="flex items-center justify-between"
            >
              <div
                className={cn(
                  "capitalize flex gap-3",
                  lesson.status === "private" ? "text-gray-50/25" : null
                )}
              >
                {lesson.status === "private" && <EyeClosedIcon />}
                {lesson.name}
              </div>
              <div className="flex gap-4">
                <LessonFormDialog
                  defaultSectionId={defaultSectionId}
                  sections={sections}
                  lesson={lesson}
                >
                  <Button>Edit</Button>
                </LessonFormDialog>
                <ActionButton
                  requireAreYouSure={true}
                  action={deleteLesson.bind(null, lesson.id)}
                >
                  <Trash2Icon />
                </ActionButton>
              </div>
            </SortableItem>
          );
        })
      }
    </SoratableList>
  );
};

export default SortableLessonList;
