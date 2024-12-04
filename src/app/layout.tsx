//src/app/layout.tsx
import "../globals.css";
import Header from "@/components/header/Header";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
