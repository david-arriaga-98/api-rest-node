"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.Router();
const baseRoute = '/api/v1/';
// Controllers
const user_controller_1 = require("../controllers/user.controller");
router.post(baseRoute + 'user', user_controller_1.createUser);
router.get(baseRoute + 'users', auth_middleware_1.default, user_controller_1.getUsers);
router.get(baseRoute + 'user/:id?', auth_middleware_1.default, user_controller_1.getUser);
router.post(baseRoute + 'login', user_controller_1.login);
exports.default = router;
//# sourceMappingURL=user.router.js.map