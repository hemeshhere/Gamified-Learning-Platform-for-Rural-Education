import { useEffect, useState } from "react";
import localforage from "localforage";
import api from "../api/axios";

localforage.config({
  name: "gamified-offline-queue",
});

export async function addOfflineOp(op) {
  const oldOps = (await localforage.getItem("offline_ops")) || [];
  await localforage.setItem("offline_ops", [...oldOps, op]);
}

export function useOfflineQueue() {
  const [pendingOps, setPendingOps] = useState([]);

  // Load pending ops on mount
  useEffect(() => {
    const loadOps = async () => {
      const ops = (await localforage.getItem("offline_ops")) || [];
      setPendingOps(ops);
    };
    loadOps();
  }, []);

  // Sync when back online
  useEffect(() => {
    const syncWhenOnline = async () => {
      const ops = (await localforage.getItem("offline_ops")) || [];
      if (ops.length === 0) return;

      try {
        await api.post("/sync", { ops });
        await localforage.removeItem("offline_ops");
        setPendingOps([]);
        console.log("Offline operations synced!");
      } catch (err) {
        console.error("Sync failed:", err);
      }
    };

    window.addEventListener("online", syncWhenOnline);
    return () => window.removeEventListener("online", syncWhenOnline);
  }, []);

  const manualSync = async () => {
    const ops = (await localforage.getItem("offline_ops")) || [];
    if (ops.length === 0) return false;

    try {
      await api.post("/sync", { ops });
      await localforage.removeItem("offline_ops");
      setPendingOps([]);
      return true;
    } catch {
      return false;
    }
  };

  return { pendingOps, manualSync };
}
