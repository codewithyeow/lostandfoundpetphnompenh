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
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '500', '600', '700', '900'],
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the locale and messages for SSR
  const locale = await getLocale();
  const messages = await getMessages();

  // Choose the appropriate font class based on locale
  const fontClassName = locale === 'km' ? battambang.className : poppins.className;

  return (
    <html lang={locale}>
      <head>
        {/* Add links to Google Fonts for preloading */}
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap`} />
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap`} />
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;600;700;900&display=swap`} />
      </head>
      <body className={fontClassName}>
        {/* Use NextIntlClientProvider to pass the messages and locale */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header locale={locale} />
          {children}
          <Footer/>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
