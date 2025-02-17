import Stripe from 'stripe';
import { customerSubscriptionsTable, stripeCustomerTable } from '../db/schema';
import db from '../db';
import { createClient } from '../supabase/server';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripeClient = new Stripe(secretKey);

const allowedEvents: Stripe.Event.Type[] = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.upcoming",
  "invoice.marked_uncollectible",
  "invoice.payment_succeeded",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
];

// This should run for every important event
export async function syncStripeDataToDatabase(customerId: string) {
  // Fetch latest subscriptions data from Stripe
  const subscriptions = await stripeClient.subscriptions.list({
    customer: customerId,
    limit: 1, // The user can only have one subscription
    status: "all",
    expand: ["data.default_payment_method"],
  });

  if (subscriptions.data.length === 0) {
    // No subscriptions found, update the database or insert new record
    const subData = await db.insert(customerSubscriptionsTable).values({
      stripe_customer_id: customerId,
      subscription_status: "None",
      subscription_id: null,
      priceId: null,
      current_period_end: null,
      current_period_start: null,
      cancel_at_period_end: null,
      payment_brand: null,
      payment_last4: null
    }).onConflictDoUpdate({
      target: [customerSubscriptionsTable.stripe_customer_id],
      set: {
        subscription_status: "None",
        subscription_id: null,
        priceId: null,
        current_period_end: null,
        current_period_start: null,
        cancel_at_period_end: null,
        payment_brand: null,
        payment_last4: null
      }
    }).returning().then((res) => res[0]);

    revalidateTag("subscription-data");

    return subData;
  }

  const subscription = subscriptions.data[0];
  const payment_method = subscription.default_payment_method &&
  typeof subscription.default_payment_method !== "string"
    ? {
        brand: subscription.default_payment_method.card?.brand ?? null,
        last4: subscription.default_payment_method.card?.last4 ?? null,
      }
    : null;

  // Store the subscription data in the database
  const subData = await db.insert(customerSubscriptionsTable).values({
    stripe_customer_id: customerId,
    subscription_status: subscription.status.toString(),
    subscription_id: subscription.id.toString(), 
    priceId: subscription.items.data[0].price.id.toString(),
    current_period_end: new Date(subscription.current_period_end * 1000),
    current_period_start: new Date(subscription.current_period_start * 1000),
    cancel_at_period_end: subscription.cancel_at_period_end,
    payment_brand: payment_method?.brand,
    payment_last4: payment_method?.last4
  }).onConflictDoUpdate({
    target: [customerSubscriptionsTable.stripe_customer_id],
    set: {
      subscription_status: subscription.status.toString(),
      subscription_id: subscription.id.toString(),
      priceId: subscription.items.data[0].price.id.toString(), 
      current_period_end: new Date(subscription.current_period_end * 1000),
      current_period_start: new Date(subscription.current_period_start * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
      payment_brand: payment_method?.brand,
      payment_last4: payment_method?.last4
    }
  }).returning().then((res) => res[0]);

  revalidateTag("subscription-data");

  return subData;
}

export async function processEvent(event: Stripe.Event) {
  // Skip processing if the event isn't one I'm tracking (list of all events below)
  if (!allowedEvents.includes(event.type)) return;

  // All the events I track have a customerId
  const { customer: customerId } = event?.data?.object as {
    customer: string; // Sadly TypeScript does not know this
  };

  // This helps make it typesafe and also lets me know if my assumption is wrong
  if (typeof customerId !== "string") {
    throw new Error(
      `[STRIPE HOOK][CANCER] ID isn't string.\nEvent type: ${event.type}`
    );
  }

  return await syncStripeDataToDatabase(customerId);
}

export async function GoToCustomerPortal() {
  "use server";
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();
  if (error) {
    return redirect("/sign-in");
  }
  const stripeCustomerid = await db.select().from(stripeCustomerTable).where(eq(stripeCustomerTable.user_id, user.user.id)).limit(1).execute().then(result => result.at(0)?.stripe_customer_id??null);
  if (!stripeCustomerid) {
    return redirect("/");
  }
  return await GetCustomerPortalSession(stripeCustomerid);
}

async function GetCustomerPortalSession(stripeCustomerId: string) {
  const portalSession = await stripeClient.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
  });
  return redirect(portalSession.url);
}

export async function GetStripeCheckout(plan: string) {
  "use server";
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();
  if (error) {
      return redirect("/sign-in");
  }
  const userId = user.user?.id ?? "";
  // Would work faster if I used a KV (redis) here
  const stripeCustomerData = await db.select().from(stripeCustomerTable).leftJoin(customerSubscriptionsTable, eq(customerSubscriptionsTable.stripe_customer_id, stripeCustomerTable.stripe_customer_id)).where(eq(stripeCustomerTable.user_id, userId)).execute().then(result => result.at(0) ?? null);
  let stripeCustomerId = stripeCustomerData?.stripe_customer.stripe_customer_id ?? "";

  // Create a new Stripe customer if this user doesn't have one
  if (stripeCustomerId === "") {
      const newCustomer = await stripeClient.customers.create({
          email: user.user.email,
          metadata: {
              user_id: userId
          }
      });

      // Store the relation between userId and stripeCustomerId in the database
      await db.insert(stripeCustomerTable).values({
          stripe_customer_id: newCustomer.id,
          user_id: userId
      });

      stripeCustomerId = newCustomer.id;
  }
  if (stripeCustomerData?.customer_subscriptions?.subscription_status == "active") {
    // TODO: Figure out some logic here if the user wants to change their plan
    return GetCustomerPortalSession(stripeCustomerId);
  }

  let planId = "";

  if (plan == "basic") {
      const basicPriceId = process.env.BASIC_PLAN_PRICE_ID;
      if (!basicPriceId) {
          throw Error("BASIC_PLAN_PRICE_ID is not set");
      }
      planId = basicPriceId;
  }
  else if (plan == "pro") {
      const proPriceId = process.env.PRO_PLAN_PRICE_ID;
      if (!proPriceId) {
          throw Error("PRO_PLAN_PRICE_ID is not set");
      }
      planId = proPriceId;
  }
  else {
      throw Error("Invalid plan");
  }

  const currentUrl = process.env.NEXT_PUBLIC_URL;
  if (!currentUrl) {
      throw Error("NEXT_PUBLIC_URL is not set");
  }

  const successUrl = `${currentUrl}/success`; // TODO: Redirect from this URL to onboarding page

  // ALWAYS create a checkout with a stripeCustomerId. They should enforce this.
  const checkout = await stripeClient.checkout.sessions.create({
      customer: stripeCustomerId,
      success_url: successUrl,
      cancel_url: `${currentUrl}/?section=pricing`,
      mode: "subscription",
      line_items: [
          {
              price: planId,
              quantity: 1
          }
      ]
  });
  if (checkout.url) {
      return redirect(checkout.url);
  }
  else {
      return;
  }
}