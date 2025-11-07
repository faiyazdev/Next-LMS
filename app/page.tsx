import { db } from "@/database";
import { usersTable } from "@/database/schema";

function Home() {
  return (
    <div>
      Home
      <br />
      <form
        onSubmit={async () => {
          "use server";

          await db
            .insert(usersTable)
            .values({
              name: "faiyaz",
              email: "faiyaz@gmail.com",
              role: "ADMID",
            });
        }}
      >
        <button type="submit">Create User!</button>
      </form>
    </div>
  );
}

export default Home;
