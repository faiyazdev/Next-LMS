import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { db } from "@/drizzle";
import {
  CourseSectionTable,
  LessonTable,
  ProductTable,
} from "@/drizzle/schema";
import { getCourseIdTag } from "@/features/courses/db/cache/cache";
import { getCourseSectionCourseTag } from "@/features/courseSections/db/cache/courseSections";
import { getLessonCourseTag } from "@/features/lessons/db/cache/lessons";
import { PurchaseButton } from "@/features/products/components/PurchaseButton";
import { getProductIdTag } from "@/features/products/db/cache/products";
import { formatNumber, formatPlural } from "@/lib/formatters";
import { getUserCoupon } from "@/lib/userCountryHeader";
import { and, asc, eq, inArray } from "drizzle-orm";
import { cacheTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { VideoIcon } from "lucide-react";

async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getPublicProduct(productId);
  if (!product) return notFound();
  const courseCount = product.courses.length;
  const lessonCount = product.courses.reduce((courseAcc, course) => {
    return (
      courseAcc +
      course.sections.reduce(
        (secAcc, section) => secAcc + section.lessons.length,
        0
      )
    );
  }, 0);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row justify-between gap-8 border p-4">
        {/* Left column */}
        <div className="flex flex-col flex-1 gap-6">
          <h1 className="text-4xl">{product.name}</h1>

          <div className="text-sm text-gray-400">
            {formatPlural(courseCount, {
              singular: "course",
              plural: "courses",
            })}{" "}
            ·{" "}
            {formatPlural(lessonCount, {
              singular: "lesson",
              plural: "lessons",
            })}
          </div>

          <Suspense
            fallback={
              <div className="text-xl">
                {formatNumber(product.priceInDollars)}
              </div>
            }
          >
            <Price price={product.priceInDollars} />
          </Suspense>

          <p className="text-base text-gray-500">{product.description}</p>

          <Suspense fallback={<div />}>
            <PurchaseButton productId={product.id} />
          </Suspense>
        </div>

        {/* Right column: image */}
        {/* Make the parent relative and give it a fixed width on md+ screens, full width on small */}
        <div className="relative w-full md:w-1/3 lg:w-1/4 h-64 bg-gray-50 overflow-hidden rounded-md">
          <Image
            src={product.imagePath || "/images/placeholder-product.png"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-300 hover:scale-105"
            loading="lazy"
            draggable={false}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {product.courses.map((course) => {
          return (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>
                  <div className="text-sm text-gray-400">
                    {formatPlural(course.sections.length, {
                      singular: "section",
                      plural: "sections",
                    })}{" "}
                    ·{" "}
                    {formatPlural(
                      course.sections.reduce(
                        (acc, res) => acc + res.lessons.length,
                        0
                      ),
                      {
                        singular: "lesson",
                        plural: "lessons",
                      }
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple">
                  {course.sections.map((section) => {
                    const value = `course-${course.id}-section-${section.id}`; // << unique value
                    return (
                      <AccordionItem key={value} value={value}>
                        <AccordionTrigger>
                          <div className="">
                            <div className="">{section.name}</div>
                            <span>
                              {formatPlural(section.lessons.length, {
                                singular: "lesson",
                                plural: "lessons",
                              })}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {section.lessons.length ? (
                            section.lessons.map((lesson) => {
                              return (
                                <div className="flex gap-2" key={lesson.id}>
                                  <VideoIcon />
                                  {lesson.status === "preview" ? (
                                    <Link
                                      className="text-muted-foreground underline"
                                      href={`courses/${course.id}/lessons/${lesson.id}`}
                                    >
                                      {lesson.name}
                                    </Link>
                                  ) : (
                                    lesson.name
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <p>There is no lesson</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

async function Price({ price }: { price: number }) {
  const coupon = await getUserCoupon();
  if (price === 0 || !coupon)
    return <div className="text-xl">{formatNumber(price)}</div>;

  return (
    <div className="flex gap-2 item-baseline">
      <div className="line-through opacity-50 text-sm">
        {formatNumber(price)}
      </div>
      <div className="text-xl">
        {formatNumber(price * (1 - coupon.discountPercentage))}
      </div>
    </div>
  );
}

async function getPublicProduct(productId: string) {
  "use cache";
  cacheTag(getProductIdTag(productId));

  const product = await db.query.ProductTable.findFirst({
    columns: {
      id: true,
      name: true,
      imagePath: true,
      description: true,
      priceInDollars: true,
    },
    where: and(
      eq(ProductTable.id, productId),
      eq(ProductTable.status, "public")
    ),
    with: {
      courseProducts: {
        columns: {},
        with: {
          course: {
            columns: {
              id: true,
              name: true,
            },
            with: {
              sections: {
                columns: { id: true, name: true },
                where: eq(CourseSectionTable.status, "public"),
                orderBy: asc(CourseSectionTable.order),
                with: {
                  lessons: {
                    columns: { id: true, name: true, status: true },
                    where: inArray(LessonTable.status, ["public", "preview"]),
                    orderBy: asc(LessonTable.order),
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (product == null) return product;

  cacheTag(
    ...product.courseProducts.flatMap((cp) => [
      getLessonCourseTag(cp.course.id),
      getCourseSectionCourseTag(cp.course.id),
      getCourseIdTag(cp.course.id),
    ])
  );
  const { courseProducts, ...other } = product;
  return {
    ...other,
    courses: courseProducts.map((cp) => cp.course),
  };
}
export default ProductPage;
