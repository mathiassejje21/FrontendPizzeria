import { renderHomeView } from "@views/cliente/home.mjs";
import { mostrarDetalleProducto } from "@views/cliente/detalleProducto.mjs";
import { renderDashboardView } from "@views/cliente/mostrarDashboard.mjs";
import { validateSession } from "@/service/validateSession.mjs";
import { authApi } from "../api/authApi.mjs";

export const clienteRoutes = (router) => {

  router.on("/pizzeria", async () => {
    const session = await validateSession(["cliente"]);
    const user = session.ok ? session.user : null; 
    await renderHomeView("home", user);
  });

  router.on("/pizzeria/productos", async () => {
    const session = await validateSession(["cliente"]);
    const user = session.ok ? session.user : null; 
    await renderHomeView("productos", user);
  });

  router.on("/pizzeria/productos/:id", async ({ data }) => {
    const session = await validateSession(["cliente"]);
    const user = session.ok ? session.user : null; 
    await mostrarDetalleProducto(data.id, user);
  });

  router.on("/pizzeria/carrito", async () => {
    const session = await validateSession(["cliente"]);
    const user = session.ok ? session.user : null; 
    await renderHomeView("carrito", user);
  });

  router.on("/pizzeria/pedidos", async () => {
    const session = await validateSession(["cliente"]);
    if (!session.ok) return location.href = session.redirect;
    await renderHomeView("pedidos", session.user);
  });

  router.on("/pizzeria/dashboard", async () => {
    const session = await validateSession(["cliente"]);
    if (!session.ok) return location.href = session.redirect;
    const api = new authApi();
    const user = await api.getProfile();
    await renderDashboardView(user);
  });

};
