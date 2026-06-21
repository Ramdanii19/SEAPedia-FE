// Views
export { RegisterView } from "./views/RegisterView";
export { LoginView } from "./views/LoginView";
export { RoleSelectionView } from "./views/RoleSelectionView";
export { ProfileView } from "./views/ProfileView";

// Service
export { default as authService } from "./service/auth.service";

// Types
export type { User, Role, LoginResponse } from "./types/auth.types";

// Guards & utilities
export { RouteGuard } from "./components/RouteGuard";
