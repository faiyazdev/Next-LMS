import PageHeader from "@/app/components/common/PageHeader";
import { getCourseById } from "@/features/courses/db/courses";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseForm } from "@/features/courses/_components/CourseForm";
import SectionFormDialog from "@/features/courseSections/components/SectionFormDialog";
import { EyeClosedIcon, PlusIcon } from "lucide-react";
import SortableSectionList from "@/features/courseSections/components/SortableSectionList";
import { cn } from "@/lib/utils";
async function CourseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (course == null) return notFound();
  return (
    <div>
      <PageHeader>Edit Page</PageHeader>
      <div className="flex w-full flex-col gap-6 mt-10">
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
                    <Button variant={"outline"}>
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
            <hr className="my-4" />
            <div className="grid gap-5">
              {course.sections.map((section) => {
                return (
                  <Card className="" key={section.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center gap-4">
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
                        <SectionFormDialog courseId={course.id}>
                          <Button variant={"outline"}>
                            <PlusIcon /> New Lesson
                          </Button>
                        </SectionFormDialog>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-3 grid grid-cols-1 gap-y-10"></CardContent>
                  </Card>
                );
              })}
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
    </div>
  );
}

export default CourseEditPage;
