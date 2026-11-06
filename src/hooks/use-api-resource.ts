"use client";

import { useEffect, useState } from "react";
import { ApiRequestError } from "@/lib/api/queries";

export type Resource<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function getRequestError(error: unknown) {
  if (error instanceof ApiRequestError) return error.message;
  if (error instanceof Error) {
    return `Tidak dapat terhubung ke API HIMATIKA: ${error.message}`;
  }
  return "Tidak dapat terhubung ke API HIMATIKA.";
}

export function useApiResource<T>(load: () => Promise<T>): Resource<T> {
  const [resource, setResource] = useState<Resource<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    void load()
      .then((data) => {
        if (active) setResource({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) {
          setResource({
            data: null,
            loading: false,
            error: getRequestError(error),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [load]);

  return resource;
}
