import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';

const router: Router = Router();
const baseRoute = '/api/v1/';

// Controllers
import {
	createUser,
	getUsers,
	getUser,
	login
} from '../controllers/user.controller';

router.post(baseRoute + 'user', createUser);
router.get(baseRoute + 'users', AuthMiddleware, getUsers);
router.get(baseRoute + 'user/:id?', AuthMiddleware, getUser);
router.post(baseRoute + 'login', login);

export default router;
