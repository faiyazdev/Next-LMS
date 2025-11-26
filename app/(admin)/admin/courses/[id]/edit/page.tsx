import PageHeader from "@/app/components/common/PageHeader";
import { Suspense } from "react";
import CourseEditContent from "./_components/CourseEditContent";

export default async function CourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <div className="flex justify-between">
        <PageHeader>Edit Page</PageHeader>
      </div>

      <div className="mt-10">
        <Suspense fallback={<h1>Loading course...</h1>}>
          <CourseEditContent courseId={id} />
        </Suspense>
      </div>
    </div>
  );
}
