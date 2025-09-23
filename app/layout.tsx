import { Inter, MuseoModerno, Nunito } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/authContext';
import { Toaster } from 'react-hot-toast';
import Footer from '../components/shared/Footer'
import Navbar from '../components/shared/Navbar';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });
const museoModerno = MuseoModerno({ subsets: ['latin'] });
const nunito = Nunito({ subsets: ['latin'] });


export const metadata = {
  title: 'Green Sphere Services- Advanced Shipment Tracking System',
  description: 'Professional shipment tracking system with crypto payments and real-time updates',
  keywords: 'shipment tracking, logistics, crypto payments, delivery tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body className={`${inter.className} ${museoModerno.className}`}>
        <Navbar />
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}