import { Button } from "@/components/ui/button";
import Link from "next/link";
import { checkIsUserOwnProduct } from "../db/products";
import { getCurrentUser } from "@/services/clerk/clerk";

export async function PurchaseButton({ productId }: { productId: string }) {
  const user = await getCurrentUser();
  if (!user || !user.dbId) return null;
  const isOwnProduct = await checkIsUserOwnProduct({
    productId,
    userId: user.dbId,
  });
  if (!isOwnProduct) return <p>You own the product</p>;
  return (
    <Button variant={"outline"} asChild>
      <Link href={`products/${productId}/purchase`}>Purchase</Link>
    </Button>
  );
}
