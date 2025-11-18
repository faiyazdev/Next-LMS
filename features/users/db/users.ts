import { db } from "@/drizzle";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function insertUser(data: UserTable) {
  const [newUser] = await db
    .insert(UserTable)
    .values(data)
    .onConflictDoUpdate({
      target: UserTable.clerkUserId,
      set: {
        email: data.email,
        id: data.id,
        clerkUserId: data.clerkUserId,
        name: data.name,
        role: "user",
        imageUrl: data.imageUrl,
      },
    })
    .returning();

  return newUser;
}

export async function updateUser(
  { clerkUserId }: { clerkUserId: string },
  data: Partial<UserTable>
) {
  const [updatedUser] = await db
    .update(UserTable)
    .set({
      email: data.email,
      name: data.name,
      imageUrl: data.imageUrl,
      role: data.role,
    })
    .where(eq(UserTable.clerkUserId, clerkUserId))
    .returning();

  return updatedUser;
}

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
  return await db
    .update(UserTable)
    .set({
      email: "deleted@email.com",
      clerkUserId: `deleted-clerkUserId-${clerkUserId}`,
      name: "deleted name",
      imageUrl: "delted image path",
      deletedAt: new Date(),
    })
    .where(eq(UserTable.clerkUserId, clerkUserId))
    .returning();
}
