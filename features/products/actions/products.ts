"use server";
import { getCurrentUser } from "@/services/clerk/clerk";
import { canDeleteProducts, canUpdateProducts } from "../permissions/products";
import z from "zod";
import { ProductInput, productSchema } from "../schemas/products";
import {
  insertProduct,
  updateProduct as updateProductDB,
  deleteProduct as deleteProductDB,
} from "../db/products";
import { ProductStatus } from "@/drizzle/schema";

export type ProductRow = {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  priceInDollars: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ActionError = {
  error: true;
  message: string;
  details?: string;
};

export type ActionSuccess = {
  error?: false;
  message: string;
  product?: ProductRow;
};

export type ActionResult = ActionError | ActionSuccess;

export async function deleteProduct(productId: string) {
  const user = await getCurrentUser();

  if (!canDeleteProducts(user)) {
    return {
      error: true,
      message: "you are not able to delete products, only admin user can",
    };
  }

  await deleteProductDB(productId);
  return { error: false, message: "product deleted successfully" };
}

export async function createProduct(unsafeData: ProductInput) {
  const user = await getCurrentUser();

  if (!canDeleteProducts(user)) {
    return {
      error: true,
      message: "you are not able to delete products, only admin user can",
    };
  }

  const { success, data } = productSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "validation failed to create product, try again",
    };
  }
  try {
    await insertProduct(data);
  } catch {
    return {
      error: true,
      message: "database error to create product, try again",
    };
  }
  return { error: false, message: "product created successfully" };
}

export async function updateProduct(
  productId: string,
  unsafeData: z.infer<typeof productSchema>
) {
  const user = await getCurrentUser();

  if (!canUpdateProducts(user)) {
    return {
      error: true,
      message: "you are not able to update products, only admin user can",
    };
  }

  const { success, data } = productSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "validation failed to update product, try again",
    };
  }
  try {
    await updateProductDB(productId, data);
  } catch {
    return {
      error: true,
      message: "database error to update product, try again",
    };
  }
  return { error: false, message: "product updated successfully" };
}
