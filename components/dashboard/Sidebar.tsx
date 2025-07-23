'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  X,
  Home,
  Users,
  FileText,
  Calendar,
  Package,
  MessageSquare,
  BarChart3,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  ChefHat,
  Shield,
  HeadphonesIcon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [clientsOpen, setClientsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey]
    );
  };

  const handleLogout = () => {
    // LocalStorage'dan kullanıcı verilerini temizle
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentUserId');
    
    // Ana sayfaya yönlendir
    router.push('/');
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard',
    },
    {
      key: 'clients',
      label: 'Danışanlar',
      icon: Users,
      href: '/dashboard/clients',
      subItems: [
        { label: 'Tüm Danışanlar', href: '/dashboard/clients' },
        { label: 'Yeni Danışan', href: '/dashboard/clients/new' },
        { label: 'Danışan Grupları', href: '/dashboard/clients/archive' },
      ]
    },
    {
      key: 'diet-plans',
      label: 'Diyet Planları',
      icon: FileText,
      href: '/dashboard/diet-plans',
    },
    {
      key: 'foods',
      label: 'Besinler',
      icon: ChefHat,
      href: '/dashboard/foods',
    },
    {
      key: 'appointments',
      label: 'Randevular',
      icon: Calendar,
      href: '/dashboard/appointments',
    },
    {
      key: 'packages',
      label: 'Paketler',
      icon: Package,
      href: '/dashboard/packages',
    },
    {
      key: 'messages',
      label: 'Mesajlar',
      icon: MessageSquare,
      href: '/dashboard/messages',
    },
    {
      key: 'reports',
      label: 'Raporlar',
      icon: BarChart3,
      href: '/dashboard/reports',
    },
    {
      key: 'blog',
      label: 'Blog',
      icon: FileText,
      href: '/dashboard/blog',
    },
    {
      key: 'recipes',
      label: 'Tarifler',
      icon: ChefHat,
      href: '/dashboard/recipes',
    },
    {
      key: 'subscription',
      label: 'Abonelik',
      icon: CreditCard,
      href: '/dashboard/subscription',
    },
    {
      key: 'support',
      label: 'Destek',
      icon: HeadphonesIcon,
      href: '/dashboard/support',
    },
    {
      key: 'settings',
      label: 'Ayarlar',
      icon: Settings,
      href: '/dashboard/settings',
    },
  ];

  const isActive = (href: string) => {
    return pathname?.startsWith(href) || false;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } h-screen`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold text-gray-900">DiyetUp</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === '/dashboard'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>

            <div className="relative">
              <button
                onClick={() => setClientsOpen(!clientsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname?.startsWith('/dashboard/clients')
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <Users className="mr-3 h-5 w-5" />
                  Danışanlar
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${clientsOpen ? 'rotate-90' : ''}`} />
              </button>
              {clientsOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  <Link
                    href="/dashboard/clients"
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      pathname === '/dashboard/clients'
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Tüm Danışanlar
                  </Link>
                  <Link
                    href="/dashboard/clients/new"
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      pathname === '/dashboard/clients/new'
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Yeni Danışan
                  </Link>
                  <Link
                    href="/dashboard/clients/archive"
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      pathname === '/dashboard/clients/archive'
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Danışan Grupları
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/dashboard/diet-plans"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname?.startsWith('/dashboard/diet-plans')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <FileText className="mr-3 h-5 w-5" />
              Diyet Planları
            </Link>

            <Link
              href="/dashboard/foods"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname?.startsWith('/dashboard/foods')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ChefHat className="mr-3 h-5 w-5" />
              Besinler
            </Link>

            <Link
              href="/dashboard/appointments"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname?.startsWith('/dashboard/appointments')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Randevular
            </Link>

            <Link
              href="/dashboard/packages"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname?.startsWith('/dashboard/packages')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Package className="mr-3 h-5 w-5" />
              Paketler
            </Link>

            <Link
              href="/dashboard/messages"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname?.startsWith('/dashboard/messages')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              Mesajlar
            </Link>

            <Link
              href="/dashboard/reports"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname?.startsWith('/dashboard/reports')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Raporlar
            </Link>

            <Link
              href="/dashboard/blog"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname?.startsWith('/dashboard/blog')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <FileText className="mr-3 h-5 w-5" />
              Blog
            </Link>

            <Link
              href="/dashboard/recipes"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname?.startsWith('/dashboard/recipes')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ChefHat className="mr-3 h-5 w-5" />
              Tarifler
            </Link>

            <Link
              href="/dashboard/subscription"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname?.startsWith('/dashboard/subscription')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Abonelik
            </Link>

            <Link
              href="/dashboard/support"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname?.startsWith('/dashboard/support')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <HeadphonesIcon className="mr-3 h-5 w-5" />
              Destek
            </Link>

            <Link
              href="/dashboard/settings"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname?.startsWith('/dashboard/settings')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Ayarlar
            </Link>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user ? `${user.firstName?.charAt(0) || 'D'}${user.lastName?.charAt(0) || 'U'}` : 'DU'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user ? `${user.firstName || 'Diyetisyen'} ${user.lastName || 'Demo User'}` : 'Diyetisyen Demo User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {(() => {
                    const subscription = user?.subscription || 'basic';
                    const planNames = {
                      'basic': 'Başlangıç Plan',
                      'professional': 'Profesyonel Plan',
                      'enterprise': 'Kurumsal Plan'
                    };
                    return planNames[subscription] || 'Başlangıç Plan';
                  })()}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full mt-3 justify-start text-gray-600 hover:text-gray-900"
            >
              <span>Çıkış Yap</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}