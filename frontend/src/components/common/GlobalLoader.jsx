import React from "react";
import { useIsFetching } from "@tanstack/react-query";

export default function GlobalLoader() {
  const isFetching = useIsFetching();

  if (!isFetching) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
