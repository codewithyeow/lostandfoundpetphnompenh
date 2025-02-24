"use client";
import { ThemeProvider } from "styled-components";
import Section1 from "../components/home/section-1";
import Section2 from "../components/home/section-2";
import { SearchSection } from "@component/home/search-section";

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
      <div className="min-h-screen flex flex-col">
        {/* Search Section */}

        {/* Main Content - Ensure it takes full height */}
        <div className="flex-1">
          <Section1 />
          <Section2 />
        </div>
      </div>
    </ThemeProvider>
  );
}
