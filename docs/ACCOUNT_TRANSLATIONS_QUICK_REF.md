# Account Translations - Quick Reference

## How to Use Account Translations

### Import the hook
```typescript
import { useI18n } from '@/contexts/I18nContext';

const { t } = useI18n();
```

### Translation Namespaces

#### 🏠 Account Main (`account.*`)
General account settings, navigation, and notifications.
```typescript
t('account.title')                    // "Account Settings"
t('account.nav.basic')                // "Basic Information"
t('account.nav.billing')              // "Billing & Plans"
t('account.status.approved')          // "approved"
t('account.buttons.saving')           // "Saving..."
t('account.notifications.title')      // "Notification Preferences"
```

#### 👤 Basic Information (`accountBasic.*`)
Personal details, contact info, demographics.
```typescript
t('accountBasic.title')               // "Basic Information"
t('accountBasic.fields.firstName')    // "First Name"
t('accountBasic.fields.email')        // "Email Address"
t('accountBasic.errors.nameRequired') // "First name and last name are required"
t('accountBasic.success')             // "Profile updated successfully"
```

#### 👁️ Appearance (`accountAppearance.*`)
Physical appearance, measurements, sizes.
```typescript
t('accountAppearance.title')          // "Appearance"
t('accountAppearance.fields.height')  // "Height"
t('accountAppearance.fields.eyeColor') // "Eye Color"
t('accountAppearance.success')        // "Appearance updated"
t('accountAppearance.loading')        // "Loading Appearance..."
```

#### 💳 Billing (`accountBilling.*`)
Subscriptions, payments, packages, coupons.
```typescript
t('accountBilling.status.active')          // "Active Subscription"
t('accountBilling.payments.creditCard')    // "Credit Card"
t('accountBilling.coupon.apply')           // "Apply"
t('accountBilling.history.noHistory')      // "No Subscription History"
t('accountBilling.packages.title')         // "Available Packages"
```

#### 🔒 Security (`accountSecurity.*`)
Password, 2FA, privacy, sessions.
```typescript
t('accountSecurity.password.title')        // "Change Password"
t('accountSecurity.password.update')       // "Update Password"
t('accountSecurity.twoFactor.enable')      // "Enable"
t('accountSecurity.privacy.title')         // "Privacy Settings"
t('accountSecurity.sessions.revoke')       // "Revoke"
```

## File Locations

| Namespace | English | Arabic |
|-----------|---------|--------|
| `account` | `src/lib/locales/en/account-main.json` | `src/lib/locales/ar/account-main.json` |
| `accountBasic` | `src/lib/locales/en/account-basic.json` | `src/lib/locales/ar/account-basic.json` |
| `accountAppearance` | `src/lib/locales/en/account-appearance.json` | `src/lib/locales/ar/account-appearance.json` |
| `accountBilling` | `src/lib/locales/en/account-billing.json` | `src/lib/locales/ar/account-billing.json` |
| `accountSecurity` | `src/lib/locales/en/account-security.json` | `src/lib/locales/ar/account-security.json` |

## Common Patterns

### Form Fields
```typescript
// Label
t('accountBasic.fields.firstName')
t('accountAppearance.fields.height')

// Placeholder
t('accountBasic.placeholders.firstName')
t('accountAppearance.placeholders.height')

// Error
t('accountBasic.errors.nameRequired')
t('accountAppearance.errors.saveFailed')
```

### Status Messages
```typescript
// Success
t('accountBasic.success')
t('accountAppearance.success')

// Loading
t('accountAppearance.loading')

// Error
t('accountBasic.errors.saveFailed')
t('accountBilling.errors.load')
```

### Buttons & Actions
```typescript
// Save button
t('account.buttons.saving')          // When saving
t('common.saveAndContinue')          // Default save text

// Apply/Submit
t('accountBilling.subscribe')        // "Subscribe Now"
t('accountBilling.processing')       // "Processing..."
t('accountSecurity.password.update') // "Update Password"
```

## Example Component

```typescript
import { useI18n } from '@/contexts/I18nContext';

export default function AppearanceForm() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  
  return (
    <form>
      <h1>{t('accountAppearance.title')}</h1>
      <p>{t('accountAppearance.description')}</p>
      
      <div>
        <label>{t('accountAppearance.fields.height')}</label>
        <input 
          placeholder={t('accountAppearance.placeholders.height')} 
        />
      </div>
      
      <button disabled={loading}>
        {loading 
          ? t('account.buttons.saving') 
          : t('common.saveAndContinue')
        }
      </button>
    </form>
  );
}
```

## Tips

1. **Use the right namespace**: Don't mix billing translations in appearance components
2. **Check both EN and AR**: Always update both language files
3. **Follow naming patterns**: Use consistent field/error/placeholder patterns
4. **Keep it DRY**: Common buttons like "Save" are in `common.*` namespace

## Need Help?

See the full documentation: [ACCOUNT_TRANSLATIONS_RESTRUCTURE.md](./ACCOUNT_TRANSLATIONS_RESTRUCTURE.md)
