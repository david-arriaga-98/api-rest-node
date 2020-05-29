"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const responses_1 = require("../utils/responses");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
exports.default = (req, res, next) => {
    var _a;
    try {
        const error = responses_1.errorResponse('No autorizado', 401, 'unauthorize');
        // Recogemos los datos
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ');
        if (token === undefined || token.length === 0) {
            throw 'error';
        }
        else {
            if (token[0] === 'Bearer') {
                if (validator_1.default.isJWT(token[1])) {
                    const key = process.env.KEY || 'llaveprimaria';
                    const data = jsonwebtoken_1.default.verify(token[1], key);
                    if (util_1.isObject(data)) {
                        req.body.tokenData = data;
                        next();
                        return;
                    }
                }
            }
            error.message = 'Error de sintaxys';
            res.status(error.code).json(error);
        }
    }
    catch (err) {
        const error = responses_1.errorResponse('No autorizado', 401, 'unauthorize');
        res.status(error.code).json(error);
    }
};
//# sourceMappingURL=auth.middleware.js.map