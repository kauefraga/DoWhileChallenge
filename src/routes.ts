import { Router } from 'express';
import auth from './middleware/auth';
import {
  RegisterController,
  LoginController,
} from './controllers/index';

const routes = Router();

routes.get('/', (req, res) => { res.json('Hello world!'); });

routes.post('/register', RegisterController.handler);

routes.post('/login', LoginController.handler);

routes.get('/welcome', auth, (request, response) => response.json({
  message: '🔥 Welcome! Congrats to sign up! 🔥',
  isAuthenticated: true,
}));

export default routes;
