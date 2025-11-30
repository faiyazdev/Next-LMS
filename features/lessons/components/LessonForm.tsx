"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { LessonStatus, lessonStatuses } from "@/drizzle/schema";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
// lazy load the heavy player
const YouTubePlayer = dynamic(() => import("./YoutubePlayer"), {
  ssr: false,
  loading: () => <div className="h-72 w-full bg-gray-100 animate-pulse" />,
});

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

/** helper to extract a YouTube ID from many URL forms or return the input if it already looks like an ID */
function getYouTubeId(urlOrId?: string | null) {
  if (!urlOrId) return null;
  const str = String(urlOrId).trim();

  // quick ID-only check (11 chars, alphanumeric + - _)
  if (/^[\w-]{11}$/.test(str)) return str;

  // try to extract from common url patterns
  const regExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:\S+)?$/;
  const match = str.match(regExp);
  return match ? match[1] : null;
}

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

  // useWatch to watch the youtubeVideoId field for live preview
  const watchedYoutubeValue = useWatch({
    control: form.control,
    name: "youtubeVideoId",
  });

  // compute a preview id (prefers the live field; falls back to existing lesson value)
  const previewId = useMemo(() => {
    // if user typed/pasted a URL - extract ID; else if they passed an ID return it
    const idFromField = getYouTubeId(watchedYoutubeValue ?? "");
    if (idFromField) return idFromField;

    // if editing an existing lesson and the field is empty, prefer lesson.youtubeVideoId
    const idFromExisting = getYouTubeId(lesson?.youtubeVideoId ?? "");
    return idFromExisting ?? null;
  }, [watchedYoutubeValue, lesson?.youtubeVideoId]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof lessonSchema>) {
    const normalizedId =
      getYouTubeId(values.youtubeVideoId) ?? values.youtubeVideoId;
    const payload = { ...values, youtubeVideoId: normalizedId };

    const action = lesson
      ? (vals: z.infer<typeof lessonSchema>) => updateLesson(lesson.id, vals)
      : createLesson;

    try {
      const data = await action(payload);
      if (data?.error) {
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
              <FormLabel>Youtube Video Id or URL</FormLabel>
              <FormControl>
                <Input placeholder="youtube id or url" {...field} />
              </FormControl>
              <FormDescription>
                Paste a full YouTube URL (https://youtu.be/...) or just the
                11-character ID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Live preview area */}
        {previewId ? (
          <div>
            <div className="mb-2 text-sm text-muted-foreground">
              Live preview
            </div>
            <YouTubePlayer videoId={previewId} />
          </div>
        ) : // if there's no preview id but the user has typed something invalid, show friendly hint
        watchedYoutubeValue ? (
          <div className="text-sm text-rose-600">
            Can not extract a valid YouTube ID from that input.
          </div>
        ) : null}

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

        {/* Render the saved lesson preview when viewing an existing lesson (if not already shown above) */}
        {!watchedYoutubeValue && lesson?.youtubeVideoId && !previewId ? (
          <YouTubePlayer videoId={lesson.youtubeVideoId} />
        ) : null}
      </form>
    </Form>
  );
};

export default LessonForm;
