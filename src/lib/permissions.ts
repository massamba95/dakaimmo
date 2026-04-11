export type Role = "ADMIN" | "MANAGER" | "AGENT" | "ACCOUNTANT" | "SECRETARY";

export type Permission =
  | "properties:create"
  | "properties:edit"
  | "properties:delete"
  | "properties:view"
  | "tenants:create"
  | "tenants:edit"
  | "tenants:delete"
  | "tenants:view"
  | "leases:create"
  | "leases:edit"
  | "leases:delete"
  | "leases:view"
  | "payments:create"
  | "payments:view"
  | "team:manage"
  | "settings:org";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    "properties:create", "properties:edit", "properties:delete", "properties:view",
    "tenants:create", "tenants:edit", "tenants:delete", "tenants:view",
    "leases:create", "leases:edit", "leases:delete", "leases:view",
    "payments:create", "payments:view",
    "team:manage", "settings:org",
  ],
  MANAGER: [
    "properties:create", "properties:edit", "properties:delete", "properties:view",
    "tenants:create", "tenants:edit", "tenants:delete", "tenants:view",
    "leases:create", "leases:edit", "leases:delete", "leases:view",
    "payments:create", "payments:view",
  ],
  AGENT: [
    "properties:create", "properties:edit", "properties:view",
    "tenants:create", "tenants:edit", "tenants:view",
    "leases:create", "leases:view",
    "payments:create", "payments:view",
  ],
  ACCOUNTANT: [
    "properties:view",
    "tenants:view",
    "leases:view",
    "payments:create", "payments:view",
  ],
  SECRETARY: [
    "properties:view",
    "tenants:create", "tenants:view",
    "leases:view",
    "payments:view",
  ],
};

export function hasPermission(role: string | null, permission: Permission): boolean {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role as Role];
  if (!perms) return false;
  return perms.includes(permission);
}

export function canAccess(role: string | null, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
