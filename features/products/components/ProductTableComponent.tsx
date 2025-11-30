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
import { formatNumber, formatPlural } from "@/lib/formatters";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import ActionButton from "@/app/components/common/ActionButton";
import { ProductStatus } from "@/drizzle/schema";
import Image from "next/image";
import { deleteProduct } from "../actions/products";

type ProductTableProps = {
  products: {
    id: string;
    name: string;
    description: string;
    status: ProductStatus;
    imagePath: string;
    priceInDollars: number;
    courseCount: number;
    customerCount: number;
  }[];
};

const ProductTableComponent = ({ products }: ProductTableProps) => {
  return (
    <Table>
      <TableCaption>A list of Products information.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">
            {formatPlural(products.length, {
              singular: "Product",
              plural: "Products",
            })}
          </TableHead>
          <TableHead>Customers</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products?.map((product) => {
          return (
            <TableRow key={product.id}>
              <TableCell className="flex gap-4">
                <Image
                  src={product.imagePath}
                  width={192}
                  height={192}
                  alt="img"
                />
                <div className="flex flex-col gap-1">
                  <h2 className="text-3xl font-medium">{product.name}</h2>
                  <p>{product.description}</p>
                  <div className="flex gap-3">
                    <span>
                      {formatPlural(product.courseCount, {
                        singular: "course",
                        plural: "courses",
                      })}{" "}
                      . {formatNumber(product.priceInDollars)}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.customerCount}</TableCell>
              <TableCell>{product.status}</TableCell>
              <TableCell className="">
                <div className="flex gap-3 justify-end">
                  <Button asChild variant={"outline"} className="">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <ActionButton
                    requireAreYouSure={true}
                    action={deleteProduct.bind(null, product.id)}
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

export default ProductTableComponent;
