import PageHeader from "@/app/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import ProductTableComponent from "@/features/products/components/ProductTableComponent";
import { getAllProducts } from "@/features/products/db/products";
import Link from "next/link";
import { Suspense } from "react";

function ProductsPage() {
  return (
    <div>
      <div className="flex justify-between">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href={"/admin/products/new"}>New Product</Link>
        </Button>
      </div>
      <div className="mt-10">
        <Suspense fallback={<div>Loading</div>}>
          <GetProductsSuspense />
        </Suspense>
      </div>
    </div>
  );
}

export default ProductsPage;

async function GetProductsSuspense() {
  const products = await getAllProducts();
  return <ProductTableComponent products={products} />;
}
