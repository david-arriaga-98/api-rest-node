import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/responses';
import validator from 'validator';
import User, { IUser } from '../models/User';
import moment from 'moment';
import jwt from 'jsonwebtoken';

export const createUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const errResp = errorResponse();

		const {
			name,
			lastname,
			schedule,
			email,
			password,
			password_confirm
		} = req.body;

		// Validamos los datos
		let valName =
			!validator.isEmpty(name) && validator.isLength(name, { min: 3, max: 80 });
		let valLastname =
			!validator.isEmpty(lastname) &&
			validator.isLength(lastname, {
				min: 3,
				max: 80
			});
		let valSchedule =
			!validator.isEmpty(schedule) &&
			validator.isInt(schedule) &&
			validator.isLength(schedule, { min: 10, max: 10 });
		let valEmail = !validator.isEmpty(email) && validator.isEmail(email);
		let valPassword =
			!validator.isEmpty(password) &&
			validator.isLength(password, { min: 5, max: 90 });
		let valPasswordConf =
			!validator.isEmpty(password_confirm) &&
			validator.isLength(password_confirm, { min: 5, max: 90 }) &&
			password === password_confirm;

		if (
			valName &&
			valLastname &&
			valSchedule &&
			valEmail &&
			valPassword &&
			valPasswordConf
		) {
			// Validamos que ni la cedula, ni el email ya esten registrados
			const valCredential = await User.findOne({
				$or: [{ email }, { schedule }]
			});

			if (!valCredential) {
				// Ahora hasheamos la contraseña
				const newUser = new User({
					name,
					lastname,
					schedule,
					email,
					password,
					state: true,
					createdAt: moment(),
					userToken: 'S5D4ADS45AD4S45DS5AD1A2D1A4D4AS4DGG1G1HG'
				});
				newUser.password = await newUser.hashPassword(newUser.password);

				// Guardamos al usuario
				newUser.save();
				// Retornamos una respuesta positia
				const success = successResponse(
					undefined,
					201,
					'Usuario creado satisfactoriamente'
				);
				res.status(success.code).json(success);
			} else {
				errResp.message =
					'Ya existe un usuario registrado con este email o cédula';
				res.status(errResp.code).json(errResp);
			}
		} else {
			throw 'Error';
		}
	} catch (error) {
		const response = errorResponse(
			'Ha ocurrido un error al validar tus datos',
			422,
			'bad request'
		);
		res.status(response.code).json(response);
	}
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const users: IUser[] = await User.find().select('-__v -password');

		const success = successResponse(users);
		res.status(success.code).json(success);
	} catch (error) {
		const response = errorResponse(
			'Ha ocurrido un error al validar tus datos',
			422,
			'bad request'
		);
		res.status(response.code).json(response);
	}
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const errResp = errorResponse();
		// Recogemos los parametros
		const id = req.params.id;
		// Validamos que el id sea correcto
		let valid = validator.isMongoId(id);

		if (valid) {
			// Buscamos al usuario
			const user = await User.findById(id).select('-__v -password');

			if (!user) {
				errResp.code = 404;
				errResp.message = 'El usuario no existe';
				errResp.status = 'not found';
				res.status(errResp.code).json(errResp);
			} else {
				const success = successResponse(user, 202);
				res.status(success.code).json(success);
			}
		} else {
			throw 'error';
		}
	} catch (error) {
		const response = errorResponse(
			'Ha ocurrido un error al validar tus datos',
			422,
			'bad request'
		);
		res.status(response.code).json(response);
	}
};

export const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const errResp = errorResponse();
		// Validamos que los datos sean los correctos
		const { credential, password } = req.body;

		let valCrendetial = !validator.isEmpty(credential);
		let valPassword = !validator.isEmpty(password);

		if (valCrendetial && valPassword) {
			// Buscamos al usuario en la base de datos
			const user = await User.findOne({
				$or: [{ email: credential }, { schedule: credential }]
			});

			if (user) {
				// Validamos que la contraseña sea correcta
				if (await user.comparePassword(password)) {
					// Generamos el token
					const key = process.env.KEY || 'llaveprimaria';
					const payload = {
						name: user.name,
						lastname: user.lastname,
						sub: user._id,
						iat: moment().unix(),
						exp: moment().add(1, 'hours').unix()
					};
					const token = jwt.sign(payload, key);

					const data = {
						token,
						tokenType: 'Bearer',
						name: user.name,
						lastname: user.lastname,
						id: user._id
					};

					const success = successResponse(data, 202);

					res.status(success.code).json(success);
				} else {
					errResp.code = 422;
					errResp.message = 'Usuario y/o Contraseña incorrectos';
					res.status(errResp.code).json(errResp);
				}
			} else {
				errResp.code = 404;
				errResp.message = 'not found';
				errResp.message = 'El usuario no existe';
				res.status(errResp.code).json(errResp);
			}
		} else {
			throw 'Error';
		}
	} catch (error) {
		const response = errorResponse(
			'Ha ocurrido un error al validar tus datos',
			422,
			'bad request'
		);
		res.status(response.code).json(response);
	}
};
