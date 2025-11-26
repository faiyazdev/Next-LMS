// CourseEditContent.tsx
import { getCourseById } from "@/features/courses/db/courses";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionFormDialog from "@/features/courseSections/components/SectionFormDialog";
import SortableSectionList from "@/features/courseSections/components/SortableSectionList";
import LessonFormDialog from "@/features/lessons/components/LessonFormDialog";
import SortableLessonList from "@/features/lessons/components/SortableLessonList";
import { CourseForm } from "@/features/courses/_components/CourseForm";
import { PlusIcon, EyeClosedIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function CourseEditContent({
  courseId,
}: {
  courseId: string;
}) {
  const course = await getCourseById(courseId);
  if (!course) return notFound();

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent className="mt-5" value="lessons">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Sections</CardTitle>
                <SectionFormDialog courseId={course.id}>
                  <Button className="outline">
                    <PlusIcon /> New Section
                  </Button>
                </SectionFormDialog>
              </div>
            </CardHeader>
            <CardContent className="mt-3 grid grid-cols-1 gap-y-10">
              <SortableSectionList
                courseId={course.id}
                sections={course.sections}
              />
            </CardContent>
          </Card>

          <hr className="py-4" />

          <div className="grid gap-5">
            {course.sections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      <div
                        className={cn(
                          "capitalize flex gap-3",
                          section.status === "private"
                            ? "text-gray-50/25"
                            : null
                        )}
                      >
                        {section.status === "private" && <EyeClosedIcon />}
                        {section.name}
                      </div>
                    </CardTitle>

                    <LessonFormDialog
                      defaultSectionId={section.id}
                      sections={course.sections}
                    >
                      <Button className="outline">
                        <PlusIcon /> New Lesson
                      </Button>
                    </LessonFormDialog>
                  </div>
                </CardHeader>

                <CardContent className="mt-3 grid grid-cols-1 gap-y-10">
                  <SortableLessonList
                    defaultSectionId={section.id}
                    lessons={section.lessons}
                    sections={course.sections}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CourseForm course={course} />
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
