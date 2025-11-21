import { UserTable } from "@/drizzle/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const syncClerkUserMetadata = async (
  {
    clerkUserId,
  }: {
    clerkUserId: string;
  },
  user: UserTable
) => {
  try {
    const client = await clerkClient();
    return client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        dbId: user.id,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export async function getCurrentUser() {
  const { userId, redirectToSignIn, sessionClaims } = await auth();

  return {
    clerkUserId: userId!,
    dbId: sessionClaims?.dbId,
    role: sessionClaims?.role,
    redirectToSignIn,
  };
}
