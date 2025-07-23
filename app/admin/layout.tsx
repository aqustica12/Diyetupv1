'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, FileText, ChefHat, Apple, HeadphonesIcon, Settings, BarChart3, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminTokenExpiry = localStorage.getItem('adminTokenExpiry');
    
    // Token yoksa veya süresi dolmuşsa login göster
    if (!adminToken || !adminTokenExpiry || new Date().getTime() > parseInt(adminTokenExpiry)) {
      // Geçersiz token'ları temizle
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminTokenExpiry');
      setIsAuthenticated(false);
      setShowLogin(true);
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin bilgileri (gerçek uygulamada bu bilgiler güvenli bir şekilde saklanmalı)
    const adminCredentials = {
      username: 'aqustica1',
      password: '2571998aF.'
    };

    if (loginData.username === adminCredentials.username && 
        loginData.password === adminCredentials.password) {
      // Token'ı 8 saat geçerli olacak şekilde ayarla
      const tokenExpiry = new Date().getTime() + (8 * 60 * 60 * 1000); // 8 saat
      localStorage.setItem('adminToken', 'admin-authenticated');
      localStorage.setItem('adminTokenExpiry', tokenExpiry.toString());
      setIsAuthenticated(true);
      setShowLogin(false);
      toast.success('Admin paneline hoş geldiniz!');
    } else {
      toast.error('Kullanıcı adı veya şifre hatalı!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    setIsAuthenticated(false);
    setShowLogin(true);
    router.push('/admin');
    toast.info('Çıkış yapıldı');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
            <p className="text-gray-600 mt-2">Giriş yapın</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
              <Input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                placeholder="admin"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Giriş Yap
            </Button>
          </form>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="bottom-right" />
      
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <h1 className="text-xl font-bold">Admin Paneli</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm">Hoş geldiniz, Admin</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-white border-white hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <a href="/admin" className="flex items-center px-3 py-4 text-sm font-medium text-gray-900 border-b-2 border-red-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Genel Bakış
            </a>
            <a href="/admin/users" className="flex items-center px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
              <Users className="w-4 h-4 mr-2" />
              Kullanıcılar
            </a>
            <a href="/admin/blog" className="flex items-center px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
              <FileText className="w-4 h-4 mr-2" />
              Blog Yönetimi
            </a>
            <a href="/admin/recipes" className="flex items-center px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
              <ChefHat className="w-4 h-4 mr-2" />
              Tarif Yönetimi
            </a>
            <a href="/admin/foods" className="flex items-center px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
              <ChefHat className="w-4 h-4 mr-2" />
              Besin Yönetimi
            </a>
            <a href="/admin/support" className="flex items-center px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
              <HeadphonesIcon className="w-4 h-4 mr-2" />
              Destek
            </a>
            <a href="/admin/system" className="flex items-center px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
              <Settings className="w-4 h-4 mr-2" />
              Sistem
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}