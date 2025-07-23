import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/ui/toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DiyetUp - Diyetisyenler İçin SaaS Platformu',
  description: 'Diyetisyenler için özel olarak tasarlanmış, modern ve güvenli SaaS platformu. Danışanlarınızı yönetin, diyet planları oluşturun ve işinizi büyütün.',
  keywords: 'diyetisyen, diyet planı, danışan yönetimi, randevu sistemi, SaaS platform',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="15" fill="%2310B981"/><text x="50" y="70" font-family="Arial" font-size="60" font-weight="bold" text-anchor="middle" fill="white">D</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <script src="https://www.paytr.com/js/iframeResizer.min.js"></script>
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <ToastContainer />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}