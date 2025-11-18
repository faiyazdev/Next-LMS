import { deleteUser, insertUser, updateUser } from "@/features/users/db/users";
import { syncClerkUserMetadata } from "@/services/clerk/clerk";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;

    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const email = evt.data.email_addresses.find(
          (e) => e.id === evt.data.primary_email_address_id
        )?.email_address;
        const name = `${evt.data.first_name} ${evt.data.last_name}`.trim();

        if (!email || !name)
          return new Response("email or name not found", { status: 400 });

        if (eventType === "user.created") {
          const newUser = await insertUser({
            clerkUserId: evt.data.id,
            email,
            name,
            imageUrl: evt.data.image_url || null,
            role: "user",
          });
          await syncClerkUserMetadata(
            {
              clerkUserId: evt.data.id,
            },
            newUser
          );
        } else {
          await updateUser(
            { clerkUserId: evt.data.id },
            {
              email,
              name,
              imageUrl: evt.data.image_url || null,
              role: evt.data.public_metadata.role,
            }
          );
        }
        break;
      }
      case "user.deleted": {
        if (evt.data.id == null) {
          return new Response("clerkUserId not found", { status: 400 });
        }
        await deleteUser({ clerkUserId: evt.data.id });
        break;
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
