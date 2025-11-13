"use client";

import { useMemo } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import AccountSection from "@/components/account/AccountSection";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["Basic profile", "5 projects", "Community support", "1GB storage"],
    current: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    features: ["Advanced profile", "Unlimited projects", "Priority support", "50GB storage", "Analytics"],
    current: false,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    features: ["Everything in Pro", "Custom branding", "Dedicated support", "500GB storage", "API access", "Team collaboration"],
    current: false,
  },
];

export default function BillingPage() {
  const { user } = useAuth();
  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile]);

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
        <div className="space-y-8">
          <AccountSection title="Current Plan" description="Manage your subscription and billing">
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl border-2 p-6 ${
                    plan.current
                      ? "border-[#c49a47] bg-[#c49a47]/5"
                      : "border-gray-200 dark:border-white/10"
                  }`}
                >
                  {plan.current && (
                    <span className="mb-4 inline-block rounded-full bg-[#c49a47] px-3 py-1 text-xs font-semibold text-white">
                      Current Plan
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">/{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-[#c49a47]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.current ? "secondary" : "primary"}
                    className="mt-6 w-full"
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : "Upgrade"}
                  </Button>
                </div>
              ))}
            </div>
          </AccountSection>

          <AccountSection title="Payment Method">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Visa ending in 4242</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/2025</p>
                </div>
              </div>
              <Button variant="secondary">Update</Button>
            </div>
          </AccountSection>

          <AccountSection title="Billing History">
            <div className="space-y-3">
              {[
                { date: "Nov 1, 2024", amount: "$0.00", status: "Paid", invoice: "#INV-001" },
                { date: "Oct 1, 2024", amount: "$0.00", status: "Paid", invoice: "#INV-002" },
                { date: "Sep 1, 2024", amount: "$0.00", status: "Paid", invoice: "#INV-003" },
              ].map((bill) => (
                <div
                  key={bill.invoice}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{bill.date}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{bill.invoice}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900 dark:text-white">{bill.amount}</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                      {bill.status}
                    </span>
                    <button className="text-sm font-medium text-[#c49a47] hover:underline">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </AccountSection>
        </div>
      </AccountLayout>
    </ProtectedRoute>
  );
}
