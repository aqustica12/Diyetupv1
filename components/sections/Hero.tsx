'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-6">
              🚀 Diyetisyenler için özel platform
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="text-gray-900">Danışanlarınızı</span>
              <br />
              <span className="text-green-600">Profesyonelce</span>
              <br />
              <span className="text-gray-900">Yönetin</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              DiyetUp ile diyet planlarınızı kolayca oluşturun,
              danışanlarınızın ilerlemesini takip edin ve randevularınızı
              profesyonelce yönetin. Tüm ihtiyaçlarınız tek platformda!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6"
                asChild
              >
                <a href="/register">
                  <span className="flex items-center">
                    Ücretsiz Dene
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 text-lg px-8 py-6"
                asChild
              >
                <a href="/demo">Demo İzle</a>
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
              {/* Dashboard Header */}
              <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">D</span>
                  </div>
                  <span className="font-semibold">DiyetUp Dashboard</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Active Clients Card */}
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <div className="text-gray-600 text-sm mb-1">Aktif Danışan</div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">127</div>
                    <div className="text-green-600 text-sm">Başarı Oranı: 89%</div>
                  </div>
                  
                  {/* Today's Appointments Card */}
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <div className="text-gray-600 text-sm mb-1">Bugün Randevu</div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">5</div>
                    <div className="text-blue-600 text-sm">2 online, 3 yüz yüze</div>
                  </div>
                </div>

                {/* İlerleme Grafikleri */}
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="text-gray-600 text-sm mb-4">İlerleme Grafikleri</div>
                  <div className="bg-gray-50 p-4 rounded-lg h-24 flex items-end justify-between">
                    <div className="w-8 bg-green-500 rounded-t-sm" style={{ height: '60%' }}></div>
                    <div className="w-8 bg-green-500 rounded-t-sm" style={{ height: '75%' }}></div>
                    <div className="w-8 bg-green-500 rounded-t-sm" style={{ height: '45%' }}></div>
                    <div className="w-8 bg-green-500 rounded-t-sm" style={{ height: '80%' }}></div>
                    <div className="w-8 bg-green-500 rounded-t-sm" style={{ height: '65%' }}></div>
                    <div className="w-8 bg-green-500 rounded-t-sm" style={{ height: '90%' }}></div>
                    <div className="w-8 bg-green-500 rounded-t-sm" style={{ height: '70%' }}></div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="text-gray-600 text-sm mb-4">Son Aktiviteler</div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 text-xs">👤</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Yeni danışan eklendi</div>
                        <div className="text-xs text-gray-500">2 dakika önce</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-xs">📅</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Randevu onaylandı</div>
                        <div className="text-xs text-gray-500">5 dakika önce</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}