# 🎯 How to Add Subscription Links to Navigation

## Option 1: Update Account Dashboard

Add these links to your account dashboard component:

```tsx
import Link from 'next/link';
import { CreditCard, History } from 'lucide-react';

// In your account dashboard component:
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  
  {/* Subscribe Link */}
  <Link 
    href="/dashboard/account/subscribe"
    className="rounded-xl border-2 border-primary bg-white p-6 shadow-sm transition-all hover:shadow-lg"
  >
    <CreditCard className="h-8 w-8 text-primary mb-3" />
    <h3 className="text-lg font-semibold text-gray-900">Subscribe</h3>
    <p className="mt-2 text-sm text-gray-600">
      Choose a subscription package
    </p>
  </Link>

  {/* Subscription History Link */}
  <Link 
    href="/dashboard/account/subscriptions"
    className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
  >
    <History className="h-8 w-8 text-gray-700 mb-3" />
    <h3 className="text-lg font-semibold text-gray-900">Subscriptions</h3>
    <p className="mt-2 text-sm text-gray-600">
      View your subscription history
    </p>
  </Link>

</div>
```

## Option 2: Add to Header/Navigation Menu

```tsx
// In your header navigation component:
{isAuthenticated && (
  <nav>
    {/* Other nav items */}
    
    <Link href="/dashboard/account/subscribe">
      Subscribe
    </Link>
    
    <Link href="/dashboard/account/subscriptions">
      My Subscriptions
    </Link>
  </nav>
)}
```

## Option 3: Add to Account Settings Sidebar

```tsx
// In your account settings sidebar:
const navigation = [
  { name: 'Profile', href: '/dashboard/account', icon: User },
  { name: 'Subscribe', href: '/dashboard/account/subscribe', icon: CreditCard },
  { name: 'Subscriptions', href: '/dashboard/account/subscriptions', icon: History },
  { name: 'Settings', href: '/dashboard/account/settings', icon: Settings },
];
```

## Subscription Status Badge

You can also add a subscription status indicator in the header:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { getSubscriptionStatus } from '@/lib/api/subscriptions';
import { getActiveProfileId } from '@/lib/api/client';

export function SubscriptionBadge() {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profileId = getActiveProfileId();
    if (profileId) {
      getSubscriptionStatus(Number(profileId))
        .then(res => {
          setHasSubscription(res.data.has_subscription);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) return null;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
      hasSubscription 
        ? 'bg-green-100 text-green-700' 
        : 'bg-gray-100 text-gray-700'
    }`}>
      {hasSubscription ? 'Premium' : 'Free'}
    </span>
  );
}
```

## Conditional Access Based on Subscription

You can protect certain features based on subscription status:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { getSubscriptionStatus } from '@/lib/api/subscriptions';
import { getActiveProfileId } from '@/lib/api/client';
import Link from 'next/link';

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profileId = getActiveProfileId();
    if (profileId) {
      getSubscriptionStatus(Number(profileId))
        .then(res => {
          setHasSubscription(res.data.has_subscription);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasSubscription) {
    return (
      <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-8 text-center">
        <h3 className="text-xl font-semibold text-orange-900">
          Premium Feature
        </h3>
        <p className="mt-2 text-gray-700">
          This feature requires an active subscription.
        </p>
        <Link
          href="/dashboard/account/subscribe"
          className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90"
        >
          Subscribe Now
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

// Usage:
<SubscriptionGuard>
  <PremiumFeature />
</SubscriptionGuard>
```

## Files to Update

Based on your project structure, you should update these files:

1. **Account Dashboard**
   - File: `src/app/dashboard/account/page.tsx`
   - Add subscription cards

2. **Header Navigation** (if exists)
   - File: `src/components/layout/Header.tsx`
   - Add subscription links

3. **Account Layout** (if exists)
   - File: `src/components/account/AccountLayout.tsx`
   - Add sidebar navigation items

---

**Next Steps:**
1. Choose one of the integration options above
2. Update the relevant component files
3. Test navigation flow
4. Add subscription status indicators where needed
