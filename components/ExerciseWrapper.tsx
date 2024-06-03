"use client";

import "../assets/App.scss";
import { ReactNode } from "react";
import { ApiOperationsProvider } from "../context/ApiOperationsContext";
import { apiOperations } from "../services/priceData";

export default function ExerciseWrapper({ children }: { children: ReactNode }) {
  return (
    <ApiOperationsProvider operations={apiOperations}>
      {children}
    </ApiOperationsProvider>
  );
}
