import { Role } from "@/features/auth/types/auth.types";

export function roleHome(role: Role | null): string {
  switch (role) {
    case "BUYER":  return "/buyer/dashboard";
    case "SELLER": return "/seller/dashboard";
    case "DRIVER": return "/driver/dashboard";
    case "ADMIN":  return "/admin/dashboard";
    default:       return "/select-role";
  }
}
