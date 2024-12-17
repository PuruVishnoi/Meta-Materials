"use client";

import { useState } from "react";

import DotGrid from "@/components/DotGrid";
import Automated from "@/components/Automated";

export default function Home() {
  const [tab, setTab] = useState(0);

  return (
    <main className="flex flex-col items-center justify-center bg-gray-100 py-5 gap-10">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${
            tab === 0 ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab(0)}
        >
          Dot Grid
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            tab === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab(1)}
        >
          Automated
        </button>
      </div>

      {tab === 0 ? <DotGrid /> : <Automated />}
    </main>
  );
}
