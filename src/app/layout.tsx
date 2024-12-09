//src/app/layout.tsx
import "../globals.css";
import Header from "@/components/header/Header";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  display: "swap",        
});
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body className={roboto.className}> 
        <Header />
        {children}
      </body>
    </html>
  );
}
