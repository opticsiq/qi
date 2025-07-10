# 🃏 QI Cards - نظام البطاقات الذكية

نظام إدارة البطاقات المصرفية مع واجهة مستخدم حديثة ولوحة تحكم للأدمن.

## ✨ المميزات

- 🎨 واجهة مستخدم حديثة وجذابة
- 📱 متجاوب مع جميع الأجهزة
- 🔐 حماية صفحة الأدمن بكلمة مرور
- 📊 لوحة تحكم شاملة للأدمن
- 🖼️ رفع وعرض صور البطاقات
- ⚡ تحديث فوري للبيانات
- 🌐 نشر مجاني على GitHub Pages
- 🗄️ قاعدة بيانات Supabase مجانية

## 🚀 النشر السريع

### الطريقة الأولى: GitHub Pages + Supabase (موصى بها)

1. **إنشاء حساب Supabase**
   - اذهب إلى [supabase.com](https://supabase.com)
   - أنشئ مشروع جديد
   - أنشئ جدول `uploads` مع الأعمدة المطلوبة

2. **رفع المشروع إلى GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/card-face.git
   git push -u origin main
   ```

3. **إعداد GitHub Secrets**
   - اذهب إلى Settings > Secrets and variables > Actions
   - أضف `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY`

4. **تفعيل GitHub Pages**
   - اذهب إلى Settings > Pages
   - اختر "GitHub Actions" كمصدر

### الطريقة الثانية: Netlify + Supabase

1. ارفع المشروع إلى GitHub
2. اربط المشروع بـ Netlify
3. أضف متغيرات البيئة في Netlify
4. انشر تلقائياً

## 🔧 التطوير المحلي

### المتطلبات
- Node.js 18+
- npm أو yarn

### التثبيت
```bash
# تثبيت التبعيات
npm install

# تشغيل في وضع التطوير
npm run dev

# بناء للمنتج
npm run build
```

### متغيرات البيئة
أنشئ ملف `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 استخدام الموقع

### للمستخدمين العاديين
- اذهب إلى الصفحة الرئيسية
- ارفع صور الواجهة الأمامية والخلفية للبطاقة
- اضغط "تحديث البطاقة"

### للأدمن
- اذهب إلى `/admin`
- كلمة المرور الافتراضية: `admin123`
- يمكنك مراجعة وإدارة جميع الرفوعات

## 🛠️ التقنيات المستخدمة

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Deployment**: GitHub Pages
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod

## 📁 هيكل المشروع

```
card-face/
├── src/
│   ├── components/     # مكونات UI
│   ├── pages/         # صفحات التطبيق
│   ├── lib/           # مكتبات وخدمات
│   └── hooks/         # React Hooks
├── public/            # الملفات العامة
├── .github/           # GitHub Actions
└── docs/             # التوثيق
```

## 🔐 الأمان

- حماية صفحة الأدمن بكلمة مرور
- تشفير البيانات في قاعدة البيانات
- التحقق من صحة المدخلات
- حماية من XSS و CSRF

## 📊 قاعدة البيانات

### جدول uploads
```sql
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  front_image TEXT NOT NULL,
  back_image TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 النشر

### GitHub Pages
- النشر التلقائي عند push إلى main
- الرابط: `https://username.github.io/card-face/`

### Netlify
- النشر التلقائي من GitHub
- رابط مخصص

### Vercel
- النشر التلقائي من GitHub
- أداء عالي

## 🔧 التخصيص

### تغيير كلمة مرور الأدمن
```typescript
// في src/pages/Admin.tsx
const ADMIN_PASSWORD = 'كلمة_المرور_الجديدة';
```

### تغيير الألوان
```css
/* في src/index.css */
:root {
  --primary: #FFD600;
  --secondary: #111;
}
```

## 📞 الدعم

- 📧 البريد الإلكتروني: support@qicards.iq
- 📱 الهاتف: 422 (زين - اسياسيل - كورك)
- 🏢 العنوان: شارع الكرادة بغداد، العراق

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:
1. Fork المشروع
2. إنشاء branch جديد
3. إجراء التغييرات
4. إنشاء Pull Request

---

**QI Cards** - نظام حماية البطاقات المصرفية المدعوم من البنك المركزي العراقي
