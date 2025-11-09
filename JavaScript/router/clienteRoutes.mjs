import { renderDashboardView } from "@views/cliente/dashboard.mjs";

export const clienteRoutes = (router) => {
  router.on('/pizzeria/dashboard', () => { renderDashboardView(); });

  router.on('/pizzeria/pedidos', () => {});

  router.on('/pizzeria/perfil', () => {});
};
