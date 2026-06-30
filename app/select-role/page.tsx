import { Suspense } from "react";
import { RoleSelectionView } from "@/features/auth/views/RoleSelectionView";

export default function SelectRolePage() {
  return (
    <Suspense>
      <RoleSelectionView />
    </Suspense>
  );
}
