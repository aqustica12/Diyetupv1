'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Weight, 
  Ruler, 
  Target, 
  Activity,
  Save,
  Edit,
  Check,
  TrendingUp,
  FileText,
  BarChart3,
  Stethoscope,
  AlertTriangle,
  StickyNote
} from 'lucide-react';
import PdfMeasurementUpload from './PdfMeasurementUpload';
import WeightChart from './WeightChart';

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

interface ClientDetailProps {
  clientId: string;
}

export default function ClientDetail({ clientId }: ClientDetailProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

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

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Danışan bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-60"
        >
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            {notification}
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{client.firstName} {client.lastName}</h1>
                  <p className="text-gray-600">Danışan Detayları</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={saveClient}
                      className="bg-green-600 hover:bg-green-700"
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
                    >
                      İptal
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
              <TabsTrigger value="measurements">Vücut Analizi</TabsTrigger>
              <TabsTrigger value="weight">Kilo Takibi</TabsTrigger>
            </TabsList>

            {/* General Information */}
            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Kişisel Bilgiler
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Ad</Label>
                        {isEditing ? (
                          <Input
                            value={editedClient?.firstName || ''}
                            onChange={(e) => setEditedClient(prev => prev ? {...prev, firstName: e.target.value} : null)}
                          />
                        ) : (
                          <p className="font-medium">{client.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label>Soyad</Label>
                        {isEditing ? (
                          <Input
                            value={editedClient?.lastName || ''}
                            onChange={(e) => setEditedClient(prev => prev ? {...prev, lastName: e.target.value} : null)}
                          />
                        ) : (
                          <p className="font-medium">{client.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Yaş</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedClient?.age || ''}
                          onChange={(e) => setEditedClient(prev => prev ? {...prev, age: parseInt(e.target.value)} : null)}
                        />
                      ) : (
                        <p className="font-medium">{client.age} yaş</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>E-posta</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedClient?.email || ''}
                          onChange={(e) => setEditedClient(prev => prev ? {...prev, email: e.target.value} : null)}
                        />
                      ) : (
                        <p className="font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {client.email}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Telefon</Label>
                      {isEditing ? (
                        <Input
                          value={editedClient?.phone || ''}
                          onChange={(e) => setEditedClient(prev => prev ? {...prev, phone: e.target.value} : null)}
                        />
                      ) : (
                        <p className="font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {client.phone}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Physical Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Fiziksel Özellikler
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Boy (cm)</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedClient?.height || ''}
                            onChange={(e) => setEditedClient(prev => prev ? {...prev, height: parseInt(e.target.value)} : null)}
                          />
                        ) : (
                          <p className="font-medium flex items-center gap-2">
                            <Ruler className="w-4 h-4" />
                            {client.height} cm
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Kilo (kg)</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.1"
                            value={editedClient?.weight || ''}
                            onChange={(e) => setEditedClient(prev => prev ? {...prev, weight: parseFloat(e.target.value)} : null)}
                          />
                        ) : (
                          <p className="font-medium flex items-center gap-2">
                            <Weight className="w-4 h-4" />
                            {client.weight} kg
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>BMI</Label>
                      <p className="font-medium">
                        {client.height && client.weight 
                          ? (client.weight / Math.pow(client.height / 100, 2)).toFixed(1)
                          : 'Hesaplanamadı'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Goals & Health Info */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Hedefler ve Sağlık Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="flex items-center gap-2">
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
                      <Label className="flex items-center gap-2">
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
                      <Label className="flex items-center gap-2">
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
                      <Label className="flex items-center gap-2">
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
            </TabsContent>

            {/* Measurements */}
            <TabsContent value="measurements" className="space-y-6">
              <PdfMeasurementUpload 
                clientId={clientId} 
                gender={client.gender} 
                onMeasurement={(data) => {
                  console.log('Ölçüm verisi güncellendi:', data);
                }}
              />
            </TabsContent>

            {/* Weight Chart */}
            <TabsContent value="weight" className="space-y-6">
              <WeightChart clientId={clientId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}