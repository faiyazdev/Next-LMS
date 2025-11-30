import PageHeader from "@/app/components/common/PageHeader";
import { db } from "@/drizzle";
import { CourseTable, ProductTable } from "@/drizzle/schema";
import { ProductForm } from "@/features/products/components/ProductForm";
import { asc, eq } from "drizzle-orm";

const ProductEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  const product = await getProductById(id);
  if (!product) return <h1>Loading.</h1>;
  return (
    <div className="space-y-6">
      <PageHeader>Create New Product</PageHeader>
      <ProductForm
        courses={await getAllCourses()}
        product={{
          ...product,
          courseIds: product.courseProducts.map((c) => c.courseId),
        }}
      />
    </div>
  );
};

async function getProductById(productId: string) {
  return await db.query.ProductTable.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      imagePath: true,
      priceInDollars: true,
      status: true,
    },
    with: {
      courseProducts: {
        columns: {
          courseId: true,
        },
      },
    },
    where: eq(ProductTable.id, productId),
  });
}

async function getAllCourses() {
  return await db.query.CourseTable.findMany({
    columns: {
      id: true,
      name: true,
    },
    orderBy: asc(CourseTable.name),
  });
}
export default ProductEditPage;
