'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, User, Mail, Phone, Calendar, Target, FileText, CheckCircle, X, AlertCircle } from 'lucide-react';
import { checkClientLimit, getSubscriptionWarning } from '@/lib/subscription';

export default function NewClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newClientInfo, setNewClientInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: '',
    medicalConditions: '',
    allergies: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        setErrorMessage('Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
        setShowErrorModal(true);
        return;
      }

      // Abonelik kontrolü
      const limitCheck = checkClientLimit(currentUserId);
      if (!limitCheck.canAdd) {
        setErrorMessage(limitCheck.message || 'Danışan ekleme sınırına ulaştınız.');
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }

      // Abonelik uyarısı kontrolü
      const warning = getSubscriptionWarning(currentUserId);
      if (warning) {
        // Uyarı göster ama devam et
        console.warn('Abonelik uyarısı:', warning);
      }
      
      // Sabit şifre kullan
      const defaultPassword = '123456';
      
      // Yeni danışan objesi oluştur
      const newClient = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'active',
        lastVisit: null,
        progress: 0,
        currentWeight: formData.weight,
        targetWeight: formData.weight, // Başlangıçta aynı
        avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=100`
      };
      
      const existingClients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
      existingClients.push(newClient);
      localStorage.setItem(`clients_${currentUserId}`, JSON.stringify(existingClients));

      // Danışanı sisteme üye olarak kaydet
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      registeredUsers[formData.email] = {
        password: defaultPassword,
        user: {
          id: newClient.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          title: 'Danışan', // Danışan unvanı
          subscription: 'client', // Danışan aboneliği
          userType: 'client' // Danışan tipi - diyetisyen değil
        }
      };
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Danışan paket bilgilerini başlat (boş)
      const clientPackages = JSON.parse(localStorage.getItem(`clientPackages_${currentUserId}`) || '{}');
      // Yeni danışan için paket bilgisi eklenmez, randevu sırasında eklenecek
      localStorage.setItem(`clientPackages_${currentUserId}`, JSON.stringify(clientPackages));
      // Başarı modalı için bilgileri kaydet
      setNewClientInfo({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: defaultPassword
      });
      
      // Başarı modalını göster
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Danışan kayıt hatası:', error);
      setErrorMessage('Danışan kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };
  // Şık başarı modalı
  const SuccessModal = () => {
    if (!showSuccessModal || !newClientInfo) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Danışan Kaydedildi</h3>
                <p className="text-gray-600">Danışan başarıyla sisteme eklendi</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/dashboard/clients');
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-green-800 mb-2">Danışan Bilgileri</h4>
            <div className="space-y-2 text-green-700">
              <div className="flex justify-between">
                <span>İsim:</span>
                <span className="font-medium">{newClientInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span>E-posta:</span>
                <span className="font-medium">{newClientInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Şifre:</span>
                <span className="font-medium">{newClientInfo.password}</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-6">
            <p>Bu bilgiler danışanınıza iletilmelidir. Danışan uygulamasına bu bilgilerle giriş yapabilecek.</p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline"
              onClick={() => {
                setShowSuccessModal(false);
                // Formu sıfırla ve yeni danışan eklemek için sayfada kal
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  age: '',
                  gender: '',
                  height: '',
                  weight: '',
                  activityLevel: '',
                  goal: '',
                  medicalConditions: '',
                  allergies: '',
                  notes: ''
                });
              }}
            >
              Yeni Danışan Ekle
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/dashboard/clients');
              }}
            >
              Danışanlara Git
            </Button>
          </div>
        </motion.div>
      </div>
    );
  };

  // Şık hata modalı
  const ErrorModal = () => {
    if (!showErrorModal) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hata</h3>
                <p className="text-gray-600">İşlem sırasında bir sorun oluştu</p>
              </div>
            </div>
            <button 
              onClick={() => setShowErrorModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg mb-6">
            <p className="text-red-700">{errorMessage}</p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={() => setShowErrorModal(false)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Tamam
            </Button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* Başarı Modalı */}
      <SuccessModal />
      
      {/* Hata Modalı */}
      <ErrorModal />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Geri</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Yeni Danışan Ekle</h1>
              <p className="text-gray-600">Yeni danışan bilgilerini girin</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Kişisel Bilgiler</span>
                  </CardTitle>
                  <CardDescription>
                    Danışanın temel kişisel bilgileri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ad *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Adını girin"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Soyad *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Soyadını girin"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+90 555 123 45 67"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Yaş</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="25"
                        min="1"
                        max="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Cinsiyet</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Cinsiyet seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Kadın</SelectItem>
                          <SelectItem value="male">Erkek</SelectItem>
                          <SelectItem value="other">Diğer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Physical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Fiziksel Bilgiler</span>
                  </CardTitle>
                  <CardDescription>
                    Boy, kilo ve aktivite seviyesi bilgileri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Boy (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="170"
                        min="100"
                        max="250"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Kilo (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="70"
                        min="30"
                        max="300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="activityLevel">Aktivite Seviyesi</Label>
                      <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seviye seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Hareketsiz</SelectItem>
                          <SelectItem value="light">Hafif Aktif</SelectItem>
                          <SelectItem value="moderate">Orta Aktif</SelectItem>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="very-active">Çok Aktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Hedef</Label>
                    <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hedef seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight-loss">Kilo Verme</SelectItem>
                        <SelectItem value="weight-gain">Kilo Alma</SelectItem>
                        <SelectItem value="muscle-gain">Kas Kazanma</SelectItem>
                        <SelectItem value="maintenance">Kilo Koruma</SelectItem>
                        <SelectItem value="health">Sağlıklı Beslenme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Sağlık Bilgileri</span>
                  </CardTitle>
                  <CardDescription>
                    Sağlık durumu ve alerji bilgileri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">Sağlık Durumları</Label>
                    <Textarea
                      id="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                      placeholder="Diyabet, hipertansiyon, tiroid vb. sağlık durumları"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Alerjiler</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      placeholder="Besin alerjileri, ilaç alerjileri vb."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notlar</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Ek notlar ve özel durumlar"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>İşlemler</CardTitle>
                  <CardDescription>
                    Danışan kaydını tamamlayın
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !formData.firstName || !formData.lastName || !formData.email}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Kaydediliyor...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Danışanı Kaydet</span>
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    İptal
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">İpuçları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p>• Zorunlu alanları (*) doldurmayı unutmayın</p>
                  <p>• Sağlık bilgileri diyet planı için önemlidir</p>
                  <p>• Danışan kaydedildikten sonra düzenleyebilirsiniz</p>
                  <p>• İletişim bilgileri doğru olduğundan emin olun</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}