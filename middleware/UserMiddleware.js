import {ROLES} from "../constants/Roles.js";
import {PERMISSIONS} from "../constants/Permission.js";
import bcrypt from "bcrypt";

export const hashPassword = async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
}

export const comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

export const hasPermission = function(role, permission) {
    const PERMISSION_MATRIX = {
        [ROLES.USER]: [PERMISSIONS.ORDER_ITEM, PERMISSIONS.CANCEL_ORDER, PERMISSIONS.ADD_PRODUCT],
        [ROLES.ADMIN]: Object.values(PERMISSIONS)
    };
    return PERMISSION_MATRIX[role]?.includes(permission) || false;
};
