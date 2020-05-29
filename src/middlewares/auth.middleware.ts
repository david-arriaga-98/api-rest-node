import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { errorResponse } from '../utils/responses';
import jwt from 'jsonwebtoken';
import { isObject } from 'util';

export default (req: Request, res: Response, next: NextFunction) => {
	try {
		const error = errorResponse('No autorizado', 401, 'unauthorize');
		// Recogemos los datos
		const token = req.headers.authorization?.split(' ');

		if (token === undefined || token.length === 0) {
			throw 'error';
		} else {
			if (token[0] === 'Bearer') {
				if (validator.isJWT(token[1])) {
					const key = process.env.KEY || 'llaveprimaria';
					const data = jwt.verify(token[1], key);

					if (isObject(data)) {
						req.body.tokenData = data;
						next();
						return;
					}
				}
			}
			error.message = 'Error de sintaxys';
			res.status(error.code).json(error);
		}
	} catch (err) {
		const error = errorResponse('No autorizado', 401, 'unauthorize');
		res.status(error.code).json(error);
	}
};
