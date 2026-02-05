"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register = ({ strapi }) => {
    // register phase
    strapi.customFields.register({
        name: 'checkbox-list',
        plugin: 'checkbox-list',
        type: 'json',
        inputSize: {
            default: 6,
            isResizable: true,
        },
    });
};
exports.default = register;
