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
      {/* <HomeLayout> */}
        <Section1 />
        <Section2 />
      {/* </HomeLayout> */}
    </ThemeProvider>
  );
}
