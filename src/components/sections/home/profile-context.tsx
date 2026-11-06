"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
} from "react";
import { getProfil, type Profil } from "@/lib/api/queries";
import { useApiResource, type Resource } from "@/hooks/use-api-resource";

const ProfileContext = createContext<Resource<Profil> | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const loadProfile = useCallback(() => getProfil(), []);
  const profile = useApiResource(loadProfile);

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useOrganizationProfile() {
  const profile = useContext(ProfileContext);
  if (!profile) {
    throw new Error(
      "Komponen profil organisasi harus berada di dalam ProfileProvider.",
    );
  }
  return profile;
}
