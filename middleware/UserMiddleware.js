import {ROLES} from "../constants/Roles.js";
import {PERMISSIONS} from "../constants/Permission.js";

export const hasPermission = function(role, permission) {
    const PERMISSION_MATRIX = {
        [ROLES.USER]: [PERMISSIONS.VIEW_PROFILE, PERMISSIONS.EDIT_PROFILE],
        [ROLES.ADMIN]: Object.values(PERMISSIONS)
    };
    return PERMISSION_MATRIX[role]?.includes(permission) || false;
};
