import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

// shadcn/ui components (assumes you have these available from your UI library)
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/lib/formatters";
import { getUserCoupon } from "@/lib/userCountryHeader";

export type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    imagePath: string;
    priceInDollars: number;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const { id, name, description, imagePath, priceInDollars } = product;

  return (
    <Card className="hover:shadow-lg pt-0 pb-1 transition-shadow duration-200">
      <Link
        href={`/products/${id}`}
        aria-label={`View ${name}`}
        className="block"
      >
        <div className="relative w-full h-16 sm:h-36 bg-muted/40 rounded-t-lg overflow-hidden">
          <Image
            src={imagePath || "/images/placeholder-product.png"}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-300"
            loading="lazy"
            draggable={false}
          />
        </div>
      </Link>

      <CardHeader className="">
        <CardTitle className="text-sm sm:text-base line-clamp-2">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-2 pt-0">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </CardContent>

      <Separator />

      <CardFooter className="flex items-center justify-between gap-4 px-4 py-3">
        <div>
          <div className="text-sm font-medium">
            <Suspense fallback={formatNumber(priceInDollars)}>
              <Price price={priceInDollars} />
            </Suspense>
          </div>
          <Badge className="mt-1">In stock</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/products/${id}`}>
            <Button size="sm">View</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

async function Price({ price }: { price: number }) {
  const coupon = await getUserCoupon();
  if (price === 0 || !coupon) return formatNumber(price);

  return (
    <div className="flex gap-2 item-baseline">
      <div className="line-through opacity-50">{formatNumber(price)}</div>
      <div className="">
        {formatNumber(price * (1 - coupon.discountPercentage))}
      </div>
    </div>
  );
}
