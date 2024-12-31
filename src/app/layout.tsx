import "../globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

// Define font styles directly
const battambangFontStyle = {
  fontFamily: "'Battambang', 'Helvetica', 'Arial', sans-serif",
  fontWeight: "400",
};

const poppinsFontStyle = {
  fontFamily: "'Poppins', 'Helvetica', 'Arial', sans-serif",
  fontWeight: "200, 400, 500, 600, 700, 900",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Determine font style based on locale
  const fontStyle = locale === "km" ? battambangFontStyle : poppinsFontStyle;

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={fontStyle}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header locale={locale} />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
