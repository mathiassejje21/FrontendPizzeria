import { renderHomeView } from '@views/administrador/home.mjs'
import { validateSession } from "@/service/validateSession.mjs";
import { handleUnauthorized } from "@components/handleUnauthorized.mjs";

export const administradorRoutes = (router) => {

  router.on('/administrador/dashboard', async() => { 
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session);
    await renderHomeView("dashboard", session.user);
   });

  router.on('/administrador/inventario/productos', async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session); 
    await renderHomeView("productos", session.user);
  });

  router.on('/administrador/inventario/categorias', async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session); 
    await renderHomeView("categorias", session.user);
  });

  router.on('/administrador/inventario/ingredientes', async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session); 
    await renderHomeView("ingredientes", session.user);
  });

  router.on("/administrador/usuarios", async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session); 
    await renderHomeView("usuarios", session.user);
  })

  router.on('/administrador/atributos', async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session); 
    await renderHomeView("atributos", session.user);
  });

  router.on('/administrador/perfil', async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session);
    await renderHomeView("perfil", session.user);
  });
};
