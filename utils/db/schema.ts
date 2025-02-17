import { boolean, foreignKey, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const stripeCustomerTable = pgTable("stripe_customer", {
    id: uuid("id").primaryKey().defaultRandom(),
    stripe_customer_id: text("stripe_customer_id").unique().notNull(),
    user_id: uuid("user_id").notNull()
}, (table) => [
    foreignKey({
      columns: [table.user_id],
	  // reference to the auth table from Supabase
      foreignColumns: [authUsers.id],
      name: "stripe_customer_user_id_fk",
    }).onDelete("cascade")
]).enableRLS();

export const customerSubscriptionsTable = pgTable("customer_subscriptions", {
	id: uuid("id").primaryKey().defaultRandom(),
	stripe_customer_id: text("stripe_customer_id").unique().notNull(),
	subscription_status: text("subscription_status").notNull().default("None"),
	subscription_id: text("subscription_id"),
	priceId: text("price_id"),
	current_period_end: timestamp("current_period_end"),
	current_period_start: timestamp("current_period_start"),
	cancel_at_period_end: boolean("cancel_at_period_end"),
	payment_brand: text("payment_brand"),
	payment_last4: text("payment_last4")
}).enableRLS();