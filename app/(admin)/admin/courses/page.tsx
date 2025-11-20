import PageHeader from "@/app/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import CourseTableComponent from "@/features/courses/_components/CourseTableComponent";
import { getAllCourses } from "@/features/courses/db/courses";
import Link from "next/link";
import { Suspense } from "react";

function Courses() {
  return (
    <div>
      <div className="flex justify-between">
        <PageHeader>Courses</PageHeader>
        <Button asChild>
          <Link href={"/admin/courses/new"}>New Course</Link>
        </Button>
      </div>
      <div className="mt-10">
        <Suspense fallback={<div>Loading</div>}>
          <CourseTableSuspense />
        </Suspense>
      </div>
    </div>
  );
}

export default Courses;

async function CourseTableSuspense() {
  const courses = await getAllCourses();
  return <CourseTableComponent courses={courses} />;
}
