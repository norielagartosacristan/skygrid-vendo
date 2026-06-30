"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const UserService = __importStar(require("../services/user.service"));
const response_1 = require("../utils/response");
async function getUsers(req, res) {
    try {
        const users = await UserService.getUsers();
        res.json((0, response_1.success)(users));
    }
    catch (error) {
        res.status(500).json((0, response_1.failed)(error.message));
    }
}
async function getUserById(req, res) {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const user = await UserService.getUserById(id);
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}
async function createUser(req, res) {
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).json((0, response_1.success)(user, "User created successfully."));
    }
    catch (error) {
        res.status(400).json((0, response_1.failed)(error.message));
    }
}
async function updateUser(req, res) {
    try {
        const user = await UserService.updateUser(req.params.id[0], req.body);
        res.json((0, response_1.success)(user, "User updated successfully."));
    }
    catch (error) {
        res.status(400).json((0, response_1.failed)(error.message));
    }
}
async function deleteUser(req, res) {
    try {
        await UserService.deleteUser(req.params.id[0]);
        res.json((0, response_1.success)(null, "User deleted successfully."));
    }
    catch (error) {
        res.status(400).json((0, response_1.failed)(error.message));
    }
}
