"use client";

import { useEffect } from "react";
import { registrar } from "@/lib/rastreo";

export default function RastreoClics() {
  useEffect(() => {
    const alHacerClic = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
      if (el?.dataset.track) registrar("clic", el.dataset.track);
    };
    document.addEventListener("click", alHacerClic);
    return () => document.removeEventListener("click", alHacerClic);
  }, []);
  return null;
}