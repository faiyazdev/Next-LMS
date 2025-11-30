import PageHeader from "@/app/components/common/PageHeader";
import { db } from "@/drizzle";
import { CourseTable } from "@/drizzle/schema";
import { ProductForm } from "@/features/products/components/ProductForm";
import { asc } from "drizzle-orm";

const NewProductPage = async () => {
  return (
    <div className="space-y-6">
      <PageHeader>Create New Product</PageHeader>
      <ProductForm courses={await getAllCourses()} />
    </div>
  );
};

async function getAllCourses() {
  return await db.query.CourseTable.findMany({
    columns: {
      id: true,
      name: true,
    },
    orderBy: asc(CourseTable.name),
  });
}
export default NewProductPage;
