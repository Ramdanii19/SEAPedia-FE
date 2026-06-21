import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";
import { LoginInput, RegisterInput } from "@/features/auth/schema/auth.schema";
import { LoginResponse, Role, User } from "@/features/auth/types/auth.types";

const authService = {
  register(payload: RegisterInput) {
    return apiClient.post<ApiResponse<User>>("/auth/register", payload, {
      auth: false,
    });
  },

  login(payload: LoginInput) {
    return apiClient.post<ApiResponse<LoginResponse>>("/auth/login", payload, {
      auth: false,
    });
  },

  selectActiveRole(role: Role) {
    return apiClient.patch<ApiResponse<User>>("/auth/active-role", { role });
  },

  getMe() {
    return apiClient.get<ApiResponse<User>>("/auth/me");
  },

  logout() {
    return apiClient.post<ApiResponse<null>>("/auth/logout");
  },
};

export default authService;
