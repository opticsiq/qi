import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  Download, 
  Trash2, 
  Calendar, 
  User, 
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Filter,
  Lock
} from "lucide-react";
import { supabase, Upload } from '@/lib/supabase';

interface UploadedImage {
  id: string;
  front_image: string;
  back_image: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

const Admin = () => {
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpload, setSelectedUpload] = useState<UploadedImage | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // كلمة مرور الأدمن - يمكن تغييرها
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      toast.success("تم تسجيل الدخول بنجاح!");
    } else {
      toast.error("كلمة المرور غير صحيحة!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    toast.success("تم تسجيل الخروج بنجاح!");
  };

  // التحقق من تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const authenticated = localStorage.getItem('adminAuthenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // قراءة البيانات من Supabase
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadUploads = async () => {
      try {
        const { data, error } = await supabase
          .from('uploads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('خطأ في جلب البيانات:', error);
          setUploads([]);
        } else {
          setUploads(data || []);
        }
      } catch (error) {
        console.error('خطأ في قراءة البيانات:', error);
        setUploads([]);
      }
      setLoading(false);
    };

    loadUploads();
    
    // تحديث كل 30 ثانية
    const interval = setInterval(loadUploads, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">مقبول</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">مرفوض</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('uploads')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) {
        toast.error("حدث خطأ في تحديث الحالة");
      } else {
        setUploads(prev => prev.map(upload => 
          upload.id === id ? { ...upload, status: 'approved' as const } : upload
        ));
        toast.success("تم قبول الصور بنجاح!");
      }
    } catch (error) {
      console.error('خطأ في تحديث الحالة:', error);
      toast.error("حدث خطأ في تحديث الحالة");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('uploads')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) {
        toast.error("حدث خطأ في تحديث الحالة");
      } else {
        setUploads(prev => prev.map(upload => 
          upload.id === id ? { ...upload, status: 'rejected' as const } : upload
        ));
        toast.error("تم رفض الصور");
      }
    } catch (error) {
      console.error('خطأ في تحديث الحالة:', error);
      toast.error("حدث خطأ في تحديث الحالة");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('uploads')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("حدث خطأ في حذف الصور");
      } else {
        setUploads(prev => prev.filter(upload => upload.id !== id));
        toast.success("تم حذف الصور بنجاح!");
      }
    } catch (error) {
      console.error('خطأ في حذف الصور:', error);
      toast.error("حدث خطأ في حذف الصور");
    }
  };

  const filteredUploads = uploads.filter(upload => 
    filterStatus === 'all' ? true : upload.status === filterStatus
  );

  // صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={`${import.meta.env.BASE_URL}qi-logo.svg`} alt="QI Cards" className="h-12 w-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">لوحة تحكم الأدمن</CardTitle>
            <p className="text-gray-600">أدخل كلمة المرور للوصول</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Lock className="w-4 h-4 mr-2" />
              تسجيل الدخول
            </Button>
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <img src={`${import.meta.env.BASE_URL}qi-logo.svg`} alt="QI Cards" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم الأدمن</h1>
                <p className="text-gray-600">إدارة الصور المرفوعة</p>
                <p className="text-xs text-gray-500 mt-1">الرابط المباشر: /admin</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 space-x-reverse"
                onClick={() => window.location.href = '/'}
              >
                <ArrowLeft className="h-4 w-4" />
                العودة للرئيسية
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
              >
                تسجيل الخروج
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
                    try {
                      const response = await fetch('/api/uploads', {
                        method: 'DELETE'
                      });
                      if (response.ok) {
                        setUploads([]);
                        toast.success("تم حذف جميع البيانات");
                      } else {
                        toast.error("حدث خطأ في حذف البيانات");
                      }
                    } catch (error) {
                      console.error('خطأ في حذف البيانات:', error);
                      toast.error("حدث خطأ في حذف البيانات");
                    }
                  }
                }}
              >
                مسح جميع البيانات
              </Button>
              <Badge variant="outline" className="text-sm">
                {uploads.length} صورة مرفوعة
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الصور</p>
                  <p className="text-2xl font-bold text-gray-900">{uploads.length}</p>
                </div>
                <ImageIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {uploads.filter(u => u.status === 'pending').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">مقبول</p>
                  <p className="text-2xl font-bold text-green-600">
                    {uploads.filter(u => u.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">مرفوض</p>
                  <p className="text-2xl font-bold text-red-600">
                    {uploads.filter(u => u.status === 'rejected').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700 font-medium">تصفية حسب الحالة:</span>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                الكل ({uploads.length})
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                في الانتظار ({uploads.filter(u => u.status === 'pending').length})
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('approved')}
              >
                مقبول ({uploads.filter(u => u.status === 'approved').length})
              </Button>
              <Button
                variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('rejected')}
              >
                مرفوض ({uploads.filter(u => u.status === 'rejected').length})
              </Button>
            </div>
          </div>
        </div>

        {/* Uploads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUploads.map((upload) => (
            <Card key={upload.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    مرفوع جديد
                  </CardTitle>
                  {getStatusBadge(upload.status)}
                </div>
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(upload.created_at)}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Images Display */}
                <div className="grid grid-cols-2 gap-2 p-4">
                  <div className="relative group">
                    <img
                      src={upload.front_image}
                      alt="صورة أمامية"
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                        onClick={() => setSelectedUpload(upload)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">أمامية</Badge>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <img
                      src={upload.back_image}
                      alt="صورة خلفية"
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                        onClick={() => setSelectedUpload(upload)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">خلفية</Badge>
                    </div>
                  </div>
                </div>

                <Separator />
                
                {/* Actions */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <Download className="h-4 w-4" />
                      <span>تحميل</span>
                    </Button>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {upload.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(upload.id)}
                          >
                            قبول
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(upload.id)}
                          >
                            رفض
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(upload.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUploads.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {uploads.length === 0 ? "لا توجد صور مرفوعة" : "لا توجد نتائج للتصفية المحددة"}
            </h3>
            <p className="text-gray-600">
              {uploads.length === 0 ? "لم يتم رفع أي صور بعد" : "جرب تغيير معايير التصفية"}
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  معاينة صور مرفوعة
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUpload(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">الصورة الأمامية</h4>
                  <img
                    src={selectedUpload.front_image}
                    alt="صورة أمامية"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">الصورة الخلفية</h4>
                  <img
                    src={selectedUpload.back_image}
                    alt="صورة خلفية"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">تاريخ الرفع:</p>
                    <p className="font-medium">{formatDate(selectedUpload.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">الحالة:</p>
                    <div className="mt-1">{getStatusBadge(selectedUpload.status)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 