//src/app/layout.tsx
import "../globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Roboto } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Battambang, Poppins } from 'next/font/google';

const roboto = Roboto({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  display: "swap",        
});
const battambang = Battambang({
  subsets: ['khmer'],
  weight: ['400', '700'],
  display: 'fallback',
  // fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '500', '600', '700', '900'],
  display: 'swap',
  // fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const fontClassName = locale === 'kh' ? battambang.className : poppins.className;
  return (
    <html lang={locale}>
      <head></head>
      <body className={fontClassName}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Header locale={locale} />
        {children}
        <Footer/>
      </NextIntlClientProvider>
      </body>
    </html>
  );
}
