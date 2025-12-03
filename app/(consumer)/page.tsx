import { db } from "@/drizzle";
import { ProductTable } from "@/drizzle/schema";
import ProductCard from "@/features/products/components/ProductCard";
import { desc, eq } from "drizzle-orm";

async function HomePage() {
  const products = await getPublicProducts();
  if (!products) return <h1>Loading</h1>;

  return (
    <div>
      <h1>hello</h1>
      <div className="my-5 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {products.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}
async function getPublicProducts() {
  return await db.query.ProductTable.findMany({
    columns: {
      id: true,
      name: true,
      imagePath: true,
      description: true,
      priceInDollars: true,
    },
    where: eq(ProductTable.status, "public"),
    orderBy: desc(ProductTable.createdAt),
  });
}
export default HomePage;
