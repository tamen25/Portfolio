"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      <Navbar />
      <main>
        <Hero started={!isLoading} />
      </main>
    </>
  );
}
