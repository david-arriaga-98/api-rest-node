"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.getUser = exports.getUsers = exports.createUser = void 0;
const responses_1 = require("../utils/responses");
const validator_1 = __importDefault(require("validator"));
const User_1 = __importDefault(require("../models/User"));
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errResp = responses_1.errorResponse();
        const { name, lastname, schedule, email, password, password_confirm } = req.body;
        // Validamos los datos
        let valName = !validator_1.default.isEmpty(name) && validator_1.default.isLength(name, { min: 3, max: 80 });
        let valLastname = !validator_1.default.isEmpty(lastname) &&
            validator_1.default.isLength(lastname, {
                min: 3,
                max: 80
            });
        let valSchedule = !validator_1.default.isEmpty(schedule) &&
            validator_1.default.isInt(schedule) &&
            validator_1.default.isLength(schedule, { min: 10, max: 10 });
        let valEmail = !validator_1.default.isEmpty(email) && validator_1.default.isEmail(email);
        let valPassword = !validator_1.default.isEmpty(password) &&
            validator_1.default.isLength(password, { min: 5, max: 90 });
        let valPasswordConf = !validator_1.default.isEmpty(password_confirm) &&
            validator_1.default.isLength(password_confirm, { min: 5, max: 90 }) &&
            password === password_confirm;
        if (valName &&
            valLastname &&
            valSchedule &&
            valEmail &&
            valPassword &&
            valPasswordConf) {
            // Validamos que ni la cedula, ni el email ya esten registrados
            const valCredential = yield User_1.default.findOne({
                $or: [{ email }, { schedule }]
            });
            if (!valCredential) {
                // Ahora hasheamos la contraseña
                const newUser = new User_1.default({
                    name,
                    lastname,
                    schedule,
                    email,
                    password,
                    state: true,
                    createdAt: moment_1.default(),
                    userToken: 'S5D4ADS45AD4S45DS5AD1A2D1A4D4AS4DGG1G1HG'
                });
                newUser.password = yield newUser.hashPassword(newUser.password);
                // Guardamos al usuario
                newUser.save();
                // Retornamos una respuesta positia
                const success = responses_1.successResponse(undefined, 201, 'Usuario creado satisfactoriamente');
                res.status(success.code).json(success);
            }
            else {
                errResp.message =
                    'Ya existe un usuario registrado con este email o cédula';
                res.status(errResp.code).json(errResp);
            }
        }
        else {
            throw 'Error';
        }
    }
    catch (error) {
        const response = responses_1.errorResponse('Ha ocurrido un error al validar tus datos', 422, 'bad request');
        res.status(response.code).json(response);
    }
});
exports.getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().select('-__v -password');
        const success = responses_1.successResponse(users);
        res.status(success.code).json(success);
    }
    catch (error) {
        const response = responses_1.errorResponse('Ha ocurrido un error al validar tus datos', 422, 'bad request');
        res.status(response.code).json(response);
    }
});
exports.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errResp = responses_1.errorResponse();
        // Recogemos los parametros
        const id = req.params.id;
        // Validamos que el id sea correcto
        let valid = validator_1.default.isMongoId(id);
        if (valid) {
            // Buscamos al usuario
            const user = yield User_1.default.findById(id).select('-__v -password');
            if (!user) {
                errResp.code = 404;
                errResp.message = 'El usuario no existe';
                errResp.status = 'not found';
                res.status(errResp.code).json(errResp);
            }
            else {
                const success = responses_1.successResponse(user, 202);
                res.status(success.code).json(success);
            }
        }
        else {
            throw 'error';
        }
    }
    catch (error) {
        const response = responses_1.errorResponse('Ha ocurrido un error al validar tus datos', 422, 'bad request');
        res.status(response.code).json(response);
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errResp = responses_1.errorResponse();
        // Validamos que los datos sean los correctos
        const { credential, password } = req.body;
        let valCrendetial = !validator_1.default.isEmpty(credential);
        let valPassword = !validator_1.default.isEmpty(password);
        if (valCrendetial && valPassword) {
            // Buscamos al usuario en la base de datos
            const user = yield User_1.default.findOne({
                $or: [{ email: credential }, { schedule: credential }]
            });
            if (user) {
                // Validamos que la contraseña sea correcta
                if (yield user.comparePassword(password)) {
                    // Generamos el token
                    const key = process.env.KEY || 'llaveprimaria';
                    const payload = {
                        name: user.name,
                        lastname: user.lastname,
                        sub: user._id,
                        iat: moment_1.default().unix(),
                        exp: moment_1.default().add(1, 'hours').unix()
                    };
                    const token = jsonwebtoken_1.default.sign(payload, key);
                    const data = {
                        token,
                        tokenType: 'Bearer',
                        name: user.name,
                        lastname: user.lastname,
                        id: user._id
                    };
                    const success = responses_1.successResponse(data, 202);
                    res.status(success.code).json(success);
                }
                else {
                    errResp.code = 422;
                    errResp.message = 'Usuario y/o Contraseña incorrectos';
                    res.status(errResp.code).json(errResp);
                }
            }
            else {
                errResp.code = 404;
                errResp.message = 'not found';
                errResp.message = 'El usuario no existe';
                res.status(errResp.code).json(errResp);
            }
        }
        else {
            throw 'Error';
        }
    }
    catch (error) {
        const response = responses_1.errorResponse('Ha ocurrido un error al validar tus datos', 422, 'bad request');
        res.status(response.code).json(response);
    }
});
//# sourceMappingURL=user.controller.js.map