'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AppointmentsHeader from '@/components/appointments/AppointmentsHeader';
import AppointmentsCalendar from '@/components/appointments/AppointmentsCalendar';
import AppointmentsList from '@/components/appointments/AppointmentsList';
import AppointmentsStats from '@/components/appointments/AppointmentsStats';
import NewAppointmentModal from '@/components/appointments/NewAppointmentModal';
import EditAppointmentModal from '@/components/appointments/EditAppointmentModal';

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'week' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sayfa yüklendiğinde randevuları localStorage'dan al
  useEffect(() => {
    try {
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        setAppointments([]);
        setLoading(false);
        return;
      }
      
      const savedAppointments = localStorage.getItem(`appointments_${currentUserId}`);
      if (savedAppointments) {
        const parsedAppointments = JSON.parse(savedAppointments);
        setAppointments(parsedAppointments);
      } else {
        // İlk kez açılıyorsa demo veriler ekle
        const demoAppointments = [
          {
            id: 'demo-1',
            clientName: 'Ayşe Kaya',
            time: '09:30',
            duration: 30,
            type: 'in-person',
            status: 'confirmed',
            date: '2025-01-18',
            createdAt: new Date().toISOString()
          },
          {
            id: 'demo-2',
            clientName: 'Mehmet Özkan',
            time: '10:00',
            duration: 30,
            type: 'online',
            status: 'confirmed',
            date: '2025-01-18',
            createdAt: new Date().toISOString()
          },
          {
            id: 'demo-3',
            clientName: 'Zeynep Demir',
            time: '11:30',
            duration: 30,
            type: 'in-person',
            status: 'pending',
            date: '2025-01-18',
            createdAt: new Date().toISOString()
          }
        ];
        setAppointments(demoAppointments);
        localStorage.setItem(`appointments_${currentUserId}`, JSON.stringify(demoAppointments));
      }
    } catch (error) {
      console.error('Randevular yüklenirken hata:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewAppointment = (date?: Date, time?: string) => {
    setShowNewAppointmentModal(true);
  };

  const handleSaveAppointment = (appointmentData: any) => {
    // Tarih formatını kontrol et ve düzelt
    let appointmentDate = appointmentData.date;
    if (appointmentDate && !appointmentDate.includes('T')) {
      // Eğer sadece YYYY-MM-DD formatındaysa, timezone sorununu önle
      appointmentDate = appointmentData.date;
    }
    
    const newAppointment = {
      id: Date.now().toString(),
      clientName: appointmentData.clientName,
      time: appointmentData.time,
      date: appointmentDate,
      type: appointmentData.type,
      status: appointmentData.status,
      duration: 30, // Varsayılan 30 dakika
      ...appointmentData,
      createdAt: new Date().toISOString()
    };
    
    console.log('Yeni randevu kaydediliyor:', newAppointment);
    console.log('Tarih kontrolü:', {
      original: appointmentData.date,
      saved: appointmentDate
    });
    
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    setShowNewAppointmentModal(false);
    
    // localStorage'a hemen kaydet
    try {
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId) {
        localStorage.setItem(`appointments_${currentUserId}`, JSON.stringify(updatedAppointments));
      }
      console.log('Randevu localStorage\'a kaydedildi');
    } catch (error) {
      console.error('localStorage kaydetme hatası:', error);
    }
  };

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowEditAppointmentModal(true);
  };

  const handleUpdateAppointment = (updatedAppointment: any) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === updatedAppointment.id ? updatedAppointment : apt
    );
    setAppointments(updatedAppointments);
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      localStorage.setItem(`appointments_${currentUserId}`, JSON.stringify(updatedAppointments));
    }
    setShowEditAppointmentModal(false);
    setSelectedAppointment(null);
  };

  // Randevu silme fonksiyonu
  const handleDeleteAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
    setAppointments(updatedAppointments);
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      localStorage.setItem(`appointments_${currentUserId}`, JSON.stringify(updatedAppointments));
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Randevular yükleniyor...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <AppointmentsHeader 
          viewMode={viewMode}
          setViewMode={setViewMode}
          onNewAppointment={handleNewAppointment}
        />
        <AppointmentsStats appointments={appointments} />
        {viewMode === 'list' ? (
          <AppointmentsList 
            appointments={appointments} 
            onEdit={handleEditAppointment}
          />
        ) : (
          <AppointmentsCalendar 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            viewMode={viewMode}
            onNewAppointment={handleNewAppointment}
            onAppointmentClick={handleEditAppointment}
            appointments={appointments}
          />
        )}

        {/* New Appointment Modal */}
        {showNewAppointmentModal && (
          <NewAppointmentModal
            isOpen={showNewAppointmentModal}
            onClose={() => setShowNewAppointmentModal(false)}
            onSave={handleSaveAppointment}
          />
        )}

        {/* Edit Appointment Modal */}
        {showEditAppointmentModal && selectedAppointment && (
          <EditAppointmentModal
            isOpen={showEditAppointmentModal}
            onClose={() => {
              setShowEditAppointmentModal(false);
              setSelectedAppointment(null);
            }}
            onSave={handleUpdateAppointment}
            onDelete={handleDeleteAppointment}
            appointment={selectedAppointment}
          />
        )}
      </div>
    </DashboardLayout>
  );
}