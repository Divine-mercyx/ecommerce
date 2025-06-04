import mongoose from 'mongoose';
import { ROLES } from '../constants/Roles.js';
import { PERMISSIONS } from '../constants/Permission.js';

import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.USER
    },
    permissions: {
        type: [String],
        enum: Object.values(PERMISSIONS),
        default: [PERMISSIONS.VIEW_PROFILE, PERMISSIONS.EDIT_PROFILE]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})


userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

userSchema.statics.hasPermission = function(role, permission) {
    const PERMISSION_MATRIX = {
        [ROLES.USER]: [PERMISSIONS.VIEW_PROFILE, PERMISSIONS.EDIT_PROFILE],
        [ROLES.ADMIN]: Object.values(PERMISSIONS)
    };
    return PERMISSION_MATRIX[role]?.includes(permission) || false;
};

export default mongoose.model('User', userSchema);
