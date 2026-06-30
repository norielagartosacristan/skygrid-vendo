"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.failed = failed;
function success(data, message = "Success") {
    return {
        success: true,
        message,
        data,
    };
}
function failed(message) {
    return {
        success: false,
        message,
    };
}
