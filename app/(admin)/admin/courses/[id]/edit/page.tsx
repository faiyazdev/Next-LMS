import PageHeader from "@/app/components/common/PageHeader";
import { getCourseById } from "@/features/courses/db/courses";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseForm } from "@/features/courses/_components/CourseForm";
import SectionFormDialog from "@/features/courseSections/components/SectionFormDialog";
import { EyeClosedIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import ActionButton from "@/app/components/common/ActionButton";
import { deleteSection } from "@/features/courseSections/actions/courseSections";
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
          <TabsContent value="lessons">
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
                {course.sections.map((section) => {
                  return (
                    <div className="flex justify-between" key={section.id}>
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
                      <div className="flex gap-4">
                        <SectionFormDialog
                          courseId={course.id}
                          section={{ ...section, courseId: course.id }}
                        >
                          <Button>Edit</Button>
                        </SectionFormDialog>
                        <ActionButton
                          requireAreYouSure={true}
                          action={deleteSection.bind(null, section.id)}
                        >
                          <Trash2Icon />
                        </ActionButton>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
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
