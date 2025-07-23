'use client';

import { useState, useEffect } from 'react';

interface User {
  firstName: string;
  lastName: string;
  title: string;
}

export default function WelcomeHeader() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user from localStorage or API
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return (
      <div>
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
        Hoş Geldiniz, {user.title} {user.firstName} {user.lastName}
      </h1>
      <p className="text-gray-600 mt-2">
        İşte bugünkü özet bilgileriniz ve yaklaşan randevularınız.
      </p>
    </div>
  );
}