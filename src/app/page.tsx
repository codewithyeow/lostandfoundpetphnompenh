"use client";
import { ThemeProvider } from "styled-components";
import HomeLayout from "@/components/home";

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
        <HomeLayout />
    </ThemeProvider>
  );
}
