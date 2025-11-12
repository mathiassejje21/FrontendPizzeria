import { clienteRoutes } from './clienteRoutes.mjs';
import { administradorRoutes } from './administrador.mjs';
import { personalRoutes } from './personal.mjs';
import { renderLoginView } from '@views/login.mjs';
import { renderRegisterView } from '@views/cliente/register.mjs';


export const authRoutes = (router) => {
  router.on('/pizzeria/login', renderLoginView);
  router.on('/pizzeria/register', renderRegisterView);

  clienteRoutes(router)

  router.on('/trabajadores/login', renderLoginView);

  administradorRoutes(router) 
  personalRoutes(router)

  };
