import PageHeader from "@/app/components/common/PageHeader";
import { CourseForm } from "@/features/courses/_components/CourseForm";

const NewCoursePage = () => {
  return (
    <div className="space-y-6">
      <PageHeader>Create New Course</PageHeader>
      <CourseForm />
    </div>
  );
};

export default NewCoursePage;
