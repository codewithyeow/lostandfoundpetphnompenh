import "../globals.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import localFont from 'next/font/local';

// Define font styles
const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});

const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});
const montserrat = localFont({
	src: './fonts/Montserrat-VariableFont_wght.ttf',
	variable: '--font-montserrat',
	weight: '400 700',
	display: 'fallback',
});



export const viewport =
	'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {


	const locale = await getLocale();
const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
				className={`${geistMono.variable} ${geistSans.variable} ${montserrat.variable}`}
			>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header locale={locale} />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
