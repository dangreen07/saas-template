<a href="https://github.com/dangreen07/saas-template">
  <h1 align="center">Next.js SaaS Starter Kit</h1>
</a>

<p align="center">
 A modern SaaS starter kit built with Next.js 15, Supabase, Stripe, and Tailwind CSS
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a>
</p>
<br/>

## Features

- **Authentication & User Management**
  - Complete auth flows with Supabase Auth
  - Email/password, magic links, and social login support
  - User profile and settings management
  - Password reset and email verification

- **Subscription & Payments**
  - Stripe integration for recurring subscriptions
  - Multiple pricing tiers (Basic & Pro plans)
  - Customer portal for subscription management
  - Webhook handling for subscription updates

- **Modern Tech Stack**
  - Server Components and Server Actions with Next.js 14
  - Type-safe database queries with Drizzle ORM
  - Beautiful UI with Tailwind CSS and shadcn/ui
  - Dark mode support with next-themes

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org)
- **Authentication:** [Supabase Auth](https://supabase.com/auth)
- **Database:** [Supabase PostgreSQL](https://supabase.com/database)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Payments:** [Stripe](https://stripe.com)
- **Email:** [Supabase Email](https://supabase.com/docs/guides/auth/auth-email)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Stripe account

### Setup

1. Clone the repository:
```bash
git clone https://github.com/dangreen07/saas-template.git
cd your-saas-starter
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your environment variables:
```bash
NEXT_PUBLIC_URL=your-server-url

NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

DATABASE_URL_MIGRATIONS=your-migrations-database-url
DATABASE_URL=your-database-url

STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

BASIC_PLAN_PRICE_ID=your-basic-plan-price-id
PRO_PLAN_PRICE_ID=your-pro-plan-price-id
```

5. Run database migrations:
```bash
npm run db:migrate
```

6. Start the development server:
```bash
npm run dev
```

Your app should now be running on [http://localhost:3000](http://localhost:3000)!

## Project Structure
```.
├── app/ # Next.js app directory
│ ├── (auth-pages)/ # Authentication pages
│ ├── api/ # API routes
│ └── layout.tsx # Root layout
├── components/ # React components
├── lib/ # Utility functions
├── utils/ # Helper functions
│ ├── db/ # Database utilities
│ ├── stripe/ # Stripe integration
│ └── supabase/ # Supabase utilities
└── public/ # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.