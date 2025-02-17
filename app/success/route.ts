"use server";

import { createClient } from "@/utils/supabase/server";
import { syncStripeDataToDatabase } from "@/utils/stripe";
import { redirect } from "next/navigation";
import db from "@/utils/db";
import { stripeCustomerTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getUser();
    if (error) {
        return redirect("/sign-in");
    }

    const stripeCustomerid = await db.select().from(stripeCustomerTable).where(eq(stripeCustomerTable.user_id, user.user.id)).execute().then(result => result.at(0)?.stripe_customer_id??null);

    // How do they even get here?
    if (!stripeCustomerid) {
        return redirect("/dashboard");
    }

    await syncStripeDataToDatabase(stripeCustomerid);
    return redirect("/dashboard");
}