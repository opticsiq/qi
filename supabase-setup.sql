-- إعداد قاعدة البيانات لـ QI Cards
-- قم بتشغيل هذا الكود في SQL Editor في Supabase

-- إنشاء جدول uploads
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  front_image TEXT NOT NULL,
  back_image TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_uploads_status ON uploads(status);
CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON uploads(created_at DESC);

-- إعداد Row Level Security (RLS)
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة العامة (للعرض في الأدمن)
CREATE POLICY "Allow public read access" ON uploads
  FOR SELECT USING (true);

-- سياسة للإدراج (لرفع الصور)
CREATE POLICY "Allow public insert" ON uploads
  FOR INSERT WITH CHECK (true);

-- سياسة للتحديث (لإدارة الحالة)
CREATE POLICY "Allow public update" ON uploads
  FOR UPDATE USING (true);

-- سياسة للحذف (لحذف الرفوعات)
CREATE POLICY "Allow public delete" ON uploads
  FOR DELETE USING (true);

-- إضافة تعليقات للجدول
COMMENT ON TABLE uploads IS 'جدول رفع صور البطاقات المصرفية';
COMMENT ON COLUMN uploads.id IS 'معرف فريد للرفع';
COMMENT ON COLUMN uploads.front_image IS 'صورة الواجهة الأمامية للبطاقة (base64)';
COMMENT ON COLUMN uploads.back_image IS 'صورة الواجهة الخلفية للبطاقة (base64)';
COMMENT ON COLUMN uploads.status IS 'حالة الرفع: pending, approved, rejected';
COMMENT ON COLUMN uploads.created_at IS 'تاريخ ووقت الرفع';

-- إنشاء view للإحصائيات
CREATE OR REPLACE VIEW upload_stats AS
SELECT 
  COUNT(*) as total_uploads,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_uploads,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_uploads,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_uploads
FROM uploads; 