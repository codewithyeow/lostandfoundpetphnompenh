"use client";
import { ThemeProvider } from "styled-components";

import dynamic from "next/dynamic";

const theme = {
  colors: {
    primary: "#8DC63F",
    secondary: "#ff6347",
    danger: "#ff0000",
  },
};

const Section1 = dynamic(() => import("@component/home/section-1/Section1"), {
  ssr: false,
});
const Section2 = dynamic(() => import("@component/home/section-2/Section2"), {
  ssr: false,
});

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen flex flex-col">
        {/* Search Section */}
        {/* <SearchSection /> */}

        {/* Main Content - Ensure it takes full height */}
        <div className="flex-1">
          <Section1 />
          <Section2 />
        </div>
      </div>
    </ThemeProvider>
  );
}
