import { db } from "@/drizzle";
import {
  CourseProductTable,
  ProductTable,
  PurchaseTable,
} from "@/drizzle/schema";
import { countDistinct, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import {
  getProductGlobalTag,
  revalidateProductCacheTag,
} from "./cache/products";

type ProductInsertForCreate = Omit<
  typeof ProductTable.$inferInsert,
  "id" | "createdAt" | "updatedAt"
>;

export async function getAllProducts() {
  "use cache";
  cacheTag(getProductGlobalTag());
  return await db
    .select({
      id: ProductTable.id,
      name: ProductTable.name,
      description: ProductTable.description,
      status: ProductTable.status,
      imagePath: ProductTable.imagePath,
      priceInDollers: ProductTable.priceInDollars,
      courseCount: countDistinct(CourseProductTable.courseId),
      customerCount: countDistinct(PurchaseTable.userId),
    })
    .from(ProductTable)
    .leftJoin(PurchaseTable, eq(PurchaseTable.productId, ProductTable.id))
    .leftJoin(
      CourseProductTable,
      eq(CourseProductTable.productId, ProductTable.id)
    )
    .groupBy(ProductTable.id)
    .orderBy(ProductTable.name);
}

export async function deleteProduct(productId: string) {
  const [deletedProduct] = await db
    .delete(ProductTable)
    .where(eq(ProductTable.id, productId))
    .returning();

  if (deleteProduct == null)
    throw new Error("failed to delete product, database error");

  await db
    .delete(CourseProductTable)
    .where(eq(CourseProductTable.productId, deletedProduct.id))
    .returning();

  revalidateProductCacheTag(deletedProduct.id);
}

export async function insertProduct(
  data: ProductInsertForCreate & {
    courseIds: string[];
  }
) {
  const newProduct = await db.transaction(async (trx) => {
    const [newProduct] = await trx
      .insert(ProductTable)
      .values(data)
      .returning();

    if (deleteProduct == null)
      throw new Error("failed to delete product, database error");

    await trx
      .insert(CourseProductTable)
      .values(
        data.courseIds.map((courseId) => ({
          productId: newProduct.id,
          courseId,
        }))
      )
      .returning();

    return newProduct;
  });

  revalidateProductCacheTag(newProduct.id);
}

export async function updateProduct(
  productId: string,
  data: Partial<typeof ProductTable.$inferInsert> & { courseIds: string[] }
) {
  const updateProduct = await db.transaction(async (trx) => {
    const [updateProduct] = await trx
      .update(ProductTable)
      .set(data)
      .where(eq(ProductTable.id, productId))
      .returning();

    if (updateProduct == null)
      throw new Error("failed to delete product, database error");

    await trx
      .delete(CourseProductTable)
      .where(eq(CourseProductTable.productId, updateProduct.id))
      .returning();

    await trx
      .insert(CourseProductTable)
      .values(
        data.courseIds.map((courseId) => ({
          productId: updateProduct.id,
          courseId,
        }))
      )
      .returning();

    return updateProduct;
  });

  revalidateProductCacheTag(updateProduct.id);
}
