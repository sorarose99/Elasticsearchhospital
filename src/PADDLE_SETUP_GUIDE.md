# دليل إعداد Paddle للنظام

## نظرة عامة
هذا الدليل يوضح كيفية إعداد تكامل Paddle للمدفوعات والاشتراكات في نظام إدارة العيادات.

## المفاتيح المطلوبة

### 1. PADDLE_VENDOR_ID
- **الوصف**: معرف البائع الخاص بك في Paddle
- **كيفية الحصول عليه**:
  1. سجل دخول إلى [Paddle Dashboard](https://vendors.paddle.com)
  2. اذهب إلى Developer Tools > Authentication
  3. ستجد Vendor ID في أعلى الصفحة

### 2. PADDLE_AUTH_CODE
- **الوصف**: كود المصادقة للوصول إلى Paddle API
- **كيفية الحصول عليه**:
  1. في Paddle Dashboard، اذهب إلى Developer Tools > Authentication
  2. انقر على "Generate Auth Code"
  3. احفظ الكود في مكان آمن (لن تتمكن من رؤيته مرة أخرى)

### 3. PADDLE_WEBHOOK_SECRET
- **الوصف**: مفتاح سري للتحقق من صحة webhooks
- **كيفية الحصول عليه**:
  1. اذهب إلى Developer Tools > Webhooks
  2. أنشئ webhook جديد أو استخدم موجود
  3. أضف URL الخاص بك: `https://YOUR_PROJECT.supabase.co/functions/v1/make-server-89df438c/billing/webhooks/paddle`
  4. احفظ الـ Public Key الذي سيظهر

### 4. PADDLE_PUBLIC_KEY (اختياري)
- **الوصف**: المفتاح العام للتحقق من Webhooks
- **كيفية الحصول عليه**: نفس خطوات PADDLE_WEBHOOK_SECRET

## خطوات الإعداد

### 1. إنشاء منتجات في Paddle
1. اذهب إلى Catalog > Products
2. أنشئ منتج لكل خطة اشتراك:
   - Starter Plan (Monthly)
   - Professional Plan (Monthly)
   - Enterprise Plan (Monthly)
   - Starter Plan (Yearly)
   - Professional Plan (Yearly)
   - Enterprise Plan (Yearly)

### 2. تحديث قاعدة البيانات
```sql
-- تحديث جدول خطط الاشتراك بمعرفات Paddle
UPDATE subscription_plans 
SET paddle_product_id = 'YOUR_PADDLE_PRODUCT_ID'
WHERE name = 'Starter' AND billing_cycle = 'monthly';

-- كرر لجميع الخطط
```

### 3. إعداد Webhooks
في Paddle Dashboard:
1. اذهب إلى Developer Tools > Webhooks
2. أنشئ webhook جديد
3. أضف URL: `https://YOUR_PROJECT.supabase.co/functions/v1/make-server-89df438c/billing/webhooks/paddle`
4. فعل الأحداث التالية:
   - Subscription Created
   - Subscription Updated
   - Subscription Cancelled
   - Subscription Payment Succeeded
   - Subscription Payment Failed
   - Subscription Payment Refunded

### 4. تكوين Environment Variables
في Supabase Dashboard:
1. اذهب إلى Settings > Edge Functions
2. أضف المتغيرات التالية:
   - `PADDLE_VENDOR_ID`
   - `PADDLE_AUTH_CODE`
   - `PADDLE_WEBHOOK_SECRET`
   - `PADDLE_PUBLIC_KEY` (اختياري)

## الاختبار

### 1. اختبار خطط الاشتراك
```bash
curl -X GET "https://YOUR_PROJECT.supabase.co/functions/v1/make-server-89df438c/billing/subscription-plans" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### 2. اختبار إنشاء checkout session
```bash
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/make-server-89df438c/billing/create-checkout" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"planId": "PLAN_UUID", "clinicId": "CLINIC_UUID"}'
```

### 3. اختبار webhook
استخدم Paddle Webhook Simulator لإرسال أحداث تجريبية.

## أحداث Paddle المدعومة

| الحدث | الوصف | الإجراء |
|-------|--------|---------|
| `subscription_created` | تم إنشاء اشتراك جديد | تفعيل العيادة وتحديث الحالة |
| `subscription_updated` | تم تحديث اشتراك | تحديث تفاصيل الاشتراك |
| `subscription_cancelled` | تم إلغاء اشتراك | إلغاء تفعيل العيادة |
| `subscription_payment_succeeded` | نجحت عملية دفع | إنشاء فاتورة وتسجيل الدفعة |
| `subscription_payment_failed` | فشلت عملية دفع | تحديث حالة الاشتراك إلى past_due |
| `subscription_payment_refunded` | تم استرداد دفعة | تسجيل الاسترداد |

## استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ "Paddle credentials not configured"**
   - تأكد من إعداد جميع environment variables
   - تحقق من صحة VENDOR_ID و AUTH_CODE

2. **خطأ "Plan not found or Paddle product ID not configured"**
   - تأكد من تحديث paddle_product_id في قاعدة البيانات
   - تحقق من أن المنتج موجود في Paddle

3. **فشل webhook**
   - تحقق من URL في إعدادات Paddle
   - تأكد من تفعيل الأحداث المطلوبة
   - راجع logs في Supabase Edge Functions

## الأمان

### أفضل الممارسات:
1. لا تكشف `PADDLE_AUTH_CODE` في Frontend
2. استخدم HTTPS فقط للـ webhooks
3. تحقق من صحة webhooks باستخدام signature
4. احفظ المفاتيح في مكان آمن

## الدعم

للحصول على مساعدة إضافية:
- [وثائق Paddle API](https://developer.paddle.com/api-reference)
- [دليل Webhooks](https://developer.paddle.com/webhooks)
- [مجتمع Paddle](https://paddle.com/community)

## ملاحظات مهمة

1. **وضع الاختبار**: استخدم Sandbox environment للاختبار
2. **العملات**: تأكد من دعم العملة المطلوبة
3. **الضرائب**: قم بإعداد الضرائب حسب بلدك
4. **المرجعة**: ضع سياسة واضحة للمرجعة

## مثال كامل للاستخدام

```typescript
// إنشاء checkout session
const checkoutSession = await billingService.createCheckoutSession(
  'plan-uuid',
  'clinic-uuid'
);

// إعادة توجيه المستخدم
window.location.href = checkoutSession.checkout_url;

// التحقق من حالة الاشتراك
const subscription = await billingService.getSubscription('clinic-uuid');

// إلغاء الاشتراك
await billingService.cancelSubscription('clinic-uuid');
```

هذا النظام جاهز الآن للاستخدام التجاري مع تكامل Paddle كامل!