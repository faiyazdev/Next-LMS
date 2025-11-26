"use client";
import { LessonStatus, lessonStatuses } from "@/drizzle/schema";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createLesson, updateLesson } from "../actions/lessons";
import { lessonSchema } from "../schemas/lessons";
import { Textarea } from "@/components/ui/textarea";

type LessonFormProps = {
  defaultSectionId: string;
  sections: {
    id: string;
    name: string;
  }[];
  lesson?: {
    id: string;
    name: string;
    youtubeVideoId: string;
    status: LessonStatus;
    description?: string | null;
    sectionId: string;
  };
  onSuccess: () => void;
  onError: () => void;
};

const LessonForm = ({
  defaultSectionId,
  lesson,
  sections,
  onSuccess,
  onError,
}: LessonFormProps) => {
  const fallbackSectionId =
    lesson?.sectionId ??
    defaultSectionId ??
    (sections && sections[0]?.id) ??
    "";

  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson ? lesson.name : "",
      status: lesson ? lesson.status : "private",
      description: lesson ? lesson.description : "",
      youtubeVideoId: lesson ? lesson.youtubeVideoId : "",
      sectionId: fallbackSectionId,
    },
  });
  const { isSubmitting } = form.formState;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof lessonSchema>) {
    const action = lesson
      ? (values: z.infer<typeof lessonSchema>) =>
          updateLesson(lesson.id, values)
      : createLesson;

    try {
      const data = await action(values);
      if (data?.error) {
        onError();
        return toast.error(data?.message ?? "Something went wrong");
      }
      onSuccess();
      toast.success(data?.message ?? "Saved successfully");
    } catch {
      onError();
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Name</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="youtubeVideoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Youtube Video Id</FormLabel>
              <FormControl>
                <Input placeholder="youtube id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  ref={field.ref}
                  placeholder="What about this ?"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  value={field.value as string}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessonStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormDescription>
                Choose the current status of the lesson.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section</FormLabel>
              <FormControl>
                <Select
                  value={field.value as string}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(({ id, name }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormDescription>
                Choose the section this lesson belongs to.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="self-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            aria-disabled={isSubmitting}
            className={isSubmitting ? "opacity-80 pointer-events-none" : ""}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    opacity="0.2"
                  />
                  <path
                    d="M22 12a10 10 0 00-10-10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                {lesson ? "Updating…" : "Creating…"}
              </span>
            ) : lesson ? (
              "Update Lesson"
            ) : (
              "Create Lesson"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LessonForm;
