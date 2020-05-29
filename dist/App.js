"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const responses_1 = require("./utils/responses");
const app = express_1.default();
// Configs
dotenv_1.config();
db_1.default();
app.set('port', process.env.PORT || 3000);
// Middlewares
app.use(cors_1.default());
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
// Routes
const user_router_1 = __importDefault(require("./routes/user.router"));
app.use(user_router_1.default);
// 404 error
app.use((req, res) => {
    const errResponse = responses_1.errorResponse('Esta página no existe', 404, 'not found');
    res.status(errResponse.code).json(errResponse);
});
exports.default = app;
//# sourceMappingURL=App.js.map