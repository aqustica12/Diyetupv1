'use client';
import { useState, useEffect } from 'react';
import { Users, FileText, ChefHat, TrendingUp } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    blogPosts: 0,
    recipes: 0,
    activeDietitians: 0
  });

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalUsers: 0,
        blogPosts: 0,
        recipes: 0,
        activeDietitians: 0
      });
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Genel Bakış</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Toplam Kullanıcı"
            value={stats.totalUsers}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Blog Yazıları"
            value={stats.blogPosts}
            icon={FileText}
            color="bg-green-500"
          />
          <StatCard
            title="Tarifler"
            value={stats.recipes}
            icon={ChefHat}
            color="bg-orange-500"
          />
          <StatCard
            title="Aktif Diyetisyen"
            value={stats.activeDietitians}
            icon={TrendingUp}
            color="bg-purple-500"
          />
        </div>
      </div>
    </>
  );
};

export default AdminPage;