import { GetStripeCheckout } from "@/utils/stripe";

export default async function Home() {
  return (
    <>
      <div className="flex flex-col items-center w-full max-w-6xl px-4 py-16 gap-16">
        <div className="flex flex-col items-center text-center gap-8">
          <h1 className="text-6xl font-bold">
            Build Your SaaS Faster
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Start with authentication, user management, and a beautiful UI. Focus on building your product, not the infrastructure.
          </p>
          <div className="flex gap-4">
            <a href="/sign-up" className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium">
              Get Started
            </a>
            <a href="https://github.com" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-md font-medium">
              View on GitHub
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="flex flex-col gap-4 p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-semibold">Authentication</h3>
            <p className="text-muted-foreground">
              Secure user authentication powered by Supabase. Email/password, social logins, and magic links supported.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-semibold">Beautiful UI</h3>
            <p className="text-muted-foreground">
              Modern, responsive interface built with Tailwind CSS and shadcn/ui components. Dark mode included.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-semibold">User Management</h3>
            <p className="text-muted-foreground">
              Complete user flows including sign up, sign in, password reset, and email verification.
            </p>
          </div>
        </div>

        <div id="pricing" className="flex flex-col items-center gap-8 w-full">
          <h2 className="text-4xl font-bold text-center">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground text-center max-w-2xl">
            Choose the plan that's right for you
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div className="flex flex-col gap-6 p-8 bg-card rounded-lg border">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">Basic Plan</h3>
                <p className="text-3xl font-bold">$9<span className="text-lg text-muted-foreground">/month</span></p>
                <p className="text-muted-foreground">Perfect for getting started</p>
              </div>
              
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Up to 1,000 users
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Basic analytics
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Email support
                </li>
              </ul>
              <div className="flex-grow" />

              <form action={GetStripeCheckout.bind(null, "basic")}>
                <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium">
                  Get Started
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-6 p-8 bg-card rounded-lg border border-primary">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">Pro Plan</h3>
                <p className="text-3xl font-bold">$29<span className="text-lg text-muted-foreground">/month</span></p>
                <p className="text-muted-foreground">For growing businesses</p>
              </div>
              
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Unlimited users
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Advanced analytics
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Custom integrations
                </li>
              </ul>

              <form action={GetStripeCheckout.bind(null, "pro")}>
                <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium">
                  Get Started
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
