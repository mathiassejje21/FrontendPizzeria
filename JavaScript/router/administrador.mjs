import { renderDashboardView } from "@views/administrador/dashboard.mjs";

export const administradorRoutes = (router) => {
  router.on('/administrador/dashboard', () => { renderDashboardView(); });

  router.on('/administrador/pedidos', () => {});

  router.on('/administrador/gestion', () => {});
};
