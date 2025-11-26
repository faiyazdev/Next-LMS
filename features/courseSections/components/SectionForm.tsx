"use client";
import { CourseSectionStatus, courseSectionStatuses } from "@/drizzle/schema";
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
import { sectionSchema } from "../schemas/courseSections";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSection, updateSection } from "../actions/courseSections";

type SectionFormProps = {
  courseId: string;
  section?: {
    id: string;
    name: string;
    status: CourseSectionStatus;
  } & { id: string };
  onSuccess: () => void;
  onError: () => void;
};

const SectionForm = ({ courseId, section, onSuccess }: SectionFormProps) => {
  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: section ? section.name : "",
      status: section ? section.status : "private", // Make sure this matches your schema
    },
  });
  const { isSubmitting } = form.formState;
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof sectionSchema>) {
    const action = section
      ? updateSection.bind(null, section.id)
      : createSection.bind(null, courseId);
    const data = await action(values);
    if (data?.error) {
      return toast.error(data?.message);
    }
    onSuccess();
    toast.success(data?.message);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col"
      >
        {/* 1. NAME Field (Already implemented) */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Name</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. status Field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courseSectionStatuses.map((status) => {
                    return (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormDescription>
                Choose the current status of the course.
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
              // inline accessible spinner + label
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
                {section ? "Updating…" : "Creating…"}
              </span>
            ) : section ? (
              "Update Section"
            ) : (
              "Create Section"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SectionForm;
