export function canDeleteProducts(user: {
  clerkUserId: string;
  dbId?: string;
  role?: string;
}) {
  // Only admin can delete products
  return user.role === "admin";
}

export function canCreateProducts(user: {
  clerkUserId: string;
  dbId?: string;
  role?: string;
}) {
  // Only admin can delete products
  return user.role === "admin";
}

export function canUpdateProducts(user: {
  clerkUserId: string;
  dbId?: string;
  role?: string;
}) {
  // Only admin can delete products
  return user.role === "admin";
}
