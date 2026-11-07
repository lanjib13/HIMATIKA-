import type { ReactNode } from "react";
import TokrafShell from "@/components/sections/tokraf/TokrafShell";

export default function TokrafLayout({ children }: { children: ReactNode }) {
  return <TokrafShell>{children}</TokrafShell>;
}
