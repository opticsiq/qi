# 🚀 دليل النشر - GitHub Pages + Supabase

## 📋 المتطلبات

### 1. حساب GitHub
- إنشاء حساب على [GitHub](https://github.com)
- رفع المشروع إلى repository جديد

### 2. حساب Supabase
- إنشاء حساب على [Supabase](https://supabase.com)
- إنشاء مشروع جديد

## 🔧 إعداد Supabase

### 1. إنشاء المشروع
1. اذهب إلى [supabase.com](https://supabase.com)
2. اضغط "New Project"
3. اختر اسم للمشروع (مثل: `card-face-app`)
4. اختر كلمة مرور قوية لقاعدة البيانات
5. اختر المنطقة الأقرب لك
6. اضغط "Create new project"

### 2. إنشاء الجدول
1. اذهب إلى "Table Editor" في لوحة التحكم
2. اضغط "New Table"
3. أدخل البيانات التالية:

```sql
-- اسم الجدول: uploads
-- الأعمدة:
id: uuid (primary key, default: gen_random_uuid())
front_image: text (not null)
back_image: text (not null)
status: text (default: 'pending')
created_at: timestamp with time zone (default: now())
```

4. اضغط "Save"

### 3. الحصول على المفاتيح
1. اذهب إلى "Settings" > "API"
2. انسخ:
   - **Project URL** (مثل: `https://your-project.supabase.co`)
   - **anon public** key

## 🔧 إعداد GitHub

### 1. رفع المشروع
```bash
# تهيئة Git
git init
git add .
git commit -m "Initial commit"

# رفع إلى GitHub
git remote add origin https://github.com/username/card-face.git
git branch -M main
git push -u origin main
```

### 2. إعداد GitHub Pages
1. اذهب إلى repository على GitHub
2. اذهب إلى "Settings" > "Pages"
3. في "Source" اختر "GitHub Actions"
4. سيتم إنشاء workflow تلقائياً

### 3. إضافة Secrets
1. اذهب إلى "Settings" > "Secrets and variables" > "Actions"
2. اضغط "New repository secret"
3. أضف:
   - `VITE_SUPABASE_URL`: Project URL من Supabase
   - `VITE_SUPABASE_ANON_KEY`: anon public key من Supabase

## 🚀 النشر

### 1. التحديث التلقائي
- كل مرة تدفع (push) إلى branch `main`
- سيتم البناء والنشر تلقائياً
- الرابط سيكون: `https://username.github.io/card-face/`

### 2. التحقق من النشر
1. اذهب إلى "Actions" في repository
2. ستجد workflow "Deploy to GitHub Pages"
3. انتظر حتى يكتمل البناء
4. اذهب إلى الرابط للتأكد من عمل الموقع

## 🔐 حماية صفحة الأدمن

### كلمة المرور الافتراضية
- كلمة المرور: `admin123`
- يمكن تغييرها في ملف `src/pages/Admin.tsx`

### تغيير كلمة المرور
```typescript
// في ملف src/pages/Admin.tsx
const ADMIN_PASSWORD = 'كلمة_المرور_الجديدة';
```

## 📱 استخدام الموقع

### 1. للمستخدمين العاديين
- الرابط: `https://username.github.io/card-face/`
- يمكنهم رفع صور البطاقات
- البيانات تظهر في صفحة الأدمن

### 2. للأدمن
- الرابط: `https://username.github.io/card-face/admin`
- كلمة المرور: `admin123`
- يمكنه مراجعة وإدارة الرفوعات

## 🔧 استكشاف الأخطاء

### مشاكل شائعة
1. **خطأ في الاتصال بـ Supabase**
   - تأكد من صحة المفاتيح في GitHub Secrets
   - تأكد من إنشاء الجدول `uploads`

2. **خطأ في النشر**
   - تحقق من Actions في GitHub
   - تأكد من أن جميع المفاتيح موجودة

3. **خطأ في عرض الصور**
   - تأكد من أن الصور محفوظة كـ base64
   - تحقق من حجم الصور

### إعادة النشر
```bash
# تحديث الكود
git add .
git commit -m "Fix issues"
git push origin main
```

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من Actions في GitHub
2. تحقق من Console في المتصفح
3. تأكد من إعدادات Supabase
4. تحقق من GitHub Secrets

## 🎉 النتيجة النهائية

بعد اتباع هذا الدليل:
- ✅ موقع يعمل على GitHub Pages مجاناً
- ✅ قاعدة بيانات Supabase مجانية
- ✅ رابط يمكن مشاركته مع أي شخص
- ✅ صفحة أدمن محمية بكلمة مرور
- ✅ تحديث تلقائي عند رفع البيانات

الرابط النهائي: `https://username.github.io/card-face/` 