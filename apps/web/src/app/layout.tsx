import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/layout/cart-drawer';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';
import { BRAND_IMAGES, PAGE_IMAGES } from '@/lib/images';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'RUSH — Premium Streetwear',
    template: '%s | RUSH',
  },
  description: 'Move Fast. Dress Bold. Premium modern streetwear for men.',
  icons: {
    icon: BRAND_IMAGES.favicon,
    shortcut: BRAND_IMAGES.favicon,
    apple: BRAND_IMAGES.favicon,
  },
  openGraph: {
    title: 'RUSH — Premium Streetwear',
    description: 'Move Fast. Dress Bold.',
    images: [{ url: PAGE_IMAGES.hero }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <SmoothScrollProvider>
            <AuthProvider>
              <Header />
              <MobileMenu />
              <CartDrawer />
              <main className="min-h-[calc(100vh-4rem)]">{children}</main>
              <Footer />
              <ToastProvider />
            </AuthProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
