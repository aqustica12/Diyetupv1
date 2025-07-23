'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  Weight, 
  Ruler, 
  Target, 
  Activity,
  Save,
  Edit,
  Check,
  TrendingUp,
  ArrowLeft,
  Home,
  Upload,
  FileText,
  Heart,
  Zap,
  Flame,
  Stethoscope,
  AlertTriangle,
  StickyNote
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WeightChart from '@/components/clients/WeightChart';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  goal: string;
  notes: string;
  medicalConditions?: string;
  allergies?: string;
  createdAt: string;
  lastVisit: string;
}

// Hedef çeviri fonksiyonu
const translateGoal = (goal: string): string => {
  const goalTranslations: { [key: string]: string } = {
    'weight-loss': 'Kilo Verme',
    'weight-gain': 'Kilo Alma',
    'muscle-gain': 'Kas Kazanma',
    'maintenance': 'Kilo Koruma',
    'health': 'Sağlıklı Beslenme'
  };
  
  return goalTranslations[goal] || goal;
};

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params?.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [measurementData, setMeasurementData] = useState<any>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const loadClientData = () => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;
    
    const clients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
    const foundClient = clients.find((c: any) => c.id === clientId);
    
    if (foundClient) {
      setClient(foundClient);
      setEditedClient(foundClient);
    }

    // Ölçüm verilerini yükle
    const allMeasurements = JSON.parse(localStorage.getItem('measurements') || '{}');
    if (allMeasurements[clientId]) {
      setMeasurementData(allMeasurements[clientId]);
    }
  };

  const saveClient = () => {
    if (!editedClient) return;

    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;
    
    const clients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
    const updatedClients = clients.map((c: Client) => 
      c.id === clientId ? editedClient : c
    );
    
    localStorage.setItem(`clients_${currentUserId}`, JSON.stringify(updatedClients));
    setClient(editedClient);
    setIsEditing(false);
    showNotification('Danışan bilgileri güncellendi');
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfError(null);
    setPdfLoading(true);
    setMeasurementData(null);
    
    const file = e.target.files?.[0];
    if (!file) {
      setPdfLoading(false);
      return;
    }
    
    try {
      // 1. PDF'i yükle
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error("Yükleme başarısız");

      // 2. OpenAI ile analiz et
      const extractRes = await fetch("/api/extract-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_url: uploadData.file_url,
          clientId,
        }),
      });
      const extractData = await extractRes.json();
      if (!extractData.success) {
        throw new Error(`Analiz başarısız: ${extractData.error || 'Bilinmeyen hata'}`);
      }
      
      const mapped = mapMeasurementKeys(extractData.output);
      setMeasurementData(mapped);
      
      // localStorage'a kaydet
      const allMeasurements = JSON.parse(localStorage.getItem('measurements') || '{}');
      allMeasurements[clientId] = mapped;
      localStorage.setItem('measurements', JSON.stringify(allMeasurements));
      
      // Kilo otomatik güncelle
      if (mapped.weight && client) {
        const updatedClient = { ...client, weight: mapped.weight };
        setClient(updatedClient);
        setEditedClient(updatedClient);
        
        const currentUserId = localStorage.getItem('currentUserId');
        if (currentUserId) {
          const clients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
          const updatedClients = clients.map((c: Client) => 
            c.id === clientId ? updatedClient : c
          );
          localStorage.setItem(`clients_${currentUserId}`, JSON.stringify(updatedClients));
        }

        // Kilo takip grafiğine otomatik ekle
        const now = new Date();
        const dateTimeString = now.toISOString(); // Full datetime with seconds
        
        const newWeightEntry = {
          date: mapped.date || now.toISOString().split('T')[0],
          datetime: dateTimeString, // Tam tarih-saat bilgisi
          weight: mapped.weight,
          fatPercent: mapped.fatPercent,
          muscleMass: mapped.muscleMass,
          visceralFat: mapped.visceralFat,
          metabolicAge: mapped.metabolicAge,
          notes: `📊 PDF Analizinden (${now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })})`
        };
        
        const allWeightData = JSON.parse(localStorage.getItem('weightData') || '{}');
        const currentWeightData = allWeightData[clientId] || [];
        
        // Aynı datetime'da veri var mı kontrol et (çok düşük ihtimal)
        const existingIndex = currentWeightData.findIndex((entry: any) => 
          entry.datetime && Math.abs(new Date(entry.datetime).getTime() - new Date(dateTimeString).getTime()) < 60000 // 1 dakika fark
        );
        
        if (existingIndex >= 0) {
          // 1 dakika içinde varsa güncelle
          currentWeightData[existingIndex] = { ...currentWeightData[existingIndex], ...newWeightEntry };
        } else {
          // Yeni entry ekle
          currentWeightData.push(newWeightEntry);
        }
        
        // Datetime'a göre sırala
        currentWeightData.sort((a: any, b: any) => {
          const dateA = new Date(a.datetime || a.date).getTime();
          const dateB = new Date(b.datetime || b.date).getTime();
          return dateA - dateB;
        });
        
        allWeightData[clientId] = currentWeightData;
        localStorage.setItem('weightData', JSON.stringify(allWeightData));
        
        // WeightChart'ı refresh et
        window.dispatchEvent(new Event('measurementUpdate'));
      }
      
      showNotification('PDF analizi tamamlandı ve veriler güncellendi!');
    } catch (err: any) {
      setPdfError(err.message || "PDF analiz hatası.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.onchange = (e: any) => handlePdfUpload(e);
    input.click();
  };

  // Mapping fonksiyonu
  const mapMeasurementKeys = (raw: any) => {
    if (!raw || typeof raw !== 'object') return {};
    return {
      weight: raw['Kilo'] || raw['Ağırlık'] || raw['Weight'] || raw['weight'] || raw['kilo'] || undefined,
      fatPercent: raw['Yağ Oranı'] || raw['Fat %'] || raw['fatPercent'] || raw['yağ_oranı'] || undefined,
      muscleMass: raw['Kas Kütlesi'] || raw['Muscle Mass'] || raw['muscleMass'] || raw['kas_kütlesi'] || undefined,
      visceralFat: raw['İç Yağlanma'] || raw['Visceral Fat'] || raw['visceralFat'] || raw['iç_yağlanma'] || undefined,
      metabolicAge: raw['Metabolizma Yaşı'] || raw['Metabolic Age'] || raw['metabolicAge'] || raw['metabolizma_yaşı'] || undefined,
      date: raw['Tarih'] || raw['Date'] || raw['date'] || new Date().toISOString().split('T')[0],
      // Bölgesel yağlar
      sağ_kol_yağ_oranı: raw['sağ_kol_yağ_oranı'] || undefined,
      sol_kol_yağ_oranı: raw['sol_kol_yağ_oranı'] || undefined,
      gövde_yağ_oranı: raw['gövde_yağ_oranı'] || undefined,
      sağ_bacak_yağ_oranı: raw['sağ_bacak_yağ_oranı'] || undefined,
      sol_bacak_yağ_oranı: raw['sol_bacak_yağ_oranı'] || undefined,
      ...raw
    };
  };

  if (!client) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Danışan bilgileri yükleniyor...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            {notification}
          </div>
        </motion.div>
      )}

      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900 p-0 h-auto"
          >
            Dashboard
          </Button>
          <span>/</span>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/clients')}
            className="text-gray-600 hover:text-gray-900 p-0 h-auto"
          >
            Danışanlar
          </Button>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            {client.firstName} {client.lastName}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Header Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {client.firstName} {client.lastName}
                  </h1>
                  <p className="text-xl text-gray-600">Danışan Detayları</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>ID: {client.id}</span>
                    <span>•</span>
                    <span>Kayıt: {new Date(client.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleUploadClick}
                  disabled={pdfLoading}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                >
                  {pdfLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Analiz Ediliyor...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      PDF Analizi
                    </>
                  )}
                </Button>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={saveClient}
                      className="bg-green-600 hover:bg-green-700 px-6 py-2"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Kaydet
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedClient(client);
                      }}
                      variant="outline"
                      className="px-6 py-2"
                    >
                      İptal
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - General Info */}
          <div className="xl:col-span-1 space-y-8">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-6 h-6" />
                  Kişisel Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-base">Ad</Label>
                    {isEditing ? (
                      <Input
                        value={editedClient?.firstName || ''}
                        onChange={(e) => setEditedClient(prev => prev ? {...prev, firstName: e.target.value} : null)}
                        className="mt-2"
                      />
                    ) : (
                      <p className="font-medium text-lg mt-2">{client.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-base">Soyad</Label>
                    {isEditing ? (
                      <Input
                        value={editedClient?.lastName || ''}
                        onChange={(e) => setEditedClient(prev => prev ? {...prev, lastName: e.target.value} : null)}
                        className="mt-2"
                      />
                    ) : (
                      <p className="font-medium text-lg mt-2">{client.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-base">Yaş</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedClient?.age || ''}
                      onChange={(e) => setEditedClient(prev => prev ? {...prev, age: parseInt(e.target.value)} : null)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="font-medium text-lg mt-2">{client.age} yaş</p>
                  )}
                </div>
                
                <div>
                  <Label className="text-base">E-posta</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedClient?.email || ''}
                      onChange={(e) => setEditedClient(prev => prev ? {...prev, email: e.target.value} : null)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="font-medium text-lg mt-2 flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      {client.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-base">Telefon</Label>
                  {isEditing ? (
                    <Input
                      value={editedClient?.phone || ''}
                      onChange={(e) => setEditedClient(prev => prev ? {...prev, phone: e.target.value} : null)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="font-medium text-lg mt-2 flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      {client.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Physical Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Activity className="w-6 h-6" />
                  Fiziksel Özellikler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base">Boy (cm)</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedClient?.height || ''}
                        onChange={(e) => setEditedClient(prev => prev ? {...prev, height: parseInt(e.target.value)} : null)}
                        className="mt-2"
                      />
                    ) : (
                      <p className="font-medium text-lg mt-2 flex items-center gap-2">
                        <Ruler className="w-5 h-5" />
                        {client.height} cm
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-base">Kilo (kg)</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.1"
                        value={editedClient?.weight || ''}
                        onChange={(e) => setEditedClient(prev => prev ? {...prev, weight: parseFloat(e.target.value)} : null)}
                        className="mt-2"
                      />
                    ) : (
                      <p className="font-medium text-lg mt-2 flex items-center gap-2">
                        <Weight className="w-5 h-5" />
                        {client.weight} kg
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-base">BMI</Label>
                  <p className="font-medium text-lg mt-2">
                    {client.height && client.weight 
                      ? (client.weight / Math.pow(client.height / 100, 2)).toFixed(1)
                      : 'Hesaplanamadı'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Measurement Results */}
            {measurementData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="w-6 h-6" />
                    📊 Son Ölçüm Özeti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-600 font-medium text-sm">💪 Kilo</p>
                      <p className="text-xl font-bold text-blue-800">
                        {measurementData.weight || measurementData.kilo || '-'} kg
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-green-600 font-medium text-sm">🔥 Yağ Oranı</p>
                      <p className="text-xl font-bold text-green-800">
                        {measurementData.fatPercent || measurementData.yağ_oranı || '-'}%
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-purple-600 font-medium text-sm">💪 Kas Kütlesi</p>
                      <p className="text-xl font-bold text-purple-800">
                        {measurementData.muscleMass || measurementData.kas_kütlesi || '-'} kg
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-orange-600 font-medium text-sm">❤️ İç Yağlanma</p>
                      <p className="text-xl font-bold text-orange-800">
                        {measurementData.visceralFat || measurementData.iç_yağlanma || '-'}
                      </p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg col-span-2">
                      <p className="text-pink-600 font-medium text-sm">⚡ Metabolizma Yaşı</p>
                      <p className="text-xl font-bold text-pink-800">
                        {measurementData.metabolicAge || measurementData.metabolizma_yaşı || '-'} yaş
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      📅 Son güncelleme: {measurementData.date ? new Date(measurementData.date).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {pdfError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <span>⚠️</span>
                    <p className="font-medium">Hata: {pdfError}</p>
                  </div>
                </CardContent>
              </Card>
                         )}

            {/* Goals & Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="w-6 h-6" />
                  Hedefler ve Sağlık Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    Hedef
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedClient?.goal || ''}
                      onChange={(e) => setEditedClient(prev => prev ? {...prev, goal: e.target.value} : null)}
                      className="mt-2"
                      placeholder="Kilo verme, kas kazanma vb."
                    />
                  ) : (
                    <p className="font-medium text-lg mt-2">{translateGoal(client.goal) || 'Hedef belirtilmemiş'}</p>
                  )}
                </div>
                
                <div>
                  <Label className="text-base flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    Sağlık Durumları
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editedClient?.medicalConditions || ''}
                      onChange={(e) => setEditedClient(prev => prev ? {...prev, medicalConditions: e.target.value} : null)}
                      rows={3}
                      className="mt-2"
                      placeholder="Diyabet, hipertansiyon, tiroid vb. sağlık durumları"
                    />
                  ) : (
                    <p className="font-medium text-lg mt-2">
                      {client.medicalConditions || 'Bilinen sağlık sorunu bulunmuyor'}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Alerjiler
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editedClient?.allergies || ''}
                      onChange={(e) => setEditedClient(prev => prev ? {...prev, allergies: e.target.value} : null)}
                      rows={3}
                      className="mt-2"
                      placeholder="Besin alerjileri, ilaç alerjileri vb."
                    />
                  ) : (
                    <p className="font-medium text-lg mt-2">
                      {client.allergies || 'Bilinen alerji bulunmuyor'}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-base flex items-center gap-2">
                    <StickyNote className="w-4 h-4 text-purple-600" />
                    Notlar
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editedClient?.notes || ''}
                      onChange={(e) => setEditedClient(prev => prev ? {...prev, notes: e.target.value} : null)}
                      rows={4}
                      className="mt-2"
                      placeholder="Ek notlar ve özel durumlar"
                    />
                  ) : (
                    <p className="font-medium text-lg mt-2">{client.notes || 'Not bulunmuyor'}</p>
                  )}
                </div>
              </CardContent>
            </Card>


          </div>

          {/* Right Column - Body Composition */}
          <div className="xl:col-span-2">
            {measurementData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Activity className="w-7 h-7" />
                    Vücut Kompozisyonu
                  </CardTitle>
                  <p className="text-gray-600">Bölgesel yağ oranları görselleştirmesi</p>
                </CardHeader>
                <CardContent className="flex justify-center items-center py-8">
                  <div className="relative">
                    <img
                      src={client.gender === "male" ? "/male-body.png" : "/female-body.png"}
                      alt="Vücut Kompozisyonu"
                      className="w-80 h-auto mx-auto"
                    />
                    {/* Sağ Kol */}
                    <div className="absolute left-[15%] top-[25%] transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-green-600 text-white rounded-full px-3 py-2 shadow-lg text-sm font-bold">
                        {measurementData?.sağ_kol_yağ_oranı ? `${measurementData.sağ_kol_yağ_oranı}%` : '-'}
                      </div>
                    </div>
                    {/* Sol Kol */}
                    <div className="absolute right-[15%] top-[25%] transform translate-x-1/2 -translate-y-1/2">
                      <div className="bg-green-600 text-white rounded-full px-3 py-2 shadow-lg text-sm font-bold">
                        {measurementData?.sol_kol_yağ_oranı ? `${measurementData.sol_kol_yağ_oranı}%` : '-'}
                      </div>
                    </div>
                    {/* Gövde */}
                    <div className="absolute left-1/2 top-[38%] transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-green-600 text-white rounded-full px-3 py-2 shadow-lg text-sm font-bold">
                        {measurementData?.gövde_yağ_oranı ? `${measurementData.gövde_yağ_oranı}%` : '-'}
                      </div>
                    </div>
                    {/* Sağ Bacak */}
                    <div className="absolute left-[22%] bottom-[10%] transform -translate-x-1/2 translate-y-1/2">
                      <div className="bg-green-600 text-white rounded-full px-3 py-2 shadow-lg text-sm font-bold">
                        {measurementData?.sağ_bacak_yağ_oranı ? `${measurementData.sağ_bacak_yağ_oranı}%` : '-'}
                      </div>
                    </div>
                    {/* Sol Bacak */}
                    <div className="absolute right-[22%] bottom-[10%] transform translate-x-1/2 translate-y-1/2">
                      <div className="bg-green-600 text-white rounded-full px-3 py-2 shadow-lg text-sm font-bold">
                        {measurementData?.sol_bacak_yağ_oranı ? `${measurementData.sol_bacak_yağ_oranı}%` : '-'}
                      </div>
                    </div>
                  </div>
                                 </CardContent>
               </Card>
             ) : (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-2xl">
                     <FileText className="w-7 h-7" />
                     Vücut Analizi
                   </CardTitle>
                   <p className="text-gray-600">PDF ölçüm dosyası yükleyerek vücut analizinizi görüntüleyin</p>
                 </CardHeader>
                 <CardContent className="text-center py-16">
                   <div className="flex flex-col items-center gap-4 text-gray-500">
                     <FileText className="w-16 h-16 text-gray-300" />
                     <p className="text-lg">Henüz ölçüm verisi bulunmuyor</p>
                     <p className="text-sm">
                       Yukarıdaki "PDF Analizi" butonuna tıklayarak<br />
                       vücut analizi PDF dosyanızı yükleyin
                     </p>
                   </div>
                 </CardContent>
               </Card>
             )}

            {/* Weight Chart */}
            <div className="mt-8">
              <WeightChart clientId={clientId} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}