// lib/get-backend-url.ts
export async function getBackendUrl(): Promise<string> {
  try {
    const res = await fetch("/api/config");
    if (!res.ok) throw new Error("Fehler beim Abrufen der Konfiguration");

    const data = await res.json();
    return data.backendUrl;
  } catch (err) {
    console.error("Fehler beim Abrufen der Backend-URL:", err);
    return "http://localhost:8000"; // Fallback
  }
}
