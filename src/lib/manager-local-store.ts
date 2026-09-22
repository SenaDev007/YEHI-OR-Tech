export type ManagerEvent = {
  id: string;
  type: "sale" | "expense" | "order" | "allocation";
  amount: number;
  label: string;
  center: "BOUTIQUE" | "ACADEMIA" | "DESIGN" | "TEXTILE" | "DEV";
  createdAt: string;
  syncStatus: "pending" | "synced";
};

const databaseName = "yehi-or-manager";
const storeName = "events";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function addManagerEvent(event: Omit<ManagerEvent, "id" | "createdAt" | "syncStatus">) {
  if (typeof window === "undefined" || !window.indexedDB) return;
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: "id" });
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).put({ ...event, id: makeId(), createdAt: new Date().toISOString(), syncStatus: "pending" });
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    };
  });
}
