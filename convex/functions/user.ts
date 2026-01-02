import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    console.log("currentUser");
    const userId = await getAuthUserId(ctx);
    const user = userId === null ? null : await ctx.db.get(userId);
    return user;
  },
});
