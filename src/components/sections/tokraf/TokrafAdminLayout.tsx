"use client";

import type { ReactNode } from "react";
import { TokrafDemoStore } from "./demo-store";

export default function TokrafAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TokrafDemoStore>
      <div className="tokraf-admin-demo-warning" role="note">
        Mode demo: perubahan hanya tersimpan di browser ini. Filter role
        membantu simulasi navigasi dan bukan pengganti otorisasi backend.
      </div>
      {children}
    </TokrafDemoStore>
  );
}
