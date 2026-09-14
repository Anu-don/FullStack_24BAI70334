// ---------------------------------------------------------------
// Role-Based Access Control (RBAC) definitions
// ---------------------------------------------------------------
// Instead of checking `role === "Admin"` all over the app, every
// role is granted a set of PERMISSIONS. Components and routes check
// permissions, not roles directly — so if you ever add a new role
// (e.g. "Manager"), you only need to update this one file.

export const ROLES = {
  ADMIN: "Admin",
  EMPLOYEE: "Employee",
  USER: "User",
};

// Each permission describes ONE thing a user is allowed to do.
export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  MANAGE_USERS: "manage_users",
  VIEW_REPORTS: "view_reports",
  EDIT_CONTENT: "edit_content",
  MANAGE_SETTINGS: "manage_settings",
};

// The RBAC matrix: which role gets which permissions.
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.MANAGE_SETTINGS,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EDIT_CONTENT,
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_DASHBOARD,
  ],
};

// Does this role have this permission?
export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

// Does this role have AT LEAST ONE of the given permissions?
export const hasAnyPermission = (role, permissionList = []) => {
  return permissionList.some((p) => hasPermission(role, p));
};

// Full permission list for a role (useful for debugging/display).
export const getPermissionsForRole = (role) => ROLE_PERMISSIONS[role] || [];