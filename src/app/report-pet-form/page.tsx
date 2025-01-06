// src/app/report-pet-form/page.tsx
"use client";

import dynamic from "next/dynamic";

const ReportPetForm = dynamic(() => import("@/page-sections/ReportPetForm"), {
  ssr: false, 

});

export default function ReportPetPage() {
  return (
    <div className="container mx-auto">
        <ReportPetForm />
    </div>
  );
}
