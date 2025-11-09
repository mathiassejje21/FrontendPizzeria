import { renderLoginView } from '@views/login.mjs';
import { clienteRoutes } from './clienteRoutes.mjs';
import { renderRegisterView } from '@views/cliente/register.mjs';
import { administradorRoutes } from './administrador.mjs';
import { personalRoutes } from './personal.mjs';
import { renderHomeView } from '../views/cliente/home.mjs';
import { authController } from '@/controllers/authController.mjs';

const auth = new authController();

export const authRoutes = (router) => {
  router.on('/pizzeria/login', () => renderLoginView());
  router.on('/pizzeria/register', () => renderRegisterView());

  clienteRoutes(router)

  router.on('/trabajadores/login', () => renderLoginView());

  administradorRoutes(router)
  personalRoutes(router)

  router.on('/logout', () => { auth.logout(); });
  
  router.on('/pizzeria', () => { renderHomeView(); });
};
