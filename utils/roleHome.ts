import { Role } from "@/features/auth/types/auth.types";

export function roleHome(role: Role | null): string {
  switch (role) {
    case "BUYER":  return "/";
    case "SELLER": return "/seller";
    case "DRIVER": return "/driver";
    case "ADMIN":  return "/admin";
    default:       return "/select-role";
  }
}
