"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPlural } from "@/lib/formatters";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteCourse } from "../actions/courses";
import ActionButton from "@/app/components/common/ActionButton";

type CourseTableProps = {
  courses: {
    id: string;
    name: string;
    description: string;
    sectionCount: number;
    lessonCount: number;
    studentCount: number;
  }[];
};

const CourseTableComponent = ({ courses }: CourseTableProps) => {
  return (
    <Table>
      <TableCaption>A list of Courses information.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">
            {formatPlural(courses.length, {
              singular: "Course",
              plural: "Courses",
            })}
          </TableHead>
          <TableHead>Students</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses?.map((course) => {
          return (
            <TableRow key={course.id}>
              <TableCell className="flex flex-col gap-1">
                <h2 className="text-3xl font-medium">{course.name}</h2>
                <div className="flex gap-3">
                  <span>
                    {formatPlural(course.sectionCount, {
                      singular: "section",
                      plural: "sections",
                    })}
                  </span>
                  <span>
                    {formatPlural(course.lessonCount, {
                      singular: "lesson",
                      plural: "lessons",
                    })}
                  </span>
                </div>
              </TableCell>
              <TableCell>{course.studentCount}</TableCell>
              <TableCell className="">
                <div className="flex gap-3 justify-end">
                  <Button asChild variant={"outline"} className="">
                    <Link href={`/admin/courses/${course.id}/edit`}> Edit</Link>
                  </Button>
                  <ActionButton
                    requireAreYouSure={true}
                    action={deleteCourse.bind(null, course.id)}
                  >
                    <Trash2 />
                    <span className="sr-only">Delete</span>
                  </ActionButton>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default CourseTableComponent;
