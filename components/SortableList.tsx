"use client";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { ReactNode, useId, useOptimistic, useTransition } from "react";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";

type SortableListProps<T> = {
  items: T[];
  onOrderChange: (
    newOrder: string[]
  ) => Promise<{ error: boolean; message: string }>;
  children: (items: T[]) => ReactNode;
};

export function SortableList<T extends { id: string }>({
  items,
  onOrderChange,
  children,
}: SortableListProps<T>) {
  const [optimisticItems, setOptimisticItems] = useOptimistic(items);
  const [, startTransition] = useTransition();
  const DndContextId = useId();
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();
    if (!activeId || !overId) return;

    function getNewArray(items: T[], activeId: string, overId: string) {
      const oldIndex = items.findIndex((section) => section.id === activeId);
      const newIndex = items.findIndex((section) => section.id === overId);
      return arrayMove(items, oldIndex, newIndex);
    }

    startTransition(() => {
      setOptimisticItems((items) => getNewArray(items, activeId, overId));
    });
    const actionData = await onOrderChange(
      getNewArray(optimisticItems, activeId, overId).map((s) => s.id)
    );
    if (actionData.error) {
      toast.error(actionData.message);
    } else {
      toast.success(actionData.message);
    }
  }

  return (
    <DndContext id={DndContextId} onDragEnd={handleDragEnd}>
      <SortableContext
        items={optimisticItems}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">{children(optimisticItems)}</div>
      </SortableContext>
    </DndContext>
  );
}
