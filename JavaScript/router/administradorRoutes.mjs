import { renderHomeView } from '@views/administrador/home.mjs'
import { validateSession } from "@/service/validateSession.mjs";
import { handleUnauthorized } from "@components/handleUnauthorized.mjs";

export const administradorRoutes = (router) => {

  router.on('/administrador/dashboard', async() => { 
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session);
    await renderHomeView("dashboard", session.user);
   });

  router.on('/administrador/pedidos', async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session);
    await renderHomeView("pedidos", session.user);
  });

  router.on('/administrador/inventario/productos', async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session);
    await renderHomeView("productos", session.user);
  });

  router.on('/administrador/perfil', async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session);
    await renderHomeView("perfil", session.user);
  });
};
