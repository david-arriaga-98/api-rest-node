"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
exports.successResponse = (data, code = 200, message = 'Proceso realizado satisfactoriamente') => {
    return {
        status: 'success',
        code,
        data,
        message
    };
};
exports.errorResponse = (message = 'Ha ocurrido un error al procesar su petición', code = 400, status = 'error') => {
    return {
        status,
        code,
        message
    };
};
//# sourceMappingURL=responses.js.map