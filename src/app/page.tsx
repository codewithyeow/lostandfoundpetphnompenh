"use client";
import { ThemeProvider } from "styled-components";
import HomeLayout from "@/components/home";
import Section1 from "@/components/home/section-1";
import Section2 from "@/components/home/section-2";

const theme = {
  colors: {
    primary: "#8DC63F",
    secondary: "#ff6347",
    danger: "#ff0000",
  },
};

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <main className="w-full">
        <Section1 />
        <div className="max-w-screen-xl mx-auto">
          <Section2 />
          <HomeLayout />
        </div>
      </main>
    </ThemeProvider>
  );
}
