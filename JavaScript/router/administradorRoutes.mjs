import { renderHomeView } from '@views/administrador/home.mjs'
import { validateSession } from "@/service/validateSession.mjs";
import { handleUnauthorized } from "@components/handleUnauthorized.mjs";

export const administradorRoutes = (router) => {
  
  router.on('/administrador/perfil', async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session);
    await renderHomeView("perfil", session.user);
  });

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

  router.on('/administrador/reportes/pedidos', async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session);
    await renderHomeView("reportesPedidos", session.user);
  });

  router.on('/administrador/reportes/ventas', async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session);
    await renderHomeView("reportesVentas", session.user);
  });

  router.on("/administrador/reportes/productos", async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session); 
    await renderHomeView("reportesProductos", session.user);
  });

  router.on("/administrador/reportes/inventario-categorias", async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session); 
    await renderHomeView("reportesInventario-categorias", session.user);
  });

  router.on("/administrador/reportes/clientes", async() => {
    const session = validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session); 
    await renderHomeView("clientes", session.user);
  });
};
