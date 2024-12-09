// src/app/page.tsx
"use client";
import { ThemeProvider } from "styled-components";
import HomeLayout from "@/components/home";

const theme = {
  colors: {
    primary: "#8DC63F", // Example primary color
    secondary: "#ff6347", // Example secondary color
    danger: "#ff0000", // Example danger color
  },
};

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <HomeLayout />
    </ThemeProvider>
  );
}
