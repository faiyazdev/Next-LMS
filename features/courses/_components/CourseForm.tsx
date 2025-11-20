"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
// Assuming 'courseSchema' is defined in this path
import { courseSchema } from "../schemas/courses";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { createCourse, updateCourse } from "../actions/courses";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CourseTable } from "@/drizzle/schema";

export function CourseForm({ course }: { course?: CourseTable }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: course ? course.name : "",
      description: course ? course.description : "", // Make sure this matches your schema
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof courseSchema>) {
    const action = course ? updateCourse.bind(null, course.id!) : createCourse;
    const data = await action(values);
    if (data?.error) {
      return toast.error(data?.message);
    }
    toast.success(data?.message);
    router.push(`/admin/courses/${data?.course?.id}/edit`);
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
              <FormLabel>Course Name</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to React" {...field} />
              </FormControl>
              <FormDescription>
                This is the public display name of the course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. DESCRIPTION Field (The new field) */}
        <FormField
          control={form.control}
          name="description" //
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief summary of the course content"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short, compelling summary for marketing and syllabus use.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="self-end">
          <Button type="submit">
            {course ? "Update Course" : "Submit Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
