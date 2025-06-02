import bcrypt from 'bcrypt';

export const hashPassword = async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
};

export const correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const hasPermission = function(role, permission, permissionsMatrix) {
    return permissionsMatrix[role]?.includes(permission) || false;
};
