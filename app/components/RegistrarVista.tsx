"use client";

import { useEffect } from "react";
import { registrar } from "@/lib/rastreo";

export default function RegistrarVista({ referencia }: { referencia: string }) {
  useEffect(() => {
    registrar("vista_producto", referencia);
  }, [referencia]);
  return null;
}