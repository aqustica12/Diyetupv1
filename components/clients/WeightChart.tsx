"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, Plus, X, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MeasurementEntry {
  date: string;
  datetime?: string; // ISO datetime string
  weight?: number;
  fatPercent?: number;
  muscleMass?: number;
  visceralFat?: number;
  metabolicAge?: number;
  notes?: string;
}

interface MeasurementChartProps {
  clientId: string;
}

export default function WeightChart({ clientId }: MeasurementChartProps) {
  const [measurementData, setMeasurementData] = useState<MeasurementEntry[]>([]);
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newFatPercent, setNewFatPercent] = useState('');
  const [newMuscleMass, setNewMuscleMass] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    loadMeasurementData();
  }, [clientId]);

  // PDF upload edildiğinde refresh için
  useEffect(() => {
    const handleStorageChange = () => {
      loadMeasurementData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event listener for same-tab updates
    window.addEventListener('measurementUpdate', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('measurementUpdate', handleStorageChange);
    };
  }, [clientId]);

  const loadMeasurementData = () => {
    // Weight data'dan measurement data'ya geçiş
    const allWeightData = JSON.parse(localStorage.getItem('weightData') || '{}');
    const allMeasurements = JSON.parse(localStorage.getItem('measurements') || '{}');
    
    let data: MeasurementEntry[] = [];
    
    // Eski kilo verilerini al
    if (allWeightData[clientId]) {
      data = [...allWeightData[clientId]];
    }
    
    // PDF ölçüm verilerini weightData'dan da al (çünkü artık oraya da kaydediliyor)
    // Bu sayede hem eski hem yeni PDF verileri yüklenecek
    
    // Datetime'a göre sırala
    data.sort((a: MeasurementEntry, b: MeasurementEntry) => {
      const dateA = new Date(a.datetime || a.date).getTime();
      const dateB = new Date(b.datetime || b.date).getTime();
      return dateA - dateB;
    });
    
    setMeasurementData(data);
  };

  const saveMeasurementData = (data: MeasurementEntry[]) => {
    const allWeightData = JSON.parse(localStorage.getItem('weightData') || '{}');
    allWeightData[clientId] = data;
    localStorage.setItem('weightData', JSON.stringify(allWeightData));
  };

  const addMeasurementEntry = () => {
    if (!newWeight || !newDate) return;
    
    const now = new Date();
    const newEntry: MeasurementEntry = {
      date: newDate,
      datetime: now.toISOString(), // Manuel ekleme için de datetime
      weight: parseFloat(newWeight),
      fatPercent: newFatPercent ? parseFloat(newFatPercent) : undefined,
      muscleMass: newMuscleMass ? parseFloat(newMuscleMass) : undefined,
      notes: newNotes || `Manuel girdi (${now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })})`
    };
    
    const updatedData = [...measurementData, newEntry].sort((a, b) => {
      const dateA = new Date(a.datetime || a.date).getTime();
      const dateB = new Date(b.datetime || b.date).getTime();
      return dateA - dateB;
    });
    
    setMeasurementData(updatedData);
    saveMeasurementData(updatedData);
    
    // Reset form
    setNewWeight('');
    setNewFatPercent('');
    setNewMuscleMass('');
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewNotes('');
    setIsAddingMeasurement(false);
  };

  const removeMeasurementEntry = (index: number) => {
    const updatedData = measurementData.filter((_, i) => i !== index);
    setMeasurementData(updatedData);
    saveMeasurementData(updatedData);
  };

  const getTrend = (key: keyof MeasurementEntry) => {
    if (measurementData.length < 2) return null;
    const validData = measurementData.filter(entry => entry[key] !== undefined);
    if (validData.length < 2) return null;
    
    const first = validData[0][key] as number;
    const last = validData[validData.length - 1][key] as number;
    const diff = last - first;
    
    return {
      diff: Math.abs(diff),
      isGain: diff > 0,
      isLoss: diff < 0
    };
  };

  const weightTrend = getTrend('weight');
  const fatTrend = getTrend('fatPercent');

  // Grafik için veri hazırla
  const chartData = measurementData.map(entry => {
    const displayDate = entry.datetime 
      ? new Date(entry.datetime).toLocaleDateString('tr-TR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      : new Date(entry.date).toLocaleDateString('tr-TR');
    
    return {
      date: displayDate,
      Kilo: entry.weight,
      'Yağ Oranı': entry.fatPercent,
      'Kas Kütlesi': entry.muscleMass
    };
  });

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">💪 Mevcut Kilo</p>
                <p className="text-xl font-bold text-blue-600">
                  {measurementData.length > 0 ? `${measurementData[measurementData.length - 1].weight || '-'} kg` : '-'}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">🔥 Son Yağ Oranı</p>
                <p className="text-xl font-bold text-green-600">
                  {measurementData.length > 0 ? `${measurementData[measurementData.length - 1].fatPercent || '-'}%` : '-'}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">📈 Kilo Değişimi</p>
                <p className={`text-xl font-bold ${
                  weightTrend?.isLoss ? 'text-green-600' : weightTrend?.isGain ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {weightTrend ? `${weightTrend.isLoss ? '-' : '+'}${weightTrend.diff.toFixed(1)} kg` : '-'}
                </p>
              </div>
              {weightTrend?.isLoss ? (
                <TrendingDown className="w-6 h-6 text-green-500" />
              ) : weightTrend?.isGain ? (
                <TrendingUp className="w-6 h-6 text-red-500" />
              ) : (
                <BarChart3 className="w-6 h-6 text-gray-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            📊 Ölçüm Değişim Grafiği
            <Button 
              onClick={() => setIsAddingMeasurement(true)} 
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ölçüm Ekle
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add Measurement Form */}
          {isAddingMeasurement && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label>Tarih</Label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Kilo (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="75.5"
                  />
                </div>
                <div>
                  <Label>Yağ Oranı (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newFatPercent}
                    onChange={(e) => setNewFatPercent(e.target.value)}
                    placeholder="18.5"
                  />
                </div>
                <div>
                  <Label>Kas Kütlesi (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newMuscleMass}
                    onChange={(e) => setNewMuscleMass(e.target.value)}
                    placeholder="35.2"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={addMeasurementEntry} className="bg-green-600 hover:bg-green-700">
                    Ekle
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingMeasurement(false)}>
                    İptal
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <Label>Not (opsiyonel)</Label>
                <Input
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ölçüm notu"
                />
              </div>
            </div>
          )}

          {/* Chart */}
          {chartData.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Kilo" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Yağ Oranı" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                    dot={{ fill: '#16a34a', strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Kas Kütlesi" 
                    stroke="#9333ea" 
                    strokeWidth={2}
                    dot={{ fill: '#9333ea', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz ölçüm verisi bulunmuyor</p>
              <p className="text-gray-400 text-sm mt-1">
                İlk ölçümünüzü eklemek için yukarıdaki butona tıklayın
              </p>
            </div>
          )}

          {/* Measurement List */}
          {measurementData.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">📋 Ölçüm Geçmişi</h4>
              <div className="space-y-2">
                                 {measurementData.slice(-5).reverse().map((entry, index) => (
                   <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                     <div className="flex items-center gap-4">
                       <div className="text-gray-600">
                         {entry.datetime 
                           ? new Date(entry.datetime).toLocaleDateString('tr-TR', {
                               day: '2-digit',
                               month: '2-digit', 
                               year: '2-digit',
                               hour: '2-digit',
                               minute: '2-digit'
                             })
                           : new Date(entry.date).toLocaleDateString('tr-TR')
                         }
                       </div>
                      {entry.weight && (
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          💪 {entry.weight}kg
                        </div>
                      )}
                      {entry.fatPercent && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          🔥 {entry.fatPercent}%
                        </div>
                      )}
                      {entry.muscleMass && (
                        <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          💪 {entry.muscleMass}kg
                        </div>
                      )}
                      {entry.notes && (
                        <div className="text-gray-500 italic text-xs">
                          {entry.notes}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMeasurementEntry(measurementData.length - 1 - index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 