import { renderHomeView } from "@views/cliente/home.mjs";
import { renderDetalleProductoView } from "@components/renderDetalleProductoView.mjs";
import { validateSession } from "@/service/validateSession.mjs";
import { handleUnauthorized } from "@components/handleUnauthorized.mjs";

export const clienteRoutes = (router) => {

  router.on("/pizzeria", () => {
    const session = validateSession(["cliente"]); 
    const user = session.ok ? session.user : null;
    renderHomeView("home", user);
  });

  router.on("/pizzeria/productos", () => {
    const session = validateSession(["cliente"]); 
    const user = session.ok ? session.user : null;    
    renderHomeView("productos",user);
  });

  router.on("/pizzeria/productos/:id", ({ data }) => {
    const session = validateSession(["cliente"]); 
    const user = session.ok ? session.user : null;
    renderDetalleProductoView(data.id, user);
  });

  router.on("/pizzeria/carrito", () => {
    const session = validateSession(["cliente"]); 
    const user = session.ok ? session.user : null;
    renderHomeView("carrito", user);
  });

  router.on("/pizzeria/pedidos", () => {
    const session = validateSession(["cliente"]);
    if (!session.ok) return handleUnauthorized(session);
    renderHomeView("pedidos", session.user);
  });

  router.on("/pizzeria/perfil", () => {
    const session = validateSession(["cliente"]);
    if (!session.ok) return handleUnauthorized(session);
    renderHomeView("perfil",session.user);
  });

};
