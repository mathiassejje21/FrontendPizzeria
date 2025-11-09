import { clienteRoutes } from './clienteRoutes.mjs';
import { administradorRoutes } from './administrador.mjs';
import { personalRoutes } from './personal.mjs';
import { authController } from '@/controllers/authController.mjs';



export const authRoutes = (router) => {
  const auth = new authController();

  router.on('/pizzeria/login', () => { auth.viewLogin(); });
  router.on('/pizzeria/register', () => { auth.viewRegister(); });

  clienteRoutes(router)

  router.on('/trabajadores/login', () => {auth.viewLogin(); });

  administradorRoutes(router)
  personalRoutes(router)

  router.on('/logout', () => { auth.logout(); });
  };
