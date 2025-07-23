'use client';

import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  subscription: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token bulunamadı, giriş sayfasına yönlendiriliyor');
        window.location.href = '/login';
        return;
      }

      // Fallback to localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        console.log('localStorage\'dan kullanıcı bilgisi alınıyor');
        setUser(JSON.parse(savedUser));
      } else {
        console.log('localStorage\'da da kullanıcı yok, giriş sayfasına yönlendiriliyor');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('User profile fetch error:', error);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getSubscriptionText = (subscription: string) => {
    switch (subscription) {
      case 'basic':
        return 'Başlangıç Plan';
      case 'professional':
        return 'Profesyonel Plan';
      case 'enterprise':
        return 'Kurumsal Plan';
      default:
        return 'Plan';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="hidden md:block">
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="hidden md:block text-right">
        <div className="text-sm font-medium text-gray-900">
          {user.title} {user.firstName} {user.lastName}
        </div>
        <div className="text-xs text-gray-500">
          {getSubscriptionText(user.subscription)}
        </div>
      </div>
      
      <div className="relative group">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer">
          {getInitials(user.firstName, user.lastName)}
        </div>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible transition-all duration-200 z-50">
          <div className="p-3 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900">
              {user.title} {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}