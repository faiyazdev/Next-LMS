"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProductStatus, productStatuses } from "@/drizzle/schema";
import { productSchema } from "../schemas/products";
import { createProduct, updateProduct } from "../actions/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductForm({
  product,
  courses,
}: {
  product?: {
    name: string;
    description: string;
    imagePath: string;
    priceInDollars: number;
    id: string;
    status: ProductStatus;
    courseIds: string[];
  };

  courses: {
    id: string;
    name: string;
  }[];
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      imagePath: product?.imagePath ?? "",
      priceInDollars: product?.priceInDollars ?? 0,
      status: product?.status ?? "private",
      courseIds: product?.courseIds ?? [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof productSchema>) {
    const action = product
      ? updateProduct.bind(null, product.id)
      : createProduct;
    const data = await action(values);
    if (data?.error) {
      return toast.error(data?.message);
    }
    toast.success(data?.message);
    // router.push(`/admin/products/${data?.product?.id}/edit`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col"
      >
        {/* 1. NAME Field (Already implemented) */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to React" {...field} />
              </FormControl>
              <FormDescription>
                This is the public display name of the course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceInDollars"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  step={1}
                  min={0}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. DESCRIPTION Field (The new field) */}
        <FormField
          control={form.control}
          name="description" //
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief summary of the product content"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imagePath" //
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Path</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* 2. status Field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productStatuses.map((status) => {
                    return (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormDescription>
                Choose the current status of the product.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. courses Field */}
        <FormField
          control={form.control}
          name="courseIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Included Courses</FormLabel>
              <MultiSelect
                onValuesChange={field.onChange}
                defaultValues={field.value}
              >
                <MultiSelectTrigger className="w-full max-w-[400px]">
                  <MultiSelectValue placeholder="Select frameworks..." />
                </MultiSelectTrigger>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {courses.map((course) => {
                      return (
                        <MultiSelectItem key={course.id} value={course.id}>
                          {course.name}
                        </MultiSelectItem>
                      );
                    })}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="self-end">
          <Button type="submit">
            {product ? "Update Product" : "Submit Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
