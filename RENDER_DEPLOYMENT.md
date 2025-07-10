# دليل النشر على Render

## ✅ مشروعك جاهز للنشر!

مشروعك يحتوي على جميع الملفات المطلوبة:

- ✅ `db.json` - ملف البيانات
- ✅ `package.json` - مع script `start`
- ✅ `server.js` - خادم Express مع API

## 🚀 خطوات النشر على Render:

### 1. رفع المشروع إلى GitHub

```bash
# تهيئة Git (إذا لم تكن موجودة)
git init
git add .
git commit -m "Initial commit"

# رفع إلى GitHub
git remote add origin https://github.com/username/repository-name.git
git push -u origin main
```

### 2. النشر على Render

1. **اذهب إلى [Render.com](https://render.com)**
2. **سجل دخول أو أنشئ حساب**
3. **اضغط "New" → "Web Service"**
4. **اربط حساب GitHub**
5. **اختر الريبو الخاص بك**

### 3. إعدادات المشروع

في صفحة إعدادات Render، املأ:

```
Name: qi-cards-admin (أو أي اسم تريده)
Environment: Node
Region: Frankfurt (أو الأقرب لك)
Branch: main
Build Command: npm install && npm run build
Start Command: node server.js
```

### 4. متغيرات البيئة (اختياري)

إذا أردت تغيير المنفذ:
```
PORT: 3000
```

### 5. اضغط "Create Web Service"

## 🔧 إعدادات إضافية:

### Build Command:
```bash
npm install && npm run build
```

### Start Command:
```bash
node server.js
```

### Root Directory:
اتركه فارغاً (افتراضي)

## 🔐 الوصول لصفحة الأدمن:

بعد النشر، ستجد رابط مثل:
```
https://your-app-name.onrender.com
```

### للوصول لصفحة الأدمن:
```
https://your-app-name.onrender.com/admin
```

### كلمة المرور:
```
admin123
```

## 📁 هيكل الملفات المطلوبة:

```
project/
├── db.json          ✅ موجود
├── package.json     ✅ موجود
├── server.js        ✅ موجود
├── dist/            ✅ سيُنشأ عند البناء
└── src/             ✅ موجود
```

## 🛠️ استكشاف الأخطاء:

### إذا فشل البناء:
1. تأكد من أن جميع dependencies مثبتة
2. تحقق من console logs
3. تأكد من أن Node.js version متوافق

### إذا لم تعمل الصفحة:
1. تحقق من Start Command
2. تأكد من أن PORT صحيح
3. تحقق من logs في Render dashboard

### إذا لم تعمل API:
1. تأكد من أن `db.json` موجود
2. تحقق من صلاحيات الملفات
3. تأكد من أن server.js يعمل

## 🔄 تحديث المشروع:

```bash
# بعد التغييرات
git add .
git commit -m "Update project"
git push origin main

# Render سيعيد النشر تلقائياً
```

## 💡 نصائح مهمة:

1. **غير كلمة المرور** قبل النشر
2. **احتفظ بنسخة من db.json**
3. **راقب logs** في Render dashboard
4. **اختبر API** بعد النشر

## 📞 الدعم:

إذا واجهت مشاكل:
1. تحقق من Render logs
2. تأكد من أن جميع الملفات موجودة
3. اختبر المشروع محلياً أولاً

---

**مشروعك جاهز للنشر! 🎉** 