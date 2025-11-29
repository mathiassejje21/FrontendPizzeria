import { renderHomeView } from "@views/cliente/home.mjs";
import { renderDetalleProductoView } from "@components/renderDetalleProductoView.mjs";
import { validateSession } from "@/service/validateSession.mjs";
import { handleUnauthorized } from "@components/handleUnauthorized.mjs";

export const clienteRoutes = (router) => {

  router.on("/pizzeria", async () => {
    const session = validateSession(["cliente"]); 
    const user = session.ok ? session.user : null;
    await renderHomeView("home", user);
  });

  router.on("/pizzeria/productos", async () => {
    const session = validateSession(["cliente"]); 
    const user = session.ok ? session.user : null;    
    await renderHomeView("productos", user);
  });

  router.on("/pizzeria/productos/:id", async ({ data }) => {
    const session = validateSession(["cliente"]); 
    const user = session.ok ? session.user : null;
    await renderDetalleProductoView(data.id, user);
  });

  router.on("/pizzeria/carrito", async () => {
    const session = validateSession(["cliente"]); 
    const user = session.ok ? session.user : null;
    await renderHomeView("carrito", user);
  });

  router.on("/pizzeria/pedidos", async () => {
    const session = validateSession(["cliente"]);
    if (!session.ok) return handleUnauthorized(session);
    await renderHomeView("pedidos", session.user);
  });

  router.on("/pizzeria/perfil", async () => {
    const session = validateSession(["cliente"]);
    if (!session.ok) return handleUnauthorized(session);
    await renderHomeView("perfil", session.user);
  });

};
