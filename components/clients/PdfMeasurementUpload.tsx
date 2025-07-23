"use client";
import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import BodyComposition from "./BodyComposition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PdfMeasurementUploadProps {
  clientId: string;
  gender: "male" | "female";
  onMeasurement?: (data: any) => void;
}

export default function PdfMeasurementUpload({ 
  clientId, 
  gender, 
  onMeasurement 
}: PdfMeasurementUploadProps) {
  const [measurementData, setMeasurementData] = useState<any>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // localStorage'dan ölçüm verisi yükle 
  useEffect(() => {
    const allMeasurements = JSON.parse(localStorage.getItem('measurements') || '{}');
    if (allMeasurements[clientId]) {
      setMeasurementData(allMeasurements[clientId]);
    }
  }, [clientId]);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfError(null);
    setPdfLoading(true);
    setMeasurementData(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
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
        console.error('Extract API Error:', extractData);
        throw new Error(`Analiz başarısız: ${extractData.error || extractData.details || 'Bilinmeyen hata'}`);
      }
      
      const mapped = mapMeasurementKeys(extractData.output);
      setMeasurementData(mapped);
      
      // localStorage'a kaydet
      const allMeasurements = JSON.parse(localStorage.getItem('measurements') || '{}');
      allMeasurements[clientId] = mapped;
      localStorage.setItem('measurements', JSON.stringify(allMeasurements));
      
      if (onMeasurement) onMeasurement(mapped);
    } catch (err: any) {
      setPdfError(err.message || "PDF analiz hatası.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };



  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            PDF Ölçüm Analizi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            style={{ display: 'none' }}
            disabled={pdfLoading}
            ref={inputRef}
          />
          
          <div className="text-center py-8">
            {pdfLoading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                <p className="text-gray-600">PDF analiz ediliyor...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <FileText className="w-12 h-12 text-gray-400" />
                                 <Button onClick={handleUploadClick} className="bg-green-600 hover:bg-green-700">
                   <Upload className="w-4 h-4 mr-2" />
                   PDF Ölçüm Dosyası Yükle
                 </Button>
                <p className="text-gray-500 text-sm">
                  Vücut analizi PDF dosyanızı yükleyin
                </p>
              </div>
            )}
          </div>

          {pdfError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">Hata: {pdfError}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Measurement Results */}
      {measurementData && (
        <>
          {/* Basic Measurements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Ölçüm Sonuçları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-600 font-medium">Kilo</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {measurementData.weight || measurementData.kilo || '-'} kg
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-600 font-medium">Yağ Oranı</p>
                  <p className="text-2xl font-bold text-green-800">
                    {measurementData.fatPercent || measurementData.yağ_oranı || '-'}%
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-600 font-medium">Kas Kütlesi</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {measurementData.muscleMass || measurementData.kas_kütlesi || '-'} kg
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-orange-600 font-medium">İç Yağlanma</p>
                  <p className="text-2xl font-bold text-orange-800">
                    {measurementData.visceralFat || measurementData.iç_yağlanma || '-'}
                  </p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-pink-600 font-medium">Metabolizma Yaşı</p>
                  <p className="text-2xl font-bold text-pink-800">
                    {measurementData.metabolicAge || measurementData.metabolizma_yaşı || '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Body Composition */}
          <Card>
            <CardHeader>
              <CardTitle>Vücut Kompozisyonu</CardTitle>
            </CardHeader>
            <CardContent>
              <BodyComposition measurements={measurementData} gender={gender} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// Mapping fonksiyonu
function mapMeasurementKeys(raw: any) {
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
} 