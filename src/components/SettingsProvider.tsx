"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SiteSettings } from "@/lib/settings";
import { DEFAULT_SETTINGS } from "@/lib/settings";

type SettingsContextValue = {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => void;
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refresh: () => {},
});

/**
 * Provider de paramètres pour les composants client.
 * Fetch /api/public-settings au montage.
 */
export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings?: SiteSettings;
}) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(!initialSettings);

  async function load() {
    try {
      const res = await fetch("/api/public-settings");
      const data = await res.json();
      if (data.ok && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.warn("[SettingsProvider] Erreur fetch:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!initialSettings) load();
  }, [initialSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
