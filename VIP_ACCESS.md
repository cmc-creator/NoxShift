# 🔑 VIP Access Code

## How to Get VIP Access

### Step 1: Enter VIP Code
1. Go to the landing page: http://localhost:5174
2. Click **"🔑 VIP Access"** button (top-right or bottom CTA)
3. Enter code: **NOX424**
4. Click **"Unlock"**

### Step 2: Create Account
1. You'll be redirected to the login page
2. Click **"Sign Up"**
3. Create your account with:
   - Name
   - Company Name (optional)
   - Email
   - Password

### Step 3: Access All Features
- ✅ Full access to all features
- ✅ Admin role automatically assigned
- ✅ VIP subscription tier
- ✅ No limitations
- ✅ All integrations unlocked
- ✅ Priority features

## VIP Code Details

**Code:** `NOX424`  
**Access Level:** Full Admin (ADMIN role)  
**Subscription Tier:** VIP (Complimentary)  
**Features:** All 60+ features unlocked  

## What VIP Users Get:

### 🎯 Complete Platform Access
- All Professional features
- All Enterprise features
- All Titan features
- Oracle AI - Predictive analytics
- Compliance Suite (OSHA, CMS, Joint Commission)
- Asset Vault - Equipment tracking
- Sentinel - Visitor management & security
- Guild - Gamification system
- Learning Management System
- HR Automation
- Advanced analytics & forecasting
- All 60+ integrations

### 👑 VIP Exclusive Benefits
- Lifetime access (while VIP program active)
- Early access to new features
- Priority support
- Custom feature requests considered
- No usage limits
- White-glove onboarding
- Dedicated success manager

## For Other Users:

### Professional Tier ($499/month)
- Up to 50 employees
- Basic features

### Enterprise Tier ($1,499/month)
- Up to 250 employees
- Advanced features

### Titan Tier ($2,999/month)
- Unlimited employees
- All features + custom development

## Testing VIP Access:

1. **Clear existing session:**
   ```javascript
   localStorage.clear()
   ```

2. **Enter VIP code on landing page**

3. **Create new account**

4. **Verify access:**
   ```javascript
   localStorage.getItem('noxshift-vip') // Should return 'true'
   localStorage.getItem('userRole') // Should return 'ADMIN'
   localStorage.getItem('subscriptionTier') // Should return 'VIP'
   ```

## Technical Implementation:

**Storage:**
- `noxshift-vip`: 'true' (VIP flag)
- `userRole`: 'ADMIN' (full permissions)
- `subscriptionTier`: 'VIP' (subscription level)

**Flow:**
1. Landing page → Enter code → Stores VIP flag
2. Login page → Checks VIP flag → Sets admin role
3. Signup → Creates account → Maintains VIP status
4. Throughout app → Checks role/tier → Unlocks features

**Protected Features:**
- Role-based access control
- Subscription tier checks
- Feature flagging system
- Integration unlocking

---

**VIP Code:** NOX424  
**Status:** Active ✅  
**Expiration:** None (lifetime for founding members)
