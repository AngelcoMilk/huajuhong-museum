// 当前登录账号。页面据此决定显示什么；真正的权限在服务端。
import { createContext, useContext } from "react";
import type { AdminRole, AdminUser } from "./api";

export const ROLE_LABEL: Record<AdminRole, string> = { admin: "管理员", operator: "运营" };

export const AuthContext = createContext<AdminUser | null>(null);

export function useAuth() {
  const user = useContext(AuthContext);
  if (!user) throw new Error("useAuth 要在登录后的页面里用");
  return { user, isAdmin: user.permissions.includes("*") };
}
